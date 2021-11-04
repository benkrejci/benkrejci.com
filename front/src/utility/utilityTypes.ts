/**
 * Compile time assert that the given value should be of type never. This is
 * useful for guaranteeing all cases are handled in a switch statement.
 */
 export const staticAssertNever = (value: never) => value;