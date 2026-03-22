/**
 * Locale scoped service — resolves current locale per request scope.
 *
 * Resolution order:
 * 1. Explicit override (ctx.locale from createContext)
 * 2. Default locale from app config
 *
 * This is a sync scoped service with namespace: null — it appears
 * as `ctx.locale` in handler contexts (lazy, memoized per scope).
 */
import { service } from "#questpie/server/services/define-service.js";
import { DEFAULT_LOCALE } from "#questpie/shared/constants.js";

export default service()
	.lifecycle("request")
	.namespace(null)
	.create((ctx: any) => {
		// Explicit override
		if (ctx.locale) return ctx.locale;
		// Default from config or fallback
		return ctx.config?.defaultLocale ?? DEFAULT_LOCALE;
	});
