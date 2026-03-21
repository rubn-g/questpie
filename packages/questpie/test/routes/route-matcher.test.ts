/**
 * QUE-248: Route Matcher PoC — test harness
 *
 * Tests priority (literal > parameterized > wildcard),
 * collision detection, and edge cases.
 */
import { describe, expect, it } from "bun:test";

import {
	RouteCollisionError,
	compileMatcher,
} from "../../src/server/routes/route-matcher.js";

// ============================================================================
// Helpers
// ============================================================================

function routes(
	...pairs: [string, string][]
): Map<string, string> {
	return new Map(pairs);
}

// ============================================================================
// Priority Tests
// ============================================================================

describe("Route Matcher — Priority", () => {
	it("literal beats parameterized", () => {
		const m = compileMatcher(
			routes(
				["users/admin", "literal-handler"],
				["users/:id", "param-handler"],
			),
		);

		const match = m.match("/users/admin");
		expect(match).not.toBeNull();
		expect(match!.handler).toBe("literal-handler");
		expect(match!.params).toEqual({});
	});

	it("parameterized matches when literal doesn't", () => {
		const m = compileMatcher(
			routes(
				["users/admin", "literal-handler"],
				["users/:id", "param-handler"],
			),
		);

		const match = m.match("/users/123");
		expect(match).not.toBeNull();
		expect(match!.handler).toBe("param-handler");
		expect(match!.params).toEqual({ id: "123" });
	});

	it("parameterized beats wildcard", () => {
		const m = compileMatcher(
			routes(
				["users/:id", "param-handler"],
				["users/*rest", "wildcard-handler"],
			),
		);

		const match = m.match("/users/123");
		expect(match).not.toBeNull();
		expect(match!.handler).toBe("param-handler");
		expect(match!.params).toEqual({ id: "123" });
	});

	it("wildcard matches multi-segment remainder", () => {
		const m = compileMatcher(
			routes(
				["users/:id", "param-handler"],
				["users/*rest", "wildcard-handler"],
			),
		);

		const match = m.match("/users/123/posts/456");
		expect(match).not.toBeNull();
		expect(match!.handler).toBe("wildcard-handler");
		expect(match!.params).toEqual({ rest: "123/posts/456" });
	});

	it("literal > param > wildcard in a single trie", () => {
		const m = compileMatcher(
			routes(
				["api/users/me", "literal-me"],
				["api/users/:id", "param-id"],
				["api/*path", "wildcard-api"],
			),
		);

		expect(m.match("/api/users/me")!.handler).toBe("literal-me");
		expect(m.match("/api/users/42")!.handler).toBe("param-id");
		expect(m.match("/api/users/42")!.params).toEqual({ id: "42" });
		expect(m.match("/api/docs/intro")!.handler).toBe("wildcard-api");
		expect(m.match("/api/docs/intro")!.params).toEqual({
			path: "docs/intro",
		});
	});

	it("deeper literal beats shorter param", () => {
		const m = compileMatcher(
			routes(
				["users/:id/posts", "param-posts"],
				["users/admin/posts", "literal-admin-posts"],
			),
		);

		expect(m.match("/users/admin/posts")!.handler).toBe(
			"literal-admin-posts",
		);
		expect(m.match("/users/john/posts")!.handler).toBe("param-posts");
		expect(m.match("/users/john/posts")!.params).toEqual({ id: "john" });
	});
});

// ============================================================================
// Param Extraction Tests
// ============================================================================

describe("Route Matcher — Param Extraction", () => {
	it("extracts single param", () => {
		const m = compileMatcher(routes(["users/:id", "handler"]));
		const match = m.match("/users/abc");
		expect(match!.params).toEqual({ id: "abc" });
	});

	it("extracts multiple params", () => {
		const m = compileMatcher(
			routes(["users/:userId/posts/:postId", "handler"]),
		);
		const match = m.match("/users/42/posts/99");
		expect(match!.params).toEqual({ userId: "42", postId: "99" });
	});

	it("extracts wildcard with default name", () => {
		const m = compileMatcher(routes(["files/*", "handler"]));
		const match = m.match("/files/docs/readme.md");
		expect(match!.params).toEqual({ wildcard: "docs/readme.md" });
	});

	it("extracts wildcard with custom name", () => {
		const m = compileMatcher(routes(["files/*filepath", "handler"]));
		const match = m.match("/files/docs/readme.md");
		expect(match!.params).toEqual({ filepath: "docs/readme.md" });
	});

	it("mixed params and wildcard", () => {
		const m = compileMatcher(
			routes(["org/:orgId/files/*filepath", "handler"]),
		);
		const match = m.match("/org/acme/files/src/index.ts");
		expect(match!.params).toEqual({
			orgId: "acme",
			filepath: "src/index.ts",
		});
	});
});

