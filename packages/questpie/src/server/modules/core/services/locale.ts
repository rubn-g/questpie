/**
 * Locale scoped service — resolves current locale per request scope.
 *
 * Resolution order:
 * 1. Default locale from app config
 * 2. Hardcoded fallback "en"
 *
 * Note: reads from `ctx.app.config.locale` (direct property access)
 * instead of `ctx.locale` to avoid circular service resolution.
 * Per-request locale overrides are handled by createContext(), not this service.
 */
import { service } from "#questpie/server/services/define-service.js";
import { DEFAULT_LOCALE } from "#questpie/shared/constants.js";

export default service()
	.lifecycle("request")
	.namespace(null)
	.create((ctx: any) => {
		return ctx.app?.config?.locale?.defaultLocale ?? DEFAULT_LOCALE;
	});
