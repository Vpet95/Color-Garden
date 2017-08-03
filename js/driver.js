
//initialize box position, color, starting direction, width, and height  
function init() {
	audioSamples = document.getElementsByClassName('audio');

	//set up canvas width and height 
	var c = document.getElementById("screen");
	var ctxt = c.getContext("2d");
	ctxt.canvas.width = window.innerWidth;
	ctxt.canvas.height = window.innerHeight;

	//create event listener for mouse movement 
	c.addEventListener("mousemove", getColors);

	//initialize clipboard.js and bind it to the canvas
	var cp = new Clipboard('#screen'); //clipboard.js

	//define actions to take on successful copy
	cp.on('success', function(e) {
		//only a success if a color what actually copied 
	    if(e.text != "" && typeof(e.text) != 'undefined' && e.text.charAt(0) == '#') {
	    	document.getElementById("colorLabel").textContent = "Copied!";
	    	var audId = (Math.floor(Math.random() * 2) == 0) ? 's' : 't';
	    	var copyAud = document.getElementById(audId);
	    	copyAud.volume = 0.5;
	    	copyAud.load();
	    	copyAud.play();
	    }
	});

	//define actions to take on unsuccessful copy
	cp.on('error', function(e) {
	    console.log("Problem copying: " + e.action, e.trigger);
	});

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
	dirX = Math.floor(Math.random() * 10) + 1;
	var x_sign = (Math.floor(Math.random() * 10) + 1) > 5 ? 1 : -1;

	dirY = Math.floor(Math.random() * 10) + 1;
	var y_sign = (Math.floor(Math.random() * 10) + 1) > 5 ? 1 : -1;	

	//include sign 
	dirX *= x_sign;
	dirY *= y_sign;

	animate();
}

var wait = false;
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
		if(sound && audioSamples.length > 0) {
			var aud = audioSamples[randBetween(0, audioSamples.length - 3)];
			aud.load();
			aud.play();
		}
		
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
	if(!wait) {
		wait = true;
		setTimeout(function() {
			ctxt.clearRect(0, 0, ctxt.canvas.width, ctxt.canvas.height);
			wait = false;
		}, 0);	
	}
	

	//request a new animation frame and call animate recursively
	window.requestAnimationFrame(animate);
}

function toggleSound(e) {
	e.stopPropagation();
	sound = !sound;

	if(sound) {
		document.getElementsByClassName('sound-switch-thumb')[0].style.marginLeft = "66%";
		document.getElementsByClassName('sound-switch-label')[0].textContent = "Sound ON";
	} else {
		document.getElementsByClassName('sound-switch-thumb')[0].style.marginLeft = "3%";
		document.getElementsByClassName('sound-switch-label')[0].textContent = "Sound OFF";
	}
}