import { ArrowLeftRight, Code2, Layers, Puzzle } from "lucide-react";

const approaches = [
	{
		icon: Code2,
		title: "Convention + Codegen",
		description:
			"File conventions for backend. Auto-generated admin config. Types flow automatically between them.",
	},
	{
		icon: Layers,
		title: "Native Libraries",
		description:
			"Drizzle for database. Better Auth for authentication. pg-boss for jobs. No proprietary abstractions.",
	},
	{
		icon: ArrowLeftRight,
		title: "Decoupled by Design",
		description:
			"Backend works headless without admin. Admin is optional. Build APIs first, add admin when you need it.",
	},
	{
		icon: Puzzle,
		title: "Framework Agnostic",
		description:
			"Works with Hono, Elysia, Next.js, TanStack Start. Mount anywhere with native adapters.",
	},
];

export function OurApproach() {
	return (
		<section className="border-border/30 relative overflow-hidden border-t py-24">
			{/* Subtle background glow */}
			<div className="bg-primary/3 absolute top-1/2 right-1/4 h-[400px] w-[400px] -translate-y-1/2 rounded-full blur-[150px]" />

			<div className="relative z-10 mx-auto w-full max-w-7xl px-4">
				<div className="mx-auto mb-16 max-w-2xl space-y-4 text-center">
					<h2 className="text-primary font-mono text-sm tracking-[0.2em] uppercase">
						Our Approach
					</h2>
					<h3 className="text-3xl font-bold md:text-4xl">
						Backend + Admin, Zero Lock-in
					</h3>
					<p className="text-muted-foreground">
						A complete backend framework built on libraries you already know.
						Own every line of code.
					</p>
				</div>

				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
					{approaches.map((approach) => (
						<div
							key={approach.title}
							className="group border-border hover:border-primary/50 border p-6 transition-colors"
						>
							<div className="border-border group-hover:border-primary/50 mb-4 w-fit border p-2 transition-colors">
								<approach.icon className="text-muted-foreground group-hover:text-primary h-5 w-5 transition-colors" />
							</div>

							<h4 className="group-hover:text-primary mb-2 font-bold transition-colors">
								{approach.title}
							</h4>

							<p className="text-muted-foreground text-sm leading-relaxed">
								{approach.description}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
