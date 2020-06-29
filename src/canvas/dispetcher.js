export default class Dispetcher {
	constructor(canvas) {
		var copy = document.createElement("canvas");
		this.width = copy.width = canvas.width;
		this.heigth = copy.height = canvas.height;
		this.listen = copy.getContext("2d");
		whitefill.call(this.listen);
		this.init(new Path2D());
		this.list = [];
	}
	isPoint(path, point) {
		this.listen.lineWidth = 5;
		this.listen.fill(path);
		this.listen.stroke(path);
		var color = this.listen
		.getImageData(point.x, point.y, 1, 1)
		.data;
		whitefill.call(this.listen);
		
		var flag = true,
			isAlfa = color[3] 
			value = 0;
		for(var n = 0; n < 3; n++){
			value += color[n]; 
			if(color[n]!=0) flag = false;
		}
		console.log(value);	
		return value < 200 //flag;       
	}
	
	getHandlers(point){
		//console.log(this.list.length);
		for(var n=0; n < this.list.length; n++){
			var item = this.list[n]
			//console.log(item.handlers)
			if(this.isPoint(item.path, point) && item.handlers){
				return item.handlers;
			}
		}
		return false;
	}

	add(){
		this.list.unshift(this.active);
		//this.init();
	}
	init(path){
		this.active = {
			path: path
		}
	}
}