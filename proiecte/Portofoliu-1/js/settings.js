document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const state = window.gameState;
        if (state) {
            if (document.getElementById('settings-name')) {
                document.getElementById('settings-name').value = state.playerName || 'Hero Player';
            }
            if (document.getElementById('settings-class')) {
                document.getElementById('settings-class').value = state.playerClass || 'Code Warrior';
            }
            
            updateThemeButtonHighlights(state.theme || 'dark');
        }
    }, 60);
});

function saveProfileChanges(event) {
    event.preventDefault();
    
    const newName = document.getElementById('settings-name').value.trim();
    const newClass = document.getElementById('settings-class').value.trim();
    
    if(!newName || !newClass) return;
    
    window.gameState.playerName = newName;
    window.gameState.playerClass = newClass;
    
    Storage.save(window.gameState);
    
    if (document.getElementById('sidebar-name')) document.getElementById('sidebar-name').innerText = newName;
    if (document.getElementById('sidebar-class')) document.getElementById('sidebar-class').innerText = `Class: ${newClass}`;
    
    alert("✨ Identity profiles modified successfully!");
}

function setGlobalTheme(themeMode) {
    window.gameState.theme = themeMode;
    Storage.save(window.gameState);
    
    applyThemeDOM(themeMode);
    updateThemeButtonHighlights(themeMode);
}

function applyThemeDOM(theme) {
    const root = document.documentElement;
    const body = document.body;
    
    if (theme === 'light') {
        body.classList.remove('bg-slate-950', 'text-slate-100');
        body.classList.add('bg-slate-50', 'text-slate-900');
        root.setAttribute('data-theme', 'light');
    } else {
        body.classList.remove('bg-slate-50', 'text-slate-900');
        body.classList.add('bg-slate-950', 'text-slate-100');
        root.setAttribute('data-theme', 'dark');
    }
}

function updateThemeButtonHighlights(theme) {
    const darkBtn = document.getElementById('theme-btn-dark');
    const lightBtn = document.getElementById('theme-btn-light');
    
    if(!darkBtn || !lightBtn) return;
    
    if(theme === 'light') {
        lightBtn.className = "p-4 rounded-xl border-2 border-amber-500 bg-white text-slate-900 flex flex-col items-center gap-2 cursor-pointer transition text-center shadow-md";
        darkBtn.className = "p-4 rounded-xl border border-slate-800 bg-slate-950 flex flex-col items-center gap-2 cursor-pointer transition text-center opacity-40 grayscale hover:opacity-100 hover:grayscale-0";
    } else {
        darkBtn.className = "p-4 rounded-xl border-2 border-indigo-600 bg-slate-950 flex flex-col items-center gap-2 cursor-pointer transition text-center shadow-lg shadow-indigo-500/5";
        lightBtn.className = "p-4 rounded-xl border border-slate-200 bg-slate-100 text-slate-900 flex flex-col items-center gap-2 cursor-pointer transition text-center opacity-40 grayscale hover:opacity-100 hover:grayscale-0";
    }
}

function exportGameStateString() {
    const dataBox = document.getElementById('data-matrix-box');
    const stateString = btoa(encodeURIComponent(JSON.stringify(window.gameState))); // Convert object to simple Base64 backup hash code string
    
    dataBox.value = stateString;
    dataBox.select();
    navigator.clipboard.writeText(stateString);
    
    alert("📋 Data hash string generated and copied to your clipboard system vault!");
}

function importGameStateString() {
    const code = prompt("🔮 Paste your exported encryption data timeline hash code string below:");
    if (!code) return;
    
    try {
        const decodedState = JSON.parse(decodeURIComponent(atob(code.trim())));
        
        if (decodedState && typeof decodedState.level === 'number') {
            window.gameState = decodedState;
            Storage.save(window.gameState);
            alert("🔮 Reality timeline sync restored successfully! Reloading configuration context...");
            window.location.reload();
        } else {
            throw new Error("Invalid structure parameters.");
        }
    } catch (err) {
        alert("❌ Timeline parsing failure: The code sequence string is corrupt or malformed.");
    }
}

function triggerNuclearWipe() {
    const checkOne = confirm("🛑 CRITICAL WARNING:\nYou are about to activate a timeline collapse wipe sequence. This drops ALL statistics, levels, progress tracking logs, and unlocks to absolute zero.\n\nDo you wish to proceed?");
    if(checkOne) {
        const checkTwo = confirm("⚠️ PHASE TWO SECURITY CONFIRMATION:\nAre you absolutely positive? Your progress history data records cannot be recovered.");
        if(checkTwo) {
            localStorage.clear(); 
            alert("💥 Reality matrix fully zeroed. Timeline reconstructed to starting constraints.");
            window.location.href = "index.html"; 
        }
    }
}