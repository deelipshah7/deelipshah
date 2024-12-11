// Adjust AI difficulty based on rounds and give the user a chance to win occasionally
function adjustAIDifficulty() {
    if (player1Score + player2Score % 2 === 0) {
        aiDifficulty = 'easy'; // Make the AI easier in alternating rounds
    } else {
        aiDifficulty = 'hard'; // Make the AI harder in other rounds
    }
}

// AI Move Logic (Enhanced for AI Difficulty)
function aiMove() {
    let availableMoves = [];
    for (let i = 0; i < gameBoard.length; i++) {
        if (!gameBoard[i]) {
            availableMoves.push(i);
        }
    }

    let aiChoice;
    if (aiDifficulty === 'hard') {
        aiChoice = bestMoveForAI();
    } else if (aiDifficulty === 'medium') {
        aiChoice = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    } else {
        aiChoice = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    gameBoard[aiChoice] = "O";
    document.querySelectorAll(".cell")[aiChoice].textContent = "O";
    moves++;

    checkWinner();
    switchPlayer();
}

// Helper function to simulate AI choosing the best move (hard AI)
function bestMoveForAI() {
    let availableMoves = [];
    for (let i = 0; i < gameBoard.length; i++) {
        if (!gameBoard[i]) {
            availableMoves.push(i);
        }
    }

    // Implement logic to block winning moves, or choose the best strategic move
    // For simplicity, this is left for you to enhance further
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}
