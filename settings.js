// === STAF V1 - НАСТРОЙКИ ===

// Темы оформления
const THEMES = {
    green: {
        primary: '#00ff88',
        secondary: '#00ffaa',
        dark: '#001800',
        light: '#b9ffc6'
    },
    blue: {
        primary: '#00aaff',
        secondary: '#0088ff',
        dark: '#001830',
        light: '#b9d9ff'
    },
    purple: {
        primary: '#aa00ff',
        secondary: '#cc00ff',
        dark: '#180030',
        light: '#d9b9ff'
    },
    red: {
        primary: '#ff0055',
        secondary: '#ff3366',
        dark: '#300010',
        light: '#ffb9cc'
    },
    gold: {
        primary: '#ffd700',
        secondary: '#ffed4e',
        dark: '#302800',
        light: '#fff4b9'
    }
};

// Загрузка настроек при инициализации
window.addEventListener('DOMContentLoaded', () => {
    loadUserSettings();
    loadUserLevel();
    loadDailyQuests();
    applyTheme();
    highlightCurrentTheme();
});

function loadUserSettings() {
    const settings = getUserSettings();
    
    // Применяем настройки
    document.getElementById('particles-intensity').value = settings.particlesIntensity;
    document.getElementById('ui-animations').checked = settings.uiAnimations;
    document.getElementById('glitch-effect').checked = settings.glitchEffect;
    
    // Применяем эффекты
    if (!settings.glitchEffect) {
        document.querySelectorAll('.glitch').forEach(el => {
            el.classList.remove('glitch');
        });
    }
}

function getUserSettings() {
    const defaults = {
        theme: 'green',
        particlesIntensity: 'medium',
        uiAnimations: true,
        glitchEffect: true
    };
    
    const saved = localStorage.getItem('staf_settings');
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
}

function saveUserSettings(settings) {
    const current = getUserSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem('staf_settings', JSON.stringify(updated));
}

function changeTheme(themeName) {
    saveUserSettings({ theme: themeName });
    applyTheme();
    highlightCurrentTheme();
    
    // Уведомление
    showNotification(`✨ Тема изменена на ${getThemeName(themeName)}!`);
    
    // Добавляем XP
    addXP(5, 'Смена темы');
}

function getThemeName(theme) {
    const names = {
        green: 'Зелёную',
        blue: 'Синюю',
        purple: 'Фиолетовую',
        red: 'Красную',
        gold: 'Золотую'
    };
    return names[theme] || 'Зелёную';
}

function applyTheme() {
    const settings = getUserSettings();
    const theme = THEMES[settings.theme] || THEMES.green;
    
    // Применяем CSS переменные
    document.documentElement.style.setProperty('--primary-green', theme.primary);
    document.documentElement.style.setProperty('--secondary-green', theme.secondary);
    document.documentElement.style.setProperty('--dark-green', theme.dark);
    document.documentElement.style.setProperty('--light-green', theme.light);
    
    // Переинициализируем частицы с новым цветом
    if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
        initParticlesWithSettings();
    }
}

function highlightCurrentTheme() {
    const settings = getUserSettings();
    document.querySelectorAll('.theme-card').forEach(card => {
        card.classList.remove('active-theme');
        if (card.dataset.theme === settings.theme) {
            card.classList.add('active-theme');
        }
    });
}

function initParticlesWithSettings() {
    const settings = getUserSettings();
    const theme = THEMES[settings.theme] || THEMES.green;
    
    let particleCount = 80;
    switch(settings.particlesIntensity) {
        case 'low': particleCount = 50; break;
        case 'medium': particleCount = 80; break;
        case 'high': particleCount = 150; break;
        case 'ultra': particleCount = 250; break;
    }
    
    particlesJS('particles-js', {
        particles: {
            number: { value: particleCount, density: { enable: true, value_area: 800 } },
            color: { value: theme.primary },
            shape: { type: 'circle' },
            opacity: { value: 0.5, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1 } },
            size: { value: 3, random: true, anim: { enable: true, speed: 2, size_min: 0.1 } },
            line_linked: { enable: true, distance: 150, color: theme.primary, opacity: 0.4, width: 1 },
            move: { enable: true, speed: 2, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: { enable: true, mode: 'grab' },
                onclick: { enable: true, mode: 'push' },
                resize: true
            },
            modes: {
                grab: { distance: 140, line_linked: { opacity: 1 } },
                push: { particles_nb: 4 }
            }
        },
        retina_detect: true
    });
}

