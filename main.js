const startScreen = document.getElementById('startScreen');
        const gameScreen = document.getElementById('gameScreen');
        const playerNameInput = document.getElementById('playerName');
        const timeLimitInput = document.getElementById('timeLimit');
        const startBtn = document.getElementById('startBtn');
        const displayName = document.getElementById('displayName');
        const scoreDisplay = document.getElementById('score');
        const timerDisplay = document.getElementById('timer');
        const message = document.getElementById('message');
        const gameGrid = document.getElementById('gameGrid');
        const restartBtn = document.getElementById('restartBtn');
        const exitBtn = document.getElementById('exitBtn');

        const colors = [
            '#e74c3c', // red
            '#8e44ad', // purple
            '#3498db', // blue
            '#27ae60', // green
            '#f39c12', // yellow
            '#d35400', // orange
            '#2c3e50', // dark blue
            '#c0392b'  // dark red
        ];

        let cards = [];
        let flippedCards = [];
        let matchedCount = 0;
        let score = 0;
        let timeLeft = 60;
        let timerId = null;
        let canFlip = true;

        function validateStartInput() {
            const nameFilled = playerNameInput.value.trim().length > 0;
            const timeVal = timeLimitInput.value.trim();
            // Check if timeVal is a number and within range
            const timeNum = Number(timeVal);
            const timeValid = !isNaN(timeNum) && timeNum >= 10 && timeNum <= 300;
            startBtn.disabled = !(nameFilled && timeValid);
        }

        playerNameInput.addEventListener('input', validateStartInput);
        timeLimitInput.addEventListener('input', validateStartInput);

        function shuffle(array) {
            let currentIndex = array.length, temporaryValue, randomIndex;
            while (currentIndex !== 0) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }
            return array;
        }

        function createCards() {
            const doubles = colors.concat(colors);
            const shuffled = shuffle(doubles);
            gameGrid.innerHTML = '';
            cards = [];
            shuffled.forEach((color) => {
                const card = document.createElement('div');
                card.classList.add('card');
                card.dataset.color = color;
                card.innerHTML = `
                    <div class="card-inner">
                        <div class="card-front">?</div>
                        <div class="card-back" style="--color: ${color}; --color-glow: ${color}cc;"></div>
                    </div>
                `;
                card.addEventListener('click', () => {
                    if (!canFlip || card.classList.contains('flipped') || card.classList.contains('matched')) return;
                    flipCard(card);
                });
                gameGrid.appendChild(card);
                cards.push(card);
            });
        }

        function flipCard(card) {
            if (flippedCards.length === 2) return;
            card.classList.add('flipped');
            flippedCards.push(card);
            if (flippedCards.length === 2) {
                canFlip = false;
                checkMatch();
            }
        }

        function checkMatch() {
            const [first, second] = flippedCards;
            if (first.dataset.color === second.dataset.color) {
                first.classList.add('matched');
                second.classList.add('matched');
                score += 10;
                matchedCount += 2;
                flippedCards = [];
                message.textContent = 'Great! You found a match!';
                message.className = 'message win';
                canFlip = true;
                if (matchedCount === cards.length) {
                    endGame(true);
                }
            } else {
                score -= 3;
                if(score < 0) score = 0;
                message.textContent = 'Try Again!';
                message.className = 'message lose';
                setTimeout(() => {
                    flippedCards.forEach(card => card.classList.remove('flipped'));
                    flippedCards = [];
                    message.textContent = '';
                    canFlip = true;
                }, 1200);
            }
            updateScore();
        }

        function updateScore() {
            scoreDisplay.textContent = score;
        }

        function startTimer() {
            timerId = setInterval(() => {
                timeLeft--;
                timerDisplay.textContent = timeLeft;
                if (timeLeft <= 0) {
                    endGame(false);
                }
            }, 1000);
        }

        function endGame(won) {
            canFlip = false;
            clearInterval(timerId);
            if (won) {
                message.textContent = `Congratulations, ${playerNameInput.value.trim()}! You won with a score of ${score}.`;
                message.className = 'message win';
            } else {
                message.textContent = `Better luck next time, ${playerNameInput.value.trim()}!`;
                message.className = 'message lose';
            }
        }

        function restartGame() {
            clearInterval(timerId);
            flippedCards = [];
            matchedCount = 0;
            score = 0;
            timeLeft = Number(timeLimitInput.value) || 60;
            message.textContent = '';
            canFlip = true;
            updateScore();
            timerDisplay.textContent = timeLeft;
            createCards();
            startTimer();
        }

        function exitGame() {
            clearInterval(timerId);
            flippedCards = [];
            matchedCount = 0;
            score = 0;
            canFlip = false;
            message.textContent = '';
            startScreen.style.display = 'flex';
            gameScreen.style.display = 'none';
            playerNameInput.value = '';
            timeLimitInput.value = '';
            startBtn.disabled = true;
        }

        startBtn.addEventListener('click', () => {
            if (startBtn.disabled) return;
            displayName.textContent = `Player: ${playerNameInput.value.trim()}`;
            startScreen.style.display = 'none';
            gameScreen.style.display = 'block';
            timeLeft = Number(timeLimitInput.value) || 60;
            timerDisplay.textContent = timeLeft;
            score = 0;
            updateScore();
            createCards();
            startTimer();
        });

        restartBtn.addEventListener('click', () => {
            restartGame();
        });

        exitBtn.addEventListener('click', () => {
            exitGame();
        });

        // Initialize validation on load
        validateStartInput();