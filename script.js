document.addEventListener('DOMContentLoaded', function() {
    const adForm = document.getElementById('adForm');
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const priceInput = document.getElementById('price');
    const phoneInput = document.getElementById('phone');
    const adsList = document.getElementById('adsList');
    const searchInput = document.getElementById('search');
    const categorySelect = document.getElementById('category');
    const addCategoryBtn = document.getElementById('addCategoryBtn');
    const categoryModal = document.getElementById('categoryModal');
    const closeModal = document.querySelector('.close');
    const newCategoryInput = document.getElementById('newCategoryInput');
    const saveCategoryBtn = document.getElementById('saveCategoryBtn');

    // Default categories
    const defaultCategories = ['Мошинҳо', 'Хонаҳо', 'Телефонҳо', 'Дигар'];
    let categories = JSON.parse(localStorage.getItem('categories') || 'null') || [...defaultCategories];
    updateCategoryOptions();

    let ads = JSON.parse(localStorage.getItem('ads') || '[]');
    renderAds(ads);

    adForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const title = titleInput.value.trim();
        const description = descriptionInput.value.trim();
        const price = priceInput.value.trim();
        const phone = phoneInput.value.trim();
        const category = categorySelect.value;
        if (!title || !description || !price || !phone || !category) return;
        const ad = {
            id: Date.now(),
            title,
            description,
            price: parseFloat(price),
            phone,
            category,
            createdAt: new Date().toISOString()
        };
        ads.unshift(ad);
        localStorage.setItem('ads', JSON.stringify(ads));
        renderAds(ads);
        adForm.reset();
        categorySelect.value = categories[0];
    });

    adsList.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-btn')) {
            const adId = e.target.getAttribute('data-id');
            ads = ads.filter(ad => ad.id != adId);
            localStorage.setItem('ads', JSON.stringify(ads));
            renderAds(ads);
        }
    });

    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        if (!query) {
            renderAds(ads);
            return;
        }
        const filtered = ads.filter(ad =>
            ad.title.toLowerCase().includes(query) ||
            ad.description.toLowerCase().includes(query) ||
            ad.phone.includes(query) ||
            (ad.price+'').includes(query) ||
            ad.category.toLowerCase().includes(query)
        );
        renderAds(filtered);
    });

    // Category management
    addCategoryBtn.addEventListener('click', function() {
        newCategoryInput.value = '';
        categoryModal.style.display = 'block';
        newCategoryInput.focus();
    });
    closeModal.onclick = function() {
        categoryModal.style.display = 'none';
    };
    window.onclick = function(event) {
        if (event.target === categoryModal) {
            categoryModal.style.display = 'none';
        }
    };
    saveCategoryBtn.addEventListener('click', saveCategory);
    newCategoryInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') saveCategory();
    });

    function saveCategory() {
        const cat = newCategoryInput.value.trim();
        if (cat && !categories.includes(cat)) {
            categories.push(cat);
            localStorage.setItem('categories', JSON.stringify(categories));
            updateCategoryOptions();
            categoryModal.style.display = 'none';
            categorySelect.value = cat;
        }
    }

    function updateCategoryOptions() {
        categorySelect.innerHTML = '';
        categories.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat;
            opt.textContent = cat;
            categorySelect.appendChild(opt);
        });
    }

    function renderAds(list) {
        adsList.innerHTML = '';
        if (list.length === 0) {
            adsList.innerHTML = '<li>Ҳоло ягон эълон нест.</li>';
            return;
        }
        list.forEach(ad => {
            const li = document.createElement('li');
            li.innerHTML = `
                <button class="delete-btn" data-id="${ad.id}" title="Хориҷ кардан">×</button>
                <div class="ad-meta ad-time">${formatDate(ad.createdAt)}</div>
                <span class="ad-category">${escapeHTML(ad.category)}</span>
                <strong>${escapeHTML(ad.title)}</strong>
                <div class="ad-meta">${escapeHTML(ad.description)}</div>
                <div class="ad-meta ad-price">Нарх: ${ad.price} сомонӣ</div>
                <div class="ad-meta ad-phone">Тел: <a href="tel:${ad.phone}">${ad.phone}</a></div>
            `;
            adsList.appendChild(li);
        });
    }

    function formatDate(dateStr) {
        const d = new Date(dateStr);
        if (isNaN(d)) return '';
        return d.toLocaleDateString('ru-RU', {year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit'});
    }

    function escapeHTML(str) {
        return (str+'').replace(/[&<>"']/g, function(m) {
            return ({
                '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
            })[m];
        });
    }
});