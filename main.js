// Main JavaScript - Shared Functions

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

    setupAuthNav();

    // Load preview destinations on homepage
    loadPreviewDestinations();
});

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

function getDestinationsData() {
    return destinations;
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
