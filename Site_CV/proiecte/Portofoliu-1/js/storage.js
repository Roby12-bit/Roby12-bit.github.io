const Storage = {
    save: (state) => {
        localStorage.setItem('lifeRPG_state', JSON.stringify(state));
    },
    load: () => {
        const data = localStorage.getItem('lifeRPG_state');
        return data ? JSON.parse(data) : null;
    }
};