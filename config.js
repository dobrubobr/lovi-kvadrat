// Уровни сложности
const LEVELS = [
    { name: 'Новичок', jumpSec: 3.5, timeSec: 45, color: '#b8e4c9' },
    { name: 'Лёгкий', jumpSec: 2.0, timeSec: 35, color: '#fff2b5' },
    { name: 'Средний', jumpSec: 1.5, timeSec: 30, color: '#ffd8a9' },
    { name: 'Тяжёлый', jumpSec: 0.7, timeSec: 20, color: '#ffb4a2' },
    { name: 'Эксперт', jumpSec: 0.2, timeSec: 12, color: '#ff8a7a' }
];

// Достижения
const ACHIEVEMENTS = [
    { id: 'first_blood', name: '🎯 Первый шаг', desc: 'Набрать 10 очков за игру', icon: '🎯' },
    { id: 'expert_master', name: '👑 Эксперт', desc: 'Победить на уровне Эксперт 5 раз', icon: '👑' },
    { id: 'perfect', name: '💎 Идеальная игра', desc: 'Набрать 30 очков без комбо', icon: '💎' },
    { id: 'speed_demon', name: '⚡ Скоростной демон', desc: 'Сделать 50 кликов за одну игру', icon: '⚡' },
    { id: 'combo_master', name: '🔥 Комбо-мастер', desc: 'Активировать комбо 10 раз за игру', icon: '🔥' }
];

// Глобальные переменные
let currentLevelIdx = 2;
let currentSquareColor = '#e63946';
let currentMode = 'classic';
let gameActive = false;
let score = 0;
let timeLeft = 0;
let countdownInterval = null;
let jumpInterval = null;
let fieldWidth = 500, fieldHeight = 400;
const DEFAULT_SQUARE_SIZE = 50;

let missedCount = 0;
let squareCurrentSize = DEFAULT_SQUARE_SIZE;
let comboCounter = 0;
let comboActive = false;
let comboTimer = null;
let comboActivationsThisGame = 0;

let records = [0, 0, 0, 0, 0];
let topScores = [[], [], [], [], []];
let stats = {
    totalScore: 0,
    totalGames: 0,
    totalClicks: 0,
    expertWins: 0,
    achievements: {
        first_blood: false,
        expert_master: false,
        perfect: false,
        speed_demon: false,
        combo_master: false
    }
};