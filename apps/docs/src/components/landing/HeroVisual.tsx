import { CheckCircle, FileText, Plus, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import coldarkCold from "react-syntax-highlighter/dist/esm/styles/prism/coldark-cold";
import coldarkDark from "react-syntax-highlighter/dist/esm/styles/prism/coldark-dark";

import { cn } from "@/lib/utils";

SyntaxHighlighter.registerLanguage("typescript", typescript);

// Step 1: Define your collection schema
const schemaCode = `// collections/posts.ts
const posts = collection('posts')
  .fields(({ f }) => ({
    title: f.text({ required: true }),
    content: f.richText(),
    status: f.select({
      options: ['draft', 'published'],
    }),
  }))`;

// Step 2: Auto-generated endpoints
const endpointsCode = `// Auto-generated REST API
GET    /api/posts
GET    /api/posts/:id
POST   /api/posts
PATCH  /api/posts/:id
DELETE /api/posts/:id

// Type-safe SDK
const { docs } = await client.collections.posts.find({
  where: { status: 'published' }
})`;

// Step 3: Chain admin config (same file)
const adminCode = `// server/collections/posts.ts (continued)
posts
  .admin(({ c }) => ({
    label: 'Posts',
    icon: c.icon('ph:article'),
  }))
  .list(({ v, f }) => v.collectionTable({
    columns: [f.title, f.status],
    searchable: ['title'],
  }))
  .form(({ v, f }) => v.collectionForm({
    fields: [f.title, f.content, f.status],
  }))`;

type Phase =
	| "schema"
	| "schema-done"
	| "endpoints"
	| "endpoints-done"
	| "admin"
	| "result";

export function HeroVisual() {
	const [phase, setPhase] = useState<Phase>("schema");
	const [displayedCode, setDisplayedCode] = useState("");
	const [showTable, setShowTable] = useState(false);
	const displayedCodeRef = useRef("");

	useEffect(() => {
		const controller = new AbortController();
		const { signal } = controller;

		const delay = (ms: number) =>
			new Promise<void>((resolve, reject) => {
				const id = setTimeout(resolve, ms);
				signal.addEventListener("abort", () => {
					clearTimeout(id);
					reject(new Error("aborted"));
				});
			});

		const typeCode = async (code: string) => {
			while (!signal.aborted && displayedCodeRef.current !== code) {
				const nextStr = code.slice(0, displayedCodeRef.current.length + 1);
				displayedCodeRef.current = nextStr;
				setDisplayedCode(nextStr);
				await delay(30);
			}
		};

		const loop = async () => {
			try {
				await delay(800);

				while (!signal.aborted) {
					// Phase 1: Schema definition
					setPhase("schema");
					setShowTable(false);
					displayedCodeRef.current = "";
					setDisplayedCode("");

					await typeCode(schemaCode);
					if (signal.aborted) break;

					setPhase("schema-done");
					await delay(1500);

					// Phase 2: Auto-generated endpoints
					setPhase("endpoints");
					displayedCodeRef.current = "";
					setDisplayedCode("");

					await typeCode(endpointsCode);
					if (signal.aborted) break;

					setPhase("endpoints-done");
					await delay(1500);

					// Phase 3: Admin config
					setPhase("admin");
					displayedCodeRef.current = "";
					setDisplayedCode("");

					await typeCode(adminCode);
					if (signal.aborted) break;

					// Phase 4: Result
					setPhase("result");
					await delay(400);
					setShowTable(true);

					await delay(4000);
				}
			} catch {
				// Aborted, ignore
			}
		};

		loop();
		return () => {
			controller.abort();
		};
	}, []);

	const isTyping =
		phase === "schema" || phase === "endpoints" || phase === "admin";
	const showCode = phase !== "result";

	return (
		<div className="relative">
			{/* Glow */}
			<div className="from-primary/20 via-primary/10 absolute -inset-4 rounded-3xl bg-gradient-to-r to-transparent blur-2xl" />

			{/* Main card */}
			<div className="border-border bg-background/95 relative overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-sm">
				{/* Code view */}
				<div
					className={cn(
						"transition-all duration-500",
						showCode
							? "opacity-100"
							: "pointer-events-none absolute inset-0 opacity-0",
					)}
				>
					{/* Header */}
					<div className="border-border bg-muted/30 flex items-center justify-between border-b px-4 py-3">
						<div className="flex items-center gap-2">
							<div className="flex gap-1.5">
								<div className="h-3 w-3 rounded-full bg-red-500/50" />
								<div className="h-3 w-3 rounded-full bg-yellow-500/50" />
								<div className="h-3 w-3 rounded-full bg-green-500/50" />
							</div>
							<span className="text-muted-foreground ml-2 font-mono text-xs">
								{phase === "schema" || phase === "schema-done"
									? "server/posts.ts"
									: phase === "endpoints" || phase === "endpoints-done"
										? "Generated API"
										: "server/posts.ts"}
							</span>
						</div>
						<div className="flex items-center gap-2">
							{isTyping ? (
								<>
									<Sparkles className="text-primary h-3 w-3 animate-pulse" />
									<span className="text-primary font-mono text-xs">
										Writing...
									</span>
								</>
							) : phase === "schema-done" || phase === "endpoints-done" ? (
								<>
									<CheckCircle className="h-3 w-3 text-green-500" />
									<span className="font-mono text-xs text-green-500">
										Ready
									</span>
								</>
							) : null}
						</div>
					</div>

					{/* Code */}
					<div className="relative min-h-[280px] p-4">
						{/* Light mode */}
						<div className="dark:hidden">
							<SyntaxHighlighter
								language="typescript"
								style={coldarkCold}
								customStyle={{
									background: "transparent",
									padding: 0,
									margin: 0,
									fontSize: "0.8125rem",
									lineHeight: "1.6",
								}}
								showLineNumbers={true}
								wrapLines={true}
							>
								{displayedCode || " "}
							</SyntaxHighlighter>
						</div>
						{/* Dark mode */}
						<div className="hidden dark:block">
							<SyntaxHighlighter
								language="typescript"
								style={coldarkDark}
								customStyle={{
									background: "transparent",
									padding: 0,
									margin: 0,
									fontSize: "0.8125rem",
									lineHeight: "1.6",
								}}
								showLineNumbers={true}
								wrapLines={true}
							>
								{displayedCode || " "}
							</SyntaxHighlighter>
						</div>
						{/* Typing cursor */}
						{isTyping && (
							<span
								className="bg-primary absolute inline-block h-4 w-2 animate-pulse"
								style={{ marginLeft: "2px" }}
							/>
						)}
					</div>

					{/* Footer */}
					<div className="border-border bg-muted/30 border-t px-4 py-2.5">
						<span className="text-primary font-mono text-xs">
							{phase === "schema" || phase === "schema-done"
								? "Step 1 — Define Schema"
								: phase === "endpoints" || phase === "endpoints-done"
									? "Step 2 — API Ready"
									: "Step 3 — Chain Admin Config"}
						</span>
					</div>
				</div>

				{/* Admin panel view */}
				<div
					className={cn(
						"transition-all duration-500",
						!showCode
							? "opacity-100"
							: "pointer-events-none absolute inset-0 opacity-0",
					)}
				>
					{/* Title bar */}
					<div className="border-border bg-muted/50 flex items-center gap-2 border-b px-4 py-3">
						<div className="flex gap-1.5">
							<div className="h-3 w-3 rounded-full bg-red-500/80" />
							<div className="h-3 w-3 rounded-full bg-yellow-500/80" />
							<div className="h-3 w-3 rounded-full bg-green-500/80" />
						</div>
						<span className="text-muted-foreground ml-2 font-mono text-xs">
							localhost:3000/admin/posts
						</span>
					</div>

					{/* Main content with sidebar */}
					<div className="flex min-h-[280px]">
						{/* Sidebar */}
						<div className="border-border bg-muted/30 hidden w-36 border-r p-2 sm:block">
							<div className="space-y-0.5">
								<div className="text-muted-foreground flex items-center gap-2 rounded px-2 py-1.5 text-xs font-medium">
									<div className="bg-muted h-3.5 w-3.5 rounded" />
									Dashboard
								</div>
								<div className="bg-primary/10 text-primary flex items-center gap-2 rounded px-2 py-1.5 text-xs font-medium">
									<FileText className="h-3.5 w-3.5" />
									Posts
								</div>
								<div className="text-muted-foreground flex items-center gap-2 rounded px-2 py-1.5 text-xs font-medium">
									<div className="bg-muted h-3.5 w-3.5 rounded" />
									Authors
								</div>
								<div className="text-muted-foreground flex items-center gap-2 rounded px-2 py-1.5 text-xs font-medium">
									<div className="bg-muted h-3.5 w-3.5 rounded" />
									Settings
								</div>
							</div>
						</div>

						{/* Main area */}
						<div className="flex-1 p-3">
							{/* Header */}
							<div className="mb-3 flex items-center justify-between">
								<div className="flex items-center gap-2">
									<FileText className="text-primary h-4 w-4" />
									<span className="text-sm font-semibold">Posts</span>
								</div>
								<button
									type="button"
									className="bg-primary text-primary-foreground flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium"
								>
									<Plus className="h-3.5 w-3.5" />
									New
								</button>
							</div>

							{/* Search bar */}
							<div className="mb-3 flex gap-2">
								<div className="bg-muted/50 border-border flex h-7 flex-1 items-center border px-2">
									<span className="text-muted-foreground text-xs">
										Search posts...
									</span>
								</div>
								<div className="bg-muted/50 border-border flex h-7 items-center border px-2">
									<span className="text-muted-foreground text-xs">Options</span>
								</div>
							</div>

							{/* Table */}
							<div className="border-border overflow-hidden border">
								<div className="bg-muted/50 text-muted-foreground border-border grid grid-cols-[20px_1fr_80px_70px] gap-2 border-b px-2.5 py-1.5 text-[10px] font-medium tracking-wider uppercase">
									<div />
									<div>Title</div>
									<div>Status</div>
									<div>Updated</div>
								</div>
								{[
									{
										title: "Getting Started Guide",
										status: "published",
										time: "2h ago",
									},
									{
										title: "API Documentation",
										status: "draft",
										time: "5h ago",
									},
									{
										title: "Deployment Tips",
										status: "published",
										time: "1d ago",
									},
									{ title: "Best Practices", status: "review", time: "2d ago" },
								].map((post, i) => (
									<div
										key={post.title}
										className={cn(
											"border-border hover:bg-muted/30 grid grid-cols-[20px_1fr_80px_70px] gap-2 border-b px-2.5 py-2 text-xs transition-all duration-300 last:border-0",
											showTable
												? "translate-x-0 opacity-100"
												: "translate-x-4 opacity-0",
										)}
										style={{
											transitionDelay: showTable ? `${i * 75}ms` : "0ms",
										}}
									>
										<div className="flex items-center">
											<div className="border-border bg-background h-3.5 w-3.5 rounded-sm border" />
										</div>
										<div className="truncate font-medium">{post.title}</div>
										<div>
											<StatusBadge status={post.status} />
										</div>
										<div className="text-muted-foreground">{post.time}</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Footer */}
					<div className="border-border bg-muted/20 border-t px-3 py-2">
						<span className="text-muted-foreground font-mono text-[10px]">
							Showing 4 of 4 posts
						</span>
					</div>
				</div>
			</div>

			{/* Step indicator */}
			<div className="mt-4 flex justify-center gap-1.5">
				{["Schema", "API", "Admin", "Result"].map((step, i) => {
					const stepPhases = [
						["schema", "schema-done"],
						["endpoints", "endpoints-done"],
						["admin"],
						["result"],
					];
					const isActive = stepPhases[i].includes(phase);
					const isDone = i < stepPhases.findIndex((p) => p.includes(phase));

					return (
						<div key={step} className="flex items-center gap-1.5">
							<div
								className={cn(
									"h-2 w-2 rounded-full transition-all",
									isActive
										? "bg-primary scale-125"
										: isDone
											? "bg-primary/50"
											: "bg-muted",
								)}
							/>
							<span
								className={cn(
									"text-xs transition-colors",
									isActive
										? "text-primary font-medium"
										: "text-muted-foreground",
								)}
							>
								{step}
							</span>
							{i < 3 && (
								<span className="text-muted-foreground mx-0.5">&rarr;</span>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}

function StatusBadge({ status }: { status: string }) {
	const config = {
		published: {
			bg: "bg-green-500/10",
			text: "text-green-600 dark:text-green-400",
			dot: "bg-green-500",
		},
		draft: {
			bg: "bg-yellow-500/10",
			text: "text-yellow-600 dark:text-yellow-400",
			dot: "bg-yellow-500",
		},
		review: {
			bg: "bg-blue-500/10",
			text: "text-blue-600 dark:text-blue-400",
			dot: "bg-blue-500",
		},
	};
	const style = config[status as keyof typeof config];

	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
				style.bg,
				style.text,
			)}
		>
			<span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
			{status}
		</span>
	);
}
