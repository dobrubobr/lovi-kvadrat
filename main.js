function highlightSelectedLevel() {
    document.querySelectorAll('.level-btn').forEach((btn, idx) => {
        if (idx == currentLevelIdx) btn.classList.add('active-level');
        else btn.classList.remove('active-level');
    });
    updateRecordDisplay();
    document.body.style.backgroundColor = LEVELS[currentLevelIdx].color;
}

function setupLevelButtons() {
    document.querySelectorAll('.level-btn').forEach((btn, idx) => {
        btn.addEventListener('click', () => {
            currentLevelIdx = idx;
            highlightSelectedLevel();
        });
    });
}

function setupModes() {
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentMode = btn.dataset.mode;
            const modeInfo = document.getElementById('modeInfo');
            if (currentMode === 'endless') modeInfo.innerHTML = '♾️ Бесконечный режим: 3 промаха — и конец!';
            else if (currentMode === 'boss') modeInfo.innerHTML = '👾 Режим босса: квадрат уменьшается с каждым кликом!';
            else if (currentMode === 'multiplayer') modeInfo.innerHTML = '👥 Мультиплеер: 30 секунд на двоих!';
            startGameWithCurrentSettings();
        });
    });
}

function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            contents.forEach(content => content.classList.remove('active'));
            if (tabId === 'levels') document.getElementById('tabLevels').classList.add('active');
            else if (tabId === 'rules') document.getElementById('tabRules').classList.add('active');
            else if (tabId === 'modes') document.getElementById('tabModes').classList.add('active');
            else if (tabId === 'stats') {
                document.getElementById('tabStats').classList.add('active');
                updateStatsUI();
                updateAchievementsUI();
                updateLeaderboardUI();
            }
        });
    });
}

function updateFieldSize() {
    const gameField = document.getElementById('gameField');
    fieldWidth = gameField.clientWidth || 500;
    fieldHeight = gameField.clientHeight || 400;
}

function init() {
    loadData();
    setupLevelButtons();
    setupModes();
    setupTabs();
    document.body.style.backgroundColor = '#cfe8ff';
    highlightSelectedLevel();
    document.body.style.backgroundColor = '#cfe8ff';
    const colorPicker = document.getElementById('squareColor');
    const colorDemo = document.getElementById('colorDemo');
    colorDemo.style.backgroundColor = colorPicker.value;
    currentSquareColor = colorPicker.value;
    document.getElementById('square').style.backgroundColor = currentSquareColor;
    updateFieldSize();
    exitToMainMenu();
    
    document.getElementById('squareColor').addEventListener('input', (e) => {
        currentSquareColor = e.target.value;
        document.getElementById('colorDemo').style.backgroundColor = currentSquareColor;
        if (!gameActive) document.getElementById('square').style.backgroundColor = currentSquareColor;
    });
    document.getElementById('startGameBtn').addEventListener('click', () => {
        currentMode = 'classic';
        startGameWithCurrentSettings();
    });
    document.getElementById('replayBtn').addEventListener('click', startGameWithCurrentSettings);
    document.getElementById('menuBtn').addEventListener('click', exitToMainMenu);
    document.getElementById('resetStatsBtn').addEventListener('click', resetStats);
    
    const square = document.getElementById('square');
    const gameField = document.getElementById('gameField');
    square.addEventListener('click', onSquareClick);
    square.addEventListener('touchstart', (e) => { e.preventDefault(); onSquareClick(e); });
    gameField.addEventListener('click', onFieldClick);
    gameField.addEventListener('touchstart', (e) => { if (e.target === square) return; e.preventDefault(); onFieldClick(e); });
    
    window.addEventListener('resize', () => {
        if (document.getElementById('gameArea').style.display === 'block' && gameActive) {
            const newWidth = document.getElementById('gameField').clientWidth;
            const newHeight = document.getElementById('gameField').clientHeight;
            if (newWidth !== fieldWidth || newHeight !== fieldHeight) {
                fieldWidth = newWidth;
                fieldHeight = newHeight;
                const sq = document.getElementById('square');
                let left = parseInt(sq.style.left);
                let top = parseInt(sq.style.top);
                const maxX = fieldWidth - squareCurrentSize;
                const maxY = fieldHeight - squareCurrentSize;
                if (left > maxX) left = maxX;
                if (top > maxY) top = maxY;
                if (left < 0) left = 0;
                if (top < 0) top = 0;
                sq.style.left = left + 'px';
                sq.style.top = top + 'px';
            }
        }
    });
}

init();