import { Link } from "@tanstack/react-router";
import { Box, Layers, Palette, Plug } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { AnimFloatingPies } from "@/components/landing/BrandVisuals";
import { cn } from "@/lib/utils";

const layers = [
	{
		icon: Box,
		label: "Core",
		api: "collections/ routes/ jobs/",
		description:
			"Drop files into convention directories. Collections, globals, routes, jobs - all discovered automatically.",
	},
	{
		icon: Plug,
		label: "Adapters",
		api: "runtimeConfig()",
		description:
			"Storage, queue, email, search, realtime — swap any provider. Your business logic never changes.",
	},
	{
		icon: Layers,
		label: "Modules",
		api: "modules.ts",
		description:
			"Compose pre-built modules. Admin ships a full panel. Audit adds logging. One array, unlimited capability.",
	},
	{
		icon: Palette,
		label: "Client",
		api: ".generated/client",
		description:
			"Admin config auto-generated from your server definitions. Field renderers, views, widgets — all from codegen.",
	},
];

export function Composability() {
	const [activeLayer, setActiveLayer] = useState<number>(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);

	// Auto-play interval
	useEffect(() => {
		if (!isAutoPlaying) return;

		const interval = setInterval(() => {
			setActiveLayer((prev) => (prev + 1) % layers.length);
		}, 3000); // 3 seconds per layer

		return () => clearInterval(interval);
	}, [isAutoPlaying]);

	return (
		<section
			id="composability"
			className="border-border/40 relative overflow-hidden border-t py-20"
		>
			{/* Ambient background visuals */}
			<AnimFloatingPies className="pointer-events-none absolute inset-0 h-full w-full opacity-40" />
			{/* Ambient glow */}
			<div className="pointer-events-none absolute top-1/2 left-1/2 hidden h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,_oklch(0.5984_0.3015_310.74_/_0.08)_0%,_transparent_70%)] dark:block" />

			<div className="relative z-10 mx-auto w-full max-w-7xl px-4">
				<motion.div
					className="mx-auto mb-12 max-w-2xl space-y-3 text-center"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-80px" }}
					transition={{ duration: 0.6 }}
				>
					<h2 className="text-primary font-mono text-sm tracking-[0.2em] uppercase">
						Architecture
					</h2>
					<h3 className="font-mono text-3xl font-bold tracking-[-0.02em] text-balance md:text-4xl">
						Four layers.
						<br />
						Zero lock-in.
					</h3>
					<p className="text-muted-foreground mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-balance">
						Server defines <strong className="text-foreground">what</strong>.
						Client defines <strong className="text-foreground">how</strong>.
						Adapters define <strong className="text-foreground">where</strong>.
						Compose them your way.
					</p>

					<div className="mt-8">
						<Link
							to="/docs/$"
							params={{ _splat: "start-here" }}
							className="text-primary hover:text-primary/80 inline-flex items-center gap-2 font-mono text-xs transition-colors"
						>
							Read the architecture philosophy →
						</Link>
					</div>
				</motion.div>

				{/* Interactive Pipeline visualization */}
				<motion.div
					className="relative mx-auto flex w-full max-w-5xl flex-col items-center justify-center"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-80px" }}
					transition={{ duration: 0.8, delay: 0.2 }}
				>
					{/* Pipeline nodes — grid guarantees equal columns so lines align exactly */}
					<div
						className="relative mb-4 grid w-full grid-cols-4"
						onMouseEnter={() => setIsAutoPlaying(false)}
						onMouseLeave={() => setIsAutoPlaying(true)}
						role="group"
						aria-label="Layer pipeline"
					>
						{/*
						 * 4 equal grid columns → node centers at 12.5%, 37.5%, 62.5%, 87.5%
						 * Line spans from first center (12.5%) to last center (87.5%)
						 */}

						{/* Background connecting line */}
						<div className="bg-border/40 absolute top-6 right-[12.5%] left-[12.5%] z-0 h-[1px] md:top-7" />

						{/* Active glowing connection segments */}
						<div className="absolute top-6 right-[12.5%] left-[12.5%] z-[1] flex h-[1px] md:top-7">
							{[1, 2, 3].map((seg) => (
								<motion.div
									key={seg}
									className="bg-primary/70 h-full"
									style={{ width: "33.33%" }}
									initial={{ scaleX: 0, originX: 0 }}
									animate={{
										scaleX: activeLayer >= seg ? 1 : 0,
									}}
									transition={{ duration: 0.5, ease: "easeOut" }}
								/>
							))}
						</div>

						{/* Traveling light pulse */}
						<div className="pointer-events-none absolute top-6 right-[12.5%] left-[12.5%] z-[5] h-[1px] md:top-7">
							<motion.div
								className="bg-primary absolute top-1/2 h-[2px] w-10 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_20px_4px_rgba(183,0,255,0.7)] md:w-12"
								initial={{ left: "0%" }}
								animate={{ left: `${activeLayer * 33.333}%` }}
								transition={{
									type: "spring",
									stiffness: 120,
									damping: 20,
								}}
							/>
						</div>

						{/* Nodes — one per grid column, centered */}
						{layers.map((layer, i) => {
							const isActive = activeLayer === i;
							const isPassed = i <= activeLayer;

							return (
								<button
									key={layer.label}
									type="button"
									className="group relative z-20 flex cursor-pointer flex-col items-center border-0 bg-transparent p-0"
									onClick={() => {
										setActiveLayer(i);
										setIsAutoPlaying(false);
									}}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											setActiveLayer(i);
											setIsAutoPlaying(false);
										}
									}}
								>
									<motion.div
										className={cn(
											"relative flex h-12 w-12 items-center justify-center border backdrop-blur-sm transition-all duration-300 md:h-14 md:w-14",
											isActive
												? "border-primary bg-primary/20 scale-110 shadow-[0_0_30px_-5px_rgba(183,0,255,0.5)]"
												: isPassed
													? "border-primary/50 bg-primary/5 hover:border-primary/80"
													: "border-border bg-card/20 hover:border-primary/40",
										)}
									>
										<layer.icon
											className={cn(
												"h-5 w-5 transition-colors duration-300 md:h-6 md:w-6",
												isActive
													? "text-primary"
													: isPassed
														? "text-primary/70"
														: "text-muted-foreground",
											)}
										/>
									</motion.div>

									<motion.div
										className="mt-3 flex flex-col items-center text-center"
										animate={{
											opacity: isActive ? 1 : isPassed ? 0.7 : 0.4,
										}}
									>
										<span
											className={cn(
												"font-mono text-[10px] font-bold uppercase transition-colors duration-300 md:text-sm",
												isActive ? "text-primary" : "text-foreground",
											)}
										>
											{layer.label}
										</span>
										<span
											className={cn(
												"mt-1 rounded-sm border px-1.5 py-0.5 font-mono text-[8px] whitespace-nowrap transition-colors duration-300 md:text-[10px]",
												isActive
													? "bg-primary/10 text-primary border-primary/30"
													: "bg-muted/30 text-muted-foreground border-transparent",
											)}
										>
											{layer.api}
										</span>
									</motion.div>
								</button>
							);
						})}
					</div>

					{/* Description card below pipeline */}
					<div className="mt-8 w-full max-w-xl px-4 sm:mt-6 md:mt-4">
						<AnimatePresence mode="wait">
							<motion.div
								key={activeLayer}
								initial={{ opacity: 0, y: 10, scale: 0.98 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								exit={{ opacity: 0, y: -10, scale: 0.98 }}
								transition={{ duration: 0.3 }}
								className="border-border bg-card/20 hover:border-primary/30 w-full rounded-none border p-5 backdrop-blur-md transition-colors md:p-6"
							>
								<div className="flex flex-row items-center gap-4">
									<div className="border-primary/20 bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center border transition-colors md:h-12 md:w-12">
										{(() => {
											const Icon = layers[activeLayer].icon;
											return <Icon className="h-5 w-5 md:h-6 md:w-6" />;
										})()}
									</div>
									<div>
										<h4 className="text-foreground mb-1 text-sm font-semibold md:text-lg">
											{layers[activeLayer].label} Layer
										</h4>
										<p className="text-muted-foreground text-xs leading-relaxed md:text-sm">
											{layers[activeLayer].description}
										</p>
									</div>
								</div>
							</motion.div>
						</AnimatePresence>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
