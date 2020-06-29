function getPropItem(item, index) {
    return [
        (a, b) => a[b],
        (a, b) => a(b),
        (a) => a
    ][
        [
            Array.isArray(item),
            typeof item === "function",
            true
        ].indexOf(true)
    ](item, index)
}


export default ({ children, ...props }) => {
    let propsValues = Object.values(props);
    if (!propsValues.length) return;
    let result = [], min_length = Math.min(
        ...propsValues
            .filter(Array.isArray)
            .map(arr => arr.length)
    )
    for (let n = 0; n < min_length; n++) {
        let acc = {};
        for (let [key, value] of Object.entries(props)) {
            acc[key] = getPropItem(value, n)
        }
        result.push(children(acc, n))
    }

    return result
}