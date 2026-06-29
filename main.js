// Main JavaScript - Shared Functions

const ADMIN_PASSWORD = 'admin123';
const ADMIN_VISIBLE_BY_DEFAULT = false;
const ADMIN_SHOW_URL = 'admin=1';
const ADMIN_HIDE_URL = 'admin=0';
const ADMIN_VISIBILITY_KEY = 'horizonHubAdminVisible';
const ADMIN_DESTINATIONS_KEY = 'horizonHubDestinations';

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    setupAdminAccess();
    setupAuthNav();

    // Load preview destinations on homepage
    loadPreviewDestinations();

    // Sync destination data across tabs/pages
    setupStorageSync();
});

// Listen for changes to localStorage from other tabs/pages
function setupStorageSync() {
    window.addEventListener('storage', function(e) {
        // Only refresh when destinations data changes
        if (e.key === ADMIN_DESTINATIONS_KEY || e.key === null) {
            refreshDestinationViews();
        }
    });
}

function setupAuthNav() {
    const navMenu = document.getElementById('navMenu');
    if (!navMenu || typeof getCurrentUser !== 'function') return;

    let authLink = document.getElementById('authNavLink');
    if (!authLink) {
        authLink = document.createElement('a');
        authLink.id = 'authNavLink';
        authLink.className = 'nav-link';
        navMenu.appendChild(authLink);
    }

    const currentUser = getCurrentUser();
    if (currentUser) {
        authLink.href = '#';
        authLink.textContent = `Logout (${currentUser.name})`;
        authLink.addEventListener('click', function(e) {
            e.preventDefault();
            logoutUser();
            window.location.href = 'login.html';
        });
    } else {
        authLink.href = getLoginUrl();
        authLink.textContent = 'Login';
    }
}

// Hidden Admin Access
function setupAdminAccess() {
    const adminBtn = document.getElementById('adminBtn');
    if (!adminBtn) return;

    const params = new URLSearchParams(window.location.search);
    const showAdminParam = ADMIN_SHOW_URL.split('=');
    const hideAdminParam = ADMIN_HIDE_URL.split('=');

    if (params.get(showAdminParam[0]) === showAdminParam[1]) {
        localStorage.setItem(ADMIN_VISIBILITY_KEY, 'true');
    }

    if (params.get(hideAdminParam[0]) === hideAdminParam[1]) {
        localStorage.removeItem(ADMIN_VISIBILITY_KEY);
    }

    if (ADMIN_VISIBLE_BY_DEFAULT || localStorage.getItem(ADMIN_VISIBILITY_KEY) === 'true') {
        adminBtn.hidden = false;
    }

    adminBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const password = prompt('Enter admin password:');
        if (password === ADMIN_PASSWORD) {
            showAdminPanel();
        } else if (password !== null) {
            alert('Incorrect password!');
        }
    });
}

// Load top 3 destinations for preview
function loadPreviewDestinations() {
    const previewGrid = document.getElementById('previewGrid');
    if (!previewGrid) return;

    const topDestinations = getDestinationsData().slice(0, 3);
    
    previewGrid.innerHTML = topDestinations.map(dest => `
        <div class="preview-card">
            <img src="${dest.image}" alt="${dest.name}" class="preview-image">
            <div class="preview-content">
                <span class="card-category">${dest.category}</span>
                <h3>${dest.name}</h3>
                <p>${dest.description}</p>
                <div class="preview-footer">
                    <div>
                        <div class="card-price">NPR ${dest.price.toLocaleString()}</div>
                        <small>per person</small>
                    </div>
                    <div class="card-rating">⭐ ${dest.rating}</div>
                </div>
                <a href="destinations.html" class="preview-button">View Details →</a>
            </div>
        </div>
    `).join('');
}

// Admin Panel
function showAdminPanel() {
    renderAdminPanel();
}

function getDestinationsData() {
    const savedDestinations = localStorage.getItem(ADMIN_DESTINATIONS_KEY);
    return savedDestinations ? JSON.parse(savedDestinations) : destinations;
}

function saveDestinationsData(updatedDestinations) {
    localStorage.setItem(ADMIN_DESTINATIONS_KEY, JSON.stringify(updatedDestinations));
}

function refreshDestinationViews() {
    if (typeof filterDestinations === 'function') {
        filterDestinations();
    }

    loadPreviewDestinations();
}

