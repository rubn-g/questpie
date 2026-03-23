/**
 * KV (key-value store) singleton service definition.
 * Replaces direct `new KVService()` in Questpie constructor.
 */
import { service } from "#questpie/server/services/define-service.js";

export default service()
	.lifecycle("singleton")
	.namespace(null)
	.create((ctx: any) => {
		const app = ctx.app;
		if (app?.kv) return app.kv;

		const { KVService } = require("#questpie/server/integrated/kv/service.js");
		return new KVService(app?.config?.kv);
	});
