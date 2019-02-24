export default class Maybe<T> {
    static none = new Maybe(null);
    private hasV: boolean;
    private val: T;

    constructor(value: T) {
        this.val = value;
        this.hasV = value !== undefined && value !== null;
    }

    exists(): boolean {
        return this.hasV;
    }

    value(): T {
        return this.hasV
            ? this.val
            : null;
    }

}