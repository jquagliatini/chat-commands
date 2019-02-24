const complementary = (fn) => (...args: any[]) => !(fn.apply(null, args));

export default complementary;