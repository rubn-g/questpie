/**
 * Reactive Field Introspection — Admin
 *
 * Serializes reactive field configs (hidden, readOnly, disabled, compute, options)
 * for the admin client. This is an admin concern — core introspection delegates
 * to this module via IntrospectionOptions.enrichField.
 */

import type { FieldReactiveSchema, IntrospectionOptions } from "questpie";
import {
	extractDependencies,
	getDebounce,
	isReactiveConfig,
} from "./reactive-runtime.js";

type ReactiveFormFieldKey = "hidden" | "readOnly" | "disabled" | "compute";

// ============================================================================
// Public API — enricher for core introspection
// ============================================================================

/**
 * Create IntrospectionOptions that enrich fields with reactive metadata.
 * Pass the result to introspectCollection/introspectGlobal.
 */
export function createReactiveEnricher(): IntrospectionOptions {
	return {
		enrichField: (fieldDef, fieldName, entityState) => {
			const formReactiveByField = extractFormReactiveConfigs(
				(entityState as any).adminForm,
			);
			return extractFieldReactiveConfig(fieldDef, formReactiveByField[fieldName]);
		},
	};
}

// ============================================================================
// Reactive extraction (moved from core collection/introspection.ts)
// ============================================================================

function extractFieldReactiveConfig(
	fieldDef: any,
	formReactive?: FieldReactiveSchema,
): FieldReactiveSchema | undefined {
	const optionsReactive = extractFieldOptionsReactiveConfig(fieldDef);

	if (!formReactive && !optionsReactive) {
		return undefined;
	}

	return {
		...(formReactive ?? {}),
		...(optionsReactive ?? {}),
	};
}

function extractFormReactiveConfigs(
	formConfig: unknown,
): Record<string, FieldReactiveSchema> {
	const result: Record<string, FieldReactiveSchema> = {};

	if (!formConfig || typeof formConfig !== "object") {
		return result;
	}

	const form = formConfig as Record<string, unknown>;

	collectReactiveFromLayoutItems(form.fields, result);
	collectReactiveFromSections(form.sections, result);
	collectReactiveFromTabs(form.tabs, result);

	if (form.sidebar && typeof form.sidebar === "object") {
		const sidebar = form.sidebar as Record<string, unknown>;
		collectReactiveFromLayoutItems(sidebar.fields, result);
	}

	return result;
}

function collectReactiveFromLayoutItems(
	items: unknown,
	result: Record<string, FieldReactiveSchema>,
): void {
	if (!Array.isArray(items)) return;

	for (const item of items) {
		if (!item || typeof item !== "object") continue;
		const entry = item as Record<string, unknown>;

		if (typeof entry.field === "string") {
			const reactive = serializeFormFieldReactiveConfig(entry);
			if (reactive) {
				const existing = result[entry.field] ?? {};
				result[entry.field] = { ...existing, ...reactive };
			}
			continue;
		}

		if (entry.type === "section") {
			collectReactiveFromLayoutItems(entry.fields, result);
			continue;
		}

		if (entry.type === "tabs") {
			collectReactiveFromTabs(entry.tabs, result);
		}
	}
}

function collectReactiveFromSections(
	sections: unknown,
	result: Record<string, FieldReactiveSchema>,
): void {
	if (!Array.isArray(sections)) return;
	for (const section of sections) {
		if (!section || typeof section !== "object") continue;
		collectReactiveFromLayoutItems(
			(section as Record<string, unknown>).fields,
			result,
		);
	}
}

function collectReactiveFromTabs(
	tabs: unknown,
	result: Record<string, FieldReactiveSchema>,
): void {
	if (!Array.isArray(tabs)) return;
	for (const tab of tabs) {
		if (!tab || typeof tab !== "object") continue;
		const tabConfig = tab as Record<string, unknown>;
		collectReactiveFromLayoutItems(tabConfig.fields, result);
		collectReactiveFromSections(tabConfig.sections, result);
	}
}

function serializeFormFieldReactiveConfig(
	fieldEntry: Record<string, unknown>,
): FieldReactiveSchema | undefined {
	const reactiveKeys: ReactiveFormFieldKey[] = [
		"hidden",
		"readOnly",
		"disabled",
		"compute",
	];

	const result: FieldReactiveSchema = {};
	let hasReactive = false;

	for (const key of reactiveKeys) {
		const value = fieldEntry[key];

		if (typeof value === "boolean" || value === undefined) continue;

		if (isReactiveConfig(value)) {
			hasReactive = true;
			result[key] = {
				watch: extractDependencies(value),
				debounce: getDebounce(value),
			};
			continue;
		}

		if (
			value &&
			typeof value === "object" &&
			"deps" in value &&
			Array.isArray((value as { deps?: unknown }).deps)
		) {
			hasReactive = true;
			const serializedValue = value as { deps: string[]; debounce?: unknown };
			result[key] = {
				watch: serializedValue.deps,
				debounce:
					typeof serializedValue.debounce === "number"
						? serializedValue.debounce
						: undefined,
			};
		}
	}

	return hasReactive ? result : undefined;
}

function extractFieldOptionsReactiveConfig(
	fieldDef: any,
): Pick<FieldReactiveSchema, "options"> | undefined {
	const s = fieldDef._state;
	const options = s?.options as Record<string, unknown> | undefined;

	if (options && typeof options === "object" && "handler" in options) {
		const optionsConfig = options as { handler: unknown; deps?: unknown };

		let watch: string[] = [];
		if (Array.isArray(optionsConfig.deps)) {
			watch = optionsConfig.deps as string[];
		} else if (typeof optionsConfig.deps === "function") {
			const deps = new Set<string>();
			const createProxy = (prefix: string): unknown =>
				new Proxy(Object.create(null) as Record<string, unknown>, {
					get(_, prop: string | symbol) {
						if (typeof prop === "symbol" || prop === "then") return undefined;
						const path = prefix ? `${prefix}.${prop}` : prop;
						deps.add(path);
						return createProxy(path);
					},
				});

			try {
				(optionsConfig.deps as (ctx: any) => any[])({
					data: createProxy(""),
					sibling: createProxy("$sibling"),
				});
			} catch {
				// Ignore
			}
			watch = [...deps];
		}

		return {
			options: { watch, searchable: true, paginated: true },
		};
	}

	return undefined;
}
