// Configuration
const CONFIG = {
    ADMIN_PASSWORD: 'admin123',  // Change this to your preferred password
    SHOW_ADMIN_BUTTON: false      // Set to false to completely hide admin button
};

// Global state
let currentDestination = null;
let calculatedPrice = { perPerson: 0, total: 0, breakdown: {} };
let selectedAddons = {};
let addonBuilderCount = 0;
let editingDestinationId = null;

// Load destinations from localStorage or use default
let destinationsData = JSON.parse(localStorage.getItem('horizonhub_destinations')) || destinations;

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    renderDestinations(destinationsData);
    initializeEventListeners();
    
    // Hide admin button if configured
    if (!CONFIG.SHOW_ADMIN_BUTTON) {
        const adminBtn = document.getElementById('adminPanelBtn');
        if (adminBtn) adminBtn.style.display = 'none';
    }
});

// Event Listeners
function initializeEventListeners() {
    // Search input
    document.getElementById('searchInput').addEventListener('input', filterDestinations);
    
    // Filter selects
    document.getElementById('categoryFilter').addEventListener('change', filterDestinations);
    document.getElementById('budgetFilter').addEventListener('change', filterDestinations);
    
    // Modal close buttons
    document.getElementById('closeDetailModal').addEventListener('click', () => closeModal('detailModal'));
    document.getElementById('closeBookingModal').addEventListener('click', () => closeModal('bookingModal'));
    document.getElementById('closeBookingsModal').addEventListener('click', () => closeModal('bookingsModal'));
    document.getElementById('closeAdminModal').addEventListener('click', () => closeModal('adminModal'));
    
    // Modal overlays
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) closeModal(modal.id);
        });
    });
    
    // Booking form
    document.getElementById('bookingForm').addEventListener('submit', handleBookingSubmit);
    
    // View bookings button
    document.getElementById('viewBookingsBtn').addEventListener('click', (e) => {
        e.preventDefault();
        showBookings();
    });
    
    // Admin panel button
    document.getElementById('adminPanelBtn').addEventListener('click', (e) => {
        e.preventDefault();
        openAdminPanel();
    });
    
    // Add destination form
    document.getElementById('addDestinationForm').addEventListener('submit', handleAddDestination);
}

