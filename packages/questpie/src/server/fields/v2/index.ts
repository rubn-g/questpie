/**
 * Field Builder V2
 *
 * Immutable builder pattern for type-safe field definitions.
 *
 * @module
 */

export { Field, createField } from "./field.js";
export { buildZodFromState } from "./derive-schema.js";
export type {
	FieldState,
	DefaultFieldState,
	ArrayFieldState,
	FieldRuntimeState,
	ExtractSelectType,
	ExtractInputType,
	ExtractWhereType,
} from "./types.js";
