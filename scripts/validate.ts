#!/usr/bin/env bun
/**
 * QuestPie monorepo validation runner.
 *
 * Stages (in order): codegen -> build -> types -> exports -> tests
 * Each stage runs packages in topological (dependency) order.
 *
 * Usage:
 *   bun validate                  # run all stages
 *   bun validate --stage build    # run a single stage
 *   bun validate --skip tests     # skip one or more stages (comma-separated)
 *   bun validate --package questpie  # run only a specific package (by dir name)
 */

import { readFileSync, existsSync } from "node:fs"
import { resolve, join } from "node:path"
import { spawnSync } from "node:child_process"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface WorkspacePackage {
  /** Directory name under packages/ */
  dir: string
  /** Absolute path */
  path: string
  /** package.json "name" */
  name: string
  /** workspace:* dependencies on other local packages (by name) */
  localDeps: string[]
  /** Available npm scripts */
  scripts: Record<string, string>
}

type Stage = "codegen" | "build" | "types" | "exports" | "tests"

interface StageResult {
  stage: Stage
  pkg: string
  ok: boolean
  skipped: boolean
  durationMs: number
  output?: string
}

// Stage → npm script name mapping
const STAGE_SCRIPT: Record<Stage, string> = {
  codegen: "questpie:generate",
  build: "build",
  types: "check-types",
  exports: "__validate_exports__", // placeholder for QUE-295
  tests: "test",
}

const ALL_STAGES: Stage[] = ["codegen", "build", "types", "exports", "tests"]

// ---------------------------------------------------------------------------
// Workspace discovery
// ---------------------------------------------------------------------------

function discoverWorkspaces(rootDir: string): WorkspacePackage[] {
  const packagesDir = join(rootDir, "packages")
  const rootPkg = JSON.parse(readFileSync(join(rootDir, "package.json"), "utf-8"))

  // Only consider packages/* workspace pattern
  const dirs: string[] = []
  for (const entry of Bun.spawnSync(["ls", packagesDir]).stdout.toString().trim().split("\n")) {
    const pkgJsonPath = join(packagesDir, entry, "package.json")
    if (existsSync(pkgJsonPath)) {
      dirs.push(entry)
    }
  }

  const packages: WorkspacePackage[] = []
  for (const dir of dirs) {
    const pkgPath = join(packagesDir, dir)
    const pkgJson = JSON.parse(readFileSync(join(pkgPath, "package.json"), "utf-8"))
    const allDeps = {
      ...pkgJson.dependencies,
      ...pkgJson.devDependencies,
      ...pkgJson.peerDependencies,
    }
    const localDeps = Object.entries(allDeps)
      .filter(([_, v]) => typeof v === "string" && (v as string).startsWith("workspace:"))
      .map(([k]) => k)

    packages.push({
      dir,
      path: pkgPath,
      name: pkgJson.name,
      localDeps,
      scripts: pkgJson.scripts ?? {},
    })
  }

  return packages
}

// ---------------------------------------------------------------------------
// Topological sort (Kahn's algorithm)
// ---------------------------------------------------------------------------

function topoSort(packages: WorkspacePackage[]): WorkspacePackage[] {
  const byName = new Map(packages.map((p) => [p.name, p]))
  const inDegree = new Map(packages.map((p) => [p.name, 0]))

  // Build adjacency: dep -> dependent
  const dependents = new Map<string, string[]>()
  for (const pkg of packages) {
    for (const dep of pkg.localDeps) {
      if (byName.has(dep)) {
        inDegree.set(pkg.name, (inDegree.get(pkg.name) ?? 0) + 1)
        const list = dependents.get(dep) ?? []
        list.push(pkg.name)
        dependents.set(dep, list)
      }
    }
  }

  // Deterministic: sort queue alphabetically at each step
  const queue: string[] = []
  for (const [name, degree] of inDegree) {
    if (degree === 0) queue.push(name)
  }
  queue.sort()

  const sorted: WorkspacePackage[] = []
  while (queue.length > 0) {
    const current = queue.shift()!
    sorted.push(byName.get(current)!)

    for (const dep of (dependents.get(current) ?? []).sort()) {
      const newDeg = (inDegree.get(dep) ?? 1) - 1
      inDegree.set(dep, newDeg)
      if (newDeg === 0) {
        // Insert sorted to keep deterministic
        const idx = queue.findIndex((q) => q > dep)
        if (idx === -1) queue.push(dep)
        else queue.splice(idx, 0, dep)
      }
    }
  }

  if (sorted.length !== packages.length) {
    const missing = packages.filter((p) => !sorted.includes(p)).map((p) => p.name)
    throw new Error(`Cyclic dependency detected involving: ${missing.join(", ")}`)
  }

  return sorted
}

