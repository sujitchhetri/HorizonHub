// Destinations Page JavaScript

let currentDestination = null;
let currentBookingData = {};

document.addEventListener('DOMContentLoaded', function() {
    displayDestinations(getDestinationsData());
    setupEventListeners();
});

function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const budgetFilter = document.getElementById('budgetFilter');
    const closeDetail = document.getElementById('closeDetail');
    const closeBooking = document.getElementById('closeBooking');
    const bookingForm = document.getElementById('bookingForm');

    if (searchInput) {
        searchInput.addEventListener('input', filterDestinations);
    }
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterDestinations);
    }
    if (budgetFilter) {
        budgetFilter.addEventListener('change', filterDestinations);
    }
    if (closeDetail) {
        closeDetail.addEventListener('click', () => closeModal('detailModal'));
    }
    if (closeBooking) {
        closeBooking.addEventListener('click', () => closeModal('bookingModal'));
    }
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBooking);
    }

    // Close modal when clicking overlay
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(e.target.parentElement.id);
            }
        });
    });
}

function displayDestinations(destinationsToShow) {
    const grid = document.getElementById('destinationsGrid');
    const noResults = document.getElementById('noResults');

    if (!grid) return;

    if (destinationsToShow.length === 0) {
        grid.innerHTML = '';
        if (noResults) {
            noResults.style.display = 'block';
        }
        return;
    }

    if (noResults) {
        noResults.style.display = 'none';
    }

    grid.innerHTML = destinationsToShow.map(dest => `
        <div class="destination-card" onclick="showDetail(${dest.id})">
            <img src="${dest.image}" alt="${dest.name}" class="destination-image">
            <div class="destination-content">
                <span class="card-category">${dest.category}</span>
                <h3>${dest.name}</h3>
                <p>${dest.description}</p>
                <div class="destination-card-footer">
                    <div>
                        <div class="card-price">NPR ${dest.price.toLocaleString()}</div>
                        <small>per person</small>
                    </div>
                    <div class="card-rating">⭐ ${dest.rating}</div>
                </div>
                <button type="button" class="btn btn-primary btn-block destination-book-btn" onclick="openBooking(${dest.id}, event)">
                    Book Now
                </button>
            </div>
        </div>
    `).join('');
}

function filterDestinations() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const budget = document.getElementById('budgetFilter').value;

    const filtered = getDestinationsData().filter(dest => {
        const matchSearch = dest.name.toLowerCase().includes(searchTerm) ||
                          dest.description.toLowerCase().includes(searchTerm);
        const matchCategory = category === 'all' || dest.category === category;
        
        let matchBudget = true;
        if (budget !== 'all') {
            const range = budgetRanges[budget];
            matchBudget = dest.price >= range.min && dest.price < range.max;
        }

        return matchSearch && matchCategory && matchBudget;
    });

    displayDestinations(filtered);
}

