import { Braces, Network, Paintbrush } from "lucide-react";

const cards = [
	{
		icon: Braces,
		title: "Server Contract",
		body: "Collections, globals, fields, access, list/form/dashboard/sidebar config, and routes live in one server-first model.",
		accent: "WHAT",
	},
	{
		icon: Network,
		title: "Introspection Layer",
		body: "Server emits serializable metadata and references: field types, view ids, and component refs like { type, props }.",
		accent: "CONTRACT",
	},
	{
		icon: Paintbrush,
		title: "Client Rendering",
		body: "Client resolves field/view/component registries and keeps full control over visuals and interaction patterns.",
		accent: "HOW",
	},
];

export function AdminExperience() {
	return (
		<section
			id="architecture"
			className="border-border/40 relative overflow-hidden border-t py-24"
		>
			<div className="pointer-events-none absolute inset-0">
				<div className="ambient-beam absolute top-20 left-1/3 h-[320px] w-[320px]" />
			</div>

			<div className="relative z-10 mx-auto w-full max-w-7xl px-4">
				<div className="mx-auto mb-14 max-w-3xl space-y-4 text-center">
					<h2 className="text-primary font-mono text-sm tracking-[0.2em] uppercase">
						One system, clear responsibility split
					</h2>
					<h3 className="text-3xl font-bold tracking-tight md:text-4xl">
						Server defines WHAT. Client defines HOW.
					</h3>
					<p className="text-muted-foreground">
						This keeps contracts stable, prevents schema/admin drift, and lets
						you evolve UI independently from backend internals.
					</p>
				</div>

				<div className="grid gap-6 md:grid-cols-3">
					{cards.map((card, i) => (
						<article
							key={card.title}
							className="animate-in fade-in slide-in-from-bottom-4 border-border bg-card/40 border p-6 backdrop-blur-sm duration-700"
							style={{ animationDelay: `${120 + i * 80}ms` }}
						>
							<div className="mb-5 flex items-start justify-between gap-4">
								<div className="border-primary/30 bg-primary/10 inline-flex border p-2">
									<card.icon className="text-primary h-5 w-5" />
								</div>
								<span className="text-muted-foreground font-mono text-[10px] tracking-[0.2em] uppercase">
									{card.accent}
								</span>
							</div>
							<h4 className="mb-2 text-lg font-semibold">{card.title}</h4>
							<p className="text-muted-foreground text-sm leading-relaxed">
								{card.body}
							</p>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
