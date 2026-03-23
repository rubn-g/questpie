/**
 * I18n translator singleton service definition.
 */
import { service } from "#questpie/server/services/define-service.js";

export default service()
	.lifecycle("singleton")
	.namespace(null)
	.create((ctx: any) => {
		const app = ctx.app;
		if (app?.t) return app.t;
		// Fallback: identity function
		return (key: string) => key;
	});
