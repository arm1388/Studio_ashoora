let madahiData = [];

function loadData() {
    const saved = localStorage.getItem('madahiSystem');
    if (saved) {
        madahiData = JSON.parse(saved);
    } else {
        madahiData = [
            { id: 1, name: "اشک سرد", madah: "حاج محمود کریمی", link: "https://dl.eslammusic.ir/Music/1402/Haj%20Mahmood%20Karimi%20Sog%20Va%20Setayesh/07.mp3", category: "مرثیه" },
            { id: 2, name: "ای کاش برمی‌گشتی", madah: "میثم مطیعی", link: "https://dl.eslammusic.ir/Music/1401/Meysam%20Motiee%20Rahe%20Bi%20Reza/01.mp3", category: "سوگواری" },
            { id: 3, name: "ماه من", madah: "مهدی رسولی", link: "https://dl.eslammusic.ir/Music/1403/Mahdi%20Rasouli%20Ta%20Bargardam/01.mp3", category: "مولودی" },
            { id: 4, name: "ساقی کوثر", madah: "سیدمجید بنی‌فاطمه", link: "https://dl.eslammusic.ir/Music/1402/Sayed%20Majid%20BaniFatemeh%20Bargard%20Be%20Mon/02.mp3", category: "منقبت" }
        ];
        saveData();
    }
    renderMadahi();
}

function saveData() {
    localStorage.setItem('madahiSystem', JSON.stringify(madahiData));  // اصلاح: madahiData
}

function renderMadahi(filteredData = null) {
    const container = document.getElementById('madahiList');
    const data = filteredData || madahiData;
    
    if (!container) return;
    
    if (data.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:50px;">❌ مداحی‌ای یافت نشد ❌</div>';
        return;
    }
    
    container.innerHTML = data.map(item => `
        <div class="madahi-card" data-id="${item.id}">
            <h3>🎙️ ${escapeHtml(item.name)}</h3>
            <div class="madah-name">🎤 مداح: ${escapeHtml(item.madah)}</div>
            <span class="category">${escapeHtml(item.category)}</span>
            <button class="play-btn" data-link="${item.link}" data-name="${escapeHtml(item.name)}">▶ پخش مداحی</button>
        </div>
    `).join('');
    
    document.querySelectorAll('.play-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const link = btn.getAttribute('data-link');
            const name = btn.getAttribute('data-name');
            playAudio(link, name);
        });
    });
}

function playAudio(url, title) {
    const playerDiv = document.getElementById('customPlayer');
    playerDiv.innerHTML = `
        <p>🎵 در حال پخش: ${title}</p>
        <audio controls autoplay>
            <source src="${url}" type="audio/mpeg">
            مرورگر شما پخش صدا را پشتیبانی نمی‌کند.
        </audio>
        <button onclick="document.getElementById('customPlayer').classList.remove('show')" style="background:#8b0000;color:#d4af37;border:none;padding:5px 15px;border-radius:20px;margin-top:8px;cursor:pointer;">❌ بستن</button>
    `;
    playerDiv.classList.add('show');
}

function searchMadahi() {
    const keyword = document.getElementById('searchInput').value.toLowerCase();
    const filtered = madahiData.filter(item => 
        item.name.toLowerCase().includes(keyword) || 
        item.madah.toLowerCase().includes(keyword)
    );
    renderMadahi(filtered);
}

let currentFilter = 'all';
function filterByCategory(category) {
    currentFilter = category;
    if (category === 'all') {
        renderMadahi();
    } else {
        const filtered = madahiData.filter(item => item.category === category);
        renderMadahi(filtered);
    }
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.getAttribute('data-filter') === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    if (searchBtn) searchBtn.addEventListener('click', searchMadahi);
    if (searchInput) searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchMadahi();
    });
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            filterByCategory(btn.getAttribute('data-filter'));
        });
    });
});