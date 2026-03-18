const trustItems = [
	"TypeScript",
	"Drizzle ORM",
	"Zod",
	"Better Auth",
	"Hono",
	"Elysia",
	"TanStack",
];

export function NumbersStrip() {
	return (
		<section className="border-border/40 border-y">
			<div className="mx-auto w-full max-w-7xl px-4 py-6">
				<p className="text-muted-foreground text-center text-sm">
					<span className="mr-3 font-mono text-[11px] tracking-[0.18em] uppercase">
						Built on
					</span>
					{trustItems.map((item, i) => (
						<span key={item}>
							<span className="text-foreground font-medium">{item}</span>
							{i < trustItems.length - 1 && (
								<span className="text-border mx-2">·</span>
							)}
						</span>
					))}
				</p>
			</div>
		</section>
	);
}
