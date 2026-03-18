import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";

import { AnimOrbitArcs } from "@/components/landing/BrandVisuals";

const frameworks = [
	{
		name: "TanStack Start",
		tagline: "Full-stack, type-safe",
		description:
			"Full-stack React framework with type-safe routing and server functions.",
		logo: (
			<img src="/logos/tanstack.png" alt="TanStack" className="h-8 w-auto" />
		),
		highlighted: true,
	},
	{
		name: "Hono",
		tagline: "Bun-native, edge-ready",
		description:
			"Ultra-fast, runs on Bun, Deno, Cloudflare Workers, and Node.js.",
		logo: <img src="/logos/hono.png" alt="Hono" className="h-8 w-8" />,
	},
	{
		name: "Elysia",
		tagline: "Bun-native, type-safe",
		description: "End-to-end type safety with excellent Bun performance.",
		logo: <img src="/logos/elysia.svg" alt="Elysia" className="h-8 w-8" />,
	},
	{
		name: "Next.js",
		tagline: "App Router & Pages Router",
		description:
			"Works with both App Router and Pages Router via catch-all routes.",
		logo: <img src="/logos/nextjs.png" alt="Next.js" className="h-8 w-8" />,
	},
];

export function Frameworks() {
	return (
		<section
			id="adapters"
			className="border-border/40 relative overflow-hidden border-t py-20"
		>
			<div className="relative z-10 mx-auto w-full max-w-7xl px-4">
				{/* L-R layout: heading LEFT, orbit visualization RIGHT */}
				<div className="mb-12 grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
					{/* Left — heading + description + link */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-80px" }}
						transition={{ duration: 0.6 }}
					>
						<h2 className="text-primary font-mono text-sm tracking-[0.2em] text-balance uppercase">
							Adapters
						</h2>
						<h3 className="mt-3 font-mono text-3xl font-bold tracking-[-0.02em] text-balance md:text-4xl">
							Bring your own framework
						</h3>
						<p className="text-muted-foreground mt-3 max-w-lg text-balance">
							If it handles HTTP, it runs QUESTPIE. Write your own adapter in
							under 50 lines.
						</p>
						<div className="mt-6">
							<Link
								to="/docs/$"
								params={{ _splat: "frontend/adapters" }}
								className="text-primary hover:text-primary/80 inline-flex items-center gap-2 font-mono text-xs transition-colors"
							>
								Read the adapter docs →
							</Link>
						</div>
					</motion.div>

					{/* Right — Orbit arcs visualization */}
					<motion.div
						className="order-last flex items-center justify-center lg:order-none lg:justify-end"
						initial={{ opacity: 0, x: 20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true, margin: "-80px" }}
						transition={{ duration: 0.6, delay: 0.15 }}
					>
						<AnimOrbitArcs className="pointer-events-none h-auto w-full max-w-[400px] opacity-90" />
					</motion.div>
				</div>

				{/* Framework cards — aligned with heading */}
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{frameworks.map((fw, i) => (
						<motion.div
							key={fw.name}
							className="group border-border bg-card/20 hover:border-primary/30 border p-6 text-center backdrop-blur-sm transition-colors"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{
								duration: 0.5,
								delay: i * 0.1,
							}}
						>
							<div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center">
								{fw.logo}
							</div>
							<h4 className="text-lg font-semibold">{fw.name}</h4>
							<p className="text-primary mt-1 font-mono text-[10px] tracking-[0.18em] uppercase">
								{fw.tagline}
							</p>
							<p className="text-muted-foreground mt-2 text-xs">
								{fw.description}
							</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
