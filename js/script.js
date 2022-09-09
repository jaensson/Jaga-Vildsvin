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
let pigNrElem;				// Referens till vildsvin 
let pigHitElem;				// Referens till antal träffar
let pigNr;					// Antal vildsvin
let pigHit;					// Antal vildsvin använderen träffat
let timerPig = null;		// Timer till nästa gris
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
	pigNrElem = document.getElementById("pigNr");
	pigHitElem = document.getElementById("hitCounter");
	

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
	pigNr = 0;
	pigHit = 0;
	pigNrElem.innerText = pigNr;
	pigHitElem.innerText = pigHit;
	setTimeout(spawnPig, 2000);
	checkCollision();
	

} // End startGame
// ------------------------------
// Stoppa spelet
function stopGame() {
	if (timerRef != null) clearTimeout(timerRef);
	startBtn.disabled = false;
	stopBtn.disabled = true;
	/* === Tillägg i uppgiften === */
	if(timerPig != null) clearTimeout(timerPig);
	if(timerCollision != null) clearTimeout(timerCollision);
	

} // End stopGame
// ------------------------------
// Flytta bilen ett steg framåt i bilens riktning
function moveCar() {
	let xLimit = boardElem.offsetWidth - carElem.offsetWidth;
	let yLimit = boardElem.offsetHeight - carElem.offsetHeight;
	let x = parseInt(carElem.style.left);		// x-koordinat (left) för bilen
	let y = parseInt(carElem.style.top);		// y-koordinat (top) för bilen
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
/**
 * Skapar en gris var 2000ms
 */
function spawnPig() {
	let xLimit = boardElem.offsetWidth - pigElem.offsetWidth;
	let yLimit = boardElem.offsetHeight - pigElem.offsetHeight;
	let x = parseInt(Math.random() * xLimit);		// x-koordinat (left) för grisen
	let y = parseInt(Math.random() * yLimit);		// y-koordinat (top) för grisen

	pigElem.style.left = x + "px";
	pigElem.style.top = y + "px";

	pigNr++;
	pigNrElem.innerText = pigNr;
	pigElem.src = "img/pig.png"
	
	if(pigNr == 10) {
		setTimeout(function() {
			pigElem.style.visibility = "hidden";
			stopGame();
		}, 2000)
	} else {
		pigElem.style.visibility = "visible";
		timerPig = setTimeout(spawnPig, 2000);
	}
}

/**
 * Om bilen och grisen kolliderar visas en smäll
 */
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
			pigHit++;
			pigHitElem.innerText = pigHit;
			pigElem.src = "img/smack.png";
		}
	}

	timerCollision = setTimeout(checkCollision, 250);
}