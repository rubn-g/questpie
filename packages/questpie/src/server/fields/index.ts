/**
 * Field Builder System
 *
 * Type-safe field definitions for collections with:
 * - Column generation for Drizzle
 * - Validation schemas (Zod v4)
 * - Query operators (column vs JSONB)
 * - Admin metadata for introspection
 *
 * @example
 * ```ts
 * import { createFieldBuilder, builtinFields } from "questpie/server/fields";
 *
 * // Using built-in fields (V2 chain syntax)
 * const posts = collection("posts").fields(({ f }) => ({
 *   title: f.text(255).required(),
 *   content: f.textarea().localized(),
 *   status: f.select([
 *     { value: "draft", label: "Draft" },
 *     { value: "published", label: "Published" },
 *   ]),
 * }));
 * ```
 */

// V2 Field builder class
export { Field } from "./field-class.js";
export { createField } from "./field-class.js";

// V2 Field state types
export type {
	DefaultFieldState,
	FieldState,
	FieldRuntimeState,
	ArrayFieldState,
	ExtractSelectType,
	ExtractInputType,
	ExtractWhereType,
} from "./field-class-types.js";

// Builder
export {
	type BuiltinFields,
	createFieldBuilder,
	createFieldsCallbackContext,
	extractFieldDefinitions,
	type FieldBuilderProxy,
	type FieldInputs,
	type FieldOutputs,
	type FieldsCallbackContext,
	type FieldValues,
	type InferFieldsFromFactory,
} from "./builder.js";

// V2 Built-in field factories
export * from "./builtin-factories/index.js";

// V1 field.ts — kept for InferSelectType (used by field-types.ts) and admin's rich-text/blocks
export {
	type BuildFieldState,
	createFieldDefinition,
	type ExtractConfigFromFieldDef,
	type ExtractOpsFromFieldDef,
	type ExtractTypeFromFieldDef,
	type ExtractValueFromFieldDef,
	type FieldDef,
	field,
} from "./field.js";

// Reactive field system
export {
	extractDependencies,
	getDebounce,
	getHandler,
	isReactiveConfig,
	type OptionsConfig,
	type OptionsContext,
	type OptionsHandler,
	type OptionsResult,
	type ReactiveAdminMeta,
	type ReactiveConfig,
	type ReactiveContext,
	type ReactiveHandler,
	type ReactiveServerContext,
	type SerializedOptionsConfig,
	type SerializedReactiveConfig,
	serializeOptionsConfig,
	serializeReactiveConfig,
	type TrackingResult,
	trackDependencies,
	trackDepsFunction,
} from "./reactive.js";

// Core types
export type {
	AnyFieldDefinition,
	BaseFieldConfig,
	ContextualOperators,
	FieldAccessContext,
	FieldDefinition,
	FieldDefinitionAccess,
	FieldDefinitionState,
	FieldHookContext,
	FieldHooks,
	FieldMetadata,
	FieldMetadataBase,
	FieldMetadataMeta,
	FieldType,
	FieldTypeRegistry,
	JoinBuilder,
	NestedFieldMetadata,
	OperatorFn,
	OperatorMap,
	QueryContext,
	RelationFieldMetadata,
	SelectFieldMetadata,
	SelectModifier,
} from "./types.js";
