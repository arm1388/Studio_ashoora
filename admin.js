let madahiData = [];

// این تابع برای فراخوانی از صفحه لاگین استفاده می‌شود
function loadAdminData() {
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
    renderAdminList();
}

function saveData() {
    localStorage.setItem('madahiSystem', JSON.stringify(madahiData));
}

function addMadahi(name, madah, link, category) {
    const newId = madahiData.length > 0 ? Math.max(...madahiData.map(m => m.id)) + 1 : 1;
    madahiData.push({
        id: newId,
        name: name.trim(),
        madah: madah.trim(),
        link: link.trim(),
        category: category
    });
    saveData();
    renderAdminList();
}

function updateMadahi(id, name, madah, link, category) {
    const index = madahiData.findIndex(item => item.id === id);
    if (index !== -1) {
        madahiData[index] = {
            id: id,
            name: name.trim(),
            madah: madah.trim(),
            link: link.trim(),
            category: category
        };
        saveData();
        renderAdminList();
    }
}

function deleteMadahi(id) {
    if (confirm('آیا از حذف این مداحی مطمئن هستید؟')) {
        madahiData = madahiData.filter(item => item.id !== id);
        saveData();
        renderAdminList();
    }
}

function editMadahi(id) {
    const item = madahiData.find(m => m.id === id);
    if (item) {
        document.getElementById('editId').value = item.id;
        document.getElementById('name').value = item.name;
        document.getElementById('madah').value = item.madah;
        document.getElementById('link').value = item.link;
        document.getElementById('category').value = item.category;
        
        document.getElementById('formTitle').innerHTML = '✏️ ویرایش مداحی';
        document.getElementById('submitBtn').innerHTML = '💾 ذخیره تغییرات';
        document.getElementById('cancelBtn').style.display = 'block';
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function cancelEdit() {
    document.getElementById('editId').value = '';
    document.getElementById('madahiForm').reset();
    document.getElementById('formTitle').innerHTML = '➕ افزودن مداحی جدید';
    document.getElementById('submitBtn').innerHTML = '✅ افزودن مداحی';
    document.getElementById('cancelBtn').style.display = 'none';
}

function renderAdminList() {
    const container = document.getElementById('adminList');
    
    if (!container) return;
    
    if (madahiData.length === 0) {
        container.innerHTML = '<div class="empty-msg">📭 هنوز مداحی‌ای اضافه نشده است</div>';
        return;
    }
    
    container.innerHTML = madahiData.map(item => `
        <div class="admin-item">
            <div class="admin-item-info">
                <h4>🎙️ ${escapeHtml(item.name)}</h4>
                <p>🎤 ${escapeHtml(item.madah)} | 🏷️ ${escapeHtml(item.category)}</p>
                <small>🔗 ${escapeHtml(item.link.substring(0, 60))}${item.link.length > 60 ? '...' : ''}</small>
            </div>
            <div>
                <button class="btn-edit" data-id="${item.id}">✏️ ویرایش</button>
                <button class="btn-delete" data-id="${item.id}">🗑️ حذف</button>
            </div>
        </div>
    `).join('');
    
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.getAttribute('data-id'));
            editMadahi(id);
        });
    });
    
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.getAttribute('data-id'));
            deleteMadahi(id);
        });
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

// رویدادها بعد از لود شدن صفحه (اما لاگین ابتدا نمایش داده می‌شود)
document.addEventListener('DOMContentLoaded', () => {
    // فرم فقط بعد از ورود فعال می‌شود، ولی event listener را اضافه می‌کنیم
    const form = document.getElementById('madahiForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const editId = document.getElementById('editId').value;
            const name = document.getElementById('name').value;
            const madah = document.getElementById('madah').value;
            const link = document.getElementById('link').value;
            const category = document.getElementById('category').value;
            
            if (!name || !madah || !link) {
                alert('لطفاً تمام فیلدها را پر کنید!');
                return;
            }
            
            if (editId) {
                updateMadahi(parseInt(editId), name, madah, link, category);
                alert('✏️ مداحی با موفقیت ویرایش شد!');
                cancelEdit();
            } else {
                addMadahi(name, madah, link, category);
                alert('✅ مداحی با موفقیت اضافه شد!');
                form.reset();
            }
        });
    }
    
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) cancelBtn.addEventListener('click', cancelEdit);
});