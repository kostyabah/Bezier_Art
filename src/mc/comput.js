import dataList from "./dataList"

let { map, insert, del } = dataList
export let toBorder = (value, X, Y) => {
    let toRange = size => (min) => item => value * (item - min) / size
    let sizeRange = (array) => [
        Math.min(...array),
        Math.max(...array),
    ],
        [rangeX, rangeY] = [X, Y].map(sizeRange),

        [sizeX, sizeY] = [rangeX, rangeY].map(([min, max]) => max - min),
        maxSize = Math.max(sizeX, sizeY);

    console.log("toBorder")
    let result = map(toRange(maxSize), {
        x: rangeX[0],
        ax:rangeX[0],
        y: rangeY[0],
        ay: rangeY[0]
    })

    return result;
}


export let mix = (
    colors, value, 
    points = colors.map((_, i, {length}) =>i/(length-1))
) => {
    console.log(value)

    //debugger //points.findIndex(item => item > value)
    let index = Math.floor(value),
        [w_pr, w_nt] = [value - index, 1-(value-index)],
        prev = colors[index],
        next = colors[index+1];
    if(next){
        return next.map((nx, i) =>{
            return Math.round(prev[i]*w_nt + nx*w_pr)
        })
    }else{
        return prev;
    }
}

export let back = (stop, dinamic) => stop.map((stat, i) =>{
    return 2*stat - dinamic[i];
});






 