/**
 * Built-in Field Types — Barrel
 *
 * Re-exports V2 field factories and the builtinFields map.
 */

// V2 factories
export {
	text,
	type TextFieldState,
	textarea,
	type TextareaFieldState,
	email,
	type EmailFieldState,
	url,
	type UrlFieldState,
	number,
	type NumberFieldState,
	boolean,
	type BooleanFieldState,
	date,
	type DateFieldState,
	datetime,
	type DatetimeFieldState,
	time,
	type TimeFieldState,
	select,
	type SelectOption,
	type SelectFieldState,
	json,
	type JsonFieldState,
	type JsonValue,
	object,
	type ObjectFieldState,
	from,
	type CustomFieldState,
	relation,
	type RelationFieldState,
	upload,
	type UploadFieldState,
} from "../builtin-factories/index.js";

// Builtin fields map
export {
	builtinFields,
	type BuiltinFields,
	defaultFields,
	type DefaultFields,
} from "./defaults.js";

// Re-export types from types.ts that were previously co-located with V1 builtin files
export type {
	InferredRelationType,
	ReferentialAction,
	RelationFieldMetadata,
	SelectFieldMetadata,
} from "../types.js";
