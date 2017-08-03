
//initial values 
var posX = 0, posY = 0, width = 0, height = 0, collision = false; 
var hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
var audioSamples = [];
var color = "#000000";
var dirX = 0, dirY = 0; 
var ghosts = []; //ghost squares
var sampled = false;
var tempContext;
var sound = true;

//generates a random hex color
function generateColor() {
	var c = "#";
	for(var i = 0; i < 6; i++) {
		c += hex[Math.floor(Math.random() * 16)];
	}

	return c;
}

function randBetween(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//convert hexadecimal representation of color into rgb
//source: http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

//convert rgb representation of color into hex 
//source: http://stackoverflow.com/questions/6735470/get-pixel-color-from-canvas-on-mouseover
function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

//get the colors from 
var getColors = function(ev) {
    var mouseX = ev.clientX;
    var mouseY = ev.clientY;

    tempContext = (typeof(tempContext) == 'undefined' ? this.getContext("2d") : tempContext);
    var data = tempContext.getImageData(mouseX, mouseY, 1, 1).data;
    var tempC = "#" + ("000000" + rgbToHex(data[0], data[1], data[2])).slice(-6);

    if(tempC != "#000000" && tempC != "#FFFFFF") {
        document.getElementById("screen").setAttribute("data-clipboard-text", tempC);
        var lbl = document.getElementById("colorLabel");
        lbl.textContent = tempC;
        lbl.style.color = tempC;
    }
}