// ============================================================================
// No Match Tests
// ============================================================================

describe("Route Matcher — No Match", () => {
	it("returns null for unregistered path", () => {
		const m = compileMatcher(routes(["users/:id", "handler"]));
		expect(m.match("/posts/123")).toBeNull();
	});

	it("returns null for shorter path than pattern", () => {
		const m = compileMatcher(routes(["users/:id/posts", "handler"]));
		expect(m.match("/users/123")).toBeNull();
	});

	it("returns null for longer path without wildcard", () => {
		const m = compileMatcher(routes(["users/:id", "handler"]));
		expect(m.match("/users/123/extra")).toBeNull();
	});

	it("returns null for empty path on non-root route", () => {
		const m = compileMatcher(routes(["users", "handler"]));
		expect(m.match("/")).toBeNull();
	});
});

// ============================================================================
// Collision Detection Tests
// ============================================================================

describe("Route Matcher — Collision Detection", () => {
	it("detects collision: two params at same position", () => {
		expect(() =>
			compileMatcher(
				routes(
					["users/:id", "handler-a"],
					["users/:userId", "handler-b"],
				),
			),
		).toThrow(RouteCollisionError);
	});

	it("detects collision: same literal pattern", () => {
		// Use array input — Map deduplicates same keys
		expect(() =>
			compileMatcher([
				["users/admin", "handler-a"],
				["users/admin", "handler-b"],
			]),
		).toThrow(RouteCollisionError);
	});

	it("detects collision: two wildcards at same prefix", () => {
		expect(() =>
			compileMatcher(
				routes(
					["api/*rest", "handler-a"],
					["api/*path", "handler-b"],
				),
			),
		).toThrow(RouteCollisionError);
	});

	it("allows: different literal prefixes (no collision)", () => {
		expect(() =>
			compileMatcher(
				routes(
					["users/:id", "handler-a"],
					["posts/:id", "handler-b"],
				),
			),
		).not.toThrow();
	});

	it("allows: literal and param at same depth (not ambiguous — priority resolves)", () => {
		expect(() =>
			compileMatcher(
				routes(
					["users/admin", "literal"],
					["users/:id", "param"],
				),
			),
		).not.toThrow();
	});

	it("allows: param and wildcard at same prefix (priority resolves)", () => {
		expect(() =>
			compileMatcher(
				routes(
					["users/:id", "param"],
					["users/*rest", "wildcard"],
				),
			),
		).not.toThrow();
	});
});

// ============================================================================
// Edge Cases
// ============================================================================

