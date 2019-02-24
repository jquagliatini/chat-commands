export type Predicate<T> = (t: T, index?: number, obj?: T[]) => boolean;
export type PredicateOrValue<T> = Predicate<T> | T;