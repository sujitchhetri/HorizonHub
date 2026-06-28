// Bookings Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    displayBookings();
});

function formatBookingDate(dateValue) {
    if (!dateValue) return 'Not selected';

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
        const [year, month, day] = dateValue.split('-').map(Number);
        return new Date(year, month - 1, day).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return 'Not selected';

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function displayBookings() {
    const bookingsList = document.getElementById('bookingsList');
    if (!bookingsList) return;

    if (typeof isLoggedIn === 'function' && !isLoggedIn()) {
        bookingsList.innerHTML = `
            <div class="empty-state">
                <h2>Login Required</h2>
                <p>Please login to view and manage your bookings.</p>
                <a href="${getLoginUrl()}" class="btn btn-primary" style="margin-top: 2rem; display: inline-block;">
                    Login
                </a>
            </div>
        `;
        return;
    }

    const currentUser = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    const bookings = typeof getUserBookings === 'function' ? getUserBookings() : [];

    if (bookings.length === 0) {
        bookingsList.innerHTML = `
            <div class="empty-state">
                <h2>📅 No Bookings Yet</h2>
                <p>${currentUser.name}, you haven't made any bookings yet. Start exploring destinations!</p>
                <a href="destinations.html" class="btn btn-primary" style="margin-top: 2rem; display: inline-block;">
                    Browse Destinations
                </a>
            </div>
        `;
        return;
    }

    bookingsList.innerHTML = bookings.map(booking => {
        const travelers = parseInt(booking.travelers, 10) || 1;
        const pricePerPerson = Number(booking.pricePerPerson) || 0;
        const total = Number(booking.total) || pricePerPerson * travelers;
        const selectedAddons = Array.isArray(booking.selectedAddons) ? booking.selectedAddons : [];
        const addonsTotal = Number(booking.addonsTotal) || 0;

        return `
        <div class="booking-item">
            <h3>${booking.destination}</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 1rem;">
                <div>
                    <p><strong>Travel Date:</strong> ${formatBookingDate(booking.travelDate)}</p>
                    <p><strong>Booked on:</strong> ${formatBookingDate(booking.date)}</p>
                    <p><strong>Name:</strong> ${booking.name}</p>
                    <p><strong>Email:</strong> ${booking.email}</p>
                    <p><strong>Phone:</strong> ${booking.phone}</p>
                </div>
                <div>
                    <p><strong>Travelers:</strong> ${travelers} person(s)</p>
                    <p><strong>Cost per person:</strong> NPR ${pricePerPerson.toLocaleString()}</p>
                    ${selectedAddons.length ? `<p><strong>Add-ons Total:</strong> NPR ${addonsTotal.toLocaleString()}</p>` : ''}
                    <p><strong>Total Cost:</strong> NPR ${total.toLocaleString()}</p>
                </div>
            </div>
            ${selectedAddons.length ? `
                <p><strong>Selected add-ons:</strong></p>
                <ul style="margin-left: 1.5rem; margin-bottom: 1rem;">
                    ${selectedAddons.map(addon => `
                        <li>${addon.type}: ${addon.option}</li>
                    `).join('')}
                </ul>
            ` : ''}
            ${booking.requests ? `<p><strong>Special Requests:</strong> ${booking.requests}</p>` : ''}
            <button class="btn" style="background: #e74c3c; color: white; border: none; margin-top: 1rem; cursor: pointer;" onclick="deleteBooking(${booking.id})">
                Delete Booking
            </button>
        </div>
    `;
    }).join('');
}

function deleteBooking(bookingId) {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    let bookings = getUserBookings();
    bookings = bookings.filter(b => b.id !== bookingId);
    saveUserBookings(bookings);

    displayBookings();
    showToast('Booking deleted successfully');
}
