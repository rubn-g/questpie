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
		<div className="qa-auth-layout bg-background flex min-h-screen flex-col items-center justify-center p-4">
			<div className="qa-auth-layout__content w-full max-w-sm space-y-6">
				{/* Logo */}
				{logo && (
					<div className="qa-auth-layout__logo flex justify-center">{logo}</div>
				)}

				{/* Main Card */}
				<Card className={cn("qa-auth-layout__card shadow-md w-full", className)}>
					<CardHeader className="qa-auth-layout__card-header text-center">
						<CardTitle className="text-lg">{title}</CardTitle>
						{description && <CardDescription>{description}</CardDescription>}
					</CardHeader>
					<CardContent className="qa-auth-layout__card-content">
						{children}
					</CardContent>
				</Card>

				{/* Footer */}
				{footer && (
					<div className="qa-auth-layout__footer text-muted-foreground text-center text-xs">
						{footer}
					</div>
				)}
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
	const overrideLoader = adminStore?.getState().admin.getComponent(
		"adminAuthLayout",
	) as MaybeLazyComponent | undefined;
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
