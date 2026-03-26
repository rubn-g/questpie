/**
 * Reactive Field System — Pure Types
 *
 * Type definitions for reactive field behaviors including:
 * - Reactive field states (hidden, readOnly, disabled)
 * - Computed values
 * - Dynamic options
 * - Proxy-based dependency tracking
 *
 * Runtime functions are in reactive.ts.
 */

import type { I18nText } from "#questpie/shared/i18n/types.js";

// ============================================================================
// Reactive Context
// ============================================================================

/**
 * Server context available to reactive handlers.
 * Provides access to database, user, request, and locale.
 */
export interface ReactiveServerContext {
	/** Database client (Drizzle) */
	db: unknown;

	/** Authenticated user (if any) */
	user: unknown | null;

	/** Current request */
	req: Request;

	/** Current locale */
	locale: string;
}

/**
 * Context provided to reactive handlers (hidden, readOnly, disabled, compute).
 * Includes form data with proxy for automatic dependency tracking.
 *
 * @template T - Form data type (default: Record<string, any>)
 */
export interface ReactiveContext<T = Record<string, any>> {
	/**
	 * Current form values - proxy for dependency tracking.
	 * Accessing properties automatically registers them as dependencies.
	 */
	data: T;

	/**
	 * Sibling values in array/object context - proxy for dependency tracking.
	 * Used when field is inside an array item to access other fields in the same item.
	 */
	sibling: Record<string, any>;

	/**
	 * Previous values for change detection.
	 * Useful for conditional logic based on what changed.
	 */
	prev: {
		data: T;
		sibling: Record<string, any>;
	};

	/** Server context (db, user, req, locale) */
	ctx: ReactiveServerContext;
}

// ============================================================================
// Reactive Config Types
// ============================================================================

/**
 * Reactive handler function type.
 *
 * @template TReturn - Return type of the handler
 */
export type ReactiveHandler<TReturn> = (
	ctx: ReactiveContext,
) => TReturn | Promise<TReturn>;

/**
 * Reactive configuration - can be short or full syntax.
 *
 * Short syntax: just the handler function
 * Full syntax: object with handler, optional deps, optional debounce
 *
 * @template TReturn - Return type of the handler
 *
 * @example Short syntax
 * ```ts
 * hidden: ({ data }) => !data.showAdvanced
 * ```
 *
 * @example Full syntax
 * ```ts
 * compute: {
 *   handler: ({ data }) => slugify(data.title),
 *   deps: ({ data }) => [data.title, data.category],
 *   debounce: 300,
 * }
 * ```
 */
export type ReactiveConfig<TReturn> =
	| ReactiveHandler<TReturn>
	| {
			/** Handler function that computes the value */
			handler: ReactiveHandler<TReturn>;
			/**
			 * Dependencies - optional, auto-detected via proxy.
			 * Can be array of field paths or a function with proxy tracking.
			 */
			deps?: string[] | ((ctx: ReactiveContext) => any[]);
			/** Debounce in ms (only for compute) */
			debounce?: number;
	  };

// ============================================================================
// Options Context (for dynamic options)
// ============================================================================

/**
 * Context provided to dynamic options handlers.
 * Extends reactive context with search and pagination.
 *
 * @template T - Form data type
 */
export interface OptionsContext<T = Record<string, any>> {
	/** Current form values - proxy for dependency tracking */
	data: T;

	/** Sibling values (for array/object context) */
	sibling: Record<string, any>;

	/** Search query (user typing) */
	search: string;

	/** Page number (0-based) */
	page: number;

	/** Items per page */
	limit: number;

	/** Server context */
	ctx: ReactiveServerContext;
}

/**
 * Options handler function type.
 */
export type OptionsHandler<T = Record<string, any>> = (
	ctx: OptionsContext<T>,
) => OptionsResult | Promise<OptionsResult>;

/**
 * Result from options handler.
 */
export interface OptionsResult {
	/** List of options */
	options: Array<{ value: string | number; label: I18nText }>;

	/** Whether there are more items (for infinite scroll) */
	hasMore?: boolean;

	/** Total count (optional) */
	total?: number;
}

/**
 * Dynamic options configuration.
 *
 * @example
 * ```ts
 * options: {
 *   handler: async ({ data, search, page, limit, ctx }) => {
 *     const cities = await ctx.db.query.cities.findMany({
 *       where: { countryId: data.country },
 *       limit,
 *       offset: page * limit,
 *     });
 *     return {
 *       options: cities.map(c => ({ value: c.id, label: c.name })),
 *       hasMore: cities.length === limit,
 *     };
 *   },
 *   deps: ({ data }) => [data.country],
 * }
 * ```
 */
export interface OptionsConfig<T = Record<string, any>> {
	/** Handler that fetches options */
	handler: OptionsHandler<T>;

	/**
	 * Dependencies - when these change, options are refetched.
	 * Auto-detected via proxy if not provided.
	 */
	deps?: string[] | ((ctx: OptionsContext<T>) => any[]);
}

// ============================================================================
// Reactive Admin Meta Extensions
// ============================================================================

/**
 * Reactive extensions for BaseAdminMeta.
 * These properties can be static (boolean) or reactive (function/config).
 */
export interface ReactiveAdminMeta {
	/**
	 * Hide the field conditionally.
	 * - `true`: Always hidden
	 * - Function: Evaluated on server based on form data
	 */
	hidden?: boolean | ReactiveConfig<boolean>;

	/**
	 * Make field read-only conditionally.
	 * - `true`: Always read-only
	 * - Function: Evaluated on server based on form data
	 */
	readOnly?: boolean | ReactiveConfig<boolean>;

	/**
	 * Disable the field conditionally.
	 * - `true`: Always disabled
	 * - Function: Evaluated on server based on form data
	 */
	disabled?: boolean | ReactiveConfig<boolean>;

	/**
	 * Compute field value automatically.
	 * Handler should return the computed value or undefined to keep current value.
	 * Return null to reset field to null/default.
	 */
	compute?: ReactiveConfig<any>;
}

// ============================================================================
// Dependency Tracking Types
// ============================================================================

/**
 * Result of dependency tracking.
 */
export interface TrackingResult<T> {
	/** Result of executing the function */
	result: T;

	/** Dependencies detected (field paths) */
	deps: string[];
}

// ============================================================================
// Introspection Types (for client)
// ============================================================================

/**
 * Serialized reactive config for introspection response.
 * Sent to client so it knows which fields to watch.
 */
export interface SerializedReactiveConfig {
	/** Fields to watch for changes */
	watch: string[];

	/** Debounce in ms (for compute) */
	debounce?: number;
}

/**
 * Serialized options config for introspection response.
 */
export interface SerializedOptionsConfig {
	/** Fields to watch for changes */
	watch: string[];

	/** Options support search */
	searchable: boolean;

	/** Options support pagination */
	paginated: boolean;
}
