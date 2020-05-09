//get reference to canvas
var canvas = document.getElementById('canvas');

//get reference to canvas context
var context = canvas.getContext('2d');

//getreference loading screen 
var loading_screen = document.getElementById('loading');

//initialize loading variables
var loaded = false;
var load_counter = 0;

//initialize image for layers
var background = new Image();
var sun = new Image();
var branch = new Image();
var tree = new Image();
var char = new Image();
var float1 = new Image();
var wm = new Image();
var mask = new Image();
var float2 = new Image();

//create a list of layer Object
var layer_list = [
	{
		'image': background,
		'src': './images/1.PNG',
		'z_index': -5,
		'position': {x: 0, y: 0},
		'blend': null,
		'opacity': 1
	},
	{
		'image': sun,
		'src': './images/2.PNG',
		'z_index': -4,
		'position': {x: 0, y: 0},
		'blend': null,
		'opacity': 1	
	},
	{
		'image': branch,
		'src': './images/3.PNG',
		'z_index': -3,
		'position': {x: 0, y: 0},
		'blend': 'overlay',
		'opacity': 1
	},
	{
		'image': tree,
		'src': './images/4.PNG',
		'z_index': -2.5,
		'position': {x: 0, y: 0},
		'blend': null,
		'opacity': 1
	},
	{
		'image': char,
		'src': './images/5.PNG',
		'z_index': -1,
		'position': {x: 0, y: 0},
		'blend': null,
		'opacity': 1
	},
	{
		'image': float1,
		'src': './images/6.PNG',
		'z_index': -0.5,
		'position': {x: 0, y: 0},
		'blend': null,
		'opacity': 1
	},
	
	{
		'image': wm,
		'src': './images/wm.PNG',
		'z_index': -0.1,
		'position': {x: 0, y: 0},
		'blend': null,
		'opacity': 1
	},
	
 	{
		'image': mask,
		'src': './images/7.PNG',
		'z_index': 0,
		'position': {x: 0, y: 0},
		'blend': null,
		'opacity': 1
	},
	{
		'image': float2,
		'src': './images/8.PNG',
		'z_index': 1.5,
		'position': {x: 0, y: 0},
		'blend': null,
		'opacity': 0.9
	}
];

layer_list.forEach(function(layer, index) {
	layer.image.onload = function() {
		load_counter += 1;
		if (load_counter >= layer_list.length) {
		hideLoading();
			requestAnimationFrame(drawCanvas);
		}
	}
	layer.image.src = layer.src;
});

function hideLoading () {
loading_screen.classList.add('hidden');

}

function drawCanvas() {

	//clear whatever is in canvas
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	//tweenupdate
	TWEEN.update();
	
	///calculate canvas rotate///
	
	var rotate_x = (pointer.y * -0.15) + (motion.y * -1.2);
	var rotate_y = (pointer.x * 0.15) + (motion.x * 1.2);
	
	canvas.style.transform = "rotateX("+ rotate_x +"deg) rotateY(" + rotate_y + "deg)";

	//loop through each layer and draw it to the canvas

	layer_list.forEach(function(layer, index){
	
		layer.position = getOffset(layer);
	
		if (layer.blend){
			context.globalCompositeOperation = layer.blend;
			} else {
				context.globalCompositeOperation = 'normal';
				}
				
		context.globalAlpha = layer.opacity;
				
		context.drawImage(layer.image, layer.position.x, layer.position.y);
		
	});
	requestAnimationFrame(drawCanvas);

}

function getOffset(layer) {
	var touch_multiplier = 0.3;
	var touch_offset_x = pointer.x * layer.z_index * touch_multiplier;
	var touch_offset_y = pointer.y * layer.z_index * touch_multiplier;
	
	var motion_multiplier = 2.5;
	var motion_offset_x = motion.x * layer.z_index * motion_multiplier;
	var motion_offset_y = motion.y * layer.z_index * motion_multiplier;
	
	
	var offset = {
		x : touch_offset_x + motion_offset_x,
		y : touch_offset_y + motion_offset_y
	};
	
	return offset;
}

