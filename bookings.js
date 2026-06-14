// Bookings Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    displayBookings();
});

function displayBookings() {
    const bookingsList = document.getElementById('bookingsList');
    if (!bookingsList) return;

    const bookings = JSON.parse(localStorage.getItem('horizonhub_bookings') || '[]');

    if (bookings.length === 0) {
        bookingsList.innerHTML = `
            <div class="empty-state">
                <h2>📅 No Bookings Yet</h2>
                <p>You haven't made any bookings yet. Start exploring destinations!</p>
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

        return `
        <div class="booking-item">
            <h3>${booking.destination}</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 1rem;">
                <div>
                    <p><strong>Booked on:</strong> ${new Date(booking.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p><strong>Name:</strong> ${booking.name}</p>
                    <p><strong>Email:</strong> ${booking.email}</p>
                    <p><strong>Phone:</strong> ${booking.phone}</p>
                </div>
                <div>
                    <p><strong>Travelers:</strong> ${travelers} person(s)</p>
                    <p><strong>Cost per person:</strong> NPR ${pricePerPerson.toLocaleString()}</p>
                    <p><strong>Total Cost:</strong> NPR ${total.toLocaleString()}</p>
                </div>
            </div>
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

    let bookings = JSON.parse(localStorage.getItem('horizonhub_bookings') || '[]');
    bookings = bookings.filter(b => b.id !== bookingId);
    localStorage.setItem('horizonhub_bookings', JSON.stringify(bookings));

    displayBookings();
    showToast('Booking deleted successfully');
}
