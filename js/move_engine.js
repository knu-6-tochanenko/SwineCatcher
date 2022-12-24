// DOM Elements
var divScore = document.getElementById('score');
var divLives = document.getElementById('lives');
var divTime = document.getElementById('time');
var divMode = document.getElementById('mode');
var divPopup = document.getElementById('hello_popup');
var divEndPopup = document.getElementById('end_popup');
var pEndCause = document.getElementById('end_cause');

// Game settings
var SPEED_LIMIT = 3;
const BOWL_SIZE = 80;
const SWINE_SIZE = 80;
const GAME_SPEED = 60;
var TANK_SPEED = 3;
const TANK_GAME_SPEED = 10;
const SWINE_SPAWN = 2000;
const SWINE_SPAWN_EPIC = 700;

var CONFIG = {};
var swineSpawner = {};
var epicMode = {};

// Variables
const globalHeight = document.body.scrollHeight;
const globalWidth = document.body.scrollWidth;

const bowlCoords = {
	left: (globalWidth - BOWL_SIZE) / 2,
	right: (globalWidth + BOWL_SIZE) / 2,
	top: (globalHeight - BOWL_SIZE) / 2,
	bottom: (globalHeight + BOWL_SIZE) / 2
}
var swineCount = 0;
var swines = [];
var tankConfig = {
	pos_x: (globalWidth - BOWL_SIZE) / 2,
	pos_y: (globalHeight - BOWL_SIZE) / 2,
	speed_x: 0,
	speed_y: 0
};
var tankInterval = {};
var timerInterval = {};

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

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

function createTank() {
	var tank = document.getElementById('tank');
	tankInterval = setInterval(tankFrame, TANK_GAME_SPEED);

	function tankFrame() {
		let tankCoords = {
			left: tankConfig.pos_x - BOWL_SIZE / 2,
			right: tankConfig.pos_x + BOWL_SIZE / 2,
			top: tankConfig.pos_y - BOWL_SIZE / 2,
			bottom: tankConfig.pos_y + BOWL_SIZE / 2
		}

		for (var i = 0; i < swines.length; i++) {
			if (collide(swines[i], tankCoords)) {
				console.log(JSON.stringify(swines[i], null, 4));
				let swineElement = document.getElementById(swines[i].id);
				clearInterval(swines[i].interval);

				swineElement.remove();

				swines.splice(i, 1);
				CONFIG.SCORE++;
				updateScore();
				break;
			}
		}

		if (tankConfig.pos_x <= 0 && tankConfig.speed_x < 0) {
			tankConfig.speed_x = 0;
		}
		if (tankConfig.pos_x >= globalWidth && tankConfig.speed_x > 0) {
			tankConfig.speed_x = 0;
		}
		if (tankConfig.pos_y <= 0 && tankConfig.speed_y < 0) {
			tankConfig.speed_y = 0;
		}
		if (tankConfig.pos_y >= globalHeight && tankConfig.speed_y > 0) {
			tankConfig.speed_y = 0;
		}

		tankConfig.pos_x = tankConfig.pos_x + tankConfig.speed_x;
		tank.style.left = tankConfig.pos_x - (SWINE_SIZE / 2) + 'px';

		tankConfig.pos_y = tankConfig.pos_y + tankConfig.speed_y;
		tank.style.top = tankConfig.pos_y - (SWINE_SIZE / 2) + 'px';
	}
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
	newSwine.id = "swine" + (swineCount++);
	swine.setAttribute('id', newSwine.id);


	document.body.appendChild(swine);
	let interval = setInterval(frame, GAME_SPEED);
	newSwine.interval = interval;

	swines.push(newSwine);

	function frame() {
		if (!collide(newSwine, bowlCoords)) {
			newSwine.pos_x = newSwine.pos_x + newSwine.speed_x;
			swine.style.left = newSwine.pos_x - (SWINE_SIZE / 2) + 'px';

			newSwine.pos_y = newSwine.pos_y + newSwine.speed_y;
			swine.style.top = newSwine.pos_y - (SWINE_SIZE / 2) + 'px';
		} else {
			clearInterval(newSwine.interval);
			swine.remove();
			CONFIG.LIVES--;
			updateLives();

			if (CONFIG.LIVES == 0) {
				endGame('BOWL_FAILURE');
			}

			swines = swines.filter(function (obj) {
				return obj.id !== newSwine.id;
			});
		}
	}
}

