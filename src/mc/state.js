import {mix, toBorder, back} from "../mc/comput"
//import dataList from "./dataList"
export let defPath = {        
    
    x: [],
    y: [],
    ax: [],
    ay: [], 
    mainIndex : 0,     
    editAll: false,
    keyPath : 0,
    groupId : 0,
    fill : new Uint8ClampedArray([0,0,0])
    
    //tringle: 0.5
}

export let state = {
    list: [defPath],
    selectPath: 0,
    keysPaths : [0],
    groups : [0],
    gradient: [
        [0, 0, 0],
        [255, 255, 255]
    ],

    offset : 0,
    counterColor : 0,
      
    
    pen: {
        radius : 3,
        x: 0,
        y: 0,
        center : [0,0,0],
        arround : new Uint8ClampedArray([0, 0, 0])
    },


    image: {
        position: {
            left: 0,
            top: 0,
        },
        scale: 1,
        src: null
    }
};

export let computed = (props) =>{
    let {
        list, offset, selectPath, keysPaths, 
        gradient, counterColor, image, groups    
    } = props;

    let slice = (keys, data = list) => keys.map((index)=>data[index]),
        order = slice(keysPaths),
        shapesGrouped = groups.reduce(
            (acc, gr) => ({
                ...acc,
                [`key-${gr}`] : order.filter((path) => path.groupId === gr)
            }), {}
        ),
        values = Object.values(shapesGrouped),
        shapes = values.flat(),
        /*.map(item => ({
            ...item,
            fill: mix(gradient, item.tringle)
        })),
        */
        activeShape = shapes.find(path => path.keyPath === selectPath),
        //selectGroup = activeShape.groupId
        scaleToSmall = size => item => ({
            ...item,
            ...toBorder(
                size,
                [
                    ...item.x,
                    ...item.ax,
                    ...back(item.x, item.ax)
                ],
                [
                    ...item.y,
                    ...item.ay,
                    ...back(item.y, item.ay)
                ]
            )(item)
        }),
        iconGroup = values.map(array => array[0]).slice(-10).map(scaleToSmall(50)),
        layers = shapesGrouped[`key-${activeShape.groupId}`].slice(-10).map(scaleToSmall(50));
        
        //tringle = activeShape.tringle * 600 / (gradient.length-1);


    return {
        shapes, 
        activeShape, 
        activeColor: activeShape.fill, 
        layers, 
        icons : iconGroup 
        //tringle
    }
}