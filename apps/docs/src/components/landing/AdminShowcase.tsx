import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import coldarkCold from "react-syntax-highlighter/dist/esm/styles/prism/coldark-cold";
import coldarkDark from "react-syntax-highlighter/dist/esm/styles/prism/coldark-dark";

import { AnimModuleGrid } from "@/components/landing/BrandVisuals";
import { cn } from "@/lib/utils";

SyntaxHighlighter.registerLanguage("typescript", typescript);

type TabId = "dashboard" | "table" | "form" | "sidebar";

const tabs: { id: TabId; label: string; description: string }[] = [
	{
		id: "dashboard",
		label: "Dashboard",
		description: "Live stats from your data",
	},
	{
		id: "table",
		label: "Table View",
		description: "Filterable content list",
	},
	{
		id: "form",
		label: "Form View",
		description: "Schema-driven edit form",
	},
	{
		id: "sidebar",
		label: "Sidebar",
		description: "Menu from backend config",
	},
];

const snippets: Record<TabId, { code: string; filename: string }> = {
	dashboard: {
		code: `.dashboard(({ d }) => d.dashboard({
  items: [
    d.stats({ collection: "posts" }),
    d.stats({ collection: "users" }),
    d.chart({ collection: "posts", chartType: "line" }),
    d.recentItems({ collection: "posts" }),
  ],
}))`,
		filename: "server/collections/posts.ts",
	},
	table: {
		code: `.list(({ v, f }) => v.collectionTable({
  columns: [f.title, f.author, f.status],
}))`,
		filename: "server/collections/posts.ts",
	},
	form: {
		code: `.form(({ v, f }) => v.collectionForm({
  fields: [f.title, f.content],
  sidebar: {
    fields: [f.author, f.status],
  },
}))`,
		filename: "server/collections/posts.ts",
	},
	sidebar: {
		code: `// sidebar.ts — file convention
import { sidebar } from "#questpie"

export default sidebar({
  sections: [
    { id: "content", title: { en: "Content" } },
    { id: "system", title: { en: "System" } },
  ],
  items: [
    { sectionId: "content", type: "collection", collection: "posts" },
    { sectionId: "content", type: "collection", collection: "pages" },
    { sectionId: "system", type: "global", global: "settings" },
  ],
})`,
		filename: "server/sidebar.ts",
	},
};

const AUTO_INTERVAL = 5000;
const PAUSE_AFTER_CLICK = 10000;

