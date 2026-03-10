/**
 * Field Type Selectors
 *
 * Pure type-level functions that extract concerns from field definitions.
 * Each field "owns" its type resolution — the collection and CRUD layers
 * just compose these selectors.
 *
 * Supports both:
 * - V2 Field<TState> (primary, via phantom `_` property)
 * - V1 FieldDefinition<TState> (legacy, for admin's richText/blocks until migrated)
 *
 * Three main selectors:
 *   FieldSelect<TFieldDef, TApp>         — "what value sits in the row?"
 *   FieldWhere<TFieldDef, TApp>          — "how do I filter on this field?"
 *   FieldRelationConfig<TFieldDef>       — "does this contribute to `with`?"
 */

import type {
	CollectionOptions,
	UploadOptions,
} from "#questpie/server/collection/builder/types.js";
import { text } from "#questpie/server/fields/builtin-factories/text.js";
import { number } from "#questpie/server/fields/builtin-factories/number.js";
import { datetime } from "#questpie/server/fields/builtin-factories/datetime.js";
import type { FieldState } from "#questpie/server/fields/field-class-types.js";
import type { Field } from "#questpie/server/fields/field-class.js";
import type { InferSelectType } from "#questpie/server/fields/field.js";
import type {
	BaseFieldConfig,
	ExtractOperatorParamType,
	FieldDefinition,
	FieldDefinitionState,
	OperatorMap,
} from "#questpie/server/fields/types.js";

// ============================================================================
// V2 Field Select — dispatch via accumulated state properties
// ============================================================================

/**
 * Extract select type from V2 Field<TState>.
 *
 * V2 state encodes everything directly:
 * - virtual relations/uploads → never (no FK column)
 * - output: false → never
 * - notNull: true → data type
 * - else → data | null
 */
type V2FieldSelect<TState extends FieldState> =
	// Virtual relation/upload fields have no FK column
	TState extends { virtual: true; type: "relation" | "upload" }
		? never
		: TState extends { output: false }
			? never
			: TState extends { notNull: true }
				? TState["data"]
				: TState["data"] | null;

/**
 * Extract where clause type from V2 Field<TState>.
 * Reads operators from the OperatorSetDefinition on TState.
 */
type V2FieldWhere<TState extends FieldState> =
	TState extends { operators: { column: infer TColumnOps extends OperatorMap } }
		? {
				[K in keyof TColumnOps]?: ExtractOperatorParamType<TColumnOps[K]>;
			}
		: never;

// ============================================================================
// V1 Relation Sub-type Inference (for legacy FieldDefinition dispatch)
// ============================================================================

/**
 * Infer the relation sub-type from its config.
 */
export type InferRelationSubtype<TConfig> = TConfig extends {
	morphName: string;
}
	? "morphMany"
	: TConfig extends { to: Record<string, any> }
		? "morphTo"
		: TConfig extends { hasMany: true; through: any }
			? "manyToMany"
			: TConfig extends { hasMany: true }
				? "hasMany"
				: TConfig extends { multiple: true }
					? "multiple"
					: "belongsTo";

// ============================================================================
// V1 Relation FK Select
// ============================================================================

type MorphToTypeKeys<TConfig> = TConfig extends { to: infer TTo }
	? TTo extends Record<string, any>
		? Extract<keyof TTo, string>
		: string
	: string;

type RelationFKBase<TConfig> =
	InferRelationSubtype<TConfig> extends "belongsTo"
		? string
		: InferRelationSubtype<TConfig> extends "multiple"
			? string[]
			: InferRelationSubtype<TConfig> extends "morphTo"
				? { type: MorphToTypeKeys<TConfig>; id: string }
				: never;

export type InferRelationFKSelect<TConfig> =
	RelationFKBase<TConfig> extends never
		? never
		: TConfig extends { required: true }
			? RelationFKBase<TConfig>
			: RelationFKBase<TConfig> | null;

// ============================================================================
// V1 Object/Array/Upload helpers
// ============================================================================

type ResolveFieldConfig<T> = T extends (...args: any[]) => infer R ? R : T;

type ObjectFieldShape<TConfig, TApp> = TConfig extends { fields: infer TFields }
	? {
			[K in keyof ResolveFieldConfig<TFields>]: FieldSelect<
				ResolveFieldConfig<TFields>[K],
				TApp
			>;
		}
	: Record<string, {}>;

type ArrayFieldElement<TConfig, TApp> = TConfig extends { of: infer TOf }
	? FieldSelect<ResolveFieldConfig<TOf>, TApp>
	: {};

type InferUploadFKSelect<TConfig> = TConfig extends { through: string }
	? never
	: TConfig extends BaseFieldConfig
		? InferSelectType<TConfig, string>
		: string | null;

// ============================================================================
// FieldSelect — "what value does this field contribute to a row?"
// ============================================================================

/**
 * Extract the select type for a single field.
 *
 * Dual dispatch:
 * 1. V2 Field<TState> — via phantom `_` property
 * 2. V1 FieldDefinition<TState> — via structural match (legacy)
 */
export type FieldSelect<
	TFieldDef,
	_TApp = unknown,