function showDetail(destId) {
    currentDestination = getDestinationsData().find(d => d.id === destId);
    if (!currentDestination) return;

    const modal = document.getElementById('detailModal');
    const modalBody = document.querySelector('#detailModal #modalBody');

    let addonsHTML = '';
    if (currentDestination.addons) {
        Object.keys(currentDestination.addons).forEach(key => {
            addonsHTML += `
                <div style="margin: 1rem 0;">
                    <label style="font-weight: 600; text-transform: capitalize;">${key}</label>
                    <select id="addon-${key}" style="width: 100%; padding: 0.5rem; margin-top: 0.5rem;">
                        ${currentDestination.addons[key].map(option => `
                            <option>${option}</option>
                        `).join('')}
                    </select>
                </div>
            `;
        });
    }

    modalBody.innerHTML = `
        <img src="${currentDestination.image}" alt="${currentDestination.name}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 10px; margin-bottom: 1rem;">
        
        <h2>${currentDestination.name}</h2>
        <div style="display: flex; gap: 1rem; margin: 1rem 0; flex-wrap: wrap;">
            <span class="card-category">${currentDestination.category}</span>
            <span>⏱️ ${currentDestination.duration}</span>
            <span>📊 ${currentDestination.difficulty}</span>
            <span>⭐ ${currentDestination.rating}</span>
        </div>

        <p style="margin: 1rem 0; color: #5a5a5a; line-height: 1.8;">${currentDestination.longDescription}</p>

        <h3 style="margin-top: 2rem; margin-bottom: 1rem;">Highlights</h3>
        <ul style="margin-left: 1.5rem; margin-bottom: 1.5rem;">
            ${currentDestination.highlights.map(h => `<li style="margin-bottom: 0.5rem;">✓ ${h}</li>`).join('')}
        </ul>

        <h3>Customize Your Trip</h3>
        <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 5px;">
            <div style="margin-bottom: 1rem;">
                <label style="font-weight: 600;">Number of Travelers</label>
                <input type="number" id="travelers" value="1" min="1" max="20" 
                       style="width: 100%; padding: 0.5rem; margin-top: 0.5rem;" 
                       onchange="updatePrice()">
            </div>

            ${addonsHTML}

            <div style="background: white; padding: 1rem; border-radius: 5px; margin-top: 1rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span>Base Price (per person):</span>
                    <strong>NPR ${currentDestination.price.toLocaleString()}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; padding-top: 1rem; border-top: 2px solid #eee;">
                    <span style="font-size: 1.2rem; font-weight: 600;">Total Cost:</span>
                    <strong style="font-size: 1.2rem; color: #3498db;">NPR <span id="totalPrice">${currentDestination.price.toLocaleString()}</span></strong>
                </div>
            </div>

            <button class="btn btn-primary" style="width: 100%; margin-top: 1.5rem;" onclick="openBooking()">
                Book Now
            </button>
        </div>
    `;

    modal.classList.add('active');
}

function updatePrice() {
    if (!currentDestination) return;
    const travelers = parseInt(document.getElementById('travelers').value, 10) || 1;
    const total = (Number(currentDestination.price) || 0) * travelers;
    document.getElementById('totalPrice').textContent = total.toLocaleString();
}

function openBooking(destId = null, event = null) {
    if (event) {
        event.stopPropagation();
    }

    if (destId) {
        currentDestination = getDestinationsData().find(d => d.id === destId);
    }

    if (!currentDestination) return;

    const travelersInput = document.getElementById('travelers');
    const travelers = travelersInput ? parseInt(travelersInput.value, 10) || 1 : 1;
    const pricePerPerson = Number(currentDestination.price) || 0;
    const total = pricePerPerson * travelers;

    currentBookingData = {
        destination: currentDestination.name,
        travelers: travelers,
        pricePerPerson: pricePerPerson,
        total: total
    };

    document.getElementById('bookingSummary').innerHTML = `
        <h3 style="margin-bottom: 1rem;">Trip Summary</h3>
        <p><strong>Destination:</strong> ${currentDestination.name}</p>
        <p><strong>Travelers:</strong> ${travelers}</p>
        <p><strong>Duration:</strong> ${currentDestination.duration}</p>
        <p><strong>Cost per person:</strong> NPR ${pricePerPerson.toLocaleString()}</p>
        <p><strong>Total Cost:</strong> NPR ${total.toLocaleString()}</p>
    `;

    closeModal('detailModal');
    document.getElementById('bookingModal').classList.add('active');
}

function handleBooking(e) {
    e.preventDefault();

    const booking = {
        id: Date.now(),
        destination: currentBookingData.destination,
        travelers: currentBookingData.travelers,
        pricePerPerson: currentBookingData.pricePerPerson,
        total: currentBookingData.total,
        name: document.getElementById('bookingName').value,
        email: document.getElementById('bookingEmail').value,
        phone: document.getElementById('bookingPhone').value,
        emergency: document.getElementById('emergencyContact').value,
        requests: document.getElementById('specialRequests').value,
        date: new Date().toISOString()
    };

    let bookings = JSON.parse(localStorage.getItem('horizonhub_bookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('horizonhub_bookings', JSON.stringify(bookings));

    closeModal('bookingModal');
    showToast('✓ Booking confirmed! View it in My Bookings.');
    document.getElementById('bookingForm').reset();
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}
