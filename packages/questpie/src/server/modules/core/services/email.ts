/**
 * Email singleton service definition.
 * Replaces direct MailerService initialization in Questpie constructor.
 */
import { service } from "#questpie/server/services/define-service.js";

export default service()
	.lifecycle("singleton")
	.namespace(null)
	.create((ctx: any) => {
		const app = ctx.app;
		if (app?.email) return app.email;
		throw new Error("[Core] Email service not initialized");
	});
