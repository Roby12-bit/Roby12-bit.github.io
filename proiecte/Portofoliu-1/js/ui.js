const UI = {
    update: (state) => {
        if (document.getElementById('user-level')) document.getElementById('user-level').innerText = state.level;
        if (document.getElementById('current-xp')) document.getElementById('current-xp').innerText = state.xp;
        if (document.getElementById('next-level-xp')) document.getElementById('next-level-xp').innerText = state.nextLevelXp;
        if (document.getElementById('stat-quests')) document.getElementById('stat-quests').innerText = state.questsCompleted;
        if (document.getElementById('stat-habits')) document.getElementById('stat-habits').innerText = state.habitScore;
        
        UI.renderDashboardQuests(state);
        
        const progressBar = document.getElementById('xp-progress-bar');
        if (progressBar) {
            const percentage = (state.xp / state.nextLevelXp) * 100;
            progressBar.style.width = `${percentage}%`;
        }

        // DYNAMIC BADGE CARD ENGINE
        const grid = document.getElementById('achievements-grid');
        if (grid) {
            grid.innerHTML = '';
            window.achievementDefinitions.forEach(ach => {
                const isUnlocked = state.unlockedAchievements.includes(ach.id);
                const badge = document.createElement('div');
                
                badge.className = `aspect-square rounded-xl flex items-center justify-center text-2xl border transition-all duration-300 relative group cursor-help ${
                    isUnlocked 
                    ? 'bg-slate-950 border-amber-500/40 text-slate-100 shadow-lg shadow-amber-500/5 hover:scale-105' 
                    : 'bg-slate-950/40 border-slate-800 border-dashed text-slate-600 grayscale'
                }`;
                
                badge.title = `${ach.title} — ${ach.desc} (${isUnlocked ? 'Completed' : 'Locked'})`;
                badge.innerHTML = isUnlocked ? ach.icon : '🔒';
                
                grid.appendChild(badge);
            });
        }
    },

    triggerNotification: (achievement) => {
        const popup = document.createElement('div');
        popup.className = "fixed bottom-6 right-6 bg-slate-900 border-2 border-amber-500 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-50 transform translate-y-24 opacity-0 transition-all duration-500 ease-out";
        
        popup.innerHTML = `
            <div class="text-3xl bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl shadow-inner">${achievement.icon}</div>
            <div>
                <h5 class="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest leading-none mb-1">Milestone Cleared!</h5>
                <h4 class="text-sm font-bold text-slate-100">${achievement.title}</h4>
                <p class="text-xs text-slate-400 mt-0.5">${achievement.desc}</p>
            </div>
        `;
        
        document.body.appendChild(popup);
        setTimeout(() => popup.classList.remove('translate-y-24', 'opacity-0'), 100);
        setTimeout(() => {
            popup.classList.add('translate-y-[-20px]', 'opacity-0');
            setTimeout(() => popup.remove(), 500);
        }, 4000);
    },

    renderDashboardQuests: (state) => {
        const container = document.getElementById('dashboard-custom-quests');
        if (!container) return;

        const activeQuests = state.customQuests.filter(q => !q.completed);

        if (activeQuests.length === 0) {
            container.innerHTML = `<p class="text-slate-500 text-sm italic">No active quests. Go to the Quest tag to create one!</p>`;
            return;
        }

        container.innerHTML = activeQuests.map(quest => `
            <div class="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <div class="flex items-center gap-3">
                    <input type="checkbox" onchange="toggleCustomQuest(${quest.id}, this)" class="w-5 h-5 rounded border-slate-700 text-indigo-600 bg-slate-900 cursor-pointer">
                    <div>
                        <p class="font-medium text-slate-200 text-sm">${quest.title}</p>
                        <p class="text-[10px] text-slate-500">${quest.difficulty} • ${quest.category}</p>
                    </div>
                </div>
                <span class="text-xs font-bold text-amber-400">+${quest.xp} XP</span>
            </div>
        `).join('');
    }
};