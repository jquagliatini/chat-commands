import dotenv from '../dotenv';

import { resolve, join } from 'path';

beforeAll(() => {
    process.env = undefined;
})

afterEach(() => {
    process.env = undefined;
})

test('dotenv with file', () => {
    dotenv(resolve(join(__dirname, '.fake.env')));

    expect(process.env).toHaveProperty('NODE_ENV');
    expect(process.env.NODE_ENV).toBe('development');

    expect(process.env).toHaveProperty('APP_SECRET');
    expect(process.env.APP_SECRET).toBe('secret');
});

test('dotenv with string', () => {
    dotenv(`NODE_ENV=production
    APP_SECRET =    secret   `, { isFile: false });

    expect(process.env).toHaveProperty('NODE_ENV');
    expect(process.env.NODE_ENV).toBe('production');

    expect(process.env).toHaveProperty('APP_SECRET');
    expect(process.env.APP_SECRET).toBe('secret');
});