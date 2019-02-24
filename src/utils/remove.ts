import replaceIndex from "./replaceIndex";
import { PredicateOrValue, Predicate } from "./types";

/**
 * remove an element inside an array and return the removed element as
 * well as the new array
 * @param predicate a predicate to find the element to remove or a 
 * value that should exist inside the array
 * @see replaceIndex
 * @return an array with first parameter the removed element and second
 * element the newly created array
 */
const remove = <T>(findValue: PredicateOrValue<T>) => (array: T[]): [T, T[]] => {
    const predicate: Predicate<T> = (typeof findValue !== 'function')
        ? e => e === findValue
        : findValue;
    const idx = array.findIndex(predicate);
    return idx === -1
        ? [undefined, array]
        : [array[idx], replaceIndex<T>(idx)(array)]
}

export default remove;