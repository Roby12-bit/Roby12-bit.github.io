window.addEventListener('DOMContentLoaded', () => {
    const defaultState = {
        level: 1,
        xp: 0,
        nextLevelXp: 100,
        questsCompleted: 0,
        habitScore: 0,
        streak: 0,
        theme: 'dark',
        customQuests: window.starterQuests || [],
        unlockedAchievements: []
    };

    const savedState = Storage.load();
    
    if (savedState) {
        window.gameState = {
            ...defaultState,
            ...window.gameState,
            ...savedState,
            customQuests: (savedState.customQuests && savedState.customQuests.length > 0) 
                          ? savedState.customQuests 
                          : (window.starterQuests || []),
            unlockedAchievements: savedState.unlockedAchievements || []
        };

        if (typeof window.gameState.xp !== 'number' || isNaN(window.gameState.xp) || window.gameState.xp === null) {
            window.gameState.xp = 0;
        }
        if (typeof window.gameState.nextLevelXp !== 'number' || isNaN(window.gameState.nextLevelXp) || window.gameState.nextLevelXp <= 0 || window.gameState.nextLevelXp === null) {
            window.gameState.nextLevelXp = 100;
        }
        if (typeof window.gameState.level !== 'number' || isNaN(window.gameState.level) || window.gameState.level === null) {
            window.gameState.level = 1;
        }
    } else {
        window.gameState = defaultState;
    }

    Storage.save(window.gameState); 

    if (typeof UI !== 'undefined' && UI.update) {
        UI.update(window.gameState);
    }
    
    if (typeof checkAchievements === 'function') {
        checkAchievements(true);
    }
    
    if (document.getElementById('dynamic-quest-list') && typeof renderCustomQuests === 'function') {
        renderCustomQuests();
    }
});