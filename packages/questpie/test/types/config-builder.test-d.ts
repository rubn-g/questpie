/**
 * Config Builder Type Tests
 *
 * Tests for questpie(), .collections(), .globals(), .jobs(), .use(), .build()
 * These are compile-time only tests - run with: tsc --noEmit
 */

import { z } from "zod";
import { QuestpieBuilder } from "#questpie/server/config/builder.js";
import type { Questpie } from "#questpie/server/config/questpie.js";
import { builtinFields } from "#questpie/server/fields/builtin/defaults.js";
import { job } from "#questpie/server/integrated/queue/job.js";
import type {
	Equal,
	Expect,
	Extends,
	HasKey,
	IsLiteral,
} from "./type-test-utils.js";

// ============================================================================
// Test fixtures — use q.collection() for proper field type inference
// ============================================================================

const q = QuestpieBuilder.empty("test").fields(builtinFields);

const usersCollection = q.collection("users").fields(({ f }) => ({
	name: f.textarea().required(),
	email: f.email(255).required(),
}));

const postsCollection = q.collection("posts").fields(({ f }) => ({
	title: f.text(255).required(),
	content: f.textarea(),
	author: f.relation("users").required().relationName("author"),
}));

const settingsGlobal = q.global("settings").fields(({ f }) => ({
	siteName: f.text(255).required(),
}));

const sendEmailJob = job({
	name: "send-email",
	schema: z.object({
		to: z.string().email(),
		subject: z.string(),
	}),
	handler: async ({ payload }) => {
		// Send email
	},
});

// ============================================================================
// questpie() factory tests
// ============================================================================

// questpie() should return QuestpieBuilder
const builder = QuestpieBuilder.empty("test-app");
type _builderIsQuestpieBuilder = Expect<
	Extends<typeof builder, QuestpieBuilder<any>>
>;

// Builder should have $inferApp property for type inference
type InferredCms = typeof builder.$inferApp;
type _cmsHasConfig = Expect<HasKey<InferredCms, "config">>;

// ============================================================================
// .collections() method tests
// ============================================================================

// .collections() should accumulate collections
const withCollections = QuestpieBuilder.empty("app").collections({
	users: usersCollection,
	posts: postsCollection,
});

// $inferApp should have collections
type CmsWithCollections = typeof withCollections.$inferApp;
type _cmsHasCollectionsConfig = Expect<
	Equal<HasKey<CmsWithCollections["config"], "collections">, true>
>;

// Collections should be accessible
type Collections = CmsWithCollections["config"]["collections"];
type _hasUsersCollection = Expect<Equal<HasKey<Collections, "users">, true>>;
type _hasPostsCollection = Expect<Equal<HasKey<Collections, "posts">, true>>;

// ============================================================================
// .globals() method tests
// ============================================================================

// .globals() should accumulate globals
const withGlobals = QuestpieBuilder.empty("app").globals({
	settings: settingsGlobal,
});

// $inferApp should have globals
type CmsWithGlobals = typeof withGlobals.$inferApp;
type _cmsHasGlobalsConfig = Expect<
	Equal<HasKey<CmsWithGlobals["config"], "globals">, true>
>;

// Globals should be accessible
type Globals = CmsWithGlobals["config"]["globals"];
type _hasSettingsGlobal = Expect<Equal<HasKey<Globals, "settings">, true>>;

// ============================================================================
// .jobs() method tests
// ============================================================================

// .jobs() should accumulate jobs
const withJobs = QuestpieBuilder.empty("app").jobs({
	sendEmail: sendEmailJob,
});

// Jobs should be typed
type BuilderWithJobs = typeof withJobs;
type _builderWithJobsHasJobs = Expect<
	Extends<BuilderWithJobs, { $inferApp: any }>
>;

// ============================================================================
// .use() method tests (module composition)
// ============================================================================

// Create a module
const blogModule = QuestpieBuilder.empty("blog").collections({
	posts: postsCollection,
});

// .use() should merge module into builder
const withModule = QuestpieBuilder.empty("app")
	.collections({ users: usersCollection })
	.use(blogModule);

// Result should have both collections
type CmsWithModule = typeof withModule.$inferApp;
type ModuleCollections = CmsWithModule["config"]["collections"];
type _moduleHasUsers = Expect<Equal<HasKey<ModuleCollections, "users">, true>>;
type _moduleHasPosts = Expect<Equal<HasKey<ModuleCollections, "posts">, true>>;

// ============================================================================
// Chained builder tests
// ============================================================================

// Full builder chain should work
const fullBuilder = QuestpieBuilder.empty("full-app")
	.collections({
		users: usersCollection,
		posts: postsCollection,
	})
	.globals({
		settings: settingsGlobal,
	})
	.jobs({
		sendEmail: sendEmailJob,
	});

// All parts should be typed
type FullCms = typeof fullBuilder.$inferApp;
type _fullHasCollections = Expect<
	Equal<HasKey<FullCms["config"], "collections">, true>
>;
type _fullHasGlobals = Expect<
	Equal<HasKey<FullCms["config"], "globals">, true>
>;

// ============================================================================
// Override behavior tests
// ============================================================================

// Later .collections() should override earlier ones
const overrideBuilder = QuestpieBuilder.empty("app")
	.collections({ users: usersCollection })
	.collections({ posts: postsCollection });

// Should have both collections (merge, not replace)
type OverrideCms = typeof overrideBuilder.$inferApp;
type OverrideCollections = OverrideCms["config"]["collections"];
// Both should exist after chaining
type _overrideHasUsers = Expect<
	Equal<HasKey<OverrideCollections, "users">, true>
>;
type _overrideHasPosts = Expect<
	Equal<HasKey<OverrideCollections, "posts">, true>
>;

// ============================================================================
// Type accumulation tests
// ============================================================================

// Builder state should accumulate through chain
const step1 = QuestpieBuilder.empty("app");
const step2 = step1.collections({ users: usersCollection });
const step3 = step2.globals({ settings: settingsGlobal });

// Each step should have accumulated config
type Step2Cms = typeof step2.$inferApp;
type Step3Cms = typeof step3.$inferApp;

type _step2HasCollections = Expect<
	Equal<HasKey<Step2Cms["config"], "collections">, true>
>;
type _step3HasCollections = Expect<
	Equal<HasKey<Step3Cms["config"], "collections">, true>
>;
type _step3HasGlobals = Expect<
	Equal<HasKey<Step3Cms["config"], "globals">, true>
>;
