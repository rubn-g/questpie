/**
 * Field Builder — Admin Augmentation (Runtime Patch)
 *
 * Adds `.admin()` method to the Field class via prototype patching.
 * Type declarations are in `@questpie/admin/augmentation.ts`.
 *
 * This file must be imported (side-effect) from `@questpie/admin/server`
 * to ensure the method is available before collection definitions run.
 *
 * @internal
 */

import { Field } from "questpie";

// Declaration merging: add .admin() method to Field class
declare module "questpie" {
	interface Field<TState> {
		/** Set admin-specific configuration for this field. */
		admin(opts: unknown): Field<TState>;
	}
}

/**
 * Runtime implementation of `.admin()` on Field.
 * Creates a new Field with the admin config stored in state.
 */
Field.prototype.admin = function admin(opts: unknown) {
	return new Field({ ...this._state, admin: opts });
};