> =
	// V2: Field<TState> dispatch
	TFieldDef extends { readonly _: infer TState extends FieldState }
		? V2FieldSelect<TState>
		// V1: FieldDefinition<TState> dispatch (legacy)
		: TFieldDef extends FieldDefinition<infer TState>
			? TState extends FieldDefinitionState
				? TState["type"] extends "relation"
					? InferRelationFKSelect<TState["config"]>
					: TState["type"] extends "upload"
						? InferUploadFKSelect<TState["config"]>
						: TState["type"] extends "object"
							? InferSelectType<
									TState["config"],
									ObjectFieldShape<TState["config"], _TApp>
								>
							: TState["type"] extends "array"
								? InferSelectType<
										TState["config"],
										ArrayFieldElement<TState["config"], _TApp>[]
									>
								: TState["select"]
				: never
			: never;

// ============================================================================
// FieldWhere — "how do I filter on this field?"
// ============================================================================

/**
 * Extract the where clause type for a single field.
 *
 * Dual dispatch:
 * 1. V2 Field<TState> — operators from OperatorSetDefinition
 * 2. V1 FieldDefinition<TState> — operators from ContextualOperators
 */
export type FieldWhere<
	TFieldDef,
	_TApp = unknown,
> =
	// V2: Field<TState> dispatch
	TFieldDef extends { readonly _: infer TState extends FieldState }
		? V2FieldWhere<TState>
		// V1: FieldDefinition<TState> dispatch (legacy)
		: TFieldDef extends FieldDefinition<infer TState>
			? TState extends FieldDefinitionState
				? TState extends { operators: { column: infer TColumnOps } }
					? TColumnOps extends Record<string, any>
						? {
								[K in keyof TColumnOps]?: ExtractOperatorParamType<TColumnOps[K]>;
							}
						: never
					: never
				: never
			: never;

// ============================================================================
// System Field Instances — V2 Field factories
// ============================================================================

/**
 * System field definitions using V2 factories.
 * Operators, select types, input types — all inferred from Field<TState>.
 */

/** id: text, required, has default */
const _systemIdField = text().required().default(() => "");

/** _title: text, required, virtual (computed) */
const _systemTitleField = text().required().virtual();

/** createdAt / updatedAt: datetime, required, has default */
const _systemTimestampField = datetime().required().default(() => new Date());

/** deletedAt: datetime, nullable */
const _systemNullableTimestampField = datetime();

/** Upload text fields (key, filename, mimeType): text, required */
const _systemUploadTextField = text().required();

/** Upload size field: number, required */
const _systemUploadNumberField = number().required();

/** Upload visibility field: text, required, default "public" */
const _systemUploadVisibilityField = text().required().default("public" as const);

// Extract types from real field instances
type IdField = typeof _systemIdField;
type TitleField = typeof _systemTitleField;
type TimestampField = typeof _systemTimestampField;
type NullableTimestampField = typeof _systemNullableTimestampField;
type UploadTextField = typeof _systemUploadTextField;
type UploadNumberField = typeof _systemUploadNumberField;
type UploadVisibilityField = typeof _systemUploadVisibilityField;

// ============================================================================
// Auto-Inserted Fields — system fields as real Field instances
// ============================================================================

/**
 * System fields auto-inserted into fieldDefinitions by the collection builder.
 * Only inserts fields not already defined by the user.
 */
export type AutoInsertedFields<
	TUserFields extends Record<string, any>,
	TOptions extends CollectionOptions,
	TUpload extends UploadOptions | undefined,
> = ("id" extends keyof TUserFields
	? {}
	: { readonly id: IdField }) &
	("_title" extends keyof TUserFields ? {} : { readonly _title: TitleField }) &
	(TOptions extends { timestamps: false }
		? {}
		: ("createdAt" extends keyof TUserFields
				? {}
				: {
						readonly createdAt: TimestampField;
					}) &
				("updatedAt" extends keyof TUserFields
					? {}
					: {
							readonly updatedAt: TimestampField;
						})) &
	(TOptions extends { softDelete: true }
		? "deletedAt" extends keyof TUserFields
			? {}
			: {
					readonly deletedAt: NullableTimestampField;
				}
		: {}) &
	(TUpload extends UploadOptions
		? ("key" extends keyof TUserFields
				? {}
				: {
						readonly key: UploadTextField;
					}) &
				("filename" extends keyof TUserFields
					? {}
					: {
							readonly filename: UploadTextField;
						}) &
				("mimeType" extends keyof TUserFields
					? {}
					: {
							readonly mimeType: UploadTextField;
						}) &
				("size" extends keyof TUserFields
					? {}
					: {
							readonly size: UploadNumberField;
						}) &
				("visibility" extends keyof TUserFields
					? {}
					: {
							readonly visibility: UploadVisibilityField;
						})
		: {});

/**
 * Merges user-defined field definitions with auto-inserted system fields.
 */
export type FieldDefinitionsWithSystem<
	TUserFields extends Record<string, any>,
	TOptions extends CollectionOptions,
	TUpload extends UploadOptions | undefined,
> = AutoInsertedFields<TUserFields, TOptions, TUpload> & TUserFields;

// ============================================================================
// Global Auto-Inserted Fields
// ============================================================================

type GlobalAutoInsertedFields<
	TUserFields extends Record<string, any>,
	TOptions extends { timestamps?: boolean },
> = ("id" extends keyof TUserFields ? {} : { readonly id: IdField }) &
	(TOptions extends { timestamps: false }
		? {}
		: ("createdAt" extends keyof TUserFields
				? {}
				: { readonly createdAt: TimestampField }) &
				("updatedAt" extends keyof TUserFields
					? {}
					: { readonly updatedAt: TimestampField }));

export type GlobalFieldDefinitionsWithSystem<
	TUserFields extends Record<string, any>,
	TOptions extends { timestamps?: boolean },
> = GlobalAutoInsertedFields<TUserFields, TOptions> & TUserFields;
