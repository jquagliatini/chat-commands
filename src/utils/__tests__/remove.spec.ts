import remove from '../remove';

describe('remove', () => {
    it('should return the deleted element and the new array', () => {
        type FakeUserType = { username: string, id: number };
        const array: FakeUserType[] = [
            { username: 'foo', id: 0 },
            { username: 'bar', id: 1 },
        ];

        const [deleted, got] =
            remove<FakeUserType>((e: FakeUserType) => e.username === 'bar')(array);
        expect(deleted).toEqual({ username: 'bar', id: 1 });
        expect(got).toEqual([{ username: 'foo', id: 0 }]); 
    });

    it('should remove a simple value', () => {
        const array = ['f', 'o', 'o', ' ', 'b', 'a', 'r'];
        const [deleted, got] = remove('o')(array);
        expect(deleted).toBe('o');
        expect(got).toEqual(['f', 'o', ' ', 'b', 'a', 'r']);
    });

    it('should return undefined for deleted value when no value has been deleted', () => {
        const array = ['f', 'o', 'o', ' ', 'b', 'a', 'r'];
        const [deleted, got] = remove('z')(array);
        expect(deleted).toBeUndefined();
        expect(got).toEqual(['f', 'o', 'o', ' ', 'b', 'a', 'r']);
    });
});