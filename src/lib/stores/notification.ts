import { writable } from 'svelte/store';

/**
 * Notification types
 */
export enum NOTIFICATION__TYPE {
	INFO = 'info',
	WARNING = 'warning',
	ERROR = 'error'
}

/**
 * Notification interface
 */
export interface Notification {
	message: string;
	type: NOTIFICATION__TYPE;
	visible: boolean;
}

/**
 * Initial notification state
 */
const initial__state: Notification = {
	message: '',
	type: NOTIFICATION__TYPE.INFO,
	visible: false
};

/**
 * Create notification store
 */
function createNotificationStore() {
	const { subscribe, update, set } = writable<Notification>(initial__state);

	return {
		subscribe,

		/**
		 * Show notification
		 * @param {string} message - Notification message
		 * @param {NOTIFICATION__TYPE} type - Notification type
		 */
		show: (message: string, type: NOTIFICATION__TYPE = NOTIFICATION__TYPE.INFO) => {
			update(() => ({
				message,
				type,
				visible: true
			}));
		},

		/**
		 * Hide notification
		 */
		hide: () => {
			update((state) => ({ ...state, visible: false }));
		},

		/**
		 * Reset notification to initial state
		 */
		reset: () => {
			set(initial__state);
		}
	};
}

/**
 * Notification store
 */
export const notificationStore = createNotificationStore();
