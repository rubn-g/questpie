/**
 * Builtin Field Factories — Barrel
 *
 * Import side effects: text.ts and number.ts patch Field.prototype
 * with chain methods (max, min, pattern, trim, etc.)
 */

// Value imports for builtinFields map (also triggers side effects)
import { boolean } from "./boolean.js";
import { date } from "./date.js";
import { datetime } from "./datetime.js";
import { email } from "./email.js";
import { from } from "./from.js";
import { json } from "./json.js";
import { number } from "./number.js";
import { object } from "./object.js";
import { relation } from "./relation.js";
import { select } from "./select.js";
import { text } from "./text.js";
import { textarea } from "./textarea.js";
import { time } from "./time.js";
import { upload } from "./upload.js";
import { url } from "./url.js";

export {
	type BooleanFieldMeta,
	type BooleanFieldState,
	boolean,
} from "./boolean.js";
export { type DateFieldMeta, type DateFieldState, date } from "./date.js";
export {
	type DatetimeFieldMeta,
	type DatetimeFieldState,
	datetime,
} from "./datetime.js";
export { type EmailFieldMeta, type EmailFieldState, email } from "./email.js";
export { type CustomFieldState, from } from "./from.js";
export {
	type JsonFieldMeta,
	type JsonFieldState,
	type JsonValue,
	json,
} from "./json.js";
export {
	type NumberFieldMeta,
	type NumberFieldState,
	number,
} from "./number.js";
export {
	type ObjectFieldMeta,
	type ObjectFieldState,
	object,
} from "./object.js";
export {
	type RelationFieldMeta,
	type RelationFieldState,
	relation,
} from "./relation.js";
export {
	type SelectFieldMeta,
	type SelectFieldState,
	type SelectOption,
	select,
} from "./select.js";
export { type TextFieldMeta, type TextFieldState, text } from "./text.js";
export {
	type TextareaFieldMeta,
	type TextareaFieldState,
	textarea,
} from "./textarea.js";
export { type TimeFieldMeta, type TimeFieldState, time } from "./time.js";
export {
	type UploadFieldMeta,
	type UploadFieldState,
	upload,
} from "./upload.js";
export { type UrlFieldMeta, type UrlFieldState, url } from "./url.js";

/**
 * Map of all builtin field factory functions keyed by type name.
 */
export const builtinFields = {
	text,
	textarea,
	email,
	url,
	number,
	boolean,
	date,
	datetime,
	time,
	select,
	upload,
	relation,
	object,
	json,
	from,
} as const;

/**
 * Type for the builtin fields map.
 */
export type BuiltinFields = typeof builtinFields;
