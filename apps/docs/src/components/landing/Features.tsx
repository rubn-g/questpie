import { Icon } from "@iconify/react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";

import {
	AnimModuleGrid,
	CornerPie,
	CornerSquare,
} from "@/components/landing/BrandVisuals";

const features = [
	{
		icon: "ph:cube",
		title: "Blocks System",
		description:
			"Define reusable blocks on the server and render them in admin or custom UIs.",
		link: "workspace/blocks",
	},
	{
		icon: "ph:magnifying-glass",
		title: "Search & Semantic",
		description:
			"Built-in PostgreSQL FTS, pgVector semantic search, and faceted filters.",
		link: "production/search",
	},
	{
		icon: "ph:file-text",
		title: "OpenAPI & Scalar",
		description:
			"Generate OpenAPI from collections, globals, and functions with built-in Scalar docs.",
		link: "reference",
	},
	{
		icon: "ph:translate",
		title: "i18n / Localization",
		description:
			"Field-level localization with typed locales and admin locale switching.",
		link: "backend/data-modeling/localization",
	},
	{
		icon: "ph:list-checks",
		title: "Jobs & Queues",
		description:
			"pg-boss jobs with cron schedules, retries, and priority queues.",
		link: "production/queue",
	},
	{
		icon: "ph:shield-check",
		title: "Access Control",
		description:
			"Collection and field-level rules evaluated with full user/session context.",
		link: "backend/rules/access-control",
	},
	{
		icon: "ph:buildings",
		title: "Multitenancy & Scopes",
		description:
			"Scopes, tenant isolation, row-level filters, and admin scope picker.",
		link: "backend/rules/access-control",
	},
	{
		icon: "ph:key",
		title: "Auth (Better Auth)",
		description:
			"Better Auth integration: email/password, OAuth, 2FA, sessions, and API keys.",
		link: "production/authentication",
	},
];

export function Features() {
	return (
		<section
			id="features"
			className="border-border/40 relative overflow-hidden py-20"
		>
			<div className="relative z-10 mx-auto w-full max-w-7xl px-4">
				{/* L-R layout: heading LEFT, module grid viz RIGHT */}
				<div className="mb-12 grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
					{/* Left — heading + description + link */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-80px" }}
						transition={{ duration: 0.6 }}
					>
						<h2 className="text-primary font-mono text-sm tracking-[0.2em] text-balance uppercase">
							Platform Capabilities
						</h2>
						<h3 className="mt-3 font-mono text-3xl font-bold tracking-[-0.02em] text-balance md:text-4xl">
							Built-in platform capabilities
						</h3>
						<p className="text-muted-foreground mt-3 max-w-lg text-balance">
							Search, i18n, jobs, auth, multitenancy, and blocks are all built
							in. Configure once in backend, use everywhere.
						</p>
						<div className="mt-6">
							<Link
								to="/docs/$"
								params={{ _splat: "production" }}
								className="text-primary hover:text-primary/80 inline-flex items-center gap-2 font-mono text-xs transition-colors"
							>
								Explore platform infrastructure →
							</Link>
						</div>
					</motion.div>

					{/* Right — Module grid visualization */}
					<motion.div
						className="order-last flex items-center justify-center lg:order-none lg:justify-end"
						initial={{ opacity: 0, x: 20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true, margin: "-80px" }}
						transition={{ duration: 0.6, delay: 0.15 }}
					>
						<AnimModuleGrid className="pointer-events-none h-auto w-full max-w-[320px] opacity-80" />
					</motion.div>
				</div>

				{/* Feature cards — aligned with heading */}
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{features.map((feature, i) => (
						<motion.div
							key={feature.title}
							className="group border-border bg-card/20 hover:border-primary/30 relative border p-4 backdrop-blur-sm transition-colors"
							initial={{ opacity: 0, y: 16 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{
								duration: 0.4,
								delay: i * 0.06,
							}}
						>
							<CardDecoration index={i} />
							<div className="border-primary/20 bg-primary/10 text-primary group-hover:bg-primary/20 mb-3 flex h-9 w-9 items-center justify-center border transition-colors">
								<Icon
									icon={feature.icon}
									className="h-4 w-4"
									aria-hidden="true"
								/>
							</div>
							<h4 className="mb-1 font-mono text-sm font-semibold">
								{feature.title}
							</h4>
							<p className="text-muted-foreground text-xs leading-relaxed">
								{feature.description}
							</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}

/**
 * Alternating corner decorations so cards don't all look identical.
 * Pattern: square top-right, pie bottom-left, nothing, square bottom-right,
 *          pie top-left, nothing, square top-left, pie top-right
 */
function CardDecoration({ index }: { index: number }) {
	const variant = index % 6;
	switch (variant) {
		case 0:
			return <CornerSquare size={24} className="absolute top-0 right-0" />;
		case 1:
			return (
				<CornerPie size={20} className="absolute bottom-0 left-0 rotate-180" />
			);
		case 2:
			return null;
		case 3:
			return (
				<CornerSquare
					size={20}
					className="absolute right-0 bottom-0 rotate-90"
				/>
			);
		case 4:
			return (
				<CornerPie size={24} className="absolute top-0 left-0 -rotate-90" />
			);
		case 5:
			return null;
		default:
			return null;
	}
}
