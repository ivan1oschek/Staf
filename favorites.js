// === STAF V1 - ИЗБРАННОЕ ===

let currentEditingId = null;

window.addEventListener('DOMContentLoaded', () => {
    loadFavorites();
    loadTopResults();
});

function loadFavorites() {
    const favorites = getFavorites();
    const sortBy = document.getElementById('sort-favorites')?.value || 'date-desc';
    
    // Сортировка
    let sorted = [...favorites];
    switch(sortBy) {
        case 'date-desc':
            sorted.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
            break;
        case 'date-asc':
            sorted.sort((a, b) => new Date(a.addedDate) - new Date(b.addedDate));
            break;
        case 'rating-desc':
            sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
        case 'name-asc':
            sorted.sort((a, b) => a.query.localeCompare(b.query));
            break;
    }
    
    // Статистика
    document.getElementById('favorites-count').textContent = favorites.length;
    document.getElementById('total-likes').textContent = favorites.reduce((sum, f) => sum + (f.rating || 0), 0);
    document.getElementById('notes-count').textContent = favorites.filter(f => f.note && f.note.trim()).length;
    
    // Список
    const listEl = document.getElementById('favorites-list');
    if (favorites.length === 0) {
        listEl.innerHTML = '<p style="text-align: center; color: var(--light-green); opacity: 0.7; padding: 40px;">Избранное пусто. Добавьте результаты из поиска!</p>';
        return;
    }
    
    listEl.innerHTML = sorted.map(fav => `
        <div class="favorite-item" style="padding: 25px; background: rgba(0, 255, 136, 0.05); border: 1px solid var(--primary-green); border-radius: 15px; margin: 20px 0; transition: all 0.3s;"
             onmouseover="this.style.transform='translateX(5px)'; this.style.boxShadow='0 0 30px var(--secondary-green)';" 
             onmouseout="this.style.transform='translateX(0)'; this.style.boxShadow='none';">
            <div style="display: flex; justify-content: space-between; align-items: start; flex-wrap: wrap; gap: 15px;">
                <div style="flex: 1;">
                    <h3 style="color: var(--secondary-green); margin-bottom: 10px;">
                        <i class="ri-bookmark-line"></i> ${fav.query}
                    </h3>
                    <p style="color: var(--light-green); margin-bottom: 10px;">
                        <i class="ri-calendar-line"></i> Добавлено: ${new Date(fav.addedDate).toLocaleDateString('ru-RU')}
                    </p>
                    ${fav.category ? `<span style="padding: 5px 15px; background: rgba(0,255,136,0.2); border-radius: 15px; font-size: 0.9em;">${fav.category}</span>` : ''}
                    ${fav.note ? `
                        <div style="margin-top: 15px; padding: 15px; background: rgba(0,0,0,0.5); border-left: 3px solid var(--secondary-green); border-radius: 5px;">
                            <p style="font-style: italic;"><i class="ri-file-text-line"></i> ${fav.note}</p>
                        </div>
                    ` : ''}
                </div>
                <div style="display: flex; flex-direction: column; gap: 10px; align-items: center;">
                    <div style="display: flex; gap: 10px;">
                        <button onclick="rateItem('${fav.id}', 1)" class="icon-btn" title="Лайк">
                            <i class="ri-thumb-up-line"></i>
                        </button>
                        <span style="font-size: 1.5em; color: var(--secondary-green);">${fav.rating || 0}</span>
                        <button onclick="rateItem('${fav.id}', -1)" class="icon-btn" title="Дизлайк">
                            <i class="ri-thumb-down-line"></i>
                        </button>
                    </div>
                    <button onclick="editNote('${fav.id}')" class="icon-btn" title="Добавить/изменить заметку">
                        <i class="ri-edit-line"></i>
                    </button>
                    <button onclick="shareItem('${fav.id}')" class="icon-btn" title="Поделиться">
                        <i class="ri-share-line"></i>
                    </button>
                    <button onclick="removeFavorite('${fav.id}')" class="icon-btn" style="color: #ff6b6b;" title="Удалить">
                        <i class="ri-delete-bin-line"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function getFavorites() {
    const saved = localStorage.getItem('staf_favorites');
    return saved ? JSON.parse(saved) : [];
}

function saveFavorites(favorites) {
    localStorage.setItem('staf_favorites', JSON.stringify(favorites));
}

function addToFavorites(query, category = null) {
    const favorites = getFavorites();
    
    // Проверка на дубликаты
    if (favorites.find(f => f.query === query)) {
        showNotification('⚠️ Уже в избранном!');
        return;
    }
    
    const newFav = {
        id: Date.now().toString(),
        query: query,
        category: category,
        addedDate: new Date().toISOString(),
        rating: 0,
        note: ''
    };
    
    favorites.unshift(newFav);
    saveFavorites(favorites);
    
    showNotification('⭐ Добавлено в избранное!');
    addXP(5, 'Добавление в избранное');
    updateQuestProgress('favorite', 1);
    
    return newFav;
}

function removeFavorite(id) {
    if (confirm('Удалить из избранного?')) {
        let favorites = getFavorites();
        favorites = favorites.filter(f => f.id !== id);
        saveFavorites(favorites);
        loadFavorites();
        showNotification('🗑️ Удалено из избранного');
    }
}

function clearAllFavorites() {
    if (confirm('Удалить ВСЁ избранное? Это действие нельзя отменить!')) {
        localStorage.removeItem('staf_favorites');
        loadFavorites();
        showNotification('🗑️ Избранное очищено');
    }
}

function rateItem(id, value) {
    const favorites = getFavorites();
    const item = favorites.find(f => f.id === id);
    
    if (item) {
        item.rating = (item.rating || 0) + value;
        saveFavorites(favorites);
        loadFavorites();
        
        if (value > 0) {
            addXP(2, 'Лайк');
        }
    }
}

function editNote(id) {
    currentEditingId = id;
    const favorites = getFavorites();
    const item = favorites.find(f => f.id === id);
    
    if (item) {
        document.getElementById('note-text').value = item.note || '';
        document.getElementById('note-modal').style.display = 'flex';
    }
}

function saveNote() {
    if (!currentEditingId) return;
    
    const favorites = getFavorites();
    const item = favorites.find(f => f.id === currentEditingId);
    
    if (item) {
        item.note = document.getElementById('note-text').value;
        saveFavorites(favorites);
        closeNoteModal();
        loadFavorites();
        showNotification('💾 Заметка сохранена!');
        addXP(3, 'Добавление заметки');
    }
}

function closeNoteModal() {
    document.getElementById('note-modal').style.display = 'none';
    currentEditingId = null;
}

function shareItem(id) {
    const favorites = getFavorites();
    const item = favorites.find(f => f.id === id);
    
    if (item) {
        const shareText = `Я нашёл ${item.query} на Staf v1!`;
        const shareUrl = `${window.location.origin}/search.html?q=${encodeURIComponent(item.query)}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Staf v1',
                text: shareText,
                url: shareUrl
            }).catch(() => {});
        } else {
            // Копирование в буфер обмена
            navigator.clipboard.writeText(shareUrl).then(() => {
                showNotification('🔗 Ссылка скопирована!');
            });
        }
        
        addXP(2, 'Поделиться');
    }
}

