type Predicate = (...args: any[]) => boolean

const cond = (predicates: [Predicate, Function][]) => (...args) => {
    const predicate = predicates.find(p => p[0].apply(null, args))

    return predicate
        ? predicate[1].apply(null, args)
        : undefined
}

export default cond;