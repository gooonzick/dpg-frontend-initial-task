<script lang="ts">
	/**
	 * Dependence
	 */
	import PostsApi from '$lib/api/methods/posts';
	import { getReasonPhrase } from 'http-status-codes';
	import { StorageUtils, STORAGE__KEYS } from '$lib/utils/storage';
	import { notificationStore, NOTIFICATION__TYPE } from '$lib/stores/notification';

	/**
	 * Components
	 */
	import Feed from '$lib/components/feed/Feed.svelte';
	import Loader from '$lib/components/shared/Loader.svelte';
	import ErrorComponent from '$lib/components/shared/Error.svelte';
	import Notification from '$lib/components/shared/Notification.svelte';
	import type { IPostsResponse } from '$lib/api/types/response/posts';

	/**
	 * Flag to track if data is loaded from cache
	 * @type {boolean}
	 */
	let is__cache = false;

	/**
	 * Load data
	 * @description Method to get posts from API or cache
	 */
	const loadData = async () => {
		try {
			// Try to get data from API first
			const response = await PostsApi.getAll();

			if (response.success) {
				// If API call successful, save data to cache
				StorageUtils.saveData(STORAGE__KEYS.POSTS, response.data);
				is__cache = false;
				return response.data;
			}

			// If API call failed, try to get data from cache
			if (StorageUtils.hasData(STORAGE__KEYS.POSTS)) {
				const cached__data = StorageUtils.getData<IPostsResponse>(STORAGE__KEYS.POSTS);
				is__cache = true;
				notificationStore.show(
					'Using cached data. API request failed.',
					NOTIFICATION__TYPE.WARNING
				);
				return cached__data ?? [];
			}

			// If no data in cache either, throw error
			throw new Error('No data available to display.');
		} catch (error) {
			if (error instanceof Error && error.message === 'No data available to display.') {
				throw error;
			}

			// For other errors, try to get data from cache
			if (StorageUtils.hasData(STORAGE__KEYS.POSTS)) {
				const cached__data = StorageUtils.getData<IPostsResponse>(STORAGE__KEYS.POSTS);
				is__cache = true;
				notificationStore.show(
					'Using cached data. API request failed.',
					NOTIFICATION__TYPE.WARNING
				);
				return cached__data ?? [];
			}

			// If all else fails, throw the original error
			if (error instanceof Error) {
				throw error;
			} else {
				throw new Error(getReasonPhrase(500));
			}
		}
	};
</script>

<Notification />

{#await loadData()}
	<Loader />
{:then posts}
	<Feed {posts} />
	{#if is__cache}
		<div class="cache-indicator">Data loaded from cache</div>
	{/if}
{:catch e}
	<ErrorComponent>
		{e.message || 'Error loading data'}
	</ErrorComponent>
{/await}

<style lang="scss">
	.cache-indicator {
		margin-top: 20px;
		padding: 10px;
		background-color: #fff8e1;
		border-radius: 4px;
		text-align: center;
		color: #ff8f00;
	}
</style>
