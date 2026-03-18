import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import coldarkCold from "react-syntax-highlighter/dist/esm/styles/prism/coldark-cold";
import coldarkDark from "react-syntax-highlighter/dist/esm/styles/prism/coldark-dark";

import { cn } from "@/lib/utils";

SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("tsx", tsx);

interface CodeWindowProps {
	title?: string;
	children: string;
	className?: string;
	language?: string;
}

export function CodeWindow({
	title,
	children,
	className,
	language = "typescript",
}: CodeWindowProps) {
	return (
		<div
			className={cn(
				"border-border flex flex-col overflow-hidden border",
				className,
			)}
		>
			{/* VSCode-like tab */}
			{title && (
				<div className="bg-card/30 border-border flex items-center border-b">
					<div className="border-border bg-background text-foreground relative flex min-w-fit items-center gap-2 border-r px-4 py-2.5 font-mono text-sm">
						{/* File icon based on extension */}
						<span
							className={cn(
								"h-2 w-2 rounded-full",
								title.endsWith(".ts")
									? "bg-blue-500"
									: title.endsWith(".tsx")
										? "bg-cyan-500"
										: title.endsWith(".js")
											? "bg-yellow-500"
											: title.endsWith(".jsx")
												? "bg-yellow-400"
												: "bg-gray-500",
							)}
						/>
						{/* Filename */}
						<span className="select-none">{title}</span>
						{/* Active indicator */}
						<div className="bg-primary absolute right-0 bottom-0 left-0 h-0.5" />
					</div>
				</div>
			)}

			{/* Code content */}
			<div className="bg-background flex-1 overflow-auto p-6">
				{/* Light mode */}
				<div className="dark:hidden">
					<SyntaxHighlighter
						language={language}
						style={coldarkCold}
						customStyle={{
							background: "transparent",
							padding: 0,
							margin: 0,
							fontSize: "0.875rem",
						}}
						showLineNumbers={true}
						wrapLines={true}
					>
						{children}
					</SyntaxHighlighter>
				</div>

				{/* Dark mode */}
				<div className="hidden dark:block">
					<SyntaxHighlighter
						language={language}
						style={coldarkDark}
						customStyle={{
							background: "transparent",
							padding: 0,
							margin: 0,
							fontSize: "0.875rem",
						}}
						showLineNumbers={true}
						wrapLines={true}
					>
						{children}
					</SyntaxHighlighter>
				</div>
			</div>
		</div>
	);
}
