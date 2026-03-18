import { Check, Code2, ShieldCheck, Waypoints } from "lucide-react";

const dxPoints = [
	"Autocomplete on collections and fields",
	"Typed query and relation inputs",
	"Typed route inputs and outputs",
	"Shared contracts across server and client",
];

export function UseCases() {
	return (
		<section className="border-border/40 border-t py-24" id="type-safety">
			<div className="mx-auto w-full max-w-7xl px-4">
				<div className="grid gap-8 lg:grid-cols-[1.05fr_1fr]">
					<div className="space-y-4">
						<h2 className="text-primary font-mono text-sm tracking-[0.2em] uppercase">
							Developer experience
						</h2>
						<h3 className="text-3xl font-bold tracking-tight md:text-4xl">
							Type safety without codegen ceremony.
						</h3>
						<p className="text-muted-foreground">
							Types flow from server model to client usage. Collections,
							relations, and routes are inferred directly from your app
							definitions.
						</p>

						<div className="text-muted-foreground space-y-2.5 text-sm">
							{dxPoints.map((point) => (
								<div
									key={point}
									className="border-border bg-card/30 inline-flex w-full items-center gap-2 border px-3 py-2"
								>
									<Check className="text-primary h-3.5 w-3.5" />
									{point}
								</div>
							))}
						</div>
					</div>

					<div className="grid gap-4 sm:grid-cols-2">
						<article className="border-border bg-card/40 border p-5">
							<Code2 className="text-primary mb-3 h-5 w-5" />
							<h4 className="mb-1 font-semibold">End-to-end TS inference</h4>
							<p className="text-muted-foreground text-sm">
								Strong inference from `q` builders to runtime APIs and admin
								registries.
							</p>
						</article>
						<article className="border-border bg-card/40 border p-5">
							<Waypoints className="text-primary mb-3 h-5 w-5" />
							<h4 className="mb-1 font-semibold">One mental model</h4>
							<p className="text-muted-foreground text-sm">
								Same definitions drive schema, admin behavior, and business
								workflows.
							</p>
						</article>
						<article className="border-border bg-card/40 border p-5 sm:col-span-2">
							<ShieldCheck className="text-primary mb-3 h-5 w-5" />
							<h4 className="mb-1 font-semibold">Safer refactors</h4>
							<p className="text-muted-foreground text-sm">
								Registry-first contracts and typed APIs reduce hidden coupling
								and catch architecture regressions early.
							</p>
						</article>
					</div>
				</div>
			</div>
		</section>
	);
}
