/**
 * Typed helpers for admin route handlers.
 *
 * Centralizes the necessary type casts for accessing
 * app state, entity state, and handler context.
 */

import type { Questpie } from "questpie";
import type { I18nText } from "questpie/shared";

// ============================================================================
// Route Handler Context
// ============================================================================

/** Typed admin route handler context */
export interface AdminRouteContext {
	app: Questpie<any>;
	session?: { user: any; session: any } | null;
	db: any;
	locale?: string;
}

/** Extract typed context from raw handler ctx */
export function asAdminCtx(ctx: Record<string, unknown>): AdminRouteContext {
	return ctx as AdminRouteContext;
}

// ============================================================================
// App & Entity State Accessors
// ============================================================================

export interface AppState {
	config?: { admin?: any; [key: string]: any };
	[key: string]: any;
}

/** Get typed app state (with admin config) */
export function getAppState(app: Questpie<any>): AppState {
	return (app as any).state ?? {};
}

/** Get typed collection/global builder state */
export function getEntityState(entity: unknown): Record<string, any> {
	if (!entity || typeof entity !== "object") return {};
	return (entity as any).state ?? entity;
}

// ============================================================================
// Metadata Types
// ============================================================================

export type AdminConfigItemMeta = {
	label?: I18nText | string;
	description?: I18nText | string;
	icon?: { type: string; props: Record<string, unknown> };
	hidden?: boolean;
	group?: string;
	order?: number;
	workflow?: {
		enabled: boolean;
		initialStage: string;
		stages: Array<{
			name: string;
			label?: string;
			description?: string;
			transitions?: string[];
		}>;
	};
};
