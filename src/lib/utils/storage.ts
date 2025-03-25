/**
 * Storage utility for caching data
 */

/**
 * Storage keys
 */
export const STORAGE__KEYS = {
	POSTS: 'CACHED__POSTS'
};

/**
 * Interface for storage utils
 */
export interface StorageUtils {
	/**
	 * Save data to localStorage
	 * @param {string} key - Storage key
	 * @param {any} data - Data to save
	 */
	saveData<T>(key: string, data: T): void;

	/**
	 * Get data from localStorage
	 * @param {string} key - Storage key
	 * @returns {T | null} - Retrieved data or null if not found
	 */
	getData<T>(key: string): T | null;

	/**
	 * Check if data exists in localStorage
	 * @param {string} key - Storage key
	 * @returns {boolean} - True if data exists
	 */
	hasData(key: string): boolean;
}

/**
 * Storage utils implementation
 * @type {StorageUtils}
 */
export const StorageUtils: StorageUtils = {} as StorageUtils;

/**
 * Save data to localStorage
 * @param {string} key - Storage key
 * @param {any} data - Data to save
 */
StorageUtils.saveData = function <T>(key: string, data: T): void {
	try {
		const serializedData = JSON.stringify(data);
		localStorage.setItem(key, serializedData);
	} catch (error) {
		console.error('Failed to save data to localStorage:', error);
	}
};

/**
 * Get data from localStorage
 * @param {string} key - Storage key
 * @returns {T | null} - Retrieved data or null if not found
 */
StorageUtils.getData = function <T>(key: string): T | null {
	try {
		const serializedData = localStorage.getItem(key);
		if (!serializedData) return null;
		return JSON.parse(serializedData) as T;
	} catch (error) {
		console.error('Failed to get data from localStorage:', error);
		return null;
	}
};

/**
 * Check if data exists in localStorage
 * @param {string} key - Storage key
 * @returns {boolean} - True if data exists
 */
StorageUtils.hasData = function (key: string): boolean {
	return localStorage.getItem(key) !== null;
};