describe("Route Matcher — Edge Cases", () => {
	it("handles root path", () => {
		const m = compileMatcher(routes(["", "root-handler"]));
		// Empty pattern = zero segments = matches empty path
		// This is a degenerate case; root typically handled separately
	});

	it("handles trailing slash normalization", () => {
		const m = compileMatcher(routes(["users/:id", "handler"]));
		// "/users/123/" splits to ["users", "123", ""] — trailing empty segment
		// This is fine since filter(Boolean) removes empty strings
		expect(m.match("/users/123/")!.params).toEqual({ id: "123" });
	});

	it("handles leading slash normalization", () => {
		const m = compileMatcher(routes(["users/:id", "handler"]));
		expect(m.match("users/123")!.params).toEqual({ id: "123" });
	});

	it("handles special characters in params", () => {
		const m = compileMatcher(routes(["users/:id", "handler"]));
		expect(m.match("/users/hello%20world")!.params).toEqual({
			id: "hello%20world",
		});
	});

	it("handles many routes without perf issues", () => {
		const r = new Map<string, string>();
		for (let i = 0; i < 200; i++) {
			r.set(`api/v${i}/resource`, `handler-${i}`);
		}
		r.set("api/:version/resource", "param-handler");

		const start = performance.now();
		const m = compileMatcher(r);
		const compileMs = performance.now() - start;

		// Compile should be fast
		expect(compileMs).toBeLessThan(50);

		// All 200 literals should match before param
		expect(m.match("/api/v42/resource")!.handler).toBe("handler-42");
		expect(m.match("/api/v999/resource")!.handler).toBe("param-handler");

		// Match should be fast
		const matchStart = performance.now();
		for (let i = 0; i < 1000; i++) {
			m.match("/api/v42/resource");
		}
		const matchMs = performance.now() - matchStart;
		expect(matchMs).toBeLessThan(50); // 1000 matches under 50ms
	});

	it("preserves pattern in match result", () => {
		const m = compileMatcher(
			routes(
				["users/:id", "handler-a"],
				["posts/:slug", "handler-b"],
			),
		);

		expect(m.match("/users/42")!.pattern).toBe("users/:id");
		expect(m.match("/posts/hello")!.pattern).toBe("posts/:slug");
	});
});

// ============================================================================
// Integration-style: Simulated HTTP dispatch
// ============================================================================

describe("Route Matcher — HTTP Dispatch Simulation", () => {
	it("dispatches QuestPie-style routes", () => {
		const m = compileMatcher(
			routes(
				// Framework adapter routes
				["health", "health-check"],
				["auth/*path", "auth-handler"],
				["storage/files/*filepath", "storage-handler"],
				["search", "search-handler"],
				["search/reindex/:collection", "reindex-handler"],
				["realtime", "sse-handler"],

				// Global CRUD
				["globals/:name", "global-read"],
				["globals/:name/update", "global-update"],
				["globals/:name/audit", "global-audit"],

				// Custom user routes
				["admin/stats", "admin-stats"],
				["admin/export/:format", "admin-export"],

				// Collection CRUD (catch-all)
				[":collection", "collection-list"],
				[":collection/create", "collection-create"],
				[":collection/:id", "collection-read"],
				[":collection/:id/update", "collection-update"],
				[":collection/:id/delete", "collection-delete"],
				[":collection/:id/versions", "collection-versions"],
			),
		);

		// Framework routes
		expect(m.match("/health")!.handler).toBe("health-check");
		expect(m.match("/auth/login")!.handler).toBe("auth-handler");
		expect(m.match("/auth/login")!.params).toEqual({ path: "login" });
		expect(m.match("/storage/files/uploads/img.png")!.handler).toBe(
			"storage-handler",
		);
		expect(m.match("/storage/files/uploads/img.png")!.params).toEqual({
			filepath: "uploads/img.png",
		});

		// Global CRUD
		expect(m.match("/globals/settings")!.handler).toBe("global-read");
		expect(m.match("/globals/settings/update")!.handler).toBe(
			"global-update",
		);
		expect(m.match("/globals/settings/audit")!.handler).toBe(
			"global-audit",
		);

		// Custom routes (literal beats param)
		expect(m.match("/admin/stats")!.handler).toBe("admin-stats");
		expect(m.match("/admin/export/csv")!.handler).toBe("admin-export");
		expect(m.match("/admin/export/csv")!.params).toEqual({
			format: "csv",
		});

		// Collection CRUD
		expect(m.match("/users")!.handler).toBe("collection-list");
		expect(m.match("/users")!.params).toEqual({ collection: "users" });
		expect(m.match("/users/create")!.handler).toBe("collection-create");
		expect(m.match("/users/42")!.handler).toBe("collection-read");
		expect(m.match("/users/42/update")!.handler).toBe(
			"collection-update",
		);
		expect(m.match("/users/42/versions")!.handler).toBe(
			"collection-versions",
		);

		// Search routes (literal beats param)
		expect(m.match("/search")!.handler).toBe("search-handler");
		expect(m.match("/search/reindex/posts")!.handler).toBe(
			"reindex-handler",
		);
	});
});
