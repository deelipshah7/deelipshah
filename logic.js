let gameBoard = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let moves = 0;
let gameMode = null;
let player1Score = 0;
let player2Score = 0;
let tieScore = 0;
let aiDifficulty = 'hard'; // Can be 'easy', 'medium', or 'hard'

const grid = document.getElementById("grid");
const status = document.getElementById("status");
const replayButton = document.getElementById("replayBtn");
const resetButton = document.getElementById("resetBtn");
const playWithAiButton = document.getElementById("playWithAiBtn");
const playWithPlayerButton = document.getElementById("playWithPlayerBtn");
const player1ScoreElement = document.getElementById("player1Score");
const player2ScoreElement = document.getElementById("player2Score");
const tieScoreElement = document.getElementById("tieScore");

// Initialize the game
function initBoard() {
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    moves = 0;
    status.textContent = `Player ${currentPlayer}'s turn`;
    grid.innerHTML = "";
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.setAttribute("data-index", i);
        grid.appendChild(cell);
        cell.addEventListener("click", handleCellClick);
    }
    replayButton.style.display = "none";
    resetButton.style.display = "inline-block";
}

// Handle a player's click
function handleCellClick(e) {
    if (!gameActive || e.target.textContent !== "") return;

    const index = e.target.getAttribute("data-index");
    gameBoard[index] = currentPlayer;
    e.target.textContent = currentPlayer;
    moves++;

    checkWinner();
    if (gameMode === "AI" && currentPlayer === "X") {
        setTimeout(aiMove, 500); // AI thinking time of 0.5s
    } else {
        switchPlayer();
    }
}

// Switch to the next player
function switchPlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    status.textContent = `Player ${currentPlayer}'s turn`;
}

// Check the winner
function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Columns
        [0, 4, 8], [2, 4, 6]              // Diagonals
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            gameActive = false;
            highlightWinningCombination(pattern);
            updateScore(currentPlayer);
            status.textContent = `Player ${currentPlayer} wins!`;
            return;
        }
    }

    if (moves === 9) {
        gameActive = false;
        tieGame();
    }
}

// Highlight the winning combination
function highlightWinningCombination(pattern) {
    pattern.forEach(index => {
        document.querySelectorAll(".cell")[index].classList.add("highlight");
    });
}

// Update the score based on the winner
function updateScore(winner) {
    if (winner === "X") {
        player1Score++;
        player1ScoreElement.textContent = `Player 1: ${player1Score}`;
    } else if (winner === "O") {
        player2Score++;
        player2ScoreElement.textContent = `Player 2: ${player2Score}`;
    }
}

// Handle a tie game
function tieGame() {
    tieScore++;
    tieScoreElement.textContent = `Tie: ${tieScore}`;
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => cell.classList.add("blink"));
    setTimeout(() => {
        cells.forEach(cell => cell.classList.remove("blink"));
        resetGame();
    }, 1000);
}

// Reset the game
function resetGame() {
    gameActive = true;
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    moves = 0;
    status.textContent = `Player ${currentPlayer}'s turn`;
    document.querySelectorAll(".cell").forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("highlight");
    });
}

// AI move logic
function aiMove() {
    let availableMoves = [];
    for (let i = 0; i < gameBoard.length; i++) {
        if (!gameBoard[i]) {
            availableMoves.push(i);
        }
    }

    const randomIndex = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    gameBoard[randomIndex] = "O";
    document.querySelectorAll(".cell")[randomIndex].textContent = "O";
    moves++;

    checkWinner();
    switchPlayer();
}

// Event listeners for game mode selection
playWithAiButton.addEventListener("click", () => {
    gameMode = "AI";
    initBoard();
    resetButton.style.display = "inline-block";
});

playWithPlayerButton.addEventListener("click", () => {
    gameMode = "Player";
    initBoard();
    resetButton.style.display = "inline-block";
});

resetButton.addEventListener("click", initBoard);
replayButton.addEventListener("click", initBoard);

// Initialize the game
initBoard();
