function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

const SPEED_LIMIT = 3;
const BOWL_SIZE = 80;
const SWINE_SIZE = 80;

const globalHeight = document.body.scrollHeight;
const globalWidth = document.body.scrollWidth;

const bowlCoords = {
	left: (globalWidth - BOWL_SIZE) / 2,
	right: (globalWidth + BOWL_SIZE) / 2,
	top: (globalHeight - BOWL_SIZE) / 2,
	bottom: (globalHeight + BOWL_SIZE)
}

var movableObject = {
	pos_x: 0,
	pos_y: 0,
	speed_x: 0,
	speed_y: 0,
	id: "",
	interval: {}
}

var swineCount = 0;

var movableObjects = [];

function collide(swine) {
	let swineCoords = {
		left: swine.pos_x - SWINE_SIZE / 2,
		right: swine.pos_x + SWINE_SIZE / 2,
		top: swine.pos_y - SWINE_SIZE / 2,
		bottom: swine.pos_y + SWINE_SIZE / 2
	}

	return !(
		swineCoords.left >= bowlCoords.right
		|| swineCoords.right <= bowlCoords.left
		|| swineCoords.top >= bowlCoords.bottom
		|| swineCoords.bottom <= bowlCoords.top
	);
}

function calculateSwineDirections(swine) {
	let speed = {
		speed_x: 0,
		speed_y: 0
	};

	if (swine.pos_x > globalWidth / 2) {
		speed.speed_x = -1;
	}
	if (swine.pos_x < globalWidth / 2) {
		speed.speed_x = 1;
	}
	if (swine.pos_y > globalHeight / 2) {
		speed.speed_y = -1;
	}
	if (swine.pos_y < globalHeight / 2) {
		speed.speed_y = 1;
	}

	return speed;
}

function createSwine() {
	let swine = document.createElement('div');
	swine.classList.add('swine');

	let newSwine = {};

	let side = getRandomInt(4);
	switch (side) {
		case 0:
			newSwine.pos_x = 0;
			newSwine.pos_y = globalHeight / 2;
			
			newSwine.speed_x = 1;
			newSwine.speed_y = 0;
			break;
		case 1:
			newSwine.pos_x = globalWidth;
			newSwine.pos_y = globalHeight / 2;

			newSwine.speed_x = -1;
			newSwine.speed_y = 0;
			break;
		case 2:
			newSwine.pos_x = globalWidth / 2;
			newSwine.pos_y = 0;

			newSwine.speed_x = 0;
			newSwine.speed_y = 1;
			break;
		case 3:
			newSwine.pos_x = globalWidth / 2;
			newSwine.pos_y = globalHeight;

			newSwine.speed_x = 0;
			newSwine.speed_y = -1;
			break;
		default:
			newSwine.pos_x = 0;
			newSwine.pos_y = 0;
	}

	swine.style.top = newSwine.pos_y - (SWINE_SIZE/2) + 'px';
	swine.style.left = newSwine.pos_x - (SWINE_SIZE/2) + 'px';
	swine.id = "swine" + (swineCount++);
	document.body.appendChild(swine);
	let interval = setInterval(frame, 10);

	console.log("NEW SWINE");
	console.log(JSON.stringify(newSwine, null, 4));

	function frame() {
		if (!collide(newSwine)) {
			console.log("Not collided yet");
			newSwine.pos_x = newSwine.pos_x + newSwine.speed_x;
			swine.style.left = newSwine.pos_x - (SWINE_SIZE/2) + 'px';
	
			newSwine.pos_y = newSwine.pos_y + newSwine.speed_y;
			swine.style.top = newSwine.pos_y - (SWINE_SIZE/2) + 'px';
		} else {
			console.log("Collided!");
			clearInterval(interval);
		}
	}

	console.log(JSON.stringify(newSwine, null, 4));
}

createSwine();

console.log(JSON.stringify(bowlCoords, null, 4));