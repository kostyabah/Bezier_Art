import { mix } from "./comput"
import dataList from "./dataList"
import {defPath} from "./state"
import {decoration, map} from "./util"
import * as transShape from "./transShape"


let offsetIndex = (index, offset, length) => {
    let position = (index + offset) % length;
    return position < 0 ? position + length : position
}

let offsetItem = (...args) => args[2][offsetIndex(...args)]

export let grad = {
    setValue: (posn, index) => ({ list }) => ({
        list: map(
            list,
            item => ({
                ...item,
                tringle: posn
            }),
            [index]
        )
    })
};



let setPoints = (changePoints) =>{
    return setPath((item) =>({
        points : changePoints(item.points)
    }))
} 



export let path = {
    turn: (order, name) => ({activeShape, ...state}) => ({
        [name]: state[name].map(
            (key) => {
                let keyId  = {
                    keysPaths : "keyPath",
                    groups : "groupId"
                }[name]
                let merge = [
                    activeShape[keyId], 
                    ...order, 
                    activeShape[keyId]
                ],
                    findKey = merge.indexOf(key);
                return findKey === -1 
                    ? key
                    : merge[findKey + 1] 
            }
        )
        //selectPath: offsetIndex(selectPath, offset, keysPaths.length)
    }),
    toogle: ({ index }) => ({ list, selectPath }) => ({
        list: map(
            list,
            item => ({ ...item, show: !show }),
            [index || selectPath]
        )
    }),
    add: (value = {}, index, nwGr = false) => ({ list, activeShape, keysPaths, groups }) => {
        index = index || list.length;
        let _list = [
                ...list,
                {
                    ...defPath,
                    fill: activeShape.fill,
                    ...value,
                    groupId: nwGr ? list.length : activeShape.groupId,
                    keyPath : list.length
                    
                },
            ],
            _keysPaths = [
                ...keysPaths.slice(0, index),
                list.length,
                ...keysPaths.slice(index)
            ];

        return activeShape.x.length && { 
            list: _list, 
            selectPath: index, 
            keysPaths: _keysPaths,
            groups : nwGr 
                ? [...groups, list.length]
                : groups  
        }
    },
    select: (index) => ({activeShape}) => activeShape.x.length && {
        selectPath: index,
    },

    set : (handler, predict={}) => ({selectPath, list, ...state}) =>({
        ... typeof predict=== "function" ? predict(state) : predict,
        list : map(list, handler, [selectPath])
    }),
    change : (handler, filter) => ({selectPath, list}) => ({
        list: map(list, handler(transShape), filter || [selectPath])
    }),
    //setPoint
};

//export let path = decoration(dataList, creatorMapList, attackPath);



export let merge = (obj) => state => decoration(
    obj,
    (value, key) => ({
        ...state[key],
        ...value
    })
)



export let photo = {
    set: (value) => ({ image }) => ({
        image: {
            ...image,
            ...value
        }
    }),


}

export let setHueLight = (light, hue) => ({ raduga }) => ({
    raduga: { hue, light }
})

let balanceColor = (index, {length}, slog) => (path, i) =>{
    let tringle = path.tringle < index ? path.tringle : path.tringle + slog 
    return {
        tringle: tringle //* length / (length + slog)
    } 
}
    
 
let fromRaduga = (hue, light) => mix(
    [
        [0, 0, 0],
        mix(
            [
                [255, 0, 0], [255, 255, 0],
                [0, 255, 0], [0, 255, 255],
                [0, 0, 255], [255, 0, 255], 
                [255, 0, 0]
            ],
            hue * 6
        ),
        [255, 255, 255]
    ],
    light * 2
);

export let replaceColor = (hue, light) => ({counterColor, gradient}) =>({
    gradient : map(gradient, fromRaduga(hue, light), [counterColor])
})

export let setStopColor = (hue, light) => ({counterColor, gradient, list})=>{
    let stopColor = fromRaduga(hue, light) 
    
    
    return gradient.length > counterColor 
        ? {
            gradient: map(gradient, stopColor, [counterColor]),
            counterColor: counterColor + 1
        }
        : {
            gradient : [...gradient, stopColor],
            counterColor: counterColor + 1 , 
            list : map(list, balanceColor(counterColor, gradient, 1))
        }    
}



export let delColor = (index) => ({ gradient, list, counterColor }) =>gradient.length > 2 && {
    gradient: gradient.filter((item, i)=>index!==i),
    list: map(
        list,
        ({tringle: old}) => {
            let tringle = old;
            if(Math.abs(index - tringle) < 1){
                if(index !== 0 && index !== gradient.length -1){
                    tringle = (index - 1) + (tringle - index + 1) / 2 
                }else{
                    tringle = index === 0
                        ? 0 
                        : index - 1
                }
            }else if(index < tringle){
                tringle--;
            }
            debugger
            return {tringle}
        }
    )
}


