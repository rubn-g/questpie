/**
 * AppContext — the extensible context interface.
 *
 * Empty by default. Generated code augments this via module augmentation:
 *   declare module "questpie" {
 *     interface AppContext { db: ...; queue: ...; session: ...; }
 *   }
 *
 * ALL handler contexts (HookContext, AccessContext, FunctionHandlerArgs,
 * JobHandlerArgs, BlockPrefetchContext) extend AppContext.
 *
 * Plugins can add custom keys:
 *   declare module "questpie" {
 *     interface AppContext { channels: ChannelsService; }
 *   }
 *   → ({ channels }) available in every hook, function, job, etc.
 *
 * User services support namespace placement:
 *   ({ services }) => services.blog.computeReadingTime(text) // default
 *   ({ workflows }) => workflows.run(...)                    // namespace: null
 *   ({ analytics }) => analytics.tracker.track(...)          // namespace: "analytics"
 *
 * @see RFC-CONTEXT-FIRST.md §2
 */
/**
 * Global augmentation namespace.
 * Uses `declare global` so augmentations work correctly with workspace symlinks
 * (where `declare module "questpie"` fails due to module identity mismatch).
 *
 * Augment via: `declare global { namespace Questpie { interface AppContext { ... } } }`
 */
declare global {
	namespace Questpie {
		interface AppContext {}
		interface Registry {}
		interface QuestpieContextExtension {}

		/**
		 * Augmentable interface for view record types.
		 * Populated by each module's codegen output to provide autocomplete on `v.*` proxies.
		 * Declared empty to break circular references in the CollectionBuilder augmentation chain.
		 */
		interface ViewsRegistry {}

		/**
		 * Augmentable interface for component record types.
		 * Populated by each module's codegen output to provide autocomplete on `c.*` proxies.
		 */
		interface ComponentsRegistry {}

		/**
		 * Augmentable interface for merged field type map.
		 * Populated by each module's codegen output with field factory functions.
		 * Used by `.fields(({ f }) => ...)` for autocomplete on `f.*`.
		 */
		interface FieldTypesMap {}
	}
}

/**
 * AppContext — the extensible context interface.
 * Augment via `declare global { namespace Questpie { interface AppContext { ... } } }`
 */
export interface AppContext extends Questpie.AppContext {}

/**
 * Registry — the app-wide type catalogue.
 * Augment via `declare global { namespace Questpie { interface Registry { ... } } }`
 */
export interface Registry extends Questpie.Registry {}

/**
 * Extract known names from a Registry key.
 * When the key exists → union of its keys + (string & {}) for autocomplete.
 * When it doesn't (no codegen) → plain string.
 */
export type RegistryNames<K extends string> =
	Registry extends Record<K, infer R>
		? (keyof R & string) | (string & {})
		: string;

/** Known collection names (includes module collections). @see Registry['collections'] */
export type KnownCollectionNames = RegistryNames<"collections">;

/** Known global names. @see Registry['globals'] */
export type KnownGlobalNames = RegistryNames<"globals">;

/** Known block names. @see Registry['blocks'] */
export type KnownBlockNames = RegistryNames<"blocks">;

/** Known job names (includes module jobs). @see Registry['jobs'] */
export type KnownJobNames = RegistryNames<"jobs">;

/** Known service names. @see Registry['services'] */
export type KnownServiceNames = RegistryNames<"services">;

/** Known email template names. @see Registry['emails'] */
export type KnownEmailNames = RegistryNames<"emails">;

/** Known route names. @see Registry['routes'] */
export type KnownRouteNames = RegistryNames<"routes">;

/** Known view names (from admin modules). @see Registry['views'] */
export type KnownViewNames = RegistryNames<"views">;

/**
 * Known list view names (from admin modules).
 * @deprecated Use KnownViewNames instead — list/form filtering is now type-level.
 */
export type KnownListViewNames = RegistryNames<"views">;

/**
 * Known form view names (from admin modules).
 * @deprecated Use KnownViewNames instead — list/form filtering is now type-level.
 */
export type KnownFormViewNames = RegistryNames<"views">;

/** Known component names (from admin modules). @see Registry['components'] */
export type KnownComponentNames = RegistryNames<"components">;

// extractAppServices deleted — use app.extractContext() instead (QUE-276)
