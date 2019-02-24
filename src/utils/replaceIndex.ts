
/**
 * Replace an element inside an array by the `value`. If no
 * value is provided it deletes the element inside the array.
 * This is a pure function the array is not modified
 * @param idx 
 * @param value 
 * @param array
 * @return a new array with the modifications 
 */
const replaceIndex = <T>(idx: number, value?: T) => (array: T[]): T[] => {
    const tmpArray = Array.prototype.slice.call(array, 0);
    const spliceArgs: (number|T)[] = [idx, 1];
    Array.prototype.splice.apply(tmpArray, value ? spliceArgs.concat(value) : spliceArgs);
    return tmpArray;
}

export default replaceIndex;
