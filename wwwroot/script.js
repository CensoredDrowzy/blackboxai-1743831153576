// Configuration
const API_URL = "http://localhost:8000";
let isConnected = false;
let aimbotEnabled = false;
let espEnabled = false;

// DOM Elements
const statusIndicator = document.getElementById('status');
const gameStatus = document.getElementById('gameStatus');
const toggleAimbotBtn = document.getElementById('toggleAimbot');
const toggleEspBtn = document.getElementById('toggleESP');
const updateOffsetsBtn = document.getElementById('updateOffsets');
const aimbotSmoothness = document.getElementById('aimbotSmoothness');
const espColor = document.getElementById('espColor');
const playerBase = document.getElementById('playerBase');

// Initialize connection
async function init() {
    try {
        const response = await axios.get(`${API_URL}/status`);
        if (response.data) {
            setConnected(true);
            updateGameStatus();
        }
    } catch (error) {
        setConnected(false);
        console.error("API connection failed:", error);
    }

    // Set up event listeners
    toggleAimbotBtn.addEventListener('click', toggleAimbot);
    toggleEspBtn.addEventListener('click', toggleESP);
    updateOffsetsBtn.addEventListener('click', updateOffsets);
    aimbotSmoothness.addEventListener('input', updateAimbotSettings);
    espColor.addEventListener('change', updateESPSettings);

    // Start status polling
    setInterval(updateGameStatus, 2000);
}

function setConnected(connected) {
    isConnected = connected;
    statusIndicator.textContent = connected ? "Connected" : "Disconnected";
    statusIndicator.className = `px-4 py-2 rounded-full ${connected ? 'bg-green-600' : 'bg-red-600'}`;
}

async function updateGameStatus() {
    try {
        const response = await axios.get(`${API_URL}/game/status`);
        gameStatus.textContent = response.data.running ? 
            `Running (PID: ${response.data.pid})` : "Not detected";
    } catch (error) {
        setConnected(false);
    }
}

async function toggleAimbot() {
    try {
        const response = await axios.post(`${API_URL}/aimbot/toggle`, {
            enabled: !aimbotEnabled,
            smoothness: parseFloat(aimbotSmoothness.value)
        });
        aimbotEnabled = response.data.enabled;
        toggleAimbotBtn.textContent = aimbotEnabled ? "Disable Aimbot" : "Enable Aimbot";
    } catch (error) {
        console.error("Aimbot toggle failed:", error);
    }
}

async function toggleESP() {
    try {
        const response = await axios.post(`${API_URL}/esp/toggle`, {
            enabled: !espEnabled,
            color: espColor.value
        });
        espEnabled = response.data.enabled;
        toggleEspBtn.textContent = espEnabled ? "Disable ESP" : "Enable ESP";
    } catch (error) {
        console.error("ESP toggle failed:", error);
    }
}

async function updateOffsets() {
    try {
        await axios.post(`${API_URL}/offsets/update`, {
            playerBase: playerBase.value
        });
        showToast("Offsets updated successfully");
    } catch (error) {
        showToast("Failed to update offsets", true);
    }
}

function updateAimbotSettings() {
    if (aimbotEnabled) {
        axios.post(`${API_URL}/aimbot/settings`, {
            smoothness: parseFloat(aimbotSmoothness.value)
        });
    }
}

function updateESPSettings() {
    if (espEnabled) {
        axios.post(`${API_URL}/esp/settings`, {
            color: espColor.value
        });
    }
}

function showToast(message, isError = false) {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 px-4 py-2 rounded ${isError ? 'bg-red-600' : 'bg-green-600'}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);