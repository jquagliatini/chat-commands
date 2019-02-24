import replace from '../replace';

test('it should replace element', () => {
    const users = [
        { username: 'john.doe', admin: false },
        { username: 'jane.doe', admin: true },
    ];

    const newUsers = replace(
        u => u.username === 'john.doe',
        { username: 'john.doe', admin: true },
    )(users);
    expect(newUsers[0]).toEqual({
        username: 'john.doe',
        admin: true,
    })
});

test('it should take a single value instead of a full function', () => {
    const vals = [1, 2, 3, 4];
    const got = replace(2, 28)(vals);
    expect(got[1]).toBe(28);
})

test('it should replace even the first element', () => {
    const elems = [
        1, 2, 3, 4,
    ];

    const got = replace(1, 0)(elems);
    expect(got[0]).toBe(0);
});
