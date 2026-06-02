function createCustomQuest(event) {
    event.preventDefault();

    const title = document.getElementById('q-title').value.trim();
    
    if (!title) return;

    const newQuest = {
        id: Date.now(), 
        title: title,
        description: document.getElementById('q-desc').value.trim() || 'No description provided.',
        difficulty: document.getElementById('q-difficulty').value,
        xp: parseInt(document.getElementById('q-xp').value) || 10,
        category: document.getElementById('q-category').value.trim() || 'General',
        dueDate: document.getElementById('q-date').value || 'No Due Date',
        completed: false
    };

    window.gameState.customQuests.push(newQuest);
    
    Storage.save(window.gameState);
    
    if (typeof UI !== 'undefined' && UI.update) {
        UI.update(window.gameState);
    }
    
    renderCustomQuests();
    
    event.target.reset(); 
}

function renderCustomQuests() {
    const listContainer = document.getElementById('dynamic-quest-list');
    const trackerCount = document.getElementById('quest-count');
    
    if (!listContainer) return; 

    listContainer.innerHTML = '';
    const activeQuests = window.gameState.customQuests.filter(q => !q.completed);
    
    if (trackerCount) {
        trackerCount.innerText = `${activeQuests.length} Active`;
    }

    if (window.gameState.customQuests.length === 0) {
        listContainer.innerHTML = `
            <div class="text-center p-8 border border-slate-800 border-dashed rounded-xl text-slate-500 text-sm">
                📭 Your quest log is empty. Use the forge form to create your custom tasks!
            </div>
        `;
        return;
    }

    const sortedQuests = [...window.gameState.customQuests].sort((a, b) => a.completed - b.completed);

    sortedQuests.forEach(quest => {
        const card = document.createElement('div');
        
        let diffColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
        if (quest.difficulty === 'Trivial') diffColor = 'text-slate-400 bg-slate-500/10 border-slate-500/20';
        if (quest.difficulty === 'Easy') diffColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
        if (quest.difficulty === 'Hard') diffColor = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
        if (quest.difficulty === 'Boss Fight') diffColor = 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20 font-bold animate-pulse';

        card.className = `p-4 rounded-xl border transition relative ${
            quest.completed 
            ? 'bg-slate-900/40 border-slate-900 text-slate-500 opacity-60' 
            : 'bg-slate-900 border-slate-800 hover:border-slate-700'
        }`;

        card.innerHTML = `
            <div class="flex items-start justify-between gap-3">
                <div class="flex items-start gap-3">
                    <input type="checkbox" ${quest.completed ? 'checked' : ''} 
                        onchange="toggleCustomQuest(${quest.id}, this)" 
                        class="w-5 h-5 mt-0.5 rounded border-slate-700 text-indigo-600 bg-slate-950 focus:ring-indigo-500 cursor-pointer shrink-0">
                    <div>
                        <h4 class="font-bold text-base tracking-wide ${quest.completed ? 'line-through text-slate-600' : 'text-slate-200'}">
                            ⚔️ ${quest.title}
                        </h4>
                        <p class="text-xs text-slate-400 mt-0.5 ${quest.completed ? 'hidden' : ''}">${quest.description}</p>
                        
                        <div class="flex flex-wrap items-center gap-2 mt-3 text-[11px]">
                            <span class="px-2 py-0.5 rounded-md border ${diffColor}">${quest.difficulty}</span>
                            <span class="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-slate-400">📂 ${quest.category}</span>
                            <span class="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-slate-400">📅 ${quest.dueDate}</span>
                        </div>
                    </div>
                </div>
                
                <div class="text-right shrink-0 flex flex-col items-end justify-between h-full">
                    <span class="text-xs font-extrabold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-md">
                        +${quest.xp} XP
                    </span>
                    <button onclick="deleteQuest(${quest.id})" class="text-xs text-slate-600 hover:text-rose-400 transition mt-6 cursor-pointer" title="Delete Quest">🗑️ Delete</button>
                </div>
            </div>
        `;
        listContainer.appendChild(card);
    });
}

function toggleCustomQuest(id, checkbox) {
    const quest = window.gameState.customQuests.find(q => q.id === id);
    if (!quest) return;

    quest.completed = checkbox.checked;

    if (quest.completed) {
        gainXp(quest.xp);
        window.gameState.questsCompleted++;
    } else {
        gainXp(-quest.xp);
        window.gameState.questsCompleted = Math.max(0, window.gameState.questsCompleted - 1);
    }

    Storage.save(window.gameState);
    UI.update(window.gameState);
    renderCustomQuests();
}

function deleteQuest(id) {
    const questIndex = window.gameState.customQuests.findIndex(q => q.id === id);
    if (questIndex === -1) return;

    const quest = window.gameState.customQuests[questIndex];
    
    if (quest.completed) {
        gainXp(-quest.xp);
        window.gameState.questsCompleted = Math.max(0, window.gameState.questsCompleted - 1);
    }

    window.gameState.customQuests.splice(questIndex, 1);
    Storage.save(window.gameState);
    UI.update(window.gameState);
    renderCustomQuests();
}

function claimQuestXp(xpValue, checkbox) {
    if (checkbox.checked) {
        gainXp(xpValue);
        window.gameState.questsCompleted++;
    } else {
        gainXp(-xpValue);
        window.gameState.questsCompleted = Math.max(0, window.gameState.questsCompleted - 1);
    }
    Storage.save(window.gameState);
    UI.update(window.gameState);
}

