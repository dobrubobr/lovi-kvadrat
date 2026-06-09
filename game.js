function getRandomPosition() {
    const maxX = fieldWidth - squareCurrentSize;
    const maxY = fieldHeight - squareCurrentSize;
    return { x: Math.floor(Math.random() * (maxX + 1)), y: Math.floor(Math.random() * (maxY + 1)) };
}

function moveSquareRandom() {
    if (!gameActive) return;
    const { x, y } = getRandomPosition();
    const square = document.getElementById('square');
    square.style.left = x + 'px';
    square.style.top = y + 'px';
}

function flashSquare() {
    const square = document.getElementById('square');
    square.classList.add('flash');
    setTimeout(() => square.classList.remove('flash'), 120);
}

function activateCombo() {
    if (comboActive) return;
    comboActive = true;
    comboActivationsThisGame++;
    const comboBox = document.getElementById('comboBox');
    comboBox.style.display = 'block';
    if (comboTimer) clearTimeout(comboTimer);
    comboTimer = setTimeout(() => {
        comboActive = false;
        comboBox.style.display = 'none';
    }, 3000);
}

function resetCombo() {
    comboCounter = 0;
    if (comboActive) {
        comboActive = false;
        document.getElementById('comboBox').style.display = 'none';
        if (comboTimer) clearTimeout(comboTimer);
    }
}

function addScore(points) {
    let finalPoints = comboActive ? points * 2 : points;
    score += finalPoints;
    stats.totalScore += finalPoints;
    document.getElementById('scoreValue').innerText = score;
}

function onSquareClick(e) {
    e.stopPropagation();
    if (!gameActive) return;
    comboCounter++;
    if (comboCounter >= 3) activateCombo();
    addScore(1);
    stats.totalClicks++;
    flashSquare();
    if (currentMode === 'boss') {
        squareCurrentSize = Math.max(20, squareCurrentSize - 3);
        const square = document.getElementById('square');
        square.style.width = squareCurrentSize + 'px';
        square.style.height = squareCurrentSize + 'px';
        document.getElementById('modeStatus').innerHTML = `👾 Размер: ${squareCurrentSize}px`;
    }
    moveSquareRandom();
}

function onFieldClick(e) {
    if (!gameActive) return;
    if (e.target === document.getElementById('square')) return;
    if (currentMode === 'endless') {
        missedCount++;
        const modeStatus = document.getElementById('modeStatus');
        modeStatus.innerHTML = `❌ Промахов: ${missedCount}/3`;
        if (missedCount >= 3) endGame();
        else {
            modeStatus.style.background = "#ffcdd2";
            setTimeout(() => { if (gameActive) modeStatus.style.background = "#e8f5e9"; }, 300);
        }
    }
    resetCombo();
}

function endGame() {
    if (!gameActive) return;
    gameActive = false;
    if (countdownInterval) clearInterval(countdownInterval);
    if (jumpInterval) clearInterval(jumpInterval);
    stats.totalGames++;
    document.getElementById('finalScore').innerText = score;
    const recordMessageDiv = document.getElementById('recordMessage');
    if (currentMode === 'classic') {
        const oldRecord = records[currentLevelIdx] || 0;
        if (score > oldRecord) {
            records[currentLevelIdx] = score;
            recordMessageDiv.innerHTML = '🎉 НОВЫЙ РЕКОРД! 🎉<br> Ты молодец! ✨';
            recordMessageDiv.style.background = "#dcfce7";
        } else {
            recordMessageDiv.innerHTML = `🏆 Рекорд уровня: ${oldRecord}`;
            recordMessageDiv.style.background = "#fef9c3";
        }
        updateTopScores(currentLevelIdx, score);
        if (currentLevelIdx === 4) stats.expertWins++;
    } else {
        recordMessageDiv.innerHTML = `🎮 ${getModeName()} — ${score} очков!`;
        recordMessageDiv.style.background = "#e3f2fd";
    }
    checkAchievements();
    saveAllData();
    updateRecordDisplay();
    updateStatsUI();
    updateAchievementsUI();
    updateLeaderboardUI();
    const otherLevelsDiv = document.getElementById('otherLevelsButtons');
    otherLevelsDiv.innerHTML = '';
    for (let i = 0; i < LEVELS.length; i++) {
        if (i === currentLevelIdx) continue;
        const btn = document.createElement('button');
        btn.textContent = LEVELS[i].name;
        btn.style.backgroundColor = LEVELS[i].color;
        btn.addEventListener('click', () => {
            document.getElementById('modalOverlay').style.display = 'none';
            currentLevelIdx = i;
            highlightSelectedLevel();
            startGameWithCurrentSettings();
        });
        otherLevelsDiv.appendChild(btn);
    }
    document.getElementById('modalOverlay').style.display = 'flex';
}

