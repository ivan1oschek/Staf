// === STAF V1 - Общая логика ===

// Защита паролем
const PASSWORD = 'Staf25';

function checkPassword() {
    const savedPassword = sessionStorage.getItem('staf_authenticated');
    
    if (savedPassword === 'true') {
        return true;
    }
    
    // Создаем красивую форму входа
    showLoginScreen();
    return false;
}

function showLoginScreen() {
    // Создаем оверлей для входа
    const loginOverlay = document.createElement('div');
    loginOverlay.id = 'login-overlay';
    loginOverlay.innerHTML = `
        <style>
            #login-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: radial-gradient(circle at center, #001800, #000);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.5s ease;
            }
            
            .login-container {
                background: rgba(0, 0, 0, 0.95);
                border: 2px solid #00ff88;
                border-radius: 25px;
                padding: 50px;
                text-align: center;
                box-shadow: 0 0 50px #00ff88, inset 0 0 30px rgba(0, 255, 136, 0.1);
                animation: slideIn 0.8s ease;
                max-width: 500px;
                width: 90%;
            }
            
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(-50px) scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            .login-icon {
                font-size: 80px;
                color: #00ffaa;
                margin-bottom: 20px;
                animation: pulse 2s infinite;
            }
            
            .login-title {
                font-size: 2.5em;
                color: #00ff88;
                text-shadow: 0 0 20px #00ffaa;
                margin-bottom: 15px;
                font-family: 'Orbitron', sans-serif;
            }
            
            .login-subtitle {
                color: #b9ffc6;
                font-size: 1.1em;
                margin-bottom: 30px;
                font-family: 'Orbitron', sans-serif;
            }
            
            .password-input-wrapper {
                position: relative;
                margin: 30px 0;
            }
            
            .password-input {
                width: 100%;
                padding: 18px;
                border: 2px solid #00ff88;
                border-radius: 10px;
                background: #000;
                color: #00ff88;
                font-size: 1.2em;
                outline: none;
                text-align: center;
                box-shadow: 0 0 20px #00ff88 inset;
                transition: all 0.3s;
                font-family: 'Orbitron', sans-serif;
            }
            
            .password-input:focus {
                border-color: #00ffaa;
                box-shadow: 0 0 30px #00ffaa inset;
            }
            
            .login-button {
                width: 100%;
                padding: 18px;
                background: linear-gradient(90deg, #00ff88, #00ffaa);
                color: #000;
                border: none;
                border-radius: 10px;
                font-size: 1.2em;
                font-weight: bold;
                cursor: pointer;
                text-transform: uppercase;
                box-shadow: 0 0 30px #00ff88;
                transition: all 0.3s;
                font-family: 'Orbitron', sans-serif;
            }
            
            .login-button:hover {
                background: #00ffaa;
                transform: scale(1.05);
                box-shadow: 0 0 50px #00ffaa;
            }
            
            .login-button:active {
                transform: scale(0.98);
            }
            
            .error-message {
                color: #ff6b6b;
                font-size: 1em;
                margin-top: 15px;
                text-shadow: 0 0 10px #ff6b6b;
                display: none;
                animation: shake 0.5s;
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-10px); }
                75% { transform: translateX(10px); }
            }
            
            .particles-login {
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                z-index: -1;
            }
        </style>
        
        <div id="particles-login" class="particles-login"></div>
        
        <div class="login-container">
            <div class="login-icon">🔐</div>
            <h1 class="login-title">Staf v1</h1>
            <p class="login-subtitle">Введите пароль для доступа</p>
            
            <div class="password-input-wrapper">
                <input 
                    type="password" 
                    id="password-field" 
                    class="password-input" 
                    placeholder="Пароль..." 
                    autocomplete="off"
                >
            </div>
            
            <button onclick="attemptLogin()" class="login-button">
                <i class="ri-login-box-line"></i> Войти
            </button>
            
            <div id="error-message" class="error-message">
                ❌ Неверный пароль! Попробуйте снова.
            </div>
        </div>
    `;
    
    document.body.appendChild(loginOverlay);
    
    // Фокус на поле ввода
    setTimeout(() => {
        document.getElementById('password-field').focus();
    }, 500);
    
    // Enter для входа
    document.getElementById('password-field').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            attemptLogin();
        }
    });
    
    // Инициализация частиц для страницы входа
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-login', {
            particles: {
                number: { value: 100, density: { enable: true, value_area: 800 } },
                color: { value: '#00ff88' },
                shape: { type: 'circle' },
                opacity: { value: 0.5, random: true },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: '#00ff88', opacity: 0.4, width: 1 },
                move: { enable: true, speed: 2 }
            }
        });
    }
}

function attemptLogin() {
    const passwordField = document.getElementById('password-field');
    const errorMessage = document.getElementById('error-message');
    const enteredPassword = passwordField.value;
    
    if (enteredPassword === PASSWORD) {
        // Успешный вход
        sessionStorage.setItem('staf_authenticated', 'true');
        
        // Анимация успешного входа
        const loginOverlay = document.getElementById('login-overlay');
        loginOverlay.style.animation = 'fadeOut 0.5s ease';
        
        setTimeout(() => {
            loginOverlay.remove();
            location.reload(); // Перезагрузка страницы для применения изменений
        }, 500);
    } else {
        // Неверный пароль
        errorMessage.style.display = 'block';
        passwordField.value = '';
        passwordField.style.animation = 'shake 0.5s';
        
        setTimeout(() => {
            passwordField.style.animation = '';
            errorMessage.style.display = 'none';
        }, 2000);
    }
}

// Глобальная функция для использования в HTML
window.attemptLogin = attemptLogin;

// Инициализация при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
    // Проверка пароля
    if (!checkPassword()) {
        return;
    }
    
    // Применение темы
    if (typeof applyTheme === 'function') {
        applyTheme();
    }
    
    // Увеличение счетчика посещений
    incrementVisitCounter();
    
    // Инициализация навигации
    initNavigation();
    
    // Подсветка активной страницы в меню
    highlightActivePage();
    
    // Инициализация частиц (если библиотека загружена)
    if (typeof particlesJS !== 'undefined') {
        if (typeof initParticlesWithSettings === 'function') {
            initParticlesWithSettings();
        } else {
            initParticles();
        }
    }
    
    // Плавная прокрутка
    initSmoothScroll();
    
    // Анимация элементов при появлении
    observeElements();
    
    // Добавление индикатора уровня в навигацию
    addLevelBadgeToNav();
});

// Бургер меню
function initNavigation() {
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    
    if (burger && navLinks) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Закрытие меню при клике на ссылку
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
}

// Подсветка активной страницы
function highlightActivePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Счетчик посещений
function incrementVisitCounter() {
    let visits = parseInt(localStorage.getItem('staf_visits') || '0');
    visits++;
    localStorage.setItem('staf_visits', visits.toString());
    
    // Обновление на странице статистики
    const visitCounter = document.getElementById('visit-counter');
    if (visitCounter) {
        visitCounter.textContent = visits;
    }
    
    return visits;
}

function getVisitCount() {
    return parseInt(localStorage.getItem('staf_visits') || '0');
}

// История поиска
function saveSearchQuery(query) {
    if (!query || query.trim() === '') return;
    
    let history = JSON.parse(localStorage.getItem('staf_search_history') || '[]');
    
    // Добавляем в начало и удаляем дубликаты
    history = [query, ...history.filter(q => q !== query)];
    
    // Ограничиваем до 10 последних запросов
    history = history.slice(0, 10);
    
    localStorage.setItem('staf_search_history', JSON.stringify(history));
}

function getSearchHistory() {
    return JSON.parse(localStorage.getItem('staf_search_history') || '[]');
}

function clearSearchHistory() {
    localStorage.removeItem('staf_search_history');
}

// Поиск с анимацией
function startSearch(query) {
    if (!query || query.trim() === '') {
        alert('⚠️ Введите запрос для поиска!');
        return;
    }
    
    // Сохраняем в историю
    saveSearchQuery(query);
    
    // Обновляем trending
    if (typeof updateTrending === 'function') {
        updateTrending(query);
    }
    
    // Добавляем XP за поиск
    if (typeof addXP === 'function') {
        addXP(5, 'Поиск');
    }
    
    // Обновляем прогресс задания
    if (typeof updateQuestProgress === 'function') {
        updateQuestProgress('search', 1);
    }
    
    const loading = document.getElementById('loading');
    const result = document.getElementById('result');
    const progress = document.getElementById('progress');
    
    if (loading) loading.style.display = 'block';
    if (result) result.style.display = 'none';
    
    let percent = 0;
    const interval = setInterval(() => {
        percent += 5;
        if (progress) progress.textContent = percent + '%';
        
        if (percent >= 100) {
            clearInterval(interval);
            if (loading) loading.style.display = 'none';
            if (result) result.style.display = 'block';
            
            // Показываем кнопку добавления в избранное
            showAddToFavoritesButton(query);
        }
    }, 100);
}

function showAddToFavoritesButton(query) {
    const resultDiv = document.getElementById('result');
    if (!resultDiv) return;
    
    // Проверяем, есть ли уже кнопка
    if (resultDiv.querySelector('.add-favorite-btn')) return;
    
    const btn = document.createElement('button');
    btn.className = 'btn add-favorite-btn';
    btn.style.marginTop = '15px';
    btn.innerHTML = '<i class="ri-star-line"></i> Добавить в избранное';
    btn.onclick = () => {
        if (typeof addToFavorites === 'function') {
            addToFavorites(query);
            btn.innerHTML = '<i class="ri-star-fill"></i> В избранном';
            btn.disabled = true;
            btn.style.opacity = '0.6';
        }
    };
    
    const container = resultDiv.querySelector('div');
    if (container) {
        container.appendChild(btn);
    }
}

// Переход на сервер
function goToServer() {
    window.location.href = 'https://www.roblox.com/share?code=953b049d3fa303409a6e67b806a55fda&type=Server';
}

// Инициализация частиц
function initParticles() {
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#00ff88'
            },
            shape: {
                type: 'circle'
            },
            opacity: {
                value: 0.5,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#00ff88',
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'grab'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 1
                    }
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    });
}

// Плавная прокрутка
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Наблюдение за элементами для анимации
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1
    });
    
    document.querySelectorAll('.card, .stat-item').forEach(el => {
        observer.observe(el);
    });
}

// Получение статистики
function getStats() {
    return {
        visits: getVisitCount(),
        searches: getSearchHistory().length,
        categories: 6 // Количество категорий
    };
}

// Добавление индикатора уровня в навигацию
function addLevelBadgeToNav() {
    if (typeof getUserLevel !== 'function') return;
    
    const levelData = getUserLevel();
    const navLinks = document.querySelector('.nav-links');
    
    if (navLinks && !document.querySelector('.level-badge')) {
        const levelBadge = document.createElement('li');
        levelBadge.innerHTML = `
            <a href="stats.html" class="level-badge" title="Ваш уровень">
                <i class="ri-vip-crown-line"></i>
                LVL ${levelData.level}
            </a>
        `;
        navLinks.appendChild(levelBadge);
    }
}

// Экспорт функций для использования в HTML
window.startSearch = startSearch;
window.goToServer = goToServer;
window.getSearchHistory = getSearchHistory;
window.clearSearchHistory = clearSearchHistory;
window.getVisitCount = getVisitCount;
window.getStats = getStats;
window.quickSearch = quickSearch;
