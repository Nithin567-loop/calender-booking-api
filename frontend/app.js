// API Configuration
const API_URL = 'http://localhost:3000/api';
let authToken = localStorage.getItem('authToken');
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    if (authToken && currentUser) {
        showMainContent();
        loadMeetings();
    }
});

// Show message
function showMessage(message, type = 'success') {
    const messageBox = document.getElementById('messageBox');
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    messageBox.appendChild(messageEl);

    setTimeout(() => {
        messageEl.remove();
    }, 4000);
}

// Auth Functions
function showLogin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
    document.querySelectorAll('.tab-btn')[0].classList.add('active');
    document.querySelectorAll('.tab-btn')[1].classList.remove('active');
}

function showRegister() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.querySelectorAll('.tab-btn')[0].classList.remove('active');
    document.querySelectorAll('.tab-btn')[1].classList.add('active');
}

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            authToken = data.data.token;
            currentUser = data.data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showMessage('Login successful!');
            showMainContent();
            loadMeetings();
        } else {
            showMessage(data.message, 'error');
        }
    } catch (error) {
        showMessage('Login failed. Please try again.', 'error');
        console.error('Login error:', error);
    }
}

async function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (data.success) {
            authToken = data.data.token;
            currentUser = data.data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showMessage('Registration successful!');
            showMainContent();
            loadMeetings();
        } else {
            showMessage(data.message, 'error');
        }
    } catch (error) {
        showMessage('Registration failed. Please try again.', 'error');
        console.error('Registration error:', error);
    }
}

function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    document.getElementById('authSection').style.display = 'block';
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('userInfo').style.display = 'none';
    showMessage('Logged out successfully');
}

function showMainContent() {
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
    document.getElementById('userInfo').style.display = 'flex';
    document.getElementById('userName').textContent = `Welcome, ${currentUser.name}`;
}

// Meeting Functions
async function handleCreateMeeting(event) {
    event.preventDefault();
    
    const title = document.getElementById('meetingTitle').value;
    const description = document.getElementById('meetingDescription').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;

    // Validate times
    if (new Date(startTime) >= new Date(endTime)) {
        showMessage('Start time must be before end time', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/meetings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                title,
                description,
                startTime: new Date(startTime).toISOString(),
                endTime: new Date(endTime).toISOString()
            })
        });

        const data = await response.json();

        if (data.success) {
            showMessage('Meeting created successfully!');
            document.getElementById('createMeetingForm').reset();
            loadMeetings();
        } else {
            showMessage(data.message, 'error');
        }
    } catch (error) {
        showMessage('Failed to create meeting', 'error');
        console.error('Create meeting error:', error);
    }
}

async function loadMeetings() {
    const meetingsList = document.getElementById('meetingsList');
    meetingsList.innerHTML = '<p class="loading">Loading meetings...</p>';

    try {
        const response = await fetch(`${API_URL}/meetings`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const data = await response.json();

        if (data.success && data.data.length > 0) {
            meetingsList.innerHTML = '';
            data.data.forEach(meeting => {
                const meetingEl = createMeetingElement(meeting);
                meetingsList.appendChild(meetingEl);
            });
        } else {
            meetingsList.innerHTML = '<p class="no-meetings">No meetings scheduled yet. Create your first meeting above!</p>';
        }
    } catch (error) {
        meetingsList.innerHTML = '<p class="no-meetings">Failed to load meetings</p>';
        console.error('Load meetings error:', error);
    }
}

function createMeetingElement(meeting) {
    const div = document.createElement('div');
    div.className = 'meeting-item';
    
    const startTime = new Date(meeting.startTime).toLocaleString();
    const endTime = new Date(meeting.endTime).toLocaleString();

    div.innerHTML = `
        <div class="meeting-header">
            <h3 class="meeting-title">${meeting.title}</h3>
            <div class="meeting-actions">
                <button onclick="deleteMeeting('${meeting._id}')" class="btn btn-danger">Delete</button>
            </div>
        </div>
        <div class="meeting-time">
            📅 ${startTime} - ${endTime}
        </div>
        ${meeting.description ? `<div class="meeting-description">${meeting.description}</div>` : ''}
    `;

    return div;
}

async function deleteMeeting(meetingId) {
    if (!confirm('Are you sure you want to delete this meeting?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/meetings/${meetingId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const data = await response.json();

        if (data.success) {
            showMessage('Meeting deleted successfully');
            loadMeetings();
        } else {
            showMessage(data.message, 'error');
        }
    } catch (error) {
        showMessage('Failed to delete meeting', 'error');
        console.error('Delete meeting error:', error);
    }
}
