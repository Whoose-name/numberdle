/* ==========================================
   HACK THE SYSTEM
   NUMBERDLE GAME ENGINE
   Part 2B-1A
========================================== */

// =============================
// GAME CONFIGURATION
// =============================
if (document.getElementById("board")) {

    // All Numberdle code goes here


const ROWS = 6;
const COLS = 5;
const MAX_ATTEMPTS = 6;

let secretNumber = "";
let currentGuess = "";
let currentRow = 0;
let gameOver = false;

// =============================
// DOM ELEMENTS
// =============================

const board = document.getElementById("board");
const message = document.getElementById("message");
const attemptsLabel = document.getElementById("attempts");
const statusLabel = document.getElementById("statusText");

const keyboardButtons = document.querySelectorAll(".key");

// =============================
// INITIALIZE GAME
// =============================

window.addEventListener("load", () => {

    generateSecretNumber();

    updateAttempts();

    statusLabel.textContent = "Awaiting Input...";

    console.log("Secret:", secretNumber); // remove later

    setupKeyboard();

    startHackFeed();

});

// =============================
// RANDOM SECRET NUMBER
// =============================

function generateSecretNumber() {

    secretNumber = "";

    for (let i = 0; i < COLS; i++) {

        secretNumber += Math.floor(Math.random() * 10);

    }

}

// =============================
// UPDATE ATTEMPTS
// =============================

function updateAttempts() {

    attemptsLabel.textContent = MAX_ATTEMPTS - currentRow;

}

// =============================
// GET TILE
// =============================

function getTile(row, col) {

    return document.querySelector(
        `.tile[data-row="${row}"][data-col="${col}"]`
    );

}

// =============================
// DRAW CURRENT GUESS
// =============================

function drawGuess() {

    for (let col = 0; col < COLS; col++) {

        const tile = getTile(currentRow, col);

        tile.textContent = currentGuess[col] || "";

    }

}

// =============================
// CLEAR CURRENT ROW
// =============================

function clearRow() {

    for (let col = 0; col < COLS; col++) {

        const tile = getTile(currentRow, col);

        tile.textContent = "";

        tile.classList.remove(
            "correct",
            "present",
            "absent",
            "flip",
            "shake"
        );

    }

}

// =============================
// HACKER STATUS MESSAGES
// =============================

const hackMessages = [

    "Scanning ports...",
    "Bypassing firewall...",
    "Decrypting packets...",
    "Searching database...",
    "Injecting payload...",
    "Spoofing identity...",
    "Reading memory...",
    "Escalating privileges...",
    "Analyzing network...",
    "Compiling exploit..."

];

function randomHackMessage() {

    const index = Math.floor(Math.random() * hackMessages.length);

    message.textContent = hackMessages[index];

}

// =============================
// AUTO STATUS FEED
// =============================

let hackFeedTimer = null;

function startHackFeed() {

    randomHackMessage();

    hackFeedTimer = setInterval(() => {

        if (!gameOver) {

            randomHackMessage();

        }

    }, 3000);

}

// =============================
// SHAKE ROW
// =============================

function shakeCurrentRow() {

    for (let col = 0; col < COLS; col++) {

        const tile = getTile(currentRow, col);

        tile.classList.add("shake");

        setTimeout(() => {

            tile.classList.remove("shake");

        }, 500);

    }

}/* ==========================================
   Part 2B-2
   Input + Evaluation + Win/Lose
========================================== */

// -------------------------------
// Keyboard Setup
// -------------------------------

function setupKeyboard() {

    document.addEventListener("keydown", handlePhysicalKey);

    keyboardButtons.forEach(button => {

        button.addEventListener("click", () => {

            handleInput(button.dataset.key);

        });

    });

}

// -------------------------------
// Physical Keyboard
// -------------------------------

function handlePhysicalKey(e) {

    if (gameOver) return;

    if (/^[0-9]$/.test(e.key)) {

        handleInput(e.key);

    }
    else if (e.key === "Backspace") {

        handleInput("Backspace");

    }
    else if (e.key === "Enter") {

        handleInput("Enter");

    }

}

// -------------------------------
// Main Input Handler
// -------------------------------

function handleInput(key) {

    if (gameOver) return;

    if (/^[0-9]$/.test(key)) {

        if (currentGuess.length < COLS) {

            currentGuess += key;

            drawGuess();

        }

        return;

    }

    if (key === "Backspace") {

        currentGuess = currentGuess.slice(0, -1);

        drawGuess();

        return;

    }

    if (key === "Enter") {

        submitGuess();

    }

}

// -------------------------------
// Submit Guess
// -------------------------------

function submitGuess() {

    if (currentGuess.length !== COLS) {

        message.textContent = "Guess must contain 5 digits.";

        shakeCurrentRow();

        return;

    }

    evaluateGuess();

}

// -------------------------------
// Evaluate Guess
// -------------------------------

function evaluateGuess() {

    const answer = secretNumber.split("");
    const guess = currentGuess.split("");

    const state = new Array(COLS).fill("absent");

    // PASS 1 - Correct position

    for (let i = 0; i < COLS; i++) {

        if (guess[i] === answer[i]) {

            state[i] = "correct";

            answer[i] = null;
            guess[i] = null;

        }

    }

    // PASS 2 - Present elsewhere

    for (let i = 0; i < COLS; i++) {

        if (guess[i] === null) continue;

        const index = answer.indexOf(guess[i]);

        if (index !== -1) {

            state[i] = "present";

            answer[index] = null;

        }

    }

    // Apply Colors

    for (let i = 0; i < COLS; i++) {

        const tile = getTile(currentRow, i);

        tile.classList.add("flip");

        setTimeout(() => {

            tile.classList.add(state[i]);

        }, i * 200);

    }

    // Check Win

    if (state.every(c => c === "correct")) {

        setTimeout(playerWon, 1200);

        return;

    }

    currentRow++;

    updateAttempts();

    currentGuess = "";

    if (currentRow >= MAX_ATTEMPTS) {

        setTimeout(playerLost, 1200);

        return;

    }

}

// -------------------------------
// Random Access Code
// -------------------------------

function generateAccessCode() {

    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let code = "";

    for (let i = 0; i < 6; i++) {

        code += chars[Math.floor(Math.random() * chars.length)];

    }

    return code;

}

// -------------------------------
// Player Won
// -------------------------------

function playerWon() {

    gameOver = true;

    clearInterval(hackFeedTimer);

    statusLabel.textContent = "ACCESS GRANTED";

    message.textContent =
        "Generating Security Token...";

    const code = generateAccessCode();

    localStorage.setItem("accessCode", code);

    document.getElementById("generatedCode")
        .textContent = code;

    document
        .getElementById("winOverlay")
        .classList.remove("hidden");

}

// -------------------------------
// Player Lost
// -------------------------------

function playerLost() {

    gameOver = true;

    clearInterval(hackFeedTimer);

    statusLabel.textContent = "ACCESS DENIED";

    message.textContent =
        "Firewall blocked the intrusion.";

    document
        .getElementById("loseOverlay")
        .classList.remove("hidden");

}

// -------------------------------
// Continue
// -------------------------------

const continueBtn =
document.getElementById("continueBtn");

if (continueBtn) {

    continueBtn.addEventListener("click", () => {

        window.location = "verify.html";

    });

}

// -------------------------------
// Restart
// -------------------------------

const restartBtn =
document.getElementById("restartBtn");

if (restartBtn) {

    restartBtn.addEventListener("click", () => {

        localStorage.removeItem("accessCode");

        location.reload();

    });

}}
/*==================================================
PART 3B-1
VERIFY PAGE LOGIC
==================================================*/
if (document.getElementById("codeInput")) {

// Only run this code on verify.html
if (window.location.pathname.includes("verify.html")) {

    const codeInput = document.getElementById("codeInput");
    const verifyBtn = document.getElementById("verifyBtn");
    const verifyMessage = document.getElementById("verifyMessage");

    const loadingOverlay =
        document.getElementById("loadingOverlay");

    const errorOverlay =
        document.getElementById("errorOverlay");

    const tryAgainBtn =
        document.getElementById("tryAgainBtn");

    // Read stored access code
    const storedCode =
        localStorage.getItem("accessCode");

    // If no code exists, return to game
    if (!storedCode) {

        verifyMessage.textContent =
            "No security token found.";

        setTimeout(() => {

            window.location.href = "numberdle.html";

        }, 2000);

    }

    // Verify button
    verifyBtn.addEventListener("click", verifyCode);

    // Allow Enter key
    codeInput.addEventListener("keydown", (e) => {

        if (e.key === "Enter") {

            verifyCode();

        }

    });

    // Close error popup
    tryAgainBtn.addEventListener("click", () => {

        errorOverlay.classList.add("hidden");

        codeInput.value = "";

        codeInput.focus();

    });

    function verifyCode() {

        const entered =
            codeInput.value.trim().toUpperCase();

        if (entered.length !== 6) {

            verifyMessage.textContent =
                "Security token must contain 6 characters.";

            return;

        }

        if (entered === storedCode) {

            verifyMessage.textContent =
                "Token accepted.";

            loadingOverlay.classList.remove("hidden");

            startDecryptSequence();

        }
        else {

            verifyMessage.textContent =
                "Invalid security token.";

            errorOverlay.classList.remove("hidden");

        }

    }

}/*==================================================
PART 3B-2
Decrypt Animation + Redirect
==================================================*/

function startDecryptSequence() {

    const loadingText =
        document.getElementById("loadingText");

    const steps = [

        "Decrypting security token...",
        "Bypassing firewall...",
        "Establishing secure tunnel...",
        "Escalating privileges...",
        "Accessing mainframe...",
        "Disabling intrusion detection...",
        "Authenticating...",
        "Access Granted."

    ];

    let index = 0;

    loadingText.textContent = steps[0];

    const timer = setInterval(() => {

        index++;

        if (index >= steps.length) {

            clearInterval(timer);

            localStorage.setItem(
                "verified",
                "true"
            );

            setTimeout(() => {

                window.location.href =
                    "success.html";

            }, 700);

            return;

        }

        loadingText.textContent =
            steps[index];

    }, 1000);

}

/*==========================================
Optional Matrix Animation
==========================================*/

(function(){

    const canvas = document.getElementById("matrix");

    if(!canvas) return;

    const ctx = canvas.getContext("2d");

    function resize(){

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

    }

    resize();

    window.addEventListener("resize",resize);

    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

    const size = 18;

    const cols = () =>
        Math.floor(canvas.width/size);

    let drops = [];

    function resetDrops(){

        drops = [];

        for(let i=0;i<cols();i++)
            drops[i]=1;

    }

    resetDrops();

    function draw(){

        ctx.fillStyle="rgba(0,0,0,.07)";
        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        ctx.fillStyle="#00ff66";
        ctx.font=size+"px monospace";

        for(let i=0;i<drops.length;i++){

            const ch =
                chars[
                    Math.floor(
                        Math.random()*chars.length
                    )
                ];

            ctx.fillText(
                ch,
                i*size,
                drops[i]*size
            );

            if(
                drops[i]*size >
                canvas.height &&
                Math.random()>.975
            ){

                drops[i]=0;

            }

            drops[i]++;

        }

    }

    setInterval(draw,40);

})();}
/*==================================================
PART 4B-1
SUCCESS PAGE LOGIC
==================================================*/
if (document.getElementById("terminalOutput")) {

if (window.location.pathname.includes("success.html")) {

    // -----------------------------------
    // Security Check
    // -----------------------------------

    if (localStorage.getItem("verified") !== "true") {

        window.location.href = "index.html";

    }

    const terminal =
        document.getElementById("terminalOutput");

    const successPanel =
        document.getElementById("successPanel");

    const overlay =
        document.getElementById("celebrationOverlay");

    // -----------------------------------
    // Fake Hacking Sequence
    // -----------------------------------

    const lines = [

        "[ OK ] Connection established",
        "[ OK ] Firewall bypassed",
        "[ OK ] Injecting payload",
        "[ OK ] Escalating privileges",
        "[ OK ] Reading encrypted data",
        "[ OK ] Decrypting...",
        "[ OK ] Root access granted",
        "[ OK ] Mission completed"

    ];

    let currentLine = 0;

    function typeLine(text, callback) {

        const p = document.createElement("p");

        terminal.appendChild(p);

        let i = 0;

        const timer = setInterval(() => {

            p.textContent = text.substring(0, i);

            i++;

            if (i > text.length) {

                clearInterval(timer);

                if (callback) {

                    setTimeout(callback, 350);

                }

            }

        }, 35);

    }

    function nextLine() {

        if (currentLine >= lines.length) {

            finishMission();

            return;

        }

        typeLine(lines[currentLine], () => {

            currentLine++;

            nextLine();

        });

    }

    // -----------------------------------
    // Final Reveal
    // -----------------------------------

    function finishMission() {

        setTimeout(() => {

            successPanel.classList.remove("hidden");

            overlay.classList.remove("hidden");

            setTimeout(() => {

                overlay.classList.add("hidden");

            }, 2200);

        }, 800);

    }

    // Start animation

    nextLine();

}}