function renderAdminPanel(editId = null) {
    const adminModal = getAdminModal();
    const adminDestinations = getDestinationsData();
    const editingDestination = editId ? adminDestinations.find(dest => dest.id === editId) : null;

    adminModal.querySelector('.admin-modal-body').innerHTML = `
        <div class="admin-panel">
            <div class="admin-form-wrap">
                <h2>${editingDestination ? 'Edit Destination' : 'Add Destination'}</h2>
                <form id="adminDestinationForm">
                    <input type="hidden" id="adminDestinationId" value="${editingDestination ? editingDestination.id : ''}">

                    <div class="form-row">
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" id="adminName" value="${editingDestination ? escapeHTML(editingDestination.name) : ''}" required>
                        </div>
                        <div class="form-group">
                            <label>Category</label>
                            <select id="adminCategory" required>
                                ${getCategoryOptions(editingDestination ? editingDestination.category : 'trekking')}
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Short Description</label>
                        <textarea id="adminDescription" rows="2" required>${editingDestination ? escapeHTML(editingDestination.description) : ''}</textarea>
                    </div>

                    <div class="form-group">
                        <label>Long Description</label>
                        <textarea id="adminLongDescription" rows="3" required>${editingDestination ? escapeHTML(editingDestination.longDescription) : ''}</textarea>
                    </div>

                    <div class="form-group">
                        <label>Image URL</label>
                        <input type="url" id="adminImage" value="${editingDestination ? escapeHTML(editingDestination.image) : ''}" required>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>Price</label>
                            <input type="number" id="adminPrice" min="0" value="${editingDestination ? editingDestination.price : ''}" required>
                        </div>
                        <div class="form-group">
                            <label>Rating</label>
                            <input type="number" id="adminRating" min="1" max="5" step="0.1" value="${editingDestination ? editingDestination.rating : '4.5'}" required>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>Duration</label>
                            <input type="text" id="adminDuration" value="${editingDestination ? escapeHTML(editingDestination.duration) : ''}" required>
                        </div>
                        <div class="form-group">
                            <label>Difficulty</label>
                            <select id="adminDifficulty" required>
                                ${getDifficultyOptions(editingDestination ? editingDestination.difficulty : 'Easy')}
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Highlights, one per line</label>
                        <textarea id="adminHighlights" rows="4" required>${editingDestination ? escapeHTML(editingDestination.highlights.join('\n')) : ''}</textarea>
                    </div>

                    <div class="admin-actions">
                        <button type="submit" class="btn btn-primary">${editingDestination ? 'Save Changes' : 'Add Destination'}</button>
                        ${editingDestination ? '<button type="button" class="btn admin-secondary-btn" id="adminCancelEdit">Cancel</button>' : ''}
                    </div>
                </form>
            </div>

            <div class="admin-list-wrap">
                <h2>Manage Destinations</h2>
                <div class="admin-destination-list">
                    ${adminDestinations.map(dest => `
                        <div class="admin-destination-item">
                            <div>
                                <strong>${escapeHTML(dest.name)}</strong>
                                <span>${escapeHTML(dest.category)} | NPR ${dest.price.toLocaleString()}</span>
                            </div>
                            <div class="admin-item-actions">
                                <button type="button" class="admin-small-btn" onclick="renderAdminPanel(${dest.id})">Edit</button>
                                <button type="button" class="admin-small-btn admin-danger-btn" onclick="deleteDestination(${dest.id})">Delete</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    adminModal.classList.add('active');
    document.getElementById('adminDestinationForm').addEventListener('submit', saveAdminDestination);

    const cancelEdit = document.getElementById('adminCancelEdit');
    if (cancelEdit) {
        cancelEdit.addEventListener('click', () => renderAdminPanel());
    }
}

function getAdminModal() {
    let adminModal = document.getElementById('adminModal');

    if (!adminModal) {
        adminModal = document.createElement('div');
        adminModal.id = 'adminModal';
        adminModal.className = 'modal';
        adminModal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content admin-modal-content">
                <button class="modal-close" id="closeAdmin">&times;</button>
                <div class="admin-modal-body"></div>
            </div>
        `;
        document.body.appendChild(adminModal);

        adminModal.querySelector('.modal-overlay').addEventListener('click', () => closeModal('adminModal'));
        adminModal.querySelector('#closeAdmin').addEventListener('click', () => closeModal('adminModal'));
    }

    return adminModal;
}

function saveAdminDestination(e) {
    e.preventDefault();

    const adminDestinations = getDestinationsData();
    const destinationId = Number(document.getElementById('adminDestinationId').value);
    const formDestination = {
        id: destinationId || Date.now(),
        name: document.getElementById('adminName').value.trim(),
        category: document.getElementById('adminCategory').value,
        description: document.getElementById('adminDescription').value.trim(),
        longDescription: document.getElementById('adminLongDescription').value.trim(),
        image: document.getElementById('adminImage').value.trim(),
        price: Number(document.getElementById('adminPrice').value),
        rating: Number(document.getElementById('adminRating').value),
        duration: document.getElementById('adminDuration').value.trim(),
        difficulty: document.getElementById('adminDifficulty').value,
        highlights: document.getElementById('adminHighlights').value
            .split('\n')
            .map(highlight => highlight.trim())
            .filter(Boolean),
        addons: {
            hotel: ['Budget Hotel (Free)', 'Standard Hotel (+NPR 5,000)', 'Premium Hotel (+NPR 12,000)'],
            guide: ['Self-Guided (Free)', 'Local Guide (+NPR 4,000)', 'Expert Guide (+NPR 9,000)']
        }
    };

    const updatedDestinations = destinationId
        ? adminDestinations.map(dest => dest.id === destinationId ? formDestination : dest)
        : [...adminDestinations, formDestination];

    saveDestinationsData(updatedDestinations);
    refreshDestinationViews();
    renderAdminPanel();
    showToast(destinationId ? 'Destination updated.' : 'Destination added.');
}

function deleteDestination(destinationId) {
    if (!confirm('Delete this destination?')) return;

    const updatedDestinations = getDestinationsData().filter(dest => dest.id !== destinationId);
    saveDestinationsData(updatedDestinations);
    refreshDestinationViews();
    renderAdminPanel();
    showToast('Destination deleted.');
}

function getCategoryOptions(selectedCategory) {
    return ['trekking', 'cultural', 'adventure', 'relaxation'].map(category => `
        <option value="${category}" ${category === selectedCategory ? 'selected' : ''}>${category}</option>
    `).join('');
}

function getDifficultyOptions(selectedDifficulty) {
    return ['Easy', 'Moderate', 'Challenging'].map(difficulty => `
        <option value="${difficulty}" ${difficulty === selectedDifficulty ? 'selected' : ''}>${difficulty}</option>
    `).join('');
}

function escapeHTML(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Toast Notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #2ecc71;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}