function adjustHabit(direction, xpValue) {
    if (direction > 0) {
        gainXp(xpValue);
        window.gameState.habitScore += 1;
    } else {
        gainXp(-xpValue);
        window.gameState.habitScore -= 1;
    }
    Storage.save(window.gameState);
    UI.update(window.gameState);
}

function gainXp(amount) {
    window.gameState.xp += amount;
    
    if (window.gameState.xp >= window.gameState.nextLevelXp) {
        window.gameState.xp -= window.gameState.nextLevelXp;
        window.gameState.level++;
        window.gameState.nextLevelXp = Math.floor(window.gameState.nextLevelXp * 1.5);
        alert(`🎉 LEVEL UP! You reached Level ${window.gameState.level}!`);
    }
    
    if (window.gameState.xp < 0) {
        if (window.gameState.level > 1) {
            window.gameState.level--;
            window.gameState.nextLevelXp = Math.floor(window.gameState.nextLevelXp / 1.5);
            window.gameState.xp = window.gameState.nextLevelXp + window.gameState.xp;
        } else {
            window.gameState.xp = 0;
        }
    }
}
function checkAchievements(silent = false) {
    let stateChanged = false;

    if (!window.achievementDefinitions || !Array.isArray(window.achievementDefinitions)) {
        return stateChanged;
    }

    window.achievementDefinitions.forEach(ach => {
        if (!window.gameState.unlockedAchievements) {
            window.gameState.unlockedAchievements = [];
        }
        
        if (window.gameState.unlockedAchievements.includes(ach.id)) return;

        let conditionMet = false;
        if (ach.type === 'quests' && window.gameState.questsCompleted >= ach.value) conditionMet = true;
        if (ach.type === 'streak' && window.gameState.streak >= ach.value) conditionMet = true;
        if (ach.type === 'level' && window.gameState.level >= ach.value) conditionMet = true;

        if (conditionMet) {
            window.gameState.unlockedAchievements.push(ach.id);
            stateChanged = true;
            
            if (!silent && typeof UI !== 'undefined' && typeof UI.triggerNotification === 'function') {
                UI.triggerNotification(ach);
            }
        }
    });

    return stateChanged;
}

function gainXp(amount) {
    if (typeof window.gameState.xp !== 'number') window.gameState.xp = 0;
    
    window.gameState.xp += amount;
    
    if (window.gameState.xp >= window.gameState.nextLevelXp) {
        window.gameState.xp -= window.gameState.nextLevelXp;
        window.gameState.level++;
        window.gameState.nextLevelXp = Math.floor(window.gameState.nextLevelXp * 1.5);
        alert(`🎉 LEVEL UP! You reached Level ${window.gameState.level}!`);
    }
    
    if (window.gameState.xp < 0) {
        if (window.gameState.level > 1) {
            window.gameState.level--;
            window.gameState.nextLevelXp = Math.floor(window.gameState.nextLevelXp / 1.5);
            window.gameState.xp = window.gameState.nextLevelXp + window.gameState.xp;
        } else {
            window.gameState.xp = 0;
        }
    }

    try {
        checkAchievements(false); 
    } catch (e) {
        console.warn("Achievement engine skipped: ", e.message);
    }
}

function toggleCustomQuest(id, checkbox) {
    const quest = window.gameState.customQuests.find(q => q.id === id);
    if (!quest) return;

    quest.completed = checkbox.checked;

    if (quest.completed) {
        gainXp(quest.xp);
        window.gameState.questsCompleted++;
    } else {
        gainXp(-quest.xp);
        window.gameState.questsCompleted = Math.max(0, window.gameState.questsCompleted - 1);
    }

    checkAchievements(false);
    Storage.save(window.gameState);
    UI.update(window.gameState);
    renderCustomQuests();
}

function claimQuestXp(xpValue, checkbox) {
    if (checkbox.checked) {
        gainXp(xpValue);
        window.gameState.questsCompleted++;
    } else {
        gainXp(-xpValue);
        window.gameState.questsCompleted = Math.max(0, window.gameState.questsCompleted - 1);
    }
    
    checkAchievements(false); 
    
    Storage.save(window.gameState);
    UI.update(window.gameState);
}

function adjustHabit(direction, xpValue) {
    if (direction > 0) {
        gainXp(xpValue);
        window.gameState.habitScore += 1;
    } else {
        gainXp(-xpValue);
        window.gameState.habitScore -= 1;
    }
    
    checkAchievements(false); 
    
    Storage.save(window.gameState);
    UI.update(window.gameState);
}

function gainXp(amount) {
    window.gameState.xp += amount;
    
    if (window.gameState.xp >= window.gameState.nextLevelXp) {
        window.gameState.xp -= window.gameState.nextLevelXp;
        window.gameState.level++;
        window.gameState.nextLevelXp = Math.floor(window.gameState.nextLevelXp * 1.5);
        alert(`🎉 LEVEL UP! You reached Level ${window.gameState.level}!`);
    }
    
    if (window.gameState.xp < 0) {
        if (window.gameState.level > 1) {
            window.gameState.level--;
            window.gameState.nextLevelXp = Math.floor(window.gameState.nextLevelXp / 1.5);
            window.gameState.xp = window.gameState.nextLevelXp + window.gameState.xp;
        } else {
            window.gameState.xp = 0;
        }
    }
    checkAchievements(false); 
}