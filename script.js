let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let scores = { X: 0, O: 0, draw: 0 };

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6] 
];

function initGame() {
    updateScoreDisplay();
    updateCurrentPlayer();
    attachEventListeners();
}

function attachEventListeners() {
    const cells = document.querySelectorAll('.game-cell');
    cells.forEach(cell => {
        cell.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            makeMove(index);
        });
    });

    const resetButton = document.getElementById('resetButton');
    const playAgainButton = document.getElementById('playAgainButton');
    
    if (resetButton) {
        resetButton.addEventListener('click', resetGameCompletely);
    }
    
    if (playAgainButton) {
        playAgainButton.addEventListener('click', resetGame);
    }
}

function makeMove(cellIndex) {
    if (board[cellIndex] !== '' || !gameActive) {
        return;
    }

    board[cellIndex] = currentPlayer;
    
    const cell = document.querySelectorAll('.game-cell')[cellIndex];
    cell.textContent = currentPlayer;
    cell.disabled = true;

    cell.style.transform = 'scale(1.1)';
    setTimeout(() => {
        cell.style.transform = 'scale(1)';
    }, 150);

    if (checkWin()) {
        gameActive = false;
        highlightWinningCells();
        scores[currentPlayer]++;
        updateScoreDisplay();
        setTimeout(() => showModal(`Player ${currentPlayer} Wins!`, 'Congratulations! 🎉', 'fas fa-trophy'), 500);
    } else if (checkDraw()) {
        gameActive = false;
        scores.draw++;
        updateScoreDisplay();
        setTimeout(() => showModal("It's a Draw!", 'Well played both! 🤝', 'fas fa-handshake'), 500);
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateCurrentPlayer();
    }
}

function checkWin() {
    return winningConditions.some(condition => {
        const [a, b, c] = condition;
        return board[a] && board[a] === board[b] && board[a] === board[c];
    });
}

function checkDraw() {
    return board.every(cell => cell !== '');
}

function highlightWinningCells() {
    winningConditions.forEach(condition => {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            const cells = document.querySelectorAll('.game-cell');
            cells[a].classList.add('winning-cell');
            cells[b].classList.add('winning-cell');
            cells[c].classList.add('winning-cell');
        }
    });
}

function showModal(title, subtitle, icon) {
    document.getElementById('modalMessage').textContent = title;
    document.getElementById('modalSubtext').textContent = subtitle;
    document.getElementById('modalIcon').className = `winner-icon ${icon}`;
    
    const modal = new bootstrap.Modal(document.getElementById('gameModal'));
    modal.show();
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    
    const cells = document.querySelectorAll('.game-cell');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.disabled = false;
        cell.classList.remove('winning-cell');
    });
    
    updateCurrentPlayer();
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('gameModal'));
    if (modal) {
        modal.hide();
    }
}

function resetGameCompletely() {
    scores = { X: 0, O: 0, draw: 0 };
    updateScoreDisplay();
    
    resetGame();
}

function updateCurrentPlayer() {
    document.getElementById('currentPlayer').textContent = currentPlayer;
}

function updateScoreDisplay() {
    document.getElementById('scoreX').textContent = scores.X;
    document.getElementById('scoreO').textContent = scores.O;
    document.getElementById('scoreDraw').textContent = scores.draw;
}

document.addEventListener('DOMContentLoaded', initGame);