document.addEventListener('keydown', moveTank);

function moveTank(event) {
	if (event.isComposing || event.keyCode === 87 || event.keyCode === 38) {
		console.log("UP");
		tankConfig.speed_x = 0;
		tankConfig.speed_y = -TANK_SPEED;
		return;
	}
	if (event.isComposing || event.keyCode === 65 || event.keyCode === 37) {
		console.log("LEFT");
		tankConfig.speed_x = -TANK_SPEED;
		tankConfig.speed_y = 0;
		return;
	}
	if (event.isComposing || event.keyCode === 83 || event.keyCode === 40) {
		console.log("BOTTOM");
		tankConfig.speed_x = 0;
		tankConfig.speed_y = TANK_SPEED;
		return;
	}
	if (event.isComposing || event.keyCode === 68 || event.keyCode === 39) {
		console.log("RIGHT");
		tankConfig.speed_x = TANK_SPEED;
		tankConfig.speed_y = 0;
		return;
	}
	if (event.isComposing || event.keyCode === 32) {
		console.log("RIGHT");
		tankConfig.speed_x = 0;
		tankConfig.speed_y = 0;
	}
}

function createTimer() {
	var start = Date.now();
	timerInterval = setInterval(function () {
		CONFIG.SECONDS--;
		if (CONFIG.SECONDS == 0) {
			endGame();
		}
		updateTime();
	}, 1000);
}

function updateScore() {
	divScore.innerHTML = CONFIG.SCORE + " свинособак розчавлено";
}

function updateLives() {
	divLives.innerHTML = CONFIG.LIVES + " життів у унітазу";
}

function updateTime() {
	divTime.innerHTML = CONFIG.SECONDS + " секунд";
}

function runEpicMode() {
	divMode.innerHTML = "EPIC РЕЖИМ";
	SPEED_LIMIT = 10;
	TANK_SPEED = 5;
	epicMode = setInterval(createSwine, SWINE_SPAWN_EPIC);
}

function endGame(cause) {
	console.log("ГРУ ЗАВЕРШЕНО!");
	clearInterval(swineSpawner);
	clearInterval(tankInterval);
	clearInterval(timerInterval);
	clearInterval(epicMode);
	for (var i = 0; i < swines.length; i++) {
		clearInterval(swines[i].interval);
	}

	divEndPopup.style.display = 'block';

	if (cause === 'BOWL_FAILURE') {
		pEndCause.innerHTML = "Нажаль, свинособакам вдалось вкрасти унітаз. Спробуй ще раз! Почавлено <b>" + CONFIG.SCORE + "</b> свинособак!";
	} else {
		pEndCause.innerHTML = "Вітаю! Свинособаки так і не змогли вкрасти золотий унітаз! Почавлено <b>" + CONFIG.SCORE + "</b> свинособак!";
	}
}

function startGame() {
	for (var i = 0; i < swines.length; i++) {
		console.log(swines.length);
		let swineElement = document.getElementById(swines[i].id);
		swineElement.remove();
	}	
	swines = [];


	CONFIG = {
		SCORE: 0,
		LIVES: 10,
		SECONDS: 100,
		EPIC_MODE: 65
	};

	TANK_SPEED = 3;

	divPopup.style.display = 'none';
	divEndPopup.style.display = 'none';
	swineSpawner = setInterval(createSwine, SWINE_SPAWN);

	updateScore();
	updateLives();
	updateTime();
	createTank();
	divMode.innerHTML = "Звичайний режим";
	setTimeout(runEpicMode, CONFIG.EPIC_MODE * 1000);
	createTimer();
}
