// Simple front-end auth helpers for the HorizonHub demo.
const AUTH_USERS_KEY = 'horizonhub_users';
const AUTH_CURRENT_USER_KEY = 'horizonhub_current_user';

function getStoredUsers() {
    return JSON.parse(localStorage.getItem(AUTH_USERS_KEY) || '[]');
}

function saveStoredUsers(users) {
    localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
}

function normalizeEmail(email) {
    return String(email || '').trim().toLowerCase();
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem(AUTH_CURRENT_USER_KEY) || 'null');
}

function isLoggedIn() {
    return Boolean(getCurrentUser());
}

function loginUser(name, email, password) {
    const normalizedEmail = normalizeEmail(email);
    const users = getStoredUsers();
    let user = users.find(savedUser => savedUser.email === normalizedEmail);

    if (!user) {
        user = {
            id: Date.now(),
            name: String(name || '').trim(),
            email: normalizedEmail,
            password: String(password || '')
        };
        users.push(user);
        saveStoredUsers(users);
    } else if (password && user.password && user.password !== password) {
        return { success: false, message: 'Password does not match this account.' };
    } else if (name && user.name !== name.trim()) {
        user.name = name.trim();
        saveStoredUsers(users);
    }

    const sessionUser = {
        id: user.id,
        name: user.name,
        email: user.email
    };

    localStorage.setItem(AUTH_CURRENT_USER_KEY, JSON.stringify(sessionUser));
    return { success: true, user: sessionUser };
}

function logoutUser() {
    localStorage.removeItem(AUTH_CURRENT_USER_KEY);
}

function getUserBookingsKey(user = getCurrentUser()) {
    return user ? `horizonhub_bookings_${user.email}` : null;
}

function getUserBookings() {
    const bookingsKey = getUserBookingsKey();
    if (!bookingsKey) return [];
    return JSON.parse(localStorage.getItem(bookingsKey) || '[]');
}

function saveUserBookings(bookings) {
    const bookingsKey = getUserBookingsKey();
    if (!bookingsKey) return false;
    localStorage.setItem(bookingsKey, JSON.stringify(bookings));
    return true;
}

function getLoginUrl() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const currentSearch = window.location.search || '';
    return `login.html?next=${encodeURIComponent(currentPage + currentSearch)}`;
}
