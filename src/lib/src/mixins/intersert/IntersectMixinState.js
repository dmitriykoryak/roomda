/**
 * State для перехвата видимости элемента
 */
export default {
	name: 'IntersectMixinState',
	state: {
		// при попадании элемента в область видимости / потери видимости примет значение { ID-элемента: true / false }
		isIntersecting: {},
		// значение true примет только последний элемент в обьекте isIntersecting (для подсветки пунктов меню)
		isIntersectingLast: {},
	},
	mutations: {
		/**
		 * Сохранить перехват видимости элемента
		 * @param state
		 * @param {Array} entries
		 */
		saveIntersecting(state, entries) {
			const id = entries[0].target.id;
			const isIntersecting = entries[0].isIntersecting;
			state.isIntersecting = {
				...state.isIntersecting,
				['#' + id]: isIntersecting
			}

			let isIntersectingLast = {};
			let i = 0;
			const lastIndexTrue = Object.values(state.isIntersecting).lastIndexOf(true);

			if (lastIndexTrue === -1) {
				state.isIntersectingLast = {...state.isIntersecting};
			} else {
				for(let[id, is] of Object.entries(state.isIntersecting)) {
					isIntersectingLast = {
						...isIntersectingLast,
						[id]: i === lastIndexTrue
					}
					i++;
				}
				state.isIntersectingLast = isIntersectingLast;
			}
		},
	},
};