function updateSettings() {
    const settings = {
        particlesIntensity: document.getElementById('particles-intensity').value,
        uiAnimations: document.getElementById('ui-animations').checked,
        glitchEffect: document.getElementById('glitch-effect').checked
    };
    
    saveUserSettings(settings);
    applyTheme();
    showNotification('✅ Настройки сохранены!');
}

function exportData() {
    const data = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        settings: getUserSettings(),
        visits: localStorage.getItem('staf_visits'),
        searchHistory: localStorage.getItem('staf_search_history'),
        favorites: localStorage.getItem('staf_favorites'),
        ratings: localStorage.getItem('staf_ratings'),
        notes: localStorage.getItem('staf_notes'),
        userLevel: localStorage.getItem('staf_user_level'),
        achievements: localStorage.getItem('staf_achievements'),
        dailyQuests: localStorage.getItem('staf_daily_quests'),
        trending: localStorage.getItem('staf_trending')
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `staf_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('💾 Данные экспортированы!');
    addXP(10, 'Экспорт данных');
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            
            if (confirm('Вы уверены? Это заменит все текущие данные!')) {
                // Импортируем данные
                if (data.settings) localStorage.setItem('staf_settings', JSON.stringify(data.settings));
                if (data.visits) localStorage.setItem('staf_visits', data.visits);
                if (data.searchHistory) localStorage.setItem('staf_search_history', data.searchHistory);
                if (data.favorites) localStorage.setItem('staf_favorites', data.favorites);
                if (data.ratings) localStorage.setItem('staf_ratings', data.ratings);
                if (data.notes) localStorage.setItem('staf_notes', data.notes);
                if (data.userLevel) localStorage.setItem('staf_user_level', data.userLevel);
                if (data.achievements) localStorage.setItem('staf_achievements', data.achievements);
                if (data.dailyQuests) localStorage.setItem('staf_daily_quests', data.dailyQuests);
                if (data.trending) localStorage.setItem('staf_trending', data.trending);
                
                showNotification('✅ Данные импортированы!');
                setTimeout(() => location.reload(), 1500);
            }
        } catch (err) {
            showNotification('❌ Ошибка при импорте данных!', 'error');
        }
    };
    reader.readAsText(file);
}

function resetAllSettings() {
    if (confirm('Вы уверены, что хотите сбросить все настройки?')) {
        localStorage.removeItem('staf_settings');
        showNotification('✅ Настройки сброшены!');
        setTimeout(() => location.reload(), 1000);
    }
}

function resetAllData() {
    if (confirm('ВНИМАНИЕ! Это удалит ВСЕ ваши данные! Продолжить?')) {
        if (confirm('Вы ТОЧНО уверены? Это действие нельзя отменить!')) {
            localStorage.clear();
            sessionStorage.clear();
            showNotification('🗑️ Все данные удалены!');
            setTimeout(() => location.href = 'index.html', 1500);
        }
    }
}

// Ежедневные задания
function loadDailyQuests() {
    const quests = getDailyQuests();
    const questsEl = document.getElementById('daily-quests');
    
    if (!questsEl) return;
    
    const today = new Date().toDateString();
    const lastReset = localStorage.getItem('staf_quests_date');
    
    // Сброс заданий каждый день
    if (lastReset !== today) {
        resetDailyQuests();
    }
    
    questsEl.innerHTML = quests.map(quest => `
        <div class="quest-item ${quest.completed ? 'completed' : ''}" style="padding: 20px; background: rgba(0, 255, 136, 0.05); border: 1px solid var(--primary-green); border-radius: 10px; margin: 15px 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
                <div style="flex: 1;">
                    <h3>${quest.completed ? '✅' : '⭕'} ${quest.title}</h3>
                    <p style="margin-top: 8px;">${quest.description}</p>
                    <p style="margin-top: 8px; color: var(--secondary-green);">Прогресс: ${quest.progress}/${quest.target}</p>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 2em; color: gold;">+${quest.reward} XP</div>
                    ${quest.completed ? '<span style="color: var(--secondary-green);">Завершено!</span>' : ''}
                </div>
            </div>
            <div class="progress-bar" style="margin-top: 15px;">
                <div class="progress-fill" style="width: ${(quest.progress / quest.target) * 100}%"></div>
            </div>
        </div>
    `).join('');
}

function getDailyQuests() {
    const saved = localStorage.getItem('staf_daily_quests');
    if (saved) return JSON.parse(saved);
    
    return [
        { id: 'visit', title: 'Посетить сайт', description: 'Зайдите на сайт', progress: 1, target: 1, reward: 10, completed: true },
        { id: 'search', title: 'Выполнить 3 поиска', description: 'Найдите 3 брейнрота', progress: 0, target: 3, reward: 25, completed: false },
        { id: 'favorite', title: 'Добавить в избранное', description: 'Добавьте 2 результата в избранное', progress: 0, target: 2, reward: 15, completed: false },
        { id: 'explore', title: 'Исследовать категории', description: 'Посетите 2 разные категории', progress: 0, target: 2, reward: 20, completed: false }
    ];
}

function resetDailyQuests() {
    const quests = [
        { id: 'visit', title: 'Посетить сайт', description: 'Зайдите на сайт', progress: 1, target: 1, reward: 10, completed: true },
        { id: 'search', title: 'Выполнить 3 поиска', description: 'Найдите 3 брейнрота', progress: 0, target: 3, reward: 25, completed: false },
        { id: 'favorite', title: 'Добавить в избранное', description: 'Добавьте 2 результата в избранное', progress: 0, target: 2, reward: 15, completed: false },
        { id: 'explore', title: 'Исследовать категории', description: 'Посетите 2 разные категории', progress: 0, target: 2, reward: 20, completed: false }
    ];
    
    localStorage.setItem('staf_daily_quests', JSON.stringify(quests));
    localStorage.setItem('staf_quests_date', new Date().toDateString());
    
    // Награда за первое посещение дня
    addXP(10, 'Ежедневный визит');
}

function updateQuestProgress(questId, amount = 1) {
    const quests = getDailyQuests();
    const quest = quests.find(q => q.id === questId);
    
    if (quest && !quest.completed) {
        quest.progress = Math.min(quest.progress + amount, quest.target);
        
        if (quest.progress >= quest.target) {
            quest.completed = true;
            addXP(quest.reward, `Задание: ${quest.title}`);
            showNotification(`🎉 Задание выполнено! +${quest.reward} XP`);
        }
        
        localStorage.setItem('staf_daily_quests', JSON.stringify(quests));
    }
}

// Уровни и опыт
function loadUserLevel() {
    const levelData = getUserLevel();
    const levelEl = document.getElementById('user-level');
    const xpEl = document.getElementById('user-xp');
    const xpNeededEl = document.getElementById('xp-needed');
    const progressEl = document.getElementById('xp-progress');
    
    if (levelEl) levelEl.textContent = levelData.level;
    if (xpEl) xpEl.textContent = levelData.xp;
    if (xpNeededEl) xpNeededEl.textContent = levelData.xpNeeded;
    if (progressEl) progressEl.style.width = `${(levelData.xp / levelData.xpNeeded) * 100}%`;
}

function getUserLevel() {
    const saved = localStorage.getItem('staf_user_level');
    if (saved) return JSON.parse(saved);
    
    return { level: 1, xp: 0, xpNeeded: 100, totalXp: 0 };
}

function addXP(amount, reason = '') {
    const levelData = getUserLevel();
    levelData.xp += amount;
    levelData.totalXp += amount;
    
    // Проверка повышения уровня
    while (levelData.xp >= levelData.xpNeeded) {
        levelData.xp -= levelData.xpNeeded;
        levelData.level++;
        levelData.xpNeeded = Math.floor(levelData.xpNeeded * 1.2);
        
        showNotification(`🎉 ПОЗДРАВЛЯЕМ! Вы достигли уровня ${levelData.level}!`, 'success');
        checkAchievements();
    }
    
    localStorage.setItem('staf_user_level', JSON.stringify(levelData));
    loadUserLevel();
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: rgba(0, 0, 0, 0.95);
        border: 2px solid var(--primary-green);
        border-radius: 10px;
        padding: 20px 30px;
        color: var(--primary-green);
        font-family: 'Orbitron', sans-serif;
        font-size: 1.1em;
        box-shadow: 0 0 30px var(--primary-green);
        z-index: 10000;
        animation: slideInRight 0.5s ease, fadeOut 0.5s ease 2.5s;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function checkAchievements() {
    // Проверка достижений будет в stats.html
}

// Экспортируем функции
window.changeTheme = changeTheme;
window.updateSettings = updateSettings;
window.exportData = exportData;
window.importData = importData;
window.resetAllSettings = resetAllSettings;
window.resetAllData = resetAllData;
window.addXP = addXP;
window.showNotification = showNotification;
window.updateQuestProgress = updateQuestProgress;
window.applyTheme = applyTheme;
window.getUserSettings = getUserSettings;
window.initParticlesWithSettings = initParticlesWithSettings;
