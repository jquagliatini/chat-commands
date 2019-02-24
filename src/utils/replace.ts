import replaceIndex from "./replaceIndex";

import { Predicate, PredicateOrValue } from './types';

/**
 * replace is a method to replace an element in an array by keeping its index in the array
 * it returns a new array with `element` at the found index with `findCallback`
 * 
 * @param findCallback the callback to find the element to replace in array
 * @param element the replacement element
 * @param array the array from which to replace the element
 * @see replaceIndex
 * @return a new array with the replace element
 */
const replace = <T>(findValue: PredicateOrValue<T>, element: T) => (array: T[]): T[] => {
    const findCallback: Predicate<T> = (typeof findValue !== 'function')
        ? e => e === findValue
        : findValue;

    const idx = array.findIndex(findCallback);
    return idx === -1
        ? array
        : replaceIndex(idx, element)(array)
};

export default replace;