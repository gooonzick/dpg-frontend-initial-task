<script lang="ts">
	/**
	 * Dependence
	 */
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import {
		notificationStore,
		type Notification,
		NOTIFICATION__TYPE
	} from '$lib/stores/notification';

	/**
	 * Auto-hide timeout in milliseconds
	 * @type {number}
	 */
	const AUTO__HIDE__TIMEOUT = 5000;

	/**
	 * Timer ID for auto-hide
	 * @type {number | null}
	 */
	let timer__id: number | null = null;

	/**
	 * Current notification
	 * @type {Notification}
	 */
	let notification: Notification;

	/**
	 * Subscribe to notification store
	 */
	notificationStore.subscribe((value) => {
		notification = value;

		// Clear existing timer if any
		if (timer__id) clearTimeout(timer__id);

		// Set auto-hide timer if notification is visible
		if (notification.visible) {
			timer__id = setTimeout(() => {
				notificationStore.hide();
			}, AUTO__HIDE__TIMEOUT) as unknown as number;
		}
	});

	/**
	 * Clean up on component unmount
	 */
	onMount(() => {
		return () => {
			if (timer__id) clearTimeout(timer__id);
		};
	});
</script>

{#if notification.visible}
	<div
		class="notification"
		class:notification--info={notification.type === NOTIFICATION__TYPE.INFO}
		class:notification--warning={notification.type === NOTIFICATION__TYPE.WARNING}
		class:notification--error={notification.type === NOTIFICATION__TYPE.ERROR}
		transition:fade={{ duration: 200 }}
	>
		<span>{notification.message}</span>
		<button on:click={() => notificationStore.hide()}>×</button>
	</div>
{/if}

<style lang="scss">
	.notification {
		position: fixed;
		top: 20px;
		right: 20px;
		padding: 15px 20px;
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-width: 280px;
		max-width: 400px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		z-index: 1000;

		span {
			flex-grow: 1;
			margin-right: 10px;
		}

		button {
			background: none;
			border: none;
			font-size: 20px;
			cursor: pointer;
			padding: 0;
			color: inherit;
			opacity: 0.7;

			&:hover {
				opacity: 1;
			}
		}

		&--info {
			background: #e3f2fd;
			color: #0d47a1;
		}

		&--warning {
			background: #fff8e1;
			color: #ff8f00;
		}

		&--error {
			background: #ffebee;
			color: #c62828;
		}
	}
</style>
