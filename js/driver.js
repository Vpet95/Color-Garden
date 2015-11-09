
//initialize box position, color, starting direction, width, and height  
function init() {
	//set up canvas width and height 
	var c = document.getElementById("screen");
	var ctxt = c.getContext("2d");
	ctxt.canvas.width = window.innerWidth;
	ctxt.canvas.height = window.innerHeight;

	//create event listener for mouse movement 
	c.addEventListener("mousemove", getColors);

	//set up width and height -> create a square based on the smaller of width and height  
	width = (window.innerWidth < window.innerHeight) ? 
			Math.floor(window.innerWidth * 0.2) : Math.floor(window.innerHeight * 0.2);
	height = width; 

	//set up square position 
	posX = Math.floor(Math.random() * window.innerWidth) - width; 
	posY = Math.floor(Math.random() * window.innerHeight) - height;

	//fix the positions to be within bounds 
	if(posX < 0) posX = 0;
	if(posY < 0) posY = 0;

	//set up initial color 
	color = generateColor();

	//set up initial direction 
	dirX = Math.floor(Math.random() * 180) + 1;
	var x_sign = (Math.floor(Math.random() * 10) + 1) > 5 ? 1 : -1;

	dirY = Math.floor(Math.random() * 180) + 1;
	var y_sign = (Math.floor(Math.random() * 10) + 1) > 5 ? 1 : -1;	

	//include sign and reduce
	if(dirX < dirY) {
		dirX = (dirX * x_sign) / dirX;
		dirY = (dirY * y_sign) / dirX;
	} else {
		dirX = (dirX * x_sign) / dirY;
		dirY = (dirY * y_sign) / dirY
	}

	//restrict number to keep animation a reasonable speed 
	if(dirX >= 30 || dirX <= -30) {
		dirX /= 5;
		console.log("dirX : " + dirX);
	} 

	if(dirY >= 30 || dirY <= -30) {
		dirY /= 5;
		console.log("dirY : " + dirY);
	}	

	animate();
}

function animate() {
	var c = document.getElementById("screen");
	var ctxt = c.getContext("2d");

	//sets the type of compositing operation to apply when drawing new shapes
	ctxt.globalCompositeOperation = "source-over";
	
	if(posX + dirX < 0 || posX + width + dirX >= ctxt.canvas.width) {
		dirX *= -1;
		color = generateColor();
		collision = true;
	}
	if(posY + dirY <= 0 || posY + height + dirY >= ctxt.canvas.height) {
		dirY *= -1;
		color = generateColor();	
		collision = true;
	}

	if(collision) {
		var audId = audioSamples[Math.floor(Math.random() * 18)];
		var aud = document.getElementById(audId);
		aud.load();
		aud.play();
		
		//create a new ghost
		ghosts.push({
			x: posX,
			y: posY,
			c: "rgba(" + hexToRgb(color).r + ", " + hexToRgb(color).g + ", " + hexToRgb(color).b + ", 0.5)"
		});	
		if(ghosts.length == 10) {
			ghosts.shift();
		}
		collision = false;
	}

	//set fill color 
	ctxt.fillStyle = color;
	//draw the square
	ctxt.fillRect(posX, posY, width, height);
	//save canvas context so original shape can retain its color 
	ctxt.save(); 
	
	//draw all ghosts
	for(var i = 0; i < ghosts.length; i++) {
		ctxt.fillStyle = ghosts[i].c;
		ctxt.fillRect(ghosts[i].x, ghosts[i].y, width, height);
	}

	//retore context 
	ctxt.restore();

	//move the positions 
	posX += dirX;
	posY += dirY;

	//clear the canvas 
	setTimeout(function() {
		ctxt.clearRect(0, 0, ctxt.canvas.width, ctxt.canvas.height);
	}, 17);

	//request a new animation frame and call animate recursively
	window.requestAnimationFrame(animate);
}