// ---------------------------------------------------------------------------
// Stage runner
// ---------------------------------------------------------------------------

function runStage(stage: Stage, pkg: WorkspacePackage): StageResult {
  const scriptName = STAGE_SCRIPT[stage]
  const hasScript = scriptName in pkg.scripts

  if (!hasScript) {
    return { stage, pkg: pkg.dir, ok: true, skipped: true, durationMs: 0 }
  }

  const start = performance.now()
  const result = spawnSync("bun", ["run", scriptName], {
    cwd: pkg.path,
    stdio: "pipe",
    env: { ...process.env, QUESTPIE_MIGRATIONS_SILENT: "1" },
    timeout: 5 * 60 * 1000, // 5 min per stage per package
  })
  const durationMs = Math.round(performance.now() - start)

  const stdout = result.stdout?.toString() ?? ""
  const stderr = result.stderr?.toString() ?? ""
  const output = (stdout + "\n" + stderr).trim()

  return {
    stage,
    pkg: pkg.dir,
    ok: result.status === 0,
    skipped: false,
    durationMs,
    output: result.status !== 0 ? output : undefined,
  }
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseArgs(args: string[]) {
  const parsed = {
    stages: [...ALL_STAGES] as Stage[],
    skipStages: [] as Stage[],
    filterPackage: null as string | null,
  }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === "--stage" && args[i + 1]) {
      parsed.stages = [args[++i] as Stage]
    } else if (arg === "--skip" && args[i + 1]) {
      parsed.skipStages = args[++i].split(",") as Stage[]
    } else if (arg === "--package" && args[i + 1]) {
      parsed.filterPackage = args[++i]
    }
  }

  // Apply skip
  parsed.stages = parsed.stages.filter((s) => !parsed.skipStages.includes(s))
  return parsed
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const rootDir = resolve(import.meta.dir, "..")
  const args = parseArgs(process.argv.slice(2))

  // Discover & sort
  let packages = topoSort(discoverWorkspaces(rootDir))

  if (args.filterPackage) {
    packages = packages.filter((p) => p.dir === args.filterPackage)
    if (packages.length === 0) {
      console.error(`Package "${args.filterPackage}" not found`)
      process.exit(1)
    }
  }

  console.log(`\n  Validate: ${args.stages.join(" → ")}`)
  console.log(`  Packages: ${packages.map((p) => p.dir).join(", ")}\n`)

  const results: StageResult[] = []
  let failed = false

  for (const stage of args.stages) {
    console.log(`── ${stage} ${"─".repeat(60 - stage.length)}`)

    for (const pkg of packages) {
      const result = runStage(stage, pkg)
      results.push(result)

      if (result.skipped) {
        console.log(`  ${pkg.dir.padEnd(24)} skip`)
      } else if (result.ok) {
        console.log(`  ${pkg.dir.padEnd(24)} ✓  ${result.durationMs}ms`)
      } else {
        console.log(`  ${pkg.dir.padEnd(24)} ✗  ${result.durationMs}ms`)
        if (result.output) {
          const lines = result.output.split("\n").slice(-20)
          for (const line of lines) {
            console.log(`    │ ${line}`)
          }
        }
        failed = true
      }
    }

    // Fail-fast: stop pipeline on first stage failure
    if (failed) {
      console.log(`\n  Pipeline stopped at "${stage}" due to failure.\n`)
      break
    }

    console.log()
  }

  // Summary
  const ran = results.filter((r) => !r.skipped)
  const passed = ran.filter((r) => r.ok)
  const failures = ran.filter((r) => !r.ok)
  const totalMs = ran.reduce((s, r) => s + r.durationMs, 0)

  console.log("── summary ─────────────────────────────────────────────────")
  console.log(`  ${passed.length} passed, ${failures.length} failed, ${results.filter((r) => r.skipped).length} skipped  (${(totalMs / 1000).toFixed(1)}s)`)

  if (failures.length > 0) {
    console.log("\n  Failures:")
    for (const f of failures) {
      console.log(`    ${f.stage} → ${f.pkg}`)
    }
  }

  console.log()
  process.exit(failed ? 1 : 0)
}

main()
