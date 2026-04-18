---
"questpie": patch
---

`.drizzle()` escape hatch now propagates the column's `$type<T>()` to the field's inferred `data` type. If the returned column has a narrower typed data, the field picks it up; columns still typed as `unknown` leave the existing field `data` in place.
