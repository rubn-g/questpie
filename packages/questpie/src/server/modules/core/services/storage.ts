/**
 * Storage singleton service definition.
 * Replaces direct DriveManager initialization in Questpie constructor.
 */
import { service } from "#questpie/server/services/define-service.js";

export default service()
	.lifecycle("singleton")
	.namespace(null)
	.create((ctx: any) => {
		const app = ctx.app;
		if (app?.storage) return app.storage;
		throw new Error("[Core] Storage not initialized");
	});
