import { Icon } from "@iconify/react";
import { Link } from "@tanstack/react-router";

export function Footer() {
	return (
		<footer className="border-border/50 bg-card/20 border-t py-14">
			<div className="mx-auto w-full max-w-7xl px-4">
				<div className="mb-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
					<div className="space-y-4">
						<h4 className="text-foreground font-mono text-[11px] tracking-[0.2em] uppercase">
							Product
						</h4>
						<ul className="text-muted-foreground space-y-2 text-sm">
							<li>
								<Link
									to="/docs/$"
									className="hover:text-primary transition-colors"
								>
									Docs
								</Link>
							</li>
							<li>
								<Link
									to="/docs/$"
									params={{ _splat: "examples" }}
									className="hover:text-primary transition-colors"
								>
									Examples
								</Link>
							</li>
							<li>
								<Link
									to="/docs/$"
									params={{ _splat: "start-here" }}
									className="hover:text-primary transition-colors"
								>
									Getting Started
								</Link>
							</li>
							<li>
								<a
									href="https://github.com/questpie/questpie/releases"
									target="_blank"
									rel="noreferrer"
									className="hover:text-primary transition-colors"
								>
									Releases
								</a>
							</li>
						</ul>
					</div>

					<div className="space-y-4">
						<h4 className="text-foreground font-mono text-[11px] tracking-[0.2em] uppercase">
							Ecosystem
						</h4>
						<ul className="text-muted-foreground space-y-2 text-sm">
							<li>
								<Link
									to="/docs/$"
									params={{ _splat: "frontend/adapters/hono" }}
									className="hover:text-primary transition-colors"
								>
									Hono
								</Link>
							</li>
							<li>
								<Link
									to="/docs/$"
									params={{ _splat: "frontend/adapters/elysia" }}
									className="hover:text-primary transition-colors"
								>
									Elysia
								</Link>
							</li>
							<li>
								<Link
									to="/docs/$"
									params={{ _splat: "frontend/adapters/nextjs" }}
									className="hover:text-primary transition-colors"
								>
									Next.js
								</Link>
							</li>
							<li>
								<Link
									to="/docs/$"
									params={{ _splat: "frontend/tanstack-query" }}
									className="hover:text-primary transition-colors"
								>
									TanStack
								</Link>
							</li>
						</ul>
					</div>

					<div className="space-y-4">
						<h4 className="text-foreground font-mono text-[11px] tracking-[0.2em] uppercase">
							Community
						</h4>
						<ul className="text-muted-foreground space-y-2 text-sm">
							<li>
								<a
									href="https://github.com/questpie/questpie"
									target="_blank"
									rel="noreferrer"
									className="hover:text-primary transition-colors"
								>
									GitHub
								</a>
							</li>
							<li>
								<a
									href="https://github.com/questpie/questpie/issues"
									target="_blank"
									rel="noreferrer"
									className="hover:text-primary transition-colors"
								>
									Issues
								</a>
							</li>
							<li>
								<a
									href="https://github.com/questpie/questpie/pulls"
									target="_blank"
									rel="noreferrer"
									className="hover:text-primary transition-colors"
								>
									Pull requests
								</a>
							</li>
						</ul>
					</div>

					<div className="space-y-4">
						<h4 className="text-foreground font-mono text-[11px] tracking-[0.2em] uppercase">
							Reference
						</h4>
						<ul className="text-muted-foreground space-y-2 text-sm">
							<li>
								<Link
									to="/docs/$"
									params={{ _splat: "reference/collection-api" }}
									className="hover:text-primary transition-colors"
								>
									Collection API
								</Link>
							</li>
							<li>
								<Link
									to="/docs/$"
									params={{ _splat: "reference/admin-api" }}
									className="hover:text-primary transition-colors"
								>
									Admin API
								</Link>
							</li>
							<li>
								<Link
									to="/docs/$"
									params={{ _splat: "reference/functions-api" }}
									className="hover:text-primary transition-colors"
								>
									Functions API
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<div className="border-border/40 flex flex-col items-center justify-between gap-4 border-t pt-6 md:flex-row">
					<p className="text-muted-foreground text-xs">
						© {new Date().getFullYear()} QUESTPIE — Server-first TypeScript
						framework.
					</p>
					<a
						href="https://github.com/questpie/questpie"
						target="_blank"
						rel="noreferrer"
						aria-label="QUESTPIE on GitHub"
						className="text-muted-foreground hover:text-foreground transition-colors"
					>
						<Icon
							icon="ph:github-logo"
							className="h-4 w-4"
							aria-hidden="true"
						/>
					</a>
				</div>
			</div>
		</footer>
	);
}
