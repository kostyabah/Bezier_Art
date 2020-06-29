import {decoration} from "./util"
import changeShape from "./dataList"


let affirmation = {
	delete: index => (item, i) => index !== i,
    replace: (value, index) => (item, i) => index == i ? value : item,
    move: (diff) => item => item + diff
}


export let single = (diff, index) =>  
	changeShape.replace(
		_dg =>[
			[index],
			affirmation.move(_dg)
		],
	    diff
	)

//let filterIndexs = (filter, list)  =>  

let rotateAll = (end, start, center, shape) => {

    let differ = ({ x, y }) => ({
        x: x - center.x,
        y: y - center.y
    })
    let old = differ(start);
    let young = differ(end);

    let vector = old.x ** 2 + old.y ** 2;
    let cos = (young.x * old.x + young.y * old.y) / vector;
    let sin = (old.x * young.y - old.y * young.x) / vector;

    let { x, y } = center;
    let getRotX = opp => (item, index) => {
        return x + (item - x) * cos - (opp[index] - y) * sin;
    }
    let getRotY = opp => (item, index) => {
        return y + (opp[index] - x) * sin + (item - y) * cos;
    }

    return {
    	x: getRotX(shape.y),
    	y: getRotY(shape.x),
    	ax: getRotX(shape.ay),
    	ay: getRotY(shape.ax)
    }
};




export let rotate = (end, start, center) => shape=>{
	let mapping = rotateAll(end, start, center, shape); 
	return changeShape.map(mapping)(shape);	
}

let ll = (end)=> ({x, y}) =>{
	return ((end.x-x)**2 + (end.y-y)**2)**(1/2)
}

let zip = (shape) => {
	let keys = Object.keys(shape)
	return shape[keys[0]].map((first, ind) => {
		return decoration(shape, (list) => list[ind]);
	})
}

let filterIndex = (point, basisShape) =>{
	let basis = zip(basisShape);
	let list_size = basis
	.map(ll(point))
	.map((item, i, arr) =>{
		let next = arr[ (i + 1) % arr.length ];
		return item + next;
	});
	let nearIndex = basis.indexOf(Math.min(...list_size));
	return ([
		0, basis.length-1
	].indexOf[nearIndex] !== -1) && basis[index];

}

export let editHand = (index, point) => {
	return changeShape.replace(
		value => [
            (item, i, arr) => i === (index - 1 + arr.length)% arr.length,
            value
        ],
        point
	)
} 

export let del = (index) => 
	changeShape.del(affirmation.delete(index));

export let insert = (point, findIndex)=> ({mainIndex, ...shape}) =>({
	...changeShape.insert( 
		(value)=> [
			findIndex,
			value
		],
		point
	)(shape),
	mainIndex: mainIndex==0 ? mainIndex : mainIndex + 1
})
	

export let translate = (point, pointIndex) =>{
	if(pointIndex){
		return changeShape.replace(
			coord => [
				pointIndex,
				affirmation.move(coord)
			],
			point
		)
	}else{
		return changeShape.map(value => item=> value+item, point)
	}

	 
}
	

/*
export let editDirec = (point) =>
	changeShape.map()
*/
export let changeDirection =(point, isfront, index) => shape => 
	changeShape.replace(
		([client, stat]) => [
			[index],
			(item, i) => isfront ? client : 2*stat - client
		]
	    ,{
	        ax: [point.x, shape.x[index]], ay: [point.y, shape.y[index]]
	    }
	)(shape)






  	