///// TOUCH AND MOUSE CONTROL /////

var moving = false;

//Initialize touch and mouse position
var pointer_initial = {
	x:0,
	y:0
};

var pointer = {
	x:0,
	y:0
};

canvas.addEventListener('touchstart', pointerStart);
canvas.addEventListener('mousedown', pointerStart);

function pointerStart(event){
	moving = true
	if (event.type === 'touchstart') {
		pointer_initial.x = event.touches[0].clientX;
		pointer_initial.y = event.touches[0].clientY;
	 } else if (event.type === 'mousedown'){
		pointer_initial.x = event.clientX
		pointer_initial.y = event.clientY
	}
		
}

window.addEventListener('touchmove', pointerMove);
window.addEventListener('mousemove', pointerMove);

function pointerMove(event) {
		event.preventDefault();
		if (moving === true) {
			var current_x = 0;
			var current_y = 0;
			if (event.type === 'touchmove') {
				current_x = event.touches[0].clientX;
				current_y = event.touches[0].clientY;
			} else if (event.type === 'mousemove') {
				current_x = event.clientX;
				current_y = event.clientY;
			}
			pointer.x = current_x - pointer_initial.x;
			pointer.y = current_y - pointer_initial.y;
		}
}

canvas.addEventListener('touchmove', function(event) {
	event.preventDefault();
});

canvas.addEventListener('mousemove', function(event) {
	event.preventDefault();
});

window.addEventListener('touchend', function(event) {
	endGesture()
});

window.addEventListener('mouseup', function(event) {
	endGesture()
});

function endGesture() {
	moving = false;
	
	
	TWEEN.removeAll()
	var pointer_tween = new TWEEN.Tween(pointer).to({x: 0, y: 0},300).easing(TWEEN.Easing.Back.Out).start();
}

////MOTION CONTROLS////


// Initialize variable for motion-based parallax
var motion_initial = {
	x:null,
	y:null
};

var motion = {
	x: 0,
	y: 0
};

//listen to gyroscope event
window.addEventListener('deviceorientation', function(event){
	//if this is the first time through
	if (!motion_initial.x && !motion_initial.y) {
	motion_initial.x = event.beta;
	motion_initial.y = event.gamma;
	}
	
	if(window.orientation === 0) {
		motion.x = event.gamma - motion_initial.y;
		motion.y = event.beta - motion_initial.x;
	//potrait
	} else if(window.orientation === 90) {
		motion.x = event.beta - motion_initial.x;
		motion.y = -event.gamma + motion_initial.y;
	//landscape left 
	} else if(window.orientation === -90) {
		motion.x = -event.beta + motion_initial.x;
		motion.y = event.gamma - motion_initial.y;
	//landscape right 
	} else {
		motion.x = -event.gamma + motion_initial.y; 
		motion.y = -event.beta + motion_initial.x;
	}
	
	
	var max_offset = 23;
    
    // Check if magnitude of motion offset along X axis is greater than your max setting
    if (Math.abs(motion.x) > max_offset) {
    	// Check whether offset is positive or negative, and make sure to keep it that way
    	if (motion.x < 0) {
    		motion.x = -max_offset;
    	} else {
    		motion.x = max_offset;
    	}
    }
    // Check if magnitude of motion offset along Y axis is greater than your max setting
    if (Math.abs(motion.y) > max_offset) {
    	// Check whether offset is positive or negative, and make sure to keep it that way
    	if (motion.y < 0) {
    		motion.y = -max_offset;
    	} else {
    		motion.y = max_offset;
		}
	//upside down
});


	
window.addEventListener('orientationchange', function(event) {
motion_initial.x = 0;
motion_initial.y = 0;
});

window.addEventListener('touchend', function() {
	enableMotion();
});

function enableMotion() {
	if (window.DeviceOrientationEvent && DeviceOrientationEvent.requestPermission){
		DeviceOrientationEvent.requestPermission();
		}
}
