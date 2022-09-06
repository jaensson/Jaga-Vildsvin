// Globala konstanter och variabler
var boardElem;			// Referens till div-element för "spelplanen"
const carImgs = ["car_up.png","car_right.png","car_down.png","car_left.png"];
						// Array med filnamn för bilderna med bilen
var carDir = 1;			// Riktning för bilen, index till carImgs
var carElem;			// Referens till img-element för bilen
const xStep = 5;		// Antal pixlar som bilen ska förflytta sig i x-led
const yStep = 5;		// eller y-led i varje steg
const timerStep = 20;	// Tid i ms mellan varje steg i förflyttningen
var timerRef = null;	// Referens till timern för bilens förflyttning
var startBtn;			// Referens till startknappen
var stopBtn;			// Referens till stoppknappen
/* === Tillägg i uppgiften === */
let pigElem;				// Referens till img-element för grisen
let boarNrElem;				// Referens till vildsvin 
let boarHitElem;			// Referens till antal träffar
let boarNr;					// Antal vildsvin
let boarHit;				// Antal vildsvin använderen träffat
let timerBoar = null;		// Timer till nästa gris
let timerCollision = null;	// Timer för att kolla kollision


// ------------------------------
// Initiera globala variabler och koppla funktion till knapp
function init() {
	// Referenser till element i gränssnittet
		boardElem = document.getElementById("board");
		carElem = document.getElementById("car");
		startBtn = document.getElementById("startBtn");
		stopBtn = document.getElementById("stopBtn");
	// Lägg på händelsehanterare
		document.addEventListener("keydown",checkKey);	// Känna av om användaren trycker på tangenter för att styra bilen
		startBtn.addEventListener("click",startGame);
		stopBtn.addEventListener("click",stopGame);
	// Aktivera/inaktivera knappar
		startBtn.disabled = false;
		stopBtn.disabled = true;
	/* === Tillägg i uppgiften === */
	pigElem = document.getElementById("pig");
	boarNrElem = document.getElementById("pigNr");
	boarHitElem = document.getElementById("hitCounter");
	

} // End init
window.addEventListener("load",init);
// ------------------------------
// Kontrollera tangenter och styr bilen
function checkKey(e) {
	let k = e.keyCode;
	switch (k) {
		case 37: // Pil vänster
		case 90: // Z
			carDir--; // Bilens riktning 90 grader åt vänster
			if (carDir < 0) carDir = 3;
			carElem.src = "img/" + carImgs[carDir];
			break;
		case 39:  // Pil höger
		case 189: // -
			carDir++; // Bilens riktning 90 grader åt höger
			if (carDir > 3) carDir = 0;
			carElem.src = "img/" + carImgs[carDir];
			break;
	}
} // End checkKey
// ------------------------------
// Initiera spelet och starta bilens rörelse
function startGame() {
	startBtn.disabled = true;
	stopBtn.disabled = false;
	carElem.style.left = "0px";
	carElem.style.top = "0px";
	carDir = 1;
	carElem.src = "img/" + carImgs[carDir];
	moveCar();
	/* === Tillägg i uppgiften === */
	boarNr = 0;
	boarHit = 0;
	boarNrElem.innerText = boarNr;
	boarHitElem.innerText = boarHit;
	setTimeout(spawnBoar, 2000);
	checkCollision();
	

} // End startGame
// ------------------------------
// Stoppa spelet
function stopGame() {
	if (timerRef != null) clearTimeout(timerRef);
	startBtn.disabled = false;
	stopBtn.disabled = true;
	/* === Tillägg i uppgiften === */
	if(timerBoar != null) clearTimeout(timerBoar);
	if(timerCollision != null) clearTimeout(timerCollision);
	

} // End stopGame
// ------------------------------
// Flytta bilen ett steg framåt i bilens riktning
function moveCar() {
	let xLimit = boardElem.offsetWidth - carElem.offsetWidth;
	let yLimit = boardElem.offsetHeight - carElem.offsetHeight;
	let x = parseInt(carElem.style.left);	// x-koordinat (left) för bilen
	let y = parseInt(carElem.style.top);	// y-koordinat (top) för bilen
	switch (carDir) {
		case 0: // Uppåt
			y -= yStep;
			if (y < 0) y = 0;
			break;
		case 1: // Höger
			x += xStep;
			if (x > xLimit) x = xLimit;
			break;
		case 2: // Nedåt
			y += yStep;
			if (y > yLimit) y = yLimit;
			break;
		case 3: // Vänster
			x -= xStep;
			if (x < 0) x = 0;
			break;
	}
	carElem.style.left = x + "px";
	carElem.style.top = y + "px";
	timerRef = setTimeout(moveCar,timerStep);
	/* === Tillägg i uppgiften === */
	

} // End moveCar
// ------------------------------

/* === Tillägg av nya funktioner i uppgiften === */
// Spawnar grisar var 2000ms
function spawnBoar() {
	let xLimit = boardElem.offsetWidth - pigElem.offsetWidth;
	let yLimit = boardElem.offsetHeight - pigElem.offsetHeight;
	let x = parseInt(Math.random() * xLimit);		// x-koordinat (left) för grisen
	let y = parseInt(Math.random() * yLimit);		// y-koordinat (top) för grisen

	pigElem.style.left = x + "px";
	pigElem.style.top = y + "px";

	boarNr++;
	boarNrElem.innerText = boarNr;
	
	if(boarNr == 10) {
		setTimeout(function() {
			pigElem.style.visibility = "hidden";
			stopGame();
		}, 2000)
	} else {
		loadImage(0);
		pigElem.style.visibility = "visible";
		timerBoar = setTimeout(spawnBoar, 2000);
	}
	
}

// Kollar kollisionen mellan bilen och grisen
function checkCollision() {
	let carLeft = parseInt(carElem.style.left);			// Bilens vänsterkant
	let carTop = parseInt(carElem.style.top);			// Bilens toppkant
	let carSize = parseInt(carElem.offsetWidth);		// Bilens storlek
	let pigLeft = parseInt(pigElem.style.left);			// Grisens vänsterkant
	let pigTop = parseInt(pigElem.style.top);			// Grisens toppkant
	let pigSize = parseInt(pigElem.offsetWidth);		// Grisens storlek


	if(carTop < pigTop + pigSize &&				// Bilens top mindre än grisens botten
		carTop + carSize > pigTop &&			// Bilens botten större än grisens top
		carLeft < pigLeft + pigSize &&			// Bilens vänsterkant mindre än grisens högerkant
		carLeft + carSize > pigLeft) {			// Bilens högerkant större än grisens vänsterkant

		
		if(pigElem.getAttribute("src") === "img/pig.png") {
			boarHit++;
			boarHitElem.innerText = boarHit;
			loadImage(1);
		}
	}

	timerCollision = setTimeout(checkCollision, 500);
}


function loadImage(index) {
	let imgNames = ["pig.png", "smack.png"]
	pigElem.src = `img/${imgNames[index]}`;

}

