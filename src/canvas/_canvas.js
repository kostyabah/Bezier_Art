

window.onmousedown = function (point) {
	//Mouse.count =1
	window.mousepress = true;

}


window.onmouseup = function (point) {
	window.mousepress = false;
}









ShapeStory.prototype = {


}

//---------@@@@@@@@@@@@@@@@@@@--------------------
function whitefill() {
	this.save();
	this.fillStyle = "rgb(255,255,255)";
	this.fillRect(0, 0, this.canvas.width, this.canvas.height);
	this.restore();
}


function getStyle(gamma, context) {
	function rgba(color) {
		if (!color) {
			return 'transparent'
		}
		if (typeof color == "string") {
			return color;
		} else if (Array.isArray(color)) {
			while (color.length < 3)
				color.push(color[0])
			if (color.length == 3)
				color.push(255);
			//console.log(color, `rgba(${color.join(", ")})`)			
			return `rgba(${color.join(", ")})`
		} else if (typeof color == "number") {
			return rgba([color])
		}
	}

	if (typeof gamma !== "object" || Array.isArray(gamma)) {

		return rgba(gamma);
	}
	var gr;
	if (gamma.type == "radial") {
		gr = context.createRadialGradient
			.apply(context, gamma.param);
	}
	if (gamma.type == "line") {
		gr = context.createLinearGradient
			.apply(context, gamma.param);
	}
	for (weight in gamma.colors) {
		var color = rgba(gamma.colors[weight]);
		//console.log(color);
		gr.addColorStop(parseInt(weight) / 100, color);
	}

	return gr;
}