function getModeName() {
    const modes = { classic: 'Классика', endless: 'Бесконечный', boss: 'Босс', multiplayer: 'Мультиплеер' };
    return modes[currentMode] || 'Классика';
}

function startGameMechanics() {
    if (countdownInterval) clearInterval(countdownInterval);
    if (jumpInterval) clearInterval(jumpInterval);
    const timerSpan = document.getElementById('timerValue');
    if (currentMode === 'endless') {
        timerSpan.innerText = '∞';
        jumpInterval = setInterval(() => { if (gameActive) moveSquareRandom(); }, LEVELS[currentLevelIdx].jumpSec * 1000);
        return;
    }
    timeLeft = currentMode === 'multiplayer' ? 30 : LEVELS[currentLevelIdx].timeSec;
    timerSpan.innerText = timeLeft;
    countdownInterval = setInterval(() => {
        if (!gameActive) return;
        if (timeLeft <= 1) {
            clearInterval(countdownInterval);
            clearInterval(jumpInterval);
            endGame();
        } else {
            timeLeft--;
            timerSpan.innerText = timeLeft;
        }
    }, 1000);
    jumpInterval = setInterval(() => { if (gameActive) moveSquareRandom(); }, LEVELS[currentLevelIdx].jumpSec * 1000);
}

function startGameWithCurrentSettings() {
    if (gameActive) {
        if (countdownInterval) clearInterval(countdownInterval);
        if (jumpInterval) clearInterval(jumpInterval);
        gameActive = false;
    }
    missedCount = 0;
    squareCurrentSize = DEFAULT_SQUARE_SIZE;
    comboCounter = 0;
    comboActive = false;
    comboActivationsThisGame = 0;
    document.getElementById('comboBox').style.display = 'none';
    if (comboTimer) clearTimeout(comboTimer);
    score = 0;
    document.getElementById('scoreValue').innerText = '0';
    const square = document.getElementById('square');
    square.style.width = '50px';
    square.style.height = '50px';
    square.style.backgroundColor = currentSquareColor;
    const { x, y } = getRandomPosition();
    square.style.left = x + 'px';
    square.style.top = y + 'px';
    document.getElementById('menuCard').style.display = 'none';
    document.getElementById('modalOverlay').style.display = 'none';
    document.getElementById('gameArea').style.display = 'block';
    const modeStatus = document.getElementById('modeStatus');
    if (currentMode === 'endless') {
        modeStatus.innerHTML = '♾️ Бесконечный | Промахов: 0/3';
        modeStatus.style.display = 'block';
    } else if (currentMode === 'boss') {
        modeStatus.innerHTML = '👾 Босс | Размер: 50px';
        modeStatus.style.display = 'block';
    } else if (currentMode === 'multiplayer') {
        modeStatus.innerHTML = '👥 Мультиплеер | 30 секунд!';
        modeStatus.style.display = 'block';
    } else {
        modeStatus.style.display = 'none';
    }
    gameActive = true;
    startGameMechanics();
}

function exitToMainMenu() {
    if (gameActive) {
        if (countdownInterval) clearInterval(countdownInterval);
        if (jumpInterval) clearInterval(jumpInterval);
        gameActive = false;
    }
    document.getElementById('gameArea').style.display = 'none';
    document.getElementById('modalOverlay').style.display = 'none';
    document.getElementById('menuCard').style.display = 'block';
    updateRecordDisplay();
    document.body.style.backgroundColor = LEVELS[currentLevelIdx].color;
    currentMode = 'classic';
}