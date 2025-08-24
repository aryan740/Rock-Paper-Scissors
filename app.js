let userScore = 0;
let computerScore = 0;
let isGameOver = false;
let streak = 0;

// DOM elements
const choices = document.querySelectorAll('.choice');
const msg = document.querySelector('#message');
const userScorePara = document.querySelector('#userScore');
const computerScorePara = document.querySelector('#computerScore');
const resetButton = document.querySelector('#reset-btn');
const gameLog = document.querySelector('#game-log');
const scoreLimitInput = document.querySelector('#score-limit');
const themeSwitcher = document.querySelector('#theme-switcher');
const streakDisplay = document.querySelector('#streak');

// Sound elements
const selectSound = document.querySelector('#select-sound');
const winSound = document.querySelector('#win-sound');
const loseSound = document.querySelector('#lose-sound');

// Generate computer's choice
const genCompChoice = () => {
    const options = ['rock', 'paper', 'scissors'];
    return options[Math.floor(Math.random() * 3)];
};

// Add a game round to the log
const updateGameLog = (userChoice, computerChoice, result) => {
    const li = document.createElement('li');
    li.classList.add(result);
    li.innerHTML = `You chose <strong>${userChoice}</strong>, Computer chose <strong>${computerChoice}</strong>.
                    <span>${result.toUpperCase()}!</span>`;
    gameLog.prepend(li);
    if (gameLog.children.length > 10) gameLog.lastElementChild.remove();
};

// Handle a draw
const drawGame = (userChoice, computerChoice) => {
    msg.innerText = "It's a draw!";
    msg.style.backgroundColor = "gray";
    updateGameLog(userChoice, computerChoice, 'draw');
    streak = 0; // reset streak
    streakDisplay.innerText = streak;
};

// Show the winner and update scores
const showWinner = (userWin, userChoice, computerChoice) => {
    const userChoiceElement = document.querySelector(`#${userChoice}`);
    const computerChoiceElement = document.querySelector(`#${computerChoice}`);

    // Highlight computer choice
    computerChoiceElement.classList.add('animate-pulse');
    setTimeout(() => computerChoiceElement.classList.remove('animate-pulse'), 600);

    if (userWin) {
        userScore++;
        userScorePara.innerText = userScore;
        msg.innerText = `You win! Your ${userChoice} beats ${computerChoice}.`;
        msg.style.backgroundColor = "green";
        userChoiceElement.classList.add('win-glow');
        winSound.play();
        updateGameLog(userChoice, computerChoice, 'win');
        streak++;
    } else {
        computerScore++;
        computerScorePara.innerText = computerScore;
        msg.innerText = `You lose! Computer's ${computerChoice} beats your ${userChoice}.`;
        msg.style.backgroundColor = "red";
        userChoiceElement.classList.add('lose-glow');
        loseSound.play();
        updateGameLog(userChoice, computerChoice, 'lose');
        streak = 0; // reset streak
    }

    streakDisplay.innerText = streak;
    checkGameStatus();
};

// Check if a player has reached the score limit
const checkGameStatus = () => {
    const scoreLimit = parseInt(scoreLimitInput.value, 10);
    if (userScore >= scoreLimit) {
        msg.innerText = `🏆 You are the final winner! 🏆`;
        msg.style.backgroundColor = 'gold';
        msg.style.color = '#333';
        isGameOver = true;
    } else if (computerScore >= scoreLimit) {
        msg.innerText = `🤖 The computer wins the match! 🤖`;
        msg.style.backgroundColor = 'red';
        isGameOver = true;
    }

    if (isGameOver) {
        choices.forEach(choice => choice.style.pointerEvents = 'none');
    }
};

// Main game logic
const playGame = (userChoice) => {
    if (isGameOver) return;

    selectSound.currentTime = 0;
    selectSound.play();
    choices.forEach(choice => choice.classList.remove('win-glow', 'lose-glow'));
    const computerChoice = genCompChoice();

    choices.forEach(otherChoice => {
        if (otherChoice.id !== userChoice) {
            otherChoice.classList.add('animate-spin');
        }
    });

    setTimeout(() => {
        choices.forEach(choice => choice.classList.remove('animate-spin'));

        if (userChoice === computerChoice) {
            drawGame(userChoice, computerChoice);
        } else {
            let userWin = false;
            if (userChoice === 'rock') userWin = computerChoice === 'scissors';
            else if (userChoice === 'paper') userWin = computerChoice === 'rock';
            else userWin = computerChoice === 'paper';
            showWinner(userWin, userChoice, computerChoice);
        }
    }, 1000);
};

// Reset the game
const resetGame = () => {
    userScore = 0;
    computerScore = 0;
    isGameOver = false;
    streak = 0;
    userScorePara.innerText = userScore;
    computerScorePara.innerText = computerScore;
    streakDisplay.innerText = streak;
    msg.innerText = 'Make your move!';
    msg.style.backgroundColor = '#081b31';
    msg.style.color = 'white';
    gameLog.innerHTML = '';
    choices.forEach(choice => {
        choice.classList.remove('win-glow', 'lose-glow', 'animate-spin');
        choice.style.pointerEvents = 'auto';
    });
};

// Theme switcher logic
const toggleTheme = () => {
    document.body.classList.toggle('dark-mode');
};

// Event listeners
choices.forEach((choice) => {
    choice.addEventListener('click', () => {
        const userChoice = choice.getAttribute('id');
        playGame(userChoice);
    });
});
resetButton.addEventListener('click', resetGame);
themeSwitcher.addEventListener('click', toggleTheme);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === '1') playGame('rock');
    if (e.key === '2') playGame('paper');
    if (e.key === '3') playGame('scissors');
    if (e.key.toLowerCase() === 'r') resetGame();
    if (e.key.toLowerCase() === 't') toggleTheme();
});
