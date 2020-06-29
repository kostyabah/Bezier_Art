
let getFun =(fun)=> {
	if(fun.includes){
		return (item, index, arr)=>{
			return fun.includes(index)
		}
	}else{
		return fun;
	}
}

export let decoration = (data, as, filt = true, predict ={}) => Object.entries(data).reduce(
    (acc, [key, method]) =>{
    	let filter = filt, 
            handler = as//typeof as === "function" ? as : as[key] ;
    	if(typeof filt === "function"){
    		filter = filter(method, key, acc)
    	}
    	if(filt.includes){
    		filter = filter.includes(key)
    	}
        
    	return {
    		...acc, 
	        [key] : handler && filter? handler(method, key, acc): method
        }
    }, predict
)

export let map = (list, part, chooseIndex = ()=>true) => {

    let toPartState = (part, data) =>
        typeof part === "function"
            ? part(...data) : part
    let callback = (...args) =>
        getFun(chooseIndex)(...args)
            ? Array.isArray(args[0])
                ? toPartState(part, args)
                :{
                    ...args[0],
                    ...toPartState(part, args)
                }
            : args[0];
    return list.map(callback)
}