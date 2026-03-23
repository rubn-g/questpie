/**
 * Search route — POST /search
 */
import { z } from "zod";
import { route } from "#questpie/server/routes/define-route.js";

const searchSchema = z.object({
	query: z.string().optional(),
	collections: z.array(z.string()).optional(),
	locale: z.string().optional(),
	limit: z.number().optional(),
	offset: z.number().optional(),
});

export default route()
	.post()
	.schema(searchSchema)
	.access(({ session }: any) => !!session)
	.handler(async (ctx: any) => {
		if (!ctx.search) {
			return { results: [], total: 0 };
		}
		return ctx.search.search(ctx.input);
	});
