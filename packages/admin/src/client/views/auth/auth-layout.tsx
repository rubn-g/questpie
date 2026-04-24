/**
 * Auth Layout - centered card layout for authentication pages
 *
 * Supports a file-first override via `questpie/admin/components/admin-auth-layout.tsx`.
 * When that component is registered in the admin-client registry under the reserved
 * key `adminAuthLayout`, it replaces the entire layout — all existing auth pages
 * using `AuthLayout` are automatically affected.
 *
 * Works without `AdminProvider`. When an AdminProvider is present, a registered
 * `adminAuthLayout` override can replace the built-in layout.
 */

import * as React from "react";

import type { MaybeLazyComponent } from "../../builder/types/common.js";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../../components/ui/card";
import { cn } from "../../lib/utils";
import { useAdminStoreRaw } from "../../runtime/provider.js";
import { useLazyComponent } from "../../utils/use-lazy-component.js";

/**
 * Props for the auth layout — and for any custom `adminAuthLayout` override.
 *
 * Export path: `@questpie/admin/client`
 */
export type AuthLayoutProps = {
	/** Page title */
	title: string;
	/** Page description */
	description?: string;
	/** Logo component or element */
	logo?: React.ReactNode;
	/** Footer content (e.g., links to other auth pages) */
	footer?: React.ReactNode;
	/** Form content */
	children: React.ReactNode;
	/** Additional class name for the card */
	className?: string;
};

function AuthBrandMark({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			className={cn("text-foreground size-16 shrink-0", className)}
			aria-label="QUESTPIE"
		>
			<path
				d="M2 2H22V10"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="square"
			/>
			<path
				d="M2 2V22H10"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="square"
			/>
			<path d="M23 13H13V23H23V13Z" fill="#B700FF" />
		</svg>
	);
}

/**
 * Built-in centered card layout (fallback when no override is registered).
 */
function AuthLayoutBuiltIn({
	title,
	description,
	logo,
	footer,
	children,
	className,
}: AuthLayoutProps) {
	return (
		<div className="qa-auth-layout bg-background text-foreground flex min-h-screen">
			<section className="qa-auth-layout__brand-panel bg-muted/20 relative hidden w-[40%] flex-col items-center justify-center overflow-hidden md:flex lg:w-[45%]">
				<div className="qa-auth-layout__brand-grid pointer-events-none absolute inset-0 opacity-70" />
				<div className="qa-auth-layout__brand-glow pointer-events-none absolute h-[520px] w-[520px] rounded-full" />
				<div className="relative z-10 flex flex-col items-center gap-6 px-8 text-center">
					{logo ?? <AuthBrandMark />}
					<div className="flex flex-col items-center gap-2">
						<span className="text-foreground text-2xl font-bold tracking-[-0.05em]">
							QUESTPIE
						</span>
						<p className="text-muted-foreground/60 max-w-sm text-xs tracking-[0.22em] text-balance uppercase">
							Build apps · Run companies · One platform
						</p>
					</div>
				</div>
			</section>

			<div className="qa-auth-layout__form-panel flex min-h-screen flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
				<div className="qa-auth-layout__content w-full max-w-sm space-y-6">
					<div className="qa-auth-layout__mobile-brand flex justify-center md:hidden">
						{logo ?? <AuthBrandMark className="size-12" />}
					</div>

					<Card
						className={cn(
							"qa-auth-layout__card border-border-subtle w-full shadow-sm",
							className,
						)}
					>
						<CardHeader className="qa-auth-layout__card-header text-left">
							<CardTitle className="text-xl font-semibold tracking-[-0.02em]">
								{title}
							</CardTitle>
							{description && <CardDescription>{description}</CardDescription>}
						</CardHeader>
						<CardContent className="qa-auth-layout__card-content">
							{children}
						</CardContent>
					</Card>

					{footer && (
						<div className="qa-auth-layout__footer text-muted-foreground text-center text-xs">
							{footer}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

/**
 * Centered layout for authentication pages (login, register, forgot password, etc.)
 *
 * Checks `adminAuthLayout` in the component registry (registered via
 * `questpie/admin/components/admin-auth-layout.tsx`) and renders it when present,
 * falling back to the built-in centered card layout.
 *
 * Works without `<AdminProvider>` and falls back to the built-in layout.
 * When used inside `<AdminProvider>`, a registered `adminAuthLayout` override
 * can replace the built-in layout.
 *
 * @example
 * ```tsx
 * <AuthLayout
 *   title="Sign in"
 *   description="Enter your credentials to access the admin panel"
 *   logo={<Logo />}
 *   footer={<Link to="/forgot-password">Forgot password?</Link>}
 * >
 *   <LoginForm />
 * </AuthLayout>
 * ```
 */
export function AuthLayout(props: AuthLayoutProps) {
	const adminStore = useAdminStoreRaw();
	const overrideLoader = adminStore
		?.getState()
		.admin.getComponent("adminAuthLayout") as MaybeLazyComponent | undefined;
	const { Component: Override } = useLazyComponent(overrideLoader, {
		allowDynamicImportLoaders: false,
	});

	if (Override) {
		return (
			<React.Suspense fallback={<AuthLayoutBuiltIn {...props} />}>
				<Override {...props} />
			</React.Suspense>
		);
	}

	return <AuthLayoutBuiltIn {...props} />;
}
