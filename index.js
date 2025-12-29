/**
 * DTZ 2026 - SECURE ADMISSION TERMINAL
 * Developed by RAVIYA × SHAGIYA × ASHIYA
 */

// --- 1. CONFIGURATION & ADMIN LIST ---
// These WhatsApp numbers are authorized to receive admission data
const admins = [
    "94761527735", 
    "94788262515", 
    "94741856766", 
    "94704239576", 
    "94778430626"
];

// Firebase Project Credentials
const firebaseConfig = {
    apiKey: "AIzaSyDulliK5zrr2U-0Hl9EzrWrojka1VxodOk",
    authDomain: "free-code-bf1c2.firebaseapp.com",
    databaseURL: "https://free-code-bf1c2-default-rtdb.firebaseio.com",
    projectId: "free-code-bf1c2",
    storageBucket: "free-code-bf1c2.firebasestorage.app",
    messagingSenderId: "8313552650",
    appId: "1:8313552650:web:b370e1dc3f608c819104f3",
    measurementId: "G-W4JQLJ8RYR"
};

// Initialize Firebase App and Services
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const storage = firebase.storage();

// --- 2. UI NAVIGATION ---
/**
 * Switches from the welcome screen to the main form and plays background audio
 */
function initPortal() {
    const audio = document.getElementById('crimAudio');
    if (audio) audio.play();
    
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('main-portal').style.display = 'block';
}

// --- 3. CORE ADMISSION LOGIC ---
document.getElementById('admissionForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = document.getElementById('submitBtn');
    const status = document.getElementById('status');
    
    // UI Feedback: Start processing
    btn.disabled = true;
    status.style.display = 'block';
    status.innerHTML = "> CONNECTING TO FIREBASE CLOUD...";

    // Capture form values
    const name = document.getElementById('name').value;
    const phone = document.getElementById('whatsapp').value.replace(/\D/g,'');
    const time = Date.now();
    let photoUrls = [];

    try {
        // Step 1: Sequential Upload of 4 Identification Photos
        const inputs = document.querySelectorAll('.pic-input');
        for(let i = 0; i < 4; i++) {
            status.innerHTML = `> UPLOADING INTEL ${i + 1}/4...`;
            const ref = storage.ref(`2026_admissions/${name}_${time}/photo${i}`);
            await ref.put(inputs[i].files[0]);
            photoUrls.push(await ref.getDownloadURL());
        }

        // Step 2: Data Object Construction
        const memberData = {
            name: name,
            phone: phone,
            city: document.getElementById('city').value,
            details: document.getElementById('details').value,
            photos: photoUrls,
            admissionYear: "2026",
            timestamp: new Date().toLocaleString()
        };

        // Step 3: Realtime Database Synchronization
        status.innerHTML = "> SYNCING REALTIME DATABASE...";
        await db.ref('members_2026/' + time).set(memberData);

        // Step 4: WhatsApp Redirection
        // Sends data to the primary admin (index 4 in the list)
        const targetAdmin = admins[4]; 
        const msg = `*🛡️ 2026 DTZ ADMISSION 🛡️*%0A%0A` +
                    `👤 *Name:* ${memberData.name}%0A` +
                    `📱 *WA:* ${memberData.phone}%0A` +
                    `📍 *City:* ${memberData.city}%0A%0A` +
                    `*🖼️ INTEL LINKS:*%0A${photoUrls.join('%0A')}`;

        status.innerHTML = "> MISSION SUCCESS. REDIRECTING...";
        setTimeout(() => {
            window.location.href = `https://wa.me/${targetAdmin}?text=${msg}`;
        }, 1000);

    } catch (err) {
        status.innerHTML = "> CRITICAL ERROR: " + err.message;
        btn.disabled = false;
    }
});

// --- 4. VISUAL EFFECTS ---
// Matrix Background Animation
const canvas = document.getElementById('matrix-canvas');
});