// Render destinations to grid
function renderDestinations(destinationsToRender) {
    const grid = document.getElementById('destinationsGrid');
    const noResults = document.getElementById('noResults');
    
    if (destinationsToRender.length === 0) {
        grid.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    grid.innerHTML = destinationsToRender.map(dest => `
        <div class="destination-card" onclick="showDestinationDetail(${dest.id})">
            <img src="${dest.image}" alt="${dest.name}" class="card-image">
            <div class="card-content">
                <div class="card-header">
                    <h3 class="card-title">${dest.name}</h3>
                    <span class="card-category">${dest.category}</span>
                </div>
                <p class="card-description">${dest.description}</p>
                <div class="card-footer">
                    <div>
                        <div class="card-price">NPR ${dest.basePrice.toLocaleString()}</div>
                        <div class="card-price-label">starting from / person</div>
                    </div>
                    <div class="card-rating">
                        ⭐ ${dest.rating}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter destinations
function filterDestinations() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const budget = document.getElementById('budgetFilter').value;
    
    let filtered = destinationsData.filter(dest => {
        // Search filter
        const matchesSearch = dest.name.toLowerCase().includes(searchTerm) || 
                            dest.description.toLowerCase().includes(searchTerm) ||
                            dest.category.toLowerCase().includes(searchTerm);
        
        // Category filter
        const matchesCategory = category === 'all' || dest.category === category;
        
        // Budget filter
        let matchesBudget = true;
        if (budget !== 'all') {
            const range = budgetRanges[budget];
            matchesBudget = dest.basePrice >= range.min && dest.basePrice < range.max;
        }
        
        return matchesSearch && matchesCategory && matchesBudget;
    });
    
    renderDestinations(filtered);
}

// Show destination detail modal
function showDestinationDetail(id) {
    currentDestination = destinationsData.find(d => d.id === id);
    if (!currentDestination) return;
    
    // Reset selected addons
    selectedAddons = {};
    currentDestination.addons.forEach(addon => {
        selectedAddons[addon.id] = addon.options[0].value;
    });
    
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
        <div class="detail-header">
            <img src="${currentDestination.image}" alt="${currentDestination.name}" class="detail-image">
            <h2 class="detail-title">${currentDestination.name}</h2>
            <div class="detail-meta">
                <span class="card-category">${currentDestination.category}</span>
                <span>⏱️ ${currentDestination.duration}</span>
                <span>📊 ${currentDestination.difficulty}</span>
                <span>⭐ ${currentDestination.rating}</span>
            </div>
        </div>
        
        <div class="detail-description">
            <p>${currentDestination.longDescription}</p>
        </div>
        
        <div style="margin-bottom: 2rem;">
            <h3 style="font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 1rem;">Highlights</h3>
            <ul style="list-style: none; padding: 0;">
                ${currentDestination.highlights.map(h => `<li style="padding: 0.5rem 0; color: var(--text-secondary);">✓ ${h}</li>`).join('')}
            </ul>
        </div>
        
        <div class="calculator-section">
            <h3 class="calculator-title">💰 Calculate Your Trip Cost</h3>
            
            <div class="calculator-group">
                <label for="numTravelers">Number of Travelers (min: ${currentDestination.minTravelers})</label>
                <input 
                    type="number" 
                    id="numTravelers" 
                    class="calculator-input" 
                    value="${currentDestination.minTravelers}" 
                    min="${currentDestination.minTravelers}" 
                    max="20"
                    onchange="updateCalculation()"
                >
            </div>
            
            ${currentDestination.addons.map(addon => renderAddonOptions(addon)).join('')}
            
            <div class="price-summary">
                <div class="price-row">
                    <span>Base Price (per person):</span>
                    <span class="price-value" id="basePriceDisplay">NPR ${currentDestination.basePrice.toLocaleString()}</span>
                </div>
                <div id="addonBreakdown"></div>
                <div class="price-row total">
                    <span>Cost Per Person:</span>
                    <span class="price-value total" id="perPersonPrice">NPR ${currentDestination.basePrice.toLocaleString()}</span>
                </div>
                <div class="price-row total">
                    <span>Total Trip Cost:</span>
                    <span class="price-value total" id="totalPrice">NPR ${(currentDestination.basePrice * currentDestination.minTravelers).toLocaleString()}</span>
                </div>
            </div>
            
            <button class="book-button" onclick="openBookingModal()">
                Book This Trip
                <span class="arrow">→</span>
            </button>
        </div>
    `;
    
    openModal('detailModal');
    updateCalculation();
}

// Render addon options
function renderAddonOptions(addon) {
    return `
        <div class="calculator-group">
            <label>${addon.label}</label>
            <div class="addon-options">
                ${addon.options.map(option => `
                    <label class="addon-option">
                        <div>
                            <input 
                                type="radio" 
                                name="${addon.id}" 
                                value="${option.value}"
                                ${option.value === selectedAddons[addon.id] ? 'checked' : ''}
                                onchange="handleAddonChange('${addon.id}', '${option.value}')"
                            >
                            ${option.label}
                        </div>
                        <span class="addon-price">
                            ${option.price === 0 ? 'Included' : 
                              option.perGroup ? `+NPR ${option.price.toLocaleString()} (total)` :
                              `+NPR ${option.price.toLocaleString()}`}
                        </span>
                    </label>
                `).join('')}
            </div>
        </div>
    `;
}

// Handle addon change
function handleAddonChange(addonId, value) {
    selectedAddons[addonId] = value;
    updateCalculation();
}

// Update price calculation
function updateCalculation() {
    if (!currentDestination) return;
    
    const numTravelers = parseInt(document.getElementById('numTravelers').value) || currentDestination.minTravelers;
    
    // Ensure minimum travelers
    if (numTravelers < currentDestination.minTravelers) {
        document.getElementById('numTravelers').value = currentDestination.minTravelers;
        return;
    }
    
    let perPersonCost = currentDestination.basePrice;
    let totalGroupCost = 0;
    const breakdown = {};
    
    // Calculate addon costs
    currentDestination.addons.forEach(addon => {
        const selectedValue = selectedAddons[addon.id];
        const selectedOption = addon.options.find(opt => opt.value === selectedValue);
        
        if (selectedOption && selectedOption.price > 0) {
            if (selectedOption.perGroup) {
                // Cost is for the entire group, divide by number of travelers
                const perPersonAddon = selectedOption.price / numTravelers;
                perPersonCost += perPersonAddon;
                totalGroupCost += selectedOption.price;
                breakdown[addon.label] = {
                    perPerson: perPersonAddon,
                    total: selectedOption.price,
                    isGroup: true
                };
            } else {
                // Cost is per person
                perPersonCost += selectedOption.price;
                totalGroupCost += selectedOption.price * numTravelers;
                breakdown[addon.label] = {
                    perPerson: selectedOption.price,
                    total: selectedOption.price * numTravelers,
                    isGroup: false
                };
            }
        }
    });
    
    const totalCost = perPersonCost * numTravelers;
    
    // Update display
    document.getElementById('perPersonPrice').textContent = `NPR ${Math.round(perPersonCost).toLocaleString()}`;
    document.getElementById('totalPrice').textContent = `NPR ${Math.round(totalCost).toLocaleString()}`;
    
    // Update breakdown display
    const breakdownHtml = Object.entries(breakdown).map(([label, costs]) => `
        <div class="price-row">
            <span>${label}${costs.isGroup ? ' (shared)' : ''}:</span>
            <span class="price-value">+NPR ${Math.round(costs.perPerson).toLocaleString()}</span>
        </div>
    `).join('');
    
    document.getElementById('addonBreakdown').innerHTML = breakdownHtml;
    
    // Store calculated price
    calculatedPrice = {
        perPerson: Math.round(perPersonCost),
        total: Math.round(totalCost),
        numTravelers: numTravelers,
        breakdown: breakdown
    };
}

// Open booking modal
function openBookingModal() {
    const summary = `
        <h3 style="font-family: var(--font-display); margin-bottom: 1rem;">Trip Summary</h3>
        <p><strong>Destination:</strong> ${currentDestination.name}</p>
        <p><strong>Travelers:</strong> ${calculatedPrice.numTravelers} person(s)</p>
        <p><strong>Duration:</strong> ${currentDestination.duration}</p>
        <p><strong>Cost per person:</strong> NPR ${calculatedPrice.perPerson.toLocaleString()}</p>
        <p><strong>Total cost:</strong> NPR ${calculatedPrice.total.toLocaleString()}</p>
    `;
    
    document.getElementById('bookingSummary').innerHTML = summary;
    closeModal('detailModal');
    openModal('bookingModal');
}

// Handle booking form submission
function handleBookingSubmit(e) {
    e.preventDefault();
    
    const booking = {
        id: Date.now(),
        destination: currentDestination.name,
        destinationId: currentDestination.id,
        travelers: calculatedPrice.numTravelers,
        perPersonCost: calculatedPrice.perPerson,
        totalCost: calculatedPrice.total,
        duration: currentDestination.duration,
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        emergencyContact: document.getElementById('emergencyContact').value,
        specialRequests: document.getElementById('specialRequests').value,
        bookingDate: new Date().toISOString(),
        selectedAddons: { ...selectedAddons },
        breakdown: { ...calculatedPrice.breakdown }
    };
    
    // Save to localStorage
    saveBooking(booking);
    
    // Reset form
    document.getElementById('bookingForm').reset();
    
    // Close modal and show success
    closeModal('bookingModal');
    showToast('Booking confirmed! Check "My Bookings" to view your trip details.');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Save booking to localStorage
function saveBooking(booking) {
    let bookings = JSON.parse(localStorage.getItem('horizonhub_bookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('horizonhub_bookings', JSON.stringify(bookings));
}

// Get all bookings from localStorage
function getBookings() {
    return JSON.parse(localStorage.getItem('horizonhub_bookings') || '[]');
}

// Show bookings modal
function showBookings() {
    const bookings = getBookings();
    const bookingsList = document.getElementById('bookingsList');
    
    if (bookings.length === 0) {
        bookingsList.innerHTML = '<div class="no-bookings">No bookings yet. Start exploring destinations!</div>';
    } else {
        bookingsList.innerHTML = bookings.map(booking => `
            <div class="booking-item">
                <h3>${booking.destination}</h3>
                <p><strong>Booked on:</strong> ${new Date(booking.bookingDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                })}</p>
                <p><strong>Name:</strong> ${booking.fullName}</p>
                <p><strong>Email:</strong> ${booking.email}</p>
                <p><strong>Phone:</strong> ${booking.phone}</p>
                <p><strong>Travelers:</strong> ${booking.travelers} person(s)</p>
                <p><strong>Duration:</strong> ${booking.duration}</p>
                <p><strong>Cost per person:</strong> NPR ${booking.perPersonCost.toLocaleString()}</p>
                <p><strong>Total cost:</strong> NPR ${booking.totalCost.toLocaleString()}</p>
                ${booking.specialRequests ? `<p><strong>Special requests:</strong> ${booking.specialRequests}</p>` : ''}
                <button class="submit-button" style="margin-top: 1rem;" onclick="deleteBooking(${booking.id})">
                    Delete Booking
                </button>
            </div>
        `).join('');
    }
    
    openModal('bookingsModal');
}

// Delete booking
function deleteBooking(bookingId) {
    if (confirm('Are you sure you want to delete this booking?')) {
        let bookings = getBookings();
        bookings = bookings.filter(b => b.id !== bookingId);
        localStorage.setItem('horizonhub_bookings', JSON.stringify(bookings));
        showBookings(); // Refresh the list
        showToast('Booking deleted successfully');
    }
}

// Modal functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Toast notification
function showToast(message) {
    const toast = document.getElementById('successToast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ============================================
// ADMIN PANEL FUNCTIONS
// ============================================

// Open admin panel with password protection
function openAdminPanel() {
    const password = prompt('Enter admin password to continue:');
    
    // Check password from config
    if (password === CONFIG.ADMIN_PASSWORD) {
        openModal('adminModal');
        switchAdminTab('add');
        renderManageDestinations();
    } else if (password !== null) {
        // User didn't click cancel
        alert('Incorrect password! Access denied.');
    }
}

// Switch between admin tabs
function switchAdminTab(tab) {
    // Hide all tabs
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    if (tab === 'add') {
        document.getElementById('addDestinationTab').classList.add('active');
        document.querySelector('.tab-button:nth-child(1)').classList.add('active');
    } else if (tab === 'manage') {
        document.getElementById('manageDestinationTab').classList.add('active');
        document.querySelector('.tab-button:nth-child(2)').classList.add('active');
        renderManageDestinations();
    } else if (tab === 'import') {
        document.getElementById('importExportTab').classList.add('active');
        document.querySelector('.tab-button:nth-child(3)').classList.add('active');
    }
}

// Add addon builder UI
function addAddonBuilder() {
    const addonsList = document.getElementById('addonsList');
    const id = ++addonBuilderCount;
    
    const addonHtml = `
        <div class="addon-item" id="addon-${id}">
            <div class="addon-header">
                <input type="text" 
                       class="calculator-input" 
                       placeholder="Add-on Label (e.g., Hotel Category)" 
                       id="addon-label-${id}" 
                       required>
                <button type="button" class="remove-btn" onclick="removeAddon(${id})">Remove</button>
            </div>
            
            <div class="form-group">
                <label>Add-on Type</label>
                <select class="calculator-input" id="addon-type-${id}">
                    <option value="hotel">Hotel</option>
                    <option value="transport">Transport</option>
                    <option value="guide">Guide</option>
                    <option value="activities">Activities</option>
                    <option value="other">Other</option>
                </select>
            </div>
            
            <div class="addon-options-builder" id="addon-options-${id}">
                <!-- Options will be added here -->
            </div>
            
            <button type="button" class="add-option-btn" onclick="addAddonOption(${id})">+ Add Option</button>
        </div>
    `;
    
    addonsList.insertAdjacentHTML('beforeend', addonHtml);
    
    // Add first option automatically
    addAddonOption(id);
}

// Remove addon builder
function removeAddon(id) {
    document.getElementById(`addon-${id}`).remove();
}

// Add option to addon builder
function addAddonOption(addonId) {
    const optionsContainer = document.getElementById(`addon-options-${addonId}`);
    const optionId = Date.now();
    
    const optionHtml = `
        <div class="addon-option-item" id="option-${optionId}">
            <input type="text" 
                   class="calculator-input" 
                   placeholder="Option name (e.g., Budget Hotel)" 
                   data-addon="${addonId}" 
                   data-field="label" 
                   required>
            <input type="number" 
                   class="calculator-input" 
                   placeholder="Price (0 for included)" 
                   data-addon="${addonId}" 
                   data-field="price" 
                   min="0" 
                   value="0" 
                   required>
            <div class="checkbox-group">
                <input type="checkbox" id="pergroup-${optionId}" data-addon="${addonId}" data-field="perGroup">
                <label for="pergroup-${optionId}">Per Group</label>
            </div>
            <button type="button" class="remove-btn" onclick="removeAddonOption(${optionId})">×</button>
        </div>
    `;
    
    optionsContainer.insertAdjacentHTML('beforeend', optionHtml);
}

// Remove addon option
function removeAddonOption(optionId) {
    document.getElementById(`option-${optionId}`).remove();
}

// Handle add destination form submission
function handleAddDestination(e) {
    e.preventDefault();
    
    // Collect basic info
    const newDestination = {
        id: editingDestinationId || Date.now(),
        name: document.getElementById('destName').value,
        category: document.getElementById('destCategory').value,
        description: document.getElementById('destDescription').value,
        longDescription: document.getElementById('destLongDescription').value,
        image: document.getElementById('destImage').value,
        rating: parseFloat(document.getElementById('destRating').value),
        basePrice: parseInt(document.getElementById('destBasePrice').value),
        minTravelers: parseInt(document.getElementById('destMinTravelers').value),
        duration: document.getElementById('destDuration').value,
        difficulty: document.getElementById('destDifficulty').value,
        highlights: document.getElementById('destHighlights').value.split('\n').filter(h => h.trim()),
        addons: []
    };
    
    // Collect addons
    const addonItems = document.querySelectorAll('.addon-item');
    addonItems.forEach(addonItem => {
        const addonId = addonItem.id.replace('addon-', '');
        const label = document.getElementById(`addon-label-${addonId}`).value;
        const type = document.getElementById(`addon-type-${addonId}`).value;
        
        const options = [];
        const optionInputs = addonItem.querySelectorAll('.addon-option-item');
        
        optionInputs.forEach(optionInput => {
            const inputs = optionInput.querySelectorAll('input, select');
            let optionData = { value: '', label: '', price: 0 };
            
            inputs.forEach(input => {
                const field = input.dataset.field;
                if (field === 'label') {
                    optionData.label = input.value;
                    optionData.value = input.value.toLowerCase().replace(/\s+/g, '_');
                } else if (field === 'price') {
                    optionData.price = parseInt(input.value) || 0;
                } else if (field === 'perGroup' && input.checked) {
                    optionData.perGroup = true;
                }
            });
            
            if (optionData.label) {
                options.push(optionData);
            }
        });
        
        if (label && options.length > 0) {
            newDestination.addons.push({
                id: `${type}_${addonId}`,
                type: type,
                label: label,
                options: options
            });
        }
    });
    
    // Save destination
    if (editingDestinationId) {
        // Edit existing
        const index = destinationsData.findIndex(d => d.id === editingDestinationId);
        if (index !== -1) {
            destinationsData[index] = newDestination;
        }
        showToast('Destination updated successfully!');
        editingDestinationId = null;
    } else {
        // Add new
        destinationsData.push(newDestination);
        showToast('Destination added successfully!');
    }
    
    // Save to localStorage
    saveDestinationsToStorage();
    
    // Reset form
    document.getElementById('addDestinationForm').reset();
    document.getElementById('addonsList').innerHTML = '';
    addonBuilderCount = 0;
    
    // Refresh display
    renderDestinations(destinationsData);
    renderManageDestinations();
}

// Save destinations to localStorage
function saveDestinationsToStorage() {
    localStorage.setItem('horizonhub_destinations', JSON.stringify(destinationsData));
}

// Render manage destinations list
function renderManageDestinations() {
    const list = document.getElementById('destinationManageList');
    
    if (destinationsData.length === 0) {
        list.innerHTML = '<div class="no-results">No destinations available. Add some destinations!</div>';
        return;
    }
    
    list.innerHTML = destinationsData.map(dest => `
        <div class="destination-manage-item">
            <div class="destination-manage-info">
                <h3>${dest.name}</h3>
                <p><strong>Category:</strong> ${dest.category} | <strong>Price:</strong> NPR ${dest.basePrice.toLocaleString()} | <strong>Rating:</strong> ${dest.rating} ⭐</p>
                <p>${dest.description}</p>
            </div>
            <div class="destination-manage-actions">
                <button class="edit-btn" onclick="editDestination(${dest.id})">Edit</button>
                <button class="delete-btn" onclick="deleteDestination(${dest.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Edit destination
function editDestination(id) {
    const dest = destinationsData.find(d => d.id === id);
    if (!dest) return;
    
    // Switch to add tab
    switchAdminTab('add');
    
    // Fill in the form
    document.getElementById('destName').value = dest.name;
    document.getElementById('destCategory').value = dest.category;
    document.getElementById('destDescription').value = dest.description;
    document.getElementById('destLongDescription').value = dest.longDescription;
    document.getElementById('destImage').value = dest.image;
    document.getElementById('destRating').value = dest.rating;
    document.getElementById('destBasePrice').value = dest.basePrice;
    document.getElementById('destDuration').value = dest.duration;
    document.getElementById('destDifficulty').value = dest.difficulty;
    document.getElementById('destMinTravelers').value = dest.minTravelers;
    document.getElementById('destHighlights').value = dest.highlights.join('\n');
    
    // Clear and rebuild addons
    document.getElementById('addonsList').innerHTML = '';
    addonBuilderCount = 0;
    
    dest.addons.forEach(addon => {
        addAddonBuilder();
        const currentId = addonBuilderCount;
        
        document.getElementById(`addon-label-${currentId}`).value = addon.label;
        document.getElementById(`addon-type-${currentId}`).value = addon.type;
        
        // Clear default option
        document.getElementById(`addon-options-${currentId}`).innerHTML = '';
        
        // Add options
        addon.options.forEach(option => {
            addAddonOption(currentId);
            const optionInputs = document.querySelector(`#addon-options-${currentId} .addon-option-item:last-child`);
            const inputs = optionInputs.querySelectorAll('input');
            
            inputs.forEach(input => {
                if (input.dataset.field === 'label') input.value = option.label;
                if (input.dataset.field === 'price') input.value = option.price;
                if (input.dataset.field === 'perGroup' && option.perGroup) input.checked = true;
            });
        });
    });
    
    // Set editing mode
    editingDestinationId = id;
    
    // Update button text
    const submitBtn = document.querySelector('#addDestinationForm button[type="submit"]');
    submitBtn.innerHTML = 'Update Destination <span class="arrow">→</span>';
    
    showToast('Editing destination - modify and submit to update');
}

// Delete destination
function deleteDestination(id) {
    if (!confirm('Are you sure you want to delete this destination? This cannot be undone.')) {
        return;
    }
    
    destinationsData = destinationsData.filter(d => d.id !== id);
    saveDestinationsToStorage();
    renderDestinations(destinationsData);
    renderManageDestinations();
    showToast('Destination deleted successfully');
}

// Export destinations to JSON
function exportDestinations() {
    const dataStr = JSON.stringify(destinationsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `horizonhub-destinations-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    showToast('Destinations exported successfully!');
}

// Import destinations from JSON
function importDestinations() {
    const fileInput = document.getElementById('importFile');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select a JSON file to import');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            
            if (!Array.isArray(imported)) {
                alert('Invalid JSON format. Expected an array of destinations.');
                return;
            }
            
            // Merge with existing (avoid ID conflicts)
            const maxId = Math.max(...destinationsData.map(d => d.id), 0);
            imported.forEach((dest, index) => {
                dest.id = maxId + index + 1;
                destinationsData.push(dest);
            });
            
            saveDestinationsToStorage();
            renderDestinations(destinationsData);
            renderManageDestinations();
            fileInput.value = '';
            showToast(`Successfully imported ${imported.length} destination(s)!`);
        } catch (error) {
            alert('Error parsing JSON file: ' + error.message);
        }
    };
    
    reader.readAsText(file);
}

// Reset to default destinations
function resetToDefault() {
    if (!confirm('This will restore the original 8 destinations and remove any custom destinations you added. Continue?')) {
        return;
    }
    
    destinationsData = JSON.parse(JSON.stringify(destinations)); // Deep copy
    saveDestinationsToStorage();
    renderDestinations(destinationsData);
    renderManageDestinations();
    showToast('Destinations reset to default!');
}
