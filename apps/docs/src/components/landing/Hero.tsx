import { Icon } from "@iconify/react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";

import { AnimHeroArcs } from "@/components/landing/BrandVisuals";
import { cn } from "@/lib/utils";

SyntaxHighlighter.registerLanguage("typescript", typescript);

const rows = [
	{ id: 1, title: "Homepage Redesign", author: "Alex K.", status: "published" },
	{
		id: 2,
		title: "API Documentation",
		author: "Mila J.",
		status: "draft",
		locked: true,
		lockedBy: "MJ",
	},
	{ id: 3, title: "Release Notes v2", author: "Jaro T.", status: "published" },
	{ id: 4, title: "Migration Guide", author: "Alex K.", status: "draft" },
];

const script = [
	{ row: 0, status: "draft" },
	{ row: 2, status: "draft" },
	{ row: 3, status: "published" },
	{ row: 0, status: "published" },
	{ row: 1, status: "published" },
	{ row: 3, status: "draft" },
	{ row: 2, status: "published" },
	{ row: 1, status: "draft" },
];

export function Hero() {
	const shouldReduceMotion = useReducedMotion();
	const [tableRows, setTableRows] = useState(rows);
	const [pulsingRow, setPulsingRow] = useState<number | null>(null);

	useEffect(() => {
		const controller = new AbortController();
		const { signal } = controller;

		const wait = (ms: number) =>
			new Promise<void>((resolve, reject) => {
				const id = setTimeout(resolve, ms);
				signal.addEventListener("abort", () => {
					clearTimeout(id);
					reject(new Error("aborted"));
				});
			});

		const run = async () => {
			try {
				await wait(1500);
				let step = 0;
				while (!signal.aborted) {
					const s = script[step % script.length];
					setTableRows((prev) =>
						prev.map((r, i) => (i === s.row ? { ...r, status: s.status } : r)),
					);
					setPulsingRow(s.row);
					await wait(600);
					setPulsingRow(null);
					await wait(1000);
					step++;
				}
			} catch {
				// aborted
			}
		};

		run();
		return () => controller.abort();
	}, []);

	return (
		<section className="relative flex min-h-[85vh] items-center overflow-hidden lg:min-h-0 lg:flex-1">
			{/* Brand arc motif — pinned to bottom-right corner, dark mode only */}
			<AnimHeroArcs className="pointer-events-none absolute right-0 bottom-0 w-[60%] max-w-[800px]" />

			{/* Dark mode ambient glow */}
			<div className="pointer-events-none absolute top-0 left-1/2 hidden h-[600px] w-[1200px] -translate-x-1/2 bg-[radial-gradient(ellipse,_oklch(0.5984_0.3015_310.74_/_0.08)_0%,_transparent_60%)] dark:block" />

			{/* Horizontal beam sweep on load - dark mode only */}
			{!shouldReduceMotion && (
				<motion.div
					className="pointer-events-none absolute top-1/3 left-0 hidden h-px w-full dark:block"
					style={{
						background:
							"linear-gradient(90deg, transparent 0%, oklch(0.5984 0.3015 310.74 / 0.5) 50%, transparent 100%)",
					}}
					initial={{ opacity: 0, scaleX: 0 }}
					animate={{ opacity: [0, 1, 0], scaleX: [0, 1, 1] }}
					transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
				/>
			)}

			<div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-24 lg:py-32">
				<div className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
					{/* Left — text content */}
					<div className="relative">
						<motion.div
							initial={{ opacity: 0, y: 8 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
						>
							<span className="border-primary/20 bg-primary/[0.05] text-primary inline-flex items-center gap-2 border px-3 py-1.5 font-mono text-[10px] tracking-[0.22em] uppercase">
								<Icon
									icon="ph:sparkle"
									className="h-3 w-3"
									aria-hidden="true"
								/>
								Open Source
							</span>
						</motion.div>

						<motion.h1
							className="text-foreground mt-6 font-mono text-4xl leading-[1.08] font-bold tracking-[-0.02em] text-balance md:text-5xl lg:text-6xl"
							initial={{ opacity: 0, y: 16 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.08 }}
						>
							One backend,{" "}
							<span className="relative inline-block">
								<span className="text-primary">ship everywhere</span>
								<motion.span
									className="bg-primary/30 absolute -bottom-1 left-0 h-[2px]"
									initial={{ width: 0 }}
									animate={{ width: "100%" }}
									transition={{ duration: 0.8, delay: 1 }}
								/>
							</span>
						</motion.h1>

						<motion.p
							className="text-muted-foreground mt-5 max-w-xl text-base leading-relaxed text-balance lg:text-lg"
							initial={{ opacity: 0, y: 16 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.16 }}
						>
							Drop a file. Get an API. Ship REST, functions, realtime, typed
							clients, and optional admin UI — all from one schema.
						</motion.p>

						<motion.div
							className="mt-6 flex flex-wrap gap-2"
							initial={{ opacity: 0, y: 14 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.2 }}
						>
							{[
								"File conventions",
								"Types end-to-end",
								"Admin is optional",
							].map((pill) => (
								<span
									key={pill}
									className="border-border bg-card/10 text-muted-foreground inline-flex items-center border px-3 py-1 font-mono text-[10px] tracking-[0.14em] uppercase"
								>
									{pill}
								</span>
							))}
						</motion.div>

						<motion.div
							className="mt-8 flex flex-col gap-3 sm:flex-row"
							initial={{ opacity: 0, y: 16 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.24 }}
						>
							<Link
								to="/docs/$"
								params={{ _splat: "start-here/first-app" }}
								className="group bg-primary text-primary-foreground hover:bg-primary/90 relative inline-flex h-12 items-center justify-center overflow-hidden px-8 text-sm font-medium transition-all"
							>
								<span className="relative z-10">Get Started</span>
								<Icon
									icon="ph:arrow-right"
									className="relative z-10 ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5"
								/>
								<motion.div
									className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
									initial={{ x: "-100%" }}
									whileHover={{ x: "100%" }}
									transition={{ duration: 0.5 }}
								/>
							</Link>
							<a
								href="https://github.com/questpie/questpie"
								target="_blank"
								rel="noreferrer"
								className="group border-border bg-card/10 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-card/20 inline-flex h-12 items-center justify-center gap-2 border px-8 text-sm font-medium backdrop-blur-sm transition-all"
							>
								<Icon
									icon="ph:github-logo"
									className="h-4 w-4 transition-transform group-hover:scale-110"
									aria-hidden="true"
								/>
								GitHub
							</a>
						</motion.div>

						<motion.div
							className="border-border bg-card/10 text-muted-foreground group hover:border-primary/20 mt-6 inline-flex cursor-pointer items-center gap-3 rounded-sm border px-4 py-2.5 font-mono text-sm backdrop-blur-sm transition-colors"
							initial={{ opacity: 0, y: 12 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.32 }}
							onClick={() => {
								navigator.clipboard.writeText("bun i questpie");
							}}
						>
							<Icon
								icon="ph:terminal"
								className="text-primary h-4 w-4"
								aria-hidden="true"
							/>
							<span>
								<span className="text-primary">$</span> bun i questpie
							</span>
							<motion.span
								className="text-primary text-[10px] opacity-0 transition-opacity group-hover:opacity-100"
								initial={false}
							>
								Click to copy
							</motion.span>
						</motion.div>
					</div>

					{/* Right — live admin preview */}
					<motion.div
						className="relative"
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.7, delay: 0.3 }}
					>
						{/* Main admin card */}
						<div className="border-border bg-card/10 relative overflow-hidden border backdrop-blur-sm">
							{/* Browser chrome */}
							<div className="border-border bg-background/50 relative flex items-center gap-2 border-b px-4 py-3">
								<div className="flex gap-1.5">
									<div className="h-3 w-3 bg-red-400/80" />
									<div className="h-3 w-3 bg-yellow-400/80" />
									<div className="h-3 w-3 bg-green-400/80" />
								</div>
								<div className="border-border/50 bg-background/60 ml-2 flex-1 border px-3 py-1">
									<span className="text-muted-foreground font-mono text-[10px]">
										localhost:3000/admin/posts
									</span>
								</div>
								<span className="border-primary/20 bg-primary/[0.05] inline-flex items-center gap-1.5 border px-2 py-0.5">
									<span className="relative flex h-1.5 w-1.5">
										<span className="bg-primary absolute inline-flex h-full w-full animate-ping opacity-75" />
										<span className="bg-primary relative inline-flex h-1.5 w-1.5" />
									</span>
									<span className="text-primary text-[9px] font-medium">
										SYNCED
									</span>
								</span>
							</div>

							{/* Table header */}
							<div className="border-border bg-card/5 relative flex items-center justify-between border-b px-4 py-3">
								<div className="flex items-center gap-2">
									<span className="text-foreground text-sm font-semibold">
										Posts View
									</span>
								</div>
								<div className="flex items-center gap-2">
									<div className="border-border bg-background/50 h-7 w-24 rounded-sm border" />
									<div className="border-border bg-primary/10 h-7 w-20 rounded-sm border" />
								</div>
							</div>

							{/* Column headers */}
							<div className="border-border bg-muted/30 relative grid grid-cols-[1fr_0.6fr_0.4fr_auto] gap-2 border-b px-4 py-2">
								{["Title", "Author", "Status", ""].map((h) => (
									<span
										key={h || "lock"}
										className="text-muted-foreground text-[9px] font-medium tracking-wider uppercase"
									>
										{h}
									</span>
								))}
							</div>

							{/* Rows */}
							<div className="relative">
								{tableRows.map((row, i) => (
									<motion.div
										key={row.id}
										initial={{ opacity: 0, x: -10 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: 0.5 + i * 0.1 }}
										className={cn(
											"border-border/30 hover:bg-background/40 grid grid-cols-[1fr_0.6fr_0.4fr_auto] gap-2 border-b px-4 py-2.5 transition-all",
											pulsingRow === i && "bg-primary/5",
										)}
									>
										<span className="text-foreground truncate text-[11px]">
											{row.title}
										</span>
										<span className="text-muted-foreground text-[11px]">
											{row.author}
										</span>
										<span
											className={cn(
												"inline-flex w-fit items-center rounded-sm px-2 py-0.5 text-[9px] font-medium transition-all duration-300",
												row.status === "published"
													? "bg-primary/10 text-primary border-primary/20 border"
													: "bg-muted/30 text-muted-foreground border-border border",
											)}
										>
											{row.status}
										</span>
										<div className="flex w-8 items-center justify-end">
											{row.locked && (
												<motion.span
													initial={{ scale: 0.95, opacity: 0 }}
													animate={{ scale: 1, opacity: 1 }}
													className="inline-flex items-center gap-1"
												>
													<Icon
														icon="ph:lock"
														className="text-muted-foreground h-3 w-3"
														aria-hidden="true"
													/>
													<span className="bg-primary/10 text-primary inline-flex h-4 w-4 items-center justify-center rounded-sm font-mono text-[7px]">
														{row.lockedBy}
													</span>
												</motion.span>
											)}
										</div>
									</motion.div>
								))}
							</div>

							{/* Ambient glow behind card */}
							<div className="absolute -inset-4 -z-10 hidden bg-[radial-gradient(ellipse_at_center,_oklch(0.5984_0.3015_310.74_/_0.1)_0%,_transparent_70%)] blur-2xl dark:block" />
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
