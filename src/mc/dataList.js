import {decoration} from "./util"

let createMethod =(type)=> (functor, list) => {
    /*
    if (args && args.length) {
        return createMethod(type)(functor(...args), list)
    }
    */
    return list[type](functor)
}


let dataList = {
    map: createMethod("map"),
    replace: ([functor, value], table) =>{
        let callback =Array.isArray(functor)
            ? (item, i) => functor.includes(i)
            : functor;
        return table.map(
            (item, index, arr) => callback(item, index, arr)
                ? typeof value === "function"
                    ? value(item, index, arr) 
                    : value
                : item
        )  
    } ,
    insert: ([functor, suff], body ) => {
        let calcIndex = typeof functor === "function" 
            ? body.findIndex(functor)
            : functor || -1;
        if(calcIndex == -1) calcIndex = body.length;
        return [
            ...body.slice(0, calcIndex),
            suff,
            ...body.slice(calcIndex)
        ]
    },
    del: createMethod("filter")
}


let genery = method => (
    callback, dependens
) => table => {
    
    let functor = dependens 
        ? decoration(dependens, callback)
        : callback;
    
    let getCallback = (key) =>
        typeof functor === "function" || Array.isArray(functor)
            ? functor : functor[key];
    //debugger  
    return decoration(
        table, 
        (list, key)=> {
            let result = method(
                getCallback(key),
                list
            )
            /*
            console.log({
                method,
                key,
                result,
                dependens
            })
            console.trace()
            */
            return result;
        },
        (dependens && Object.keys(dependens)) || ((item) => Array.isArray(item))
    )
}

export default decoration(dataList, genery)

