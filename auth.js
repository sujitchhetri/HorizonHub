// Simple front-end auth helpers for the HorizonHub demo.
const AUTH_USERS_KEY = 'horizonhub_users';
const AUTH_CURRENT_USER_KEY = 'horizonhub_current_user';
const LEGACY_REMOVED_USERS = ['sujit chhetri'];

function getStoredUsers() {
    const users = JSON.parse(localStorage.getItem(AUTH_USERS_KEY) || '[]');
    const filteredUsers = users.filter(user => {
        const userName = normalizeName(user.name).toLowerCase();
        return !LEGACY_REMOVED_USERS.includes(userName);
    });

    if (filteredUsers.length !== users.length) {
        localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(filteredUsers));

        const currentUser = getCurrentUser();
        if (currentUser && LEGACY_REMOVED_USERS.includes(normalizeName(currentUser.name).toLowerCase())) {
            localStorage.removeItem(AUTH_CURRENT_USER_KEY);
        }

        LEGACY_REMOVED_USERS.forEach(userName => {
            localStorage.removeItem(`horizonhub_bookings_${userName}`);
        });
    }

    return filteredUsers;
}

function saveStoredUsers(users) {
    localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
}

function normalizeName(name) {
    return String(name || '').trim();
}

function validatePasswordStrength(password) {
    const passwordText = String(password || '');

    if (passwordText.length < 8) {
        return { success: false, message: 'Password must be at least 8 characters long.' };
    }

    if (!/\d/.test(passwordText)) {
        return { success: false, message: 'Password must include at least 1 number.' };
    }

    if (!/[^\w\s]/.test(passwordText)) {
        return { success: false, message: 'Password must include at least 1 symbol.' };
    }

    return { success: true };
}

function findStoredUser(users, name) {
    const normalizedName = normalizeName(name).toLowerCase();

    return users.find(savedUser => normalizeName(savedUser.name).toLowerCase() === normalizedName);
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem(AUTH_CURRENT_USER_KEY) || 'null');
}

function isLoggedIn() {
    return Boolean(getCurrentUser());
}

function registerUser(name, password) {
    const trimmedName = normalizeName(name);
    const users = getStoredUsers();
    const passwordCheck = validatePasswordStrength(password);

    if (!trimmedName) {
        return { success: false, message: 'Name is required.' };
    }

    if (!passwordCheck.success) {
        return passwordCheck;
    }

    const existingUser = findStoredUser(users, trimmedName);
    if (existingUser) {
        return { success: false, message: 'An account with this name already exists. Please log in.' };
    }

    const user = {
        id: Date.now(),
        name: trimmedName,
        password: String(password || '')
    };

    users.push(user);
    saveStoredUsers(users);

    const sessionUser = {
        id: user.id,
        name: user.name
    };

    localStorage.setItem(AUTH_CURRENT_USER_KEY, JSON.stringify(sessionUser));
    return { success: true, user: sessionUser };
}

function loginUser(name, password) {
    const trimmedName = normalizeName(name);
    const users = getStoredUsers();
    let user = findStoredUser(users, trimmedName);

    if (!user) {
        return { success: false, message: 'No account found for this name. Please create an account first.' };
    }

    if (String(password || '') && user.password && user.password !== password) {
        return { success: false, message: 'Password does not match this account.' };
    }

    if (trimmedName && user.name !== trimmedName) {
        user.name = trimmedName;
        saveStoredUsers(users);
    }

    const sessionUser = {
        id: user.id,
        name: user.name
    };

    localStorage.setItem(AUTH_CURRENT_USER_KEY, JSON.stringify(sessionUser));
    return { success: true, user: sessionUser };
}

function logoutUser() {
    localStorage.removeItem(AUTH_CURRENT_USER_KEY);
}

function getUserBookingsKey(user = getCurrentUser()) {
    if (!user) return null;
    const accountKey = user.id || normalizeName(user.name).toLowerCase();
    return accountKey ? `horizonhub_bookings_${accountKey}` : null;
}

function getLegacyUserBookingsKey(user = getCurrentUser()) {
    if (!user) return null;
    const legacyAccountKey = normalizeName(user.name).toLowerCase();
    return legacyAccountKey ? `horizonhub_bookings_${legacyAccountKey}` : null;
}

function getUserBookings() {
    const bookingsKey = getUserBookingsKey();
    if (!bookingsKey) return [];

    const bookings = JSON.parse(localStorage.getItem(bookingsKey) || '[]');
    if (bookings.length > 0) {
        return bookings;
    }

    const legacyBookingsKey = getLegacyUserBookingsKey();
    if (legacyBookingsKey && legacyBookingsKey !== bookingsKey) {
        const legacyBookings = JSON.parse(localStorage.getItem(legacyBookingsKey) || '[]');
        if (legacyBookings.length > 0) {
            localStorage.setItem(bookingsKey, JSON.stringify(legacyBookings));
            return legacyBookings;
        }
    }

    return [];
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
