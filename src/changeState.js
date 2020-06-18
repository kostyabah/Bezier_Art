

let changeState = function (state, getter, setter = {}) {
    let result = {}
    for (sk in setter) {
        if (typeof setter == "object")
            result[sk] = changeState(state[sk], getter[sk], setter[sk])
        else
            result[sk] = setter[sk]
    }
    let minor = {}
    if (getter && getter.constructor === Object) {
        for (gk in getter) {
            if (gk in setter == false) {
                minor[gk] = getter[sk](result, state)
            }
        }
    }

    return Object.assign({}, result, minor)
}

export default changeState