document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (document.getElementById('category-bars')) {
            renderAnalytics();
        }
    }, 50);
});

function renderAnalytics() {
    const quests = window.gameState.customQuests || [];
    
    const completedQuests = quests.filter(q => q.completed);
    let lifetimeCustomXp = 0;
    
    const categoryData = {};
    const difficultyData = {
        'Trivial': 0,
        'Medium': 0,
        'Boss Fight': 0
    };

    completedQuests.forEach(quest => {
        lifetimeCustomXp += quest.xp;
        
        const cat = quest.category || 'General';
        categoryData[cat] = (categoryData[cat] || 0) + quest.xp;

        if (difficultyData[quest.difficulty] !== undefined) {
            difficultyData[quest.difficulty]++;
        } else {
            difficultyData[quest.difficulty] = 1;
        }
    });

    document.getElementById('lifetime-xp-display').innerText = lifetimeCustomXp;

    const catContainer = document.getElementById('category-bars');
    const catKeys = Object.keys(categoryData);

    if (catKeys.length > 0) {
        catContainer.innerHTML = '';
        
        catKeys.sort((a, b) => categoryData[b] - categoryData[a]);

        catKeys.forEach(cat => {
            const xp = categoryData[cat];
            const percentage = Math.min(100, Math.round((xp / lifetimeCustomXp) * 100));
            
            catContainer.innerHTML += `
                <div>
                    <div class="flex justify-between text-xs font-bold mb-1">
                        <span class="text-slate-300 flex items-center gap-2">📂 ${cat}</span>
                        <span class="text-indigo-400">${percentage}% <span class="text-slate-500 font-normal">(${xp} XP)</span></span>
                    </div>
                    <div class="w-full bg-slate-950 rounded-full h-2.5 border border-slate-800">
                        <div class="bg-indigo-500 h-2.5 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]" style="width: ${percentage}%"></div>
                    </div>
                </div>
            `;
        });
    }

    const diffContainer = document.getElementById('difficulty-stats');
    if (completedQuests.length > 0) {
        diffContainer.innerHTML = '';
        
        const totalCompleted = completedQuests.length;

        const createRow = (label, count, colorClass) => {
            if(count === 0) return '';
            const pct = Math.round((count / totalCompleted) * 100);
            return `
                <div class="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
                    <span class="text-sm font-semibold text-slate-300">${label}</span>
                    <div class="text-right">
                        <span class="text-sm font-bold ${colorClass}">${count} Quests</span>
                        <span class="text-xs text-slate-500 ml-2 border-l border-slate-700 pl-2">${pct}%</span>
                    </div>
                </div>
            `;
        };

        let diffHtml = '';
        Object.keys(difficultyData).forEach(diff => {
            let color = 'text-amber-400';
            if(diff === 'Trivial') color = 'text-slate-400';
            if(diff === 'Boss Fight') color = 'text-fuchsia-400';
            
            diffHtml += createRow(diff, difficultyData[diff], color);
        });

        diffContainer.innerHTML = diffHtml;
    }
const totalDays = 7;
const velocity = (completedQuests.length / totalDays).toFixed(1);

const analyticSummary = `
    <div class="mt-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
        <p class="text-xs font-bold text-indigo-300 uppercase tracking-tighter">The Oracle's Insight:</p>
        <p class="text-sm text-slate-300 mt-1">
            You are completing <span class="text-white font-bold">${velocity}</span> quests per day. 
            Your primary focus is <span class="text-white font-bold">${catKeys[0] || 'None'}</span>.
        </p>
    </div>
`;
}