export function AdminShowcase() {
	const [active, setActive] = useState<TabId>("dashboard");
	const pauseUntilRef = useRef(0);

	const handleClick = useCallback((id: TabId) => {
		pauseUntilRef.current = Date.now() + PAUSE_AFTER_CLICK;
		setActive(id);
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			if (Date.now() < pauseUntilRef.current) return;
			setActive((prev) => {
				const idx = tabs.findIndex((t) => t.id === prev);
				return tabs[(idx + 1) % tabs.length].id;
			});
		}, AUTO_INTERVAL);
		return () => clearInterval(interval);
	}, []);

	return (
		<section className="relative overflow-hidden py-20">
			{/* Dark mode glow */}
			<div className="pointer-events-none absolute top-1/2 left-1/2 hidden h-[800px] w-[1200px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse,_oklch(0.5984_0.3015_310.74_/_0.05)_0%,_transparent_70%)] dark:block" />

			<div className="relative z-10 mx-auto w-full max-w-7xl px-4">
				{/* Header */}
				<motion.div
					className="mx-auto mb-12 max-w-2xl space-y-3 text-center"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-80px" }}
					transition={{ duration: 0.6 }}
				>
					<h2 className="text-primary font-mono text-sm tracking-[0.2em] text-balance uppercase">
						Admin UI
					</h2>
					<h3 className="font-mono text-3xl font-bold tracking-[-0.02em] text-balance md:text-4xl">
						Ship admin without building a second app
					</h3>
					<p className="text-muted-foreground text-balance">
						Lists, forms, and dashboard come from backend config. Override
						components only where your product needs custom UX.
					</p>
				</motion.div>

				{/* Desktop: 3-column layout - Code | Admin | Tabs */}
				<div className="hidden gap-4 lg:grid lg:grid-cols-[280px_1fr_200px]">
					{/* Column 1: Code Panel */}
					<div className="border-border bg-card/30 flex flex-col border backdrop-blur-sm">
						<div className="border-border bg-background/50 flex items-center justify-between border-b px-3 py-2">
							<span className="text-primary max-w-[200px] truncate font-mono text-[10px]">
								{snippets[active].filename}
							</span>
							<div className="flex gap-1">
								<div className="bg-primary/40 h-1.5 w-1.5" />
								<div className="bg-primary/20 h-1.5 w-1.5" />
							</div>
						</div>
						<div className="flex-1 overflow-hidden p-3">
							<AnimatePresence mode="wait">
								<motion.div
									key={active}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.2 }}
									className="break-all"
								>
									<div className="dark:hidden">
										<SyntaxHighlighter
											language="typescript"
											style={coldarkCold}
											wrapLines={true}
											wrapLongLines={true}
											customStyle={{
												background: "transparent",
												padding: 0,
												margin: 0,
												fontSize: "0.65rem",
												lineHeight: "1.4",
											}}
										>
											{snippets[active].code}
										</SyntaxHighlighter>
									</div>
									<div className="hidden dark:block">
										<SyntaxHighlighter
											language="typescript"
											style={coldarkDark}
											wrapLines={true}
											wrapLongLines={true}
											customStyle={{
												background: "transparent",
												padding: 0,
												margin: 0,
												fontSize: "0.65rem",
												lineHeight: "1.4",
											}}
										>
											{snippets[active].code}
										</SyntaxHighlighter>
									</div>
								</motion.div>
							</AnimatePresence>
						</div>
					</div>

					{/* Column 2: Admin Preview */}
					<div className="border-border bg-card/20 relative overflow-hidden border backdrop-blur-sm">
						<AnimModuleGrid className="pointer-events-none absolute inset-0 h-full w-full opacity-30" />

						{/* Browser chrome */}
						<div className="border-border bg-background/50 relative flex items-center gap-2 border-b px-4 py-2.5">
							<div className="flex gap-1.5">
								<div className="h-2.5 w-2.5 bg-red-400/80" />
								<div className="h-2.5 w-2.5 bg-yellow-400/80" />
								<div className="h-2.5 w-2.5 bg-green-400/80" />
							</div>
							<div className="border-border/50 bg-background/60 ml-2 flex-1 border px-3 py-1">
								<span className="text-muted-foreground font-mono text-[10px]">
									localhost:3000/admin
								</span>
							</div>
						</div>

						{/* Crossfading mockup panels */}
						<div className="relative min-h-[380px] p-4">
							<AnimatePresence mode="wait">
								<motion.div
									key={active}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									transition={{ duration: 0.3 }}
								>
									{active === "dashboard" && <DashboardMock />}
									{active === "table" && <TableMock />}
									{active === "form" && <FormMock />}
									{active === "sidebar" && <SidebarMock />}
								</motion.div>
							</AnimatePresence>
						</div>
					</div>

					{/* Column 3: Tab Switcher - wider */}
					<div className="flex flex-col gap-3">
						{tabs.map((tab, index) => (
							<motion.button
								key={tab.id}
								type="button"
								onClick={() => handleClick(tab.id)}
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: index * 0.1 }}
								className={cn(
									"group min-h-[80px] cursor-pointer border p-4 text-left transition-all",
									active === tab.id
										? "border-primary bg-primary/[0.08] border-l-primary border-l-[3px]"
										: "border-border bg-card/20 hover:border-primary/30 hover:bg-card/40 backdrop-blur-sm",
								)}
							>
								<div className="flex items-center gap-2">
									<div
										className={cn(
											"h-2 w-2 transition-colors",
											active === tab.id
												? "bg-primary"
												: "bg-muted-foreground/30",
										)}
									/>
									<h4
										className={cn(
											"text-sm font-semibold transition-colors",
											active === tab.id ? "text-primary" : "text-foreground",
										)}
									>
										{tab.label}
									</h4>
								</div>
								<p className="text-muted-foreground mt-2 text-[11px] leading-relaxed">
									{tab.description}
								</p>
								{active === tab.id && (
									<motion.div
										layoutId="activeIndicator"
										className="from-primary mt-3 h-0.5 bg-gradient-to-r to-transparent"
									/>
								)}
							</motion.button>
						))}
					</div>
				</div>

				{/* Mobile: Stacked layout */}
				<div className="space-y-4 lg:hidden">
					{/* Tab switcher - horizontal */}
					<div className="flex gap-2 overflow-x-auto pb-2">
						{tabs.map((tab) => (
							<button
								key={tab.id}
								type="button"
								onClick={() => handleClick(tab.id)}
								className={cn(
									"flex-shrink-0 cursor-pointer border px-4 py-2 transition-all",
									active === tab.id
										? "border-primary bg-primary/[0.06] border-b-primary border-b-2"
										: "border-border bg-card/20",
								)}
							>
								<span
									className={cn(
										"text-sm font-medium",
										active === tab.id ? "text-primary" : "text-foreground",
									)}
								>
									{tab.label}
								</span>
							</button>
						))}
					</div>

					{/* Admin preview */}
					<div className="border-border bg-card/20 overflow-hidden border backdrop-blur-sm">
						<div className="border-border bg-background/50 flex items-center gap-2 border-b px-3 py-2">
							<div className="flex gap-1.5">
								<div className="border-border bg-muted h-2 w-2 border" />
								<div className="border-border bg-muted h-2 w-2 border" />
								<div className="border-border bg-muted h-2 w-2 border" />
							</div>
							<div className="border-border bg-background/60 ml-1 flex-1 border px-2 py-0.5">
								<span className="text-muted-foreground font-mono text-[9px]">
									localhost:3000/admin
								</span>
							</div>
						</div>
						<div className="min-h-[280px] p-3">
							<AnimatePresence mode="wait">
								<motion.div
									key={active}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.2 }}
								>
									{active === "dashboard" && <DashboardMock />}
									{active === "table" && <TableMock />}
									{active === "form" && <FormMock />}
									{active === "sidebar" && <SidebarMock />}
								</motion.div>
							</AnimatePresence>
						</div>
					</div>

					{/* Code panel - below on mobile */}
					<div className="border-border bg-card/30 overflow-hidden border backdrop-blur-sm">
						<div className="border-border bg-background/50 border-b px-3 py-2">
							<span className="text-primary max-w-[200px] truncate font-mono text-[10px]">
								{snippets[active].filename}
							</span>
						</div>
						<div className="overflow-hidden p-3">
							<div className="break-all dark:hidden">
								<SyntaxHighlighter
									language="typescript"
									style={coldarkCold}
									wrapLines={true}
									wrapLongLines={true}
									customStyle={{
										background: "transparent",
										padding: 0,
										margin: 0,
										fontSize: "0.7rem",
										lineHeight: "1.5",
									}}
								>
									{snippets[active].code}
								</SyntaxHighlighter>
							</div>
							<div className="hidden break-all dark:block">
								<SyntaxHighlighter
									language="typescript"
									style={coldarkDark}
									wrapLines={true}
									wrapLongLines={true}
									customStyle={{
										background: "transparent",
										padding: 0,
										margin: 0,
										fontSize: "0.7rem",
										lineHeight: "1.5",
									}}
								>
									{snippets[active].code}
								</SyntaxHighlighter>
							</div>
						</div>
					</div>
				</div>

				{/* Link */}
				<motion.div
					className="mt-10 text-center"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ delay: 0.3 }}
				>
					<Link
						to="/docs/$"
						params={{ _splat: "workspace" }}
						className="text-primary hover:text-primary/80 group inline-flex items-center gap-2 font-mono text-xs transition-colors"
					>
						Explore the admin module
						<span className="transition-transform group-hover:translate-x-1">
							→
						</span>
					</Link>
				</motion.div>
			</div>
		</section>
	);
}

function DashboardMock() {
	return (
		<div className="space-y-4">
			<div className="grid grid-cols-3 gap-3">
				{[
					{ label: "Total Posts", value: "248", change: "+12%" },
					{ label: "Published", value: "186", change: "+8%" },
					{ label: "Draft", value: "62", change: "-3%" },
				].map((stat) => (
					<div
						key={stat.label}
						className="border-border bg-background/60 hover:border-primary/20 border p-3 backdrop-blur-sm transition-colors"
					>
						<p className="text-muted-foreground text-[10px] tracking-wider uppercase">
							{stat.label}
						</p>
						<p className="mt-1 text-xl font-bold">{stat.value}</p>
						<p className="text-primary mt-0.5 text-[10px]">{stat.change}</p>
					</div>
				))}
			</div>
			<div className="grid gap-3 md:grid-cols-[1.5fr_1fr]">
				<div className="border-border bg-background/60 hover:border-primary/20 border p-3 backdrop-blur-sm transition-colors">
					<p className="text-muted-foreground mb-2 text-[10px] tracking-wider uppercase">
						Content over time
					</p>
					<div className="flex h-20 items-end gap-1">
						{[40, 55, 35, 65, 80, 60, 75, 90, 70, 85, 95, 88].map((h, i) => (
							<motion.div
								key={`chart-${h}`}
								initial={{ height: 0 }}
								animate={{ height: `${h}%` }}
								transition={{ delay: i * 0.05, duration: 0.3 }}
								className="bg-primary/20 hover:bg-primary/40 flex-1 transition-colors"
							/>
						))}
					</div>
				</div>
				<div className="border-border bg-background/60 hover:border-primary/20 border p-3 backdrop-blur-sm transition-colors">
					<p className="text-muted-foreground mb-2 text-[10px] tracking-wider uppercase">
						Recent items
					</p>
					<div className="space-y-1.5">
						{[
							"Getting Started Guide",
							"API Reference",
							"Migration Notes",
							"v1 Changelog",
						].map((item, i) => (
							<motion.div
								key={item}
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.2 + i * 0.1 }}
								className="flex items-center gap-2 text-xs"
							>
								<div className="bg-primary/40 h-1.5 w-1.5" />
								<span className="text-foreground truncate">{item}</span>
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

function TableMock() {
	const rows = [
		{
			title: "Getting Started with QUESTPIE",
			author: "Alex K.",
			status: "published",
			updated: "2h ago",
		},
		{
			title: "Advanced Field Patterns",
			author: "Mila J.",
			status: "draft",
			updated: "5h ago",
		},
		{
			title: "Building with Blocks",
			author: "Jaro T.",
			status: "published",
			updated: "1d ago",
		},
		{
			title: "Reactive Form Guide",
			author: "Alex K.",
			status: "draft",
			updated: "2d ago",
		},
	];

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2">
				<div className="border-border bg-background/60 flex-1 border px-3 py-1.5 backdrop-blur-sm">
					<span className="text-muted-foreground text-xs">Search posts...</span>
				</div>
				<div className="flex gap-1.5">
					{["Status: All", "Author: All"].map((filter) => (
						<span
							key={filter}
							className="border-border bg-background/60 text-muted-foreground hover:border-primary/20 cursor-pointer border px-2 py-1 text-[10px] backdrop-blur-sm transition-colors"
						>
							{filter}
						</span>
					))}
				</div>
			</div>
			<div className="border-border overflow-hidden border">
				<div className="border-border bg-muted/30 grid grid-cols-[1fr_0.5fr_0.4fr_0.3fr] gap-2 border-b px-3 py-2">
					{["Title", "Author", "Status", "Updated"].map((h) => (
						<span
							key={h}
							className="text-muted-foreground text-[9px] font-semibold tracking-wider uppercase"
						>
							{h}
						</span>
					))}
				</div>
				{rows.map((row, i) => (
					<motion.div
						key={row.title}
						initial={{ opacity: 0, y: 5 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: i * 0.05 }}
						className="border-border/50 hover:bg-background/40 grid grid-cols-[1fr_0.5fr_0.4fr_0.3fr] gap-2 border-b px-3 py-2 transition-colors"
					>
						<span className="text-foreground truncate text-xs">
							{row.title}
						</span>
						<span className="text-muted-foreground text-xs">{row.author}</span>
						<span
							className={cn(
								"inline-flex w-fit items-center px-1.5 py-0.5 text-[9px] font-medium",
								row.status === "published"
									? "bg-primary/10 text-primary border-primary/20 border"
									: "bg-muted text-muted-foreground border-border border",
							)}
						>
							{row.status}
						</span>
						<span className="text-muted-foreground text-[10px]">
							{row.updated}
						</span>
					</motion.div>
				))}
			</div>
			<div className="text-muted-foreground flex items-center justify-between text-[10px]">
				<span>Showing 1-4 of 248</span>
				<div className="flex gap-1">
					{["1", "2", "3"].map((p) => (
						<span
							key={p}
							className={cn(
								"inline-flex h-5 w-5 cursor-pointer items-center justify-center border transition-colors",
								p === "1"
									? "border-primary text-primary"
									: "border-border hover:border-primary/30",
							)}
						>
							{p}
						</span>
					))}
				</div>
			</div>
		</div>
	);
}

function FormMock() {
	return (
		<div className="grid gap-4 md:grid-cols-[1.5fr_0.8fr]">
			<div className="space-y-3">
				<div className="space-y-1.5">
					<div className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
						Title
					</div>
					<div className="border-border bg-background/60 hover:border-primary/20 border px-3 py-2 backdrop-blur-sm transition-colors">
						<span className="text-foreground text-sm">
							Getting Started with QUESTPIE
						</span>
					</div>
				</div>
				<div className="space-y-1.5">
					<div className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
						Content
					</div>
					<div className="border-border bg-background/60 min-h-[120px] border p-3 backdrop-blur-sm">
						<div className="border-border/50 mb-2 flex gap-1 border-b pb-2">
							{["B", "I", "U", "H1", "H2"].map((btn) => (
								<span
									key={btn}
									className="border-border/50 text-muted-foreground hover:border-primary/30 hover:text-primary inline-flex h-5 w-5 cursor-pointer items-center justify-center border text-[9px] transition-colors"
								>
									{btn}
								</span>
							))}
						</div>
						<div className="space-y-1.5">
							<div className="bg-muted/40 h-2 w-full" />
							<div className="bg-muted/40 h-2 w-4/5" />
							<div className="bg-muted/40 h-2 w-full" />
							<div className="bg-muted/40 h-2 w-3/5" />
						</div>
					</div>
				</div>
			</div>
			<div className="space-y-3">
				<div className="space-y-1.5">
					<div className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
						Author
					</div>
					<div className="border-border bg-background/60 hover:border-primary/20 flex items-center gap-2 border px-3 py-2 backdrop-blur-sm transition-colors">
						<div className="bg-primary/20 h-4 w-4" />
						<span className="text-foreground text-xs">Alex K.</span>
					</div>
				</div>
				<div className="space-y-1.5">
					<div className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
						Status
					</div>
					<div className="border-border bg-background/60 hover:border-primary/20 border px-3 py-2 backdrop-blur-sm transition-colors">
						<span className="inline-flex items-center gap-1 text-xs">
							<span className="bg-primary h-1.5 w-1.5" />
							Published
						</span>
					</div>
				</div>
				<button
					type="button"
					className="bg-primary text-primary-foreground hover:bg-primary/90 w-full px-4 py-2 text-xs font-medium transition-colors"
				>
					Save Changes
				</button>
			</div>
		</div>
	);
}

function SidebarMock() {
	const sections = [
		{
			title: "Overview",
			items: [{ name: "Dashboard", active: true }],
		},
		{
			title: "Content",
			items: [
				{ name: "Posts", count: 248 },
				{ name: "Pages", count: 12 },
				{ name: "Media", count: 1240 },
				{ name: "Categories", count: 8 },
			],
		},
		{
			title: "System",
			items: [{ name: "Settings" }],
		},
	];

	return (
		<div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
			<div className="border-border bg-background/60 hover:border-primary/20 border p-3 backdrop-blur-sm transition-colors">
				<div className="mb-3 flex items-center gap-2">
					<div className="bg-primary h-4 w-4" />
					<span className="text-xs font-bold">My App</span>
				</div>
				<div className="space-y-3">
					{sections.map((section, si) => (
						<div key={section.title}>
							<p className="text-muted-foreground mb-1 text-[9px] font-medium tracking-wider uppercase">
								{section.title}
							</p>
							<div className="space-y-0.5">
								{section.items.map((item, ii) => (
									<motion.div
										key={item.name}
										initial={{ opacity: 0, x: -5 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ duration: 0.4, delay: si * 0.25 + ii * 0.12 }}
										className={cn(
											"flex cursor-pointer items-center justify-between px-2 py-1.5 transition-colors",
											"active" in item && item.active
												? "border-primary bg-primary/[0.06] border-l-2"
												: "hover:bg-background/40 border-l-2 border-transparent",
										)}
									>
										<span
											className={cn(
												"text-xs",
												"active" in item && item.active
													? "text-primary font-medium"
													: "text-foreground",
											)}
										>
											{item.name}
										</span>
										{"count" in item && (
											<span className="text-muted-foreground bg-muted/50 px-1.5 py-0.5 text-[9px]">
												{item.count}
											</span>
										)}
									</motion.div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
			<div className="space-y-3">
				<div className="border-border bg-background/60 hover:border-primary/20 border p-4 backdrop-blur-sm transition-colors">
					<p className="text-primary mb-2 font-mono text-[10px] tracking-[0.18em] uppercase">
						Server-defined
					</p>
					<p className="text-muted-foreground text-sm">
						Sidebar sections, grouping, and item counts — all from{" "}
						<code className="text-foreground bg-muted/50 px-1 py-0.5 text-xs">
							.sidebar()
						</code>{" "}
						in your builder config.
					</p>
				</div>
				<div className="border-border bg-background/60 hover:border-primary/20 border p-4 backdrop-blur-sm transition-colors">
					<p className="text-primary mb-2 font-mono text-[10px] tracking-[0.18em] uppercase">
						Client-rendered
					</p>
					<p className="text-muted-foreground text-sm">
						Swap the sidebar component via the client registry to match your
						product&apos;s design system.
					</p>
				</div>
			</div>
		</div>
	);
}
