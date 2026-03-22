/**
 * Session scoped service — resolves current user session per request scope.
 *
 * - With request: resolves from auth API via request headers
 * - Without request (job/script): returns null
 *
 * This is the first scoped service with namespace: null — it appears
 * as `ctx.session` in handler contexts.
 */
import { service } from "#questpie/server/services/define-service.js";

export default service()
	.lifecycle("request")
	.namespace(null)
	.create((ctx: any) => {
		// In a request scope with auth, resolve session from headers
		if (ctx.request && ctx.auth?.api?.getSession) {
			// Note: this is sync — actual async resolution happens eagerly
			// at createContext() time via RequestScope.set()
			return null; // Placeholder — real resolution wired by HTTP adapter
		}
		// Job/script scope: no session
		return null;
	});
