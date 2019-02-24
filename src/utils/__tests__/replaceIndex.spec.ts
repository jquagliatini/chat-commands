/* env jest */

import replaceIndex from '../replaceIndex';

describe('replaceIndex', () => {
    it('should replace an element inside an array at a defined index', () => {
        const array = [1, 2, 3, 4];
        const got = replaceIndex(2, 12)(array);
        expect(got).toEqual([1, 2, 12, 4]);
    });

    it('should remove the element at index if no replacemenet value is provided', () => {
        const array = [1, 2, 3, 4];
        const got = replaceIndex(2)(array);
        expect(got).toEqual([1, 2, 4]);
    });
});