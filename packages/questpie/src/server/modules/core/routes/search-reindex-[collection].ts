/**
 * Search reindex route — POST /search/reindex/:collection
 */
import { z } from "zod";
import { route } from "#questpie/server/routes/define-route.js";

export default route()
	.post()
	.schema(z.object({}))
	.access(({ session }: any) => !!session)
	.handler(async (ctx: any) => {
		const collection = ctx.params?.collection;
		if (!ctx.search || !collection) {
			return { success: false };
		}
		await ctx.search.reindex(collection);
		return { success: true, collection };
	});
