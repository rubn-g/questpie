import { Icon } from "@iconify/react";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

const navItems = [
	{ label: "Docs", href: "/docs/$", type: "internal" as const },
	{
		label: "Examples",
		href: "/docs/$",
		type: "internal" as const,
		params: { _splat: "examples" },
	},
	{
		label: "GitHub",
		href: "https://github.com/questpie/questpie",
		type: "external" as const,
	},
];

export function Navbar() {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 8);
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header
			className={cn(
				"fixed inset-x-0 top-0 z-50 border-b border-transparent transition-all duration-300",
				isScrolled
					? "bg-background/70 border-border/60 py-3 backdrop-blur-xl"
					: "bg-transparent py-5",
			)}
		>
			<div className="mx-auto w-full max-w-7xl px-4">
				<nav className="flex items-center justify-between">
					<Link to="/" className="group flex items-center gap-2">
						<img
							src="/symbol/Q-symbol-dark-pink.svg"
							alt="QUESTPIE"
							className="block h-8 w-auto sm:hidden dark:hidden"
						/>
						<img
							src="/symbol/Q-symbol-white-pink.svg"
							alt="QUESTPIE"
							className="hidden h-8 w-auto dark:block dark:sm:hidden"
						/>
						<img
							src="/logo/Questpie-dark-pink.svg"
							alt="QUESTPIE"
							className="hidden h-6 w-auto sm:block dark:hidden"
						/>
						<img
							src="/logo/Questpie-white-pink.svg"
							alt="QUESTPIE"
							className="hidden h-6 w-auto dark:sm:block"
						/>
					</Link>

					<div className="hidden items-center gap-7 md:flex">
						{navItems.map((item) =>
							item.type === "internal" ? (
								<Link
									key={item.label}
									to={item.href}
									params={item.params as never}
									className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
								>
									{item.label}
								</Link>
							) : (
								<a
									key={item.label}
									href={item.href}
									target="_blank"
									rel="noreferrer"
									className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
								>
									{item.label}
								</a>
							),
						)}

						<a
							href="https://github.com/questpie/questpie"
							target="_blank"
							rel="noreferrer"
							aria-label="QUESTPIE on GitHub"
							className="text-muted-foreground hover:text-foreground transition-colors"
						>
							<Icon
								icon="ph:github-logo"
								className="h-5 w-5"
								aria-hidden="true"
							/>
						</a>
						<ThemeToggle />
						<Link
							to="/docs/$"
							params={{ _splat: "start-here/first-app" }}
							className="border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 inline-flex h-9 items-center justify-center border px-4 font-mono text-[11px] font-medium tracking-wider uppercase transition-all"
						>
							Build Platform
						</Link>
					</div>

					<button
						type="button"
						className="text-muted-foreground hover:text-foreground p-2 transition-colors md:hidden"
						onClick={() => setIsMobileMenuOpen((v) => !v)}
						aria-label="Toggle navigation"
					>
						{isMobileMenuOpen ? (
							<Icon icon="ph:x" className="h-6 w-6" aria-hidden="true" />
						) : (
							<Icon icon="ph:list" className="h-6 w-6" aria-hidden="true" />
						)}
					</button>
				</nav>

				{isMobileMenuOpen && (
					<div className="animate-in slide-in-from-top-2 border-border bg-background/95 absolute top-full right-0 left-0 border-b p-4 backdrop-blur-xl duration-300 md:hidden">
						<div className="flex flex-col gap-4">
							<Link
								to="/docs/$"
								className="text-muted-foreground py-1 text-sm font-medium"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								Docs
							</Link>
							<Link
								to="/docs/$"
								params={{ _splat: "examples" }}
								className="text-muted-foreground py-1 text-sm font-medium"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								Examples
							</Link>
							<a
								href="https://github.com/questpie/questpie/tree/main/examples"
								target="_blank"
								rel="noreferrer"
								className="text-muted-foreground py-1 text-sm font-medium"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								Examples
							</a>
							<div className="bg-border my-1 h-px" />
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-4">
									<ThemeToggle />
									<a
										href="https://github.com/questpie/questpie"
										target="_blank"
										rel="noreferrer"
										className="text-muted-foreground inline-flex items-center gap-2 text-sm"
									>
										<Icon
											icon="ph:github-logo"
											className="h-5 w-5"
											aria-hidden="true"
										/>
										GitHub
									</a>
								</div>
								<Link
									to="/docs/$"
									params={{ _splat: "start-here/first-app" }}
									className="border-primary/30 bg-primary/10 text-primary inline-flex h-8 items-center justify-center border px-3 font-mono text-[11px] tracking-wider uppercase"
									onClick={() => setIsMobileMenuOpen(false)}
								>
									Build
								</Link>
							</div>
						</div>
					</div>
				)}
			</div>
		</header>
	);
}
