function loadData() {
    const storedRecords = localStorage.getItem('squareGameRecords');
    if (storedRecords) {
        try {
            const parsed = JSON.parse(storedRecords);
            if (Array.isArray(parsed) && parsed.length === 5) records = parsed;
        } catch(e) {}
    }
    
    const storedTopScores = localStorage.getItem('squareTopScores');
    if (storedTopScores) {
        try {
            topScores = JSON.parse(storedTopScores);
        } catch(e) {}
    }
    
    const storedStats = localStorage.getItem('squareStats');
    if (storedStats) {
        try {
            stats = JSON.parse(storedStats);
        } catch(e) {}
    }
    
    updateRecordDisplay();
    updateStatsUI();
    updateAchievementsUI();
    updateLeaderboardUI();
}

function saveAllData() {
    localStorage.setItem('squareGameRecords', JSON.stringify(records));
    localStorage.setItem('squareTopScores', JSON.stringify(topScores));
    localStorage.setItem('squareStats', JSON.stringify(stats));
}

function updateRecordDisplay() {
    const recordDisplay = document.getElementById('recordDisplay');
    if (recordDisplay) recordDisplay.innerText = records[currentLevelIdx] || 0;
}

function updateTopScores(levelIdx, finalScore) {
    let levelTop = [...topScores[levelIdx]];
    levelTop.push(finalScore);
    levelTop.sort((a, b) => b - a);
    levelTop = levelTop.slice(0, 3);
    topScores[levelIdx] = levelTop;
    saveAllData();
    updateLeaderboardUI();
}

function updateLeaderboardUI() {
    const container = document.getElementById('leaderboardTable');
    if (!container) return;
    
    container.innerHTML = '';
    for (let i = 0; i < LEVELS.length; i++) {
        const levelTop = topScores[i] || [];
        const levelDiv = document.createElement('div');
        levelDiv.className = 'leaderboard-level';
        levelDiv.innerHTML = `
            <div class="leaderboard-header">
                <span>${LEVELS[i].name}</span>
                <span>🏆 ${records[i] || 0}</span>
            </div>
            <div class="leaderboard-rows">
                ${levelTop.length === 0 ? '<div class="leaderboard-row">Нет рекордов</div>' : ''}
                ${levelTop.map((sc, idx) => `
                    <div class="leaderboard-row rank-${idx + 1 === 1 ? '1' : idx + 1 === 2 ? '2' : '3'}">
                        <span>${idx + 1}. ${idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</span>
                        <span>${sc} очков</span>
                    </div>
                `).join('')}
            </div>
        `;
        container.appendChild(levelDiv);
    }
}

function showAchievementUnlock(name, desc) {
    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.innerHTML = `<div style="background: linear-gradient(135deg, #f59e0b, #ef4444); color: white; padding: 10px 18px; border-radius: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">🏆 Достижение разблокировано!<br><strong>${name}</strong> — ${desc}</div>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function checkAchievements() {
    let anyNew = false;
    
    if (!stats.achievements.first_blood && score >= 10) {
        stats.achievements.first_blood = true;
        anyNew = true;
        showAchievementUnlock('🎯 Первый шаг', 'Набрать 10 очков за игру');
    }
    if (!stats.achievements.speed_demon && score >= 50) {
        stats.achievements.speed_demon = true;
        anyNew = true;
        showAchievementUnlock('⚡ Скоростной демон', 'Сделать 50 кликов за игру');
    }
    if (!stats.achievements.perfect && score >= 30 && comboActivationsThisGame === 0) {
        stats.achievements.perfect = true;
        anyNew = true;
        showAchievementUnlock('💎 Идеальная игра', '30 очков без комбо');
    }
    if (!stats.achievements.combo_master && comboActivationsThisGame >= 10) {
        stats.achievements.combo_master = true;
        anyNew = true;
        showAchievementUnlock('🔥 Комбо-мастер', '10 комбо за игру');
    }
    if (!stats.achievements.expert_master && stats.expertWins >= 5) {
        stats.achievements.expert_master = true;
        anyNew = true;
        showAchievementUnlock('👑 Эксперт', 'Победить на Эксперте 5 раз');
    }
    
    if (anyNew) {
        saveAllData();
        updateAchievementsUI();
    }
}

function updateAchievementsUI() {
    const grid = document.getElementById('achievementsGrid');
    if (!grid) return;
    
    grid.innerHTML = ACHIEVEMENTS.map(ach => {
        const unlocked = stats.achievements[ach.id];
        return `<div class="achievement-card ${unlocked ? 'unlocked' : 'locked'}">
            <div class="achievement-icon">${ach.icon}</div>
            <div class="achievement-info">
                <div class="achievement-name">${ach.name}</div>
                <div class="achievement-desc">${ach.desc}</div>
                ${unlocked ? '<div class="achievement-progress">✓ Разблокировано!</div>' : '<div class="achievement-progress">🔒 Не разблокировано</div>'}
            </div>
        </div>`;
    }).join('');
}

function updateStatsUI() {
    const totalScoreEl = document.getElementById('totalScore');
    const totalGamesEl = document.getElementById('totalGames');
    const totalClicksEl = document.getElementById('totalClicks');
    if (totalScoreEl) totalScoreEl.innerText = stats.totalScore;
    if (totalGamesEl) totalGamesEl.innerText = stats.totalGames;
    if (totalClicksEl) totalClicksEl.innerText = stats.totalClicks;
}

function resetStats() {
    if (confirm('Точно сбросить всю статистику и достижения? Это нельзя отменить!')) {
        stats = {
            totalScore: 0, totalGames: 0, totalClicks: 0, expertWins: 0,
            achievements: { first_blood: false, expert_master: false, perfect: false, speed_demon: false, combo_master: false }
        };
        records = [0, 0, 0, 0, 0];
        topScores = [[], [], [], [], []];
        saveAllData();
        updateStatsUI();
        updateAchievementsUI();
        updateLeaderboardUI();
        updateRecordDisplay();
        alert('Статистика сброшена!');
    }
}