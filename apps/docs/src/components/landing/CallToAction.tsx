import { Icon } from "@iconify/react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";

import { AnimFloatingPies } from "@/components/landing/BrandVisuals";

export function CallToAction() {
	return (
		<section className="relative overflow-hidden py-24">
			{/* Brand floating pies — ambient background */}
			<AnimFloatingPies className="pointer-events-none absolute inset-0 h-full w-full opacity-80" />
			{/* Extra ambient glow for CTA */}
			<div className="pointer-events-none absolute top-1/2 left-1/2 hidden h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse,_oklch(0.5984_0.3015_310.74_/_0.08)_0%,_transparent_60%)] dark:block" />

			<div className="relative z-10 mx-auto w-full max-w-7xl px-4 text-center">
				{/* Logo + badge inline */}
				<motion.div
					className="mb-6 inline-flex items-center gap-3"
					initial={{ opacity: 0, y: 10 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
				>
					<div className="relative">
						<div className="bg-primary/20 absolute inset-0 blur-2xl" />
						<img
							src="/symbol/Q-symbol-white-pink.svg"
							alt="QUESTPIE"
							className="relative hidden h-10 w-auto dark:block"
						/>
						<img
							src="/symbol/Q-symbol-dark-pink.svg"
							alt="QUESTPIE"
							className="relative h-10 w-auto dark:hidden"
						/>
					</div>
					<span className="border-primary/20 bg-primary/[0.05] text-primary inline-flex items-center gap-2 border px-3 py-1 font-mono text-[10px] tracking-[0.22em] uppercase">
						<span className="bg-primary h-1.5 w-1.5" />
						Open Source
					</span>
				</motion.div>

				<motion.h2
					className="font-mono text-3xl font-bold tracking-[-0.02em] text-balance md:text-4xl"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.15 }}
				>
					Start with one backend, ship fast
				</motion.h2>

				<motion.p
					className="text-muted-foreground mx-auto mt-4 max-w-md text-base text-balance"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.2 }}
				>
					Get CRUD + functions running first. Add admin UI and client SDKs when
					you need them.
				</motion.p>

				<motion.div
					className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.25 }}
				>
					<Link
						to="/docs/$"
						params={{ _splat: "start-here/first-app" }}
						className="group bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-11 items-center justify-center px-7 text-sm font-medium transition-colors"
					>
						Start with Quickstart
						<Icon
							icon="ph:arrow-right"
							className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5"
							aria-hidden="true"
						/>
					</Link>
					<Link
						to="/docs/$"
						params={{
							_splat: "examples/barbershop",
						}}
						className="border-border bg-card/10 hover:border-primary/30 inline-flex h-11 items-center justify-center border px-7 text-sm font-medium backdrop-blur-sm transition-colors"
					>
						Architecture Example
					</Link>
					<a
						href="https://github.com/questpie/questpie"
						target="_blank"
						rel="noreferrer"
						className="text-muted-foreground hover:text-foreground inline-flex h-11 items-center justify-center gap-2 px-7 text-sm font-medium transition-colors"
					>
						<Icon
							icon="ph:github-logo"
							className="h-4 w-4"
							aria-hidden="true"
						/>
						GitHub
					</a>
				</motion.div>

				{/* Terminal command */}
				<motion.div
					className="border-border bg-card/10 text-muted-foreground mt-6 inline-flex items-center gap-3 border px-4 py-2.5 font-mono text-sm backdrop-blur-sm"
					initial={{ opacity: 0, y: 10 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.3 }}
				>
					<Icon
						icon="ph:terminal"
						className="text-primary h-4 w-4"
						aria-hidden="true"
					/>
					<div className="text-left leading-tight">
						<div>
							<span className="text-primary">$</span> bun i questpie
						</div>
						<div className="text-muted-foreground/80 text-[10px]">
							optional generated admin UI
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
