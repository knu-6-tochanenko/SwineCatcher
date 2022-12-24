var divScore = document.getElementById('score');

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

const SPEED_LIMIT = 3;
const BOWL_SIZE = 80;
const SWINE_SIZE = 80;
const GAME_SPEED = 60;

var CONFIG = {
	SCORE: 0,
	LIVES: 10
}

divScore.innerHTML = CONFIG.LIVES;

const globalHeight = document.body.scrollHeight;
const globalWidth = document.body.scrollWidth;

const bowlCoords = {
	left: (globalWidth - BOWL_SIZE) / 2,
	right: (globalWidth + BOWL_SIZE) / 2,
	top: (globalHeight - BOWL_SIZE) / 2,
	bottom: (globalHeight + BOWL_SIZE) / 2
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

function collide(swine, obj) {
	let swineCoords = {
		left: swine.pos_x - SWINE_SIZE / 2,
		right: swine.pos_x + SWINE_SIZE / 2,
		top: swine.pos_y - SWINE_SIZE / 2,
		bottom: swine.pos_y + SWINE_SIZE / 2
	}

	return !(
		swineCoords.top >= obj.bottom ||
		swineCoords.right <= obj.left ||
		swineCoords.bottom <= obj.top ||
		swineCoords.left >= obj.right
	);
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

			newSwine.speed_x = (getRandomInt(SPEED_LIMIT) + 1);
			newSwine.speed_y = 0;
			break;
		case 1:
			newSwine.pos_x = globalWidth;
			newSwine.pos_y = globalHeight / 2;

			newSwine.speed_x = -(getRandomInt(SPEED_LIMIT) + 1);
			newSwine.speed_y = 0;
			break;
		case 2:
			newSwine.pos_x = globalWidth / 2;
			newSwine.pos_y = 0;

			newSwine.speed_x = 0;
			newSwine.speed_y = (getRandomInt(SPEED_LIMIT) + 1);
			break;
		case 3:
			newSwine.pos_x = globalWidth / 2;
			newSwine.pos_y = globalHeight;

			newSwine.speed_x = 0;
			newSwine.speed_y = -(getRandomInt(SPEED_LIMIT) + 1);
			break;
		default:
			newSwine.pos_x = 0;
			newSwine.pos_y = 0;
	}

	swine.style.top = newSwine.pos_y - (SWINE_SIZE / 2) + 'px';
	swine.style.left = newSwine.pos_x - (SWINE_SIZE / 2) + 'px';
	swine.id = "swine" + (swineCount++);
	document.body.appendChild(swine);
	let interval = setInterval(frame, GAME_SPEED);

	function frame() {
		if (!collide(newSwine, bowlCoords)) {
			newSwine.pos_x = newSwine.pos_x + newSwine.speed_x;
			swine.style.left = newSwine.pos_x - (SWINE_SIZE / 2) + 'px';

			newSwine.pos_y = newSwine.pos_y + newSwine.speed_y;
			swine.style.top = newSwine.pos_y - (SWINE_SIZE / 2) + 'px';
		} else {
			clearInterval(interval);
			swine.remove();
			CONFIG.LIVES--;
			divScore.innerHTML = CONFIG.LIVES;
		}
	}
}

setInterval(createSwine, 2000);