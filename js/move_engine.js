function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

const SPEED_LIMIT = 3;

const globalHeight = document.body.scrollHeight;
const globalWidth = document.body.scrollWidth;

var movableObject = {
	pos_x: 0,
	pos_y: 0,
	speed_x: 0,
	speed_y: 0
}

var movableObjects = [];

function frame() {
	for (const obj of movableObjects) {
		obj.pos_x = obj.pos_x + obj.speed_x;
		obj.style.top = obj.pos_x;

		obj.pos_y = obj.pos_y + obj.speed_y;
		obj.style.left = obj.pos_y;
	}
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
	if (swine.pos_y > globalWidth / 2) {
		speed.speed_y = -1;
	}
	if (swine.pos_y < globalWidth / 2) {
		speed.speed_y = 1;
	}

	return speed;
}

function createSwine() {
	let newSwine = {};

	let side = getRandomInt(4);
	switch (side) {
		case 0:
			newSwine.pos_x = 0;
			newSwine.pos_y = getRandomInt(globalWidth);
			break;
		case 1:
			newSwine.pox_x = globalHeight;
			newSwine.pos_y = getRandomInt(globalWidth);
			break;
		case 2:
			newSwine.pos_x = getRandomInt(globalWidth);
			newSwine.pos_y = 0;
			break;
		case 3:
			newSwine.pos_x = getRandomInt(globalWidth);
			newSwine.pos_y = globalHeight;
			break;
		default:
			newSwine.pos_x = 0;
			newSwine.pos_y = 0;
	}

	let newSwineDirections = calculateSwineDirections(newSwine);
	newSwine.speed_x = getRandomInt(SPEED_LIMIT) * newSwineDirections.speed_x;
	newSwine.speed_y = getRandomInt(SPEED_LIMIT) * newSwineDirections.speed_y;
}