function loadTopResults() {
    const trending = getTrending();
    const topEl = document.getElementById('top-results');
    
    if (!topEl) return;
    
    if (trending.length === 0) {
        topEl.innerHTML = '<p style="text-align: center; color: var(--light-green); opacity: 0.7; padding: 40px;">Пока нет данных о популярных результатах</p>';
        return;
    }
    
    // Топ 5 результатов
    const top = trending.slice(0, 5);
    
    topEl.innerHTML = top.map((item, index) => `
        <div style="padding: 20px; background: rgba(0, 255, 136, 0.05); border: 1px solid var(--primary-green); border-radius: 10px; margin: 15px 0; display: flex; justify-content: space-between; align-items: center; gap: 15px;">
            <div style="font-size: 2em; font-weight: bold; color: ${index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? '#cd7f32' : 'var(--secondary-green)'}; min-width: 50px;">
                #${index + 1}
            </div>
            <div style="flex: 1;">
                <h3 style="color: var(--secondary-green);">${item.query}</h3>
                <p style="margin-top: 8px;"><i class="ri-fire-line"></i> ${item.count} поисков</p>
            </div>
            <button onclick="window.location.href='search.html?q=${encodeURIComponent(item.query)}'" class="btn" style="padding: 10px 20px;">
                <i class="ri-search-line"></i>
            </button>
        </div>
    `).join('');
}

function getTrending() {
    const saved = localStorage.getItem('staf_trending');
    return saved ? JSON.parse(saved) : [];
}

function updateTrending(query) {
    let trending = getTrending();
    const existing = trending.find(t => t.query === query);
    
    if (existing) {
        existing.count++;
        existing.lastSearched = new Date().toISOString();
    } else {
        trending.push({
            query: query,
            count: 1,
            lastSearched: new Date().toISOString()
        });
    }
    
    // Сортировка по количеству
    trending.sort((a, b) => b.count - a.count);
    
    // Храним только топ 20
    trending = trending.slice(0, 20);
    
    localStorage.setItem('staf_trending', JSON.stringify(trending));
}

// Экспорт функций
window.loadFavorites = loadFavorites;
window.addToFavorites = addToFavorites;
window.removeFavorite = removeFavorite;
window.clearAllFavorites = clearAllFavorites;
window.rateItem = rateItem;
window.editNote = editNote;
window.saveNote = saveNote;
window.closeNoteModal = closeNoteModal;
window.shareItem = shareItem;
window.updateTrending = updateTrending;
window.getFavorites = getFavorites;
