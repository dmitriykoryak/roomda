export default {
    name: 'MenuState',
    state: {
        menu: {
            drawer: false,
            mini: false,
            width: {
                mini: 62,
                full: 256,
            },
        }
    },
    mutations: {
        setMenu({menu}, {drawer, mini}) {
            menu.drawer = drawer;
            menu.mini = mini;
        },
    },
    getters: {
        menuWidth({menu}) {
            if (menu.mini && menu.drawer) {
                return menu.width.mini
            } else if (menu.drawer) {
                return menu.width.full
            } else {
                return 0
            }
        }
    }
};
