<script lang="ts">
	import { privateConfigCategories, publicConfigCategories } from '@root/config/guiConfig';

	// Components
	import PageTitle from '@components/PageTitle.svelte';

	// Skeleton
	import ModalEditSystem from './ModalEditSystem.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalComponent, ModalSettings } from '@skeletonlabs/skeleton';

	import { getContext } from 'svelte';
	import { type ToastContext } from '@skeletonlabs/skeleton-svelte';

	export const toast: ToastContext = getContext('toast');
	const modalStore = getModalStore();

	// Show corresponding Toast messages
	function showToast(description: string, type: 'success' | 'info' | 'error') {
		const types: Record<'success' | 'info' | 'error', 'success' | 'error' | 'info'> = {
			success: 'success',
			info: 'info',
			error: 'error'
		};
		toast.create({
			title: type.charAt(0).toUpperCase() + type.slice(1),
			description,
			type: types[type],
			duration: 3000
		});
	}

	async function saveConfig(configData: { [key: string]: any }, isPrivate: boolean) {
		try {
			const response = await fetch('/api/save-config', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ configData, isPrivate })
			});
			const result = await response.json();
			if (result.success) {
				showToast('Configuration saved successfully!', 'success');

				// Trigger a restart API route
				await triggerRestart();
			} else {
				showToast('Failed to save configuration.', 'error');
			}
		} catch (error) {
			console.error('Error saving configuration:', error);
			showToast('Error saving configuration.', 'error');
		}
	}

	async function triggerRestart() {
		try {
			const response = await fetch('/api/restart', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			const result = await response.json();
			if (result.success) {
				showToast('Server restart triggered successfully!', 'success');
			} else {
				showToast('Failed to trigger server restart.', 'error');
			}
		} catch (error) {
			console.error('Error triggering server restart:', error);
			showToast('Error triggering server restart.', 'error');
		}
	}

	// Modal Edit System
	function openModal(title, configCategory, description, isPrivate): void {
		const modalComponent: ModalComponent = {
			ref: ModalEditSystem,
			props: {
				title,
				configCategory,
				description,
				isPrivate,
				parent: {
					onClose: () => modalStore.close(),
					onSave: async (formData: { [key: string]: any }) => {
						await saveConfig(formData, isPrivate);
						modalStore.close();
					}
				}
			}
		};
		const modalSettings: ModalSettings = {
			type: 'component',
			title,
			component: modalComponent
		};
		modalStore.trigger(modalSettings);
	}

	const categories = [
		...Object.entries(privateConfigCategories).map(([category, config]) => ({
			name: category,
			category,
			config,
			isPrivate: true
		})),
		...Object.entries(publicConfigCategories).map(([category, config]) => ({
			name: category,
			category,
			config,
			isPrivate: false
		}))
	];
</script>

<!-- Page Title with Back Button -->
<PageTitle name="System Settings" icon="uil:setting" showBackButton={true} backUrl="/config" />

<div class="my-4">
	<div class="wrapper !bg-error-500 text-center">
		<p>Current in Development!!! For testing purposes only</p>
		<p>Environment Data is only shown to role admin</p>
	</div>
</div>

<div class="my-2 mt-2 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
	{#each categories as { name, category, config, isPrivate }}
		<button
			onclick={() => openModal(name, category, config.description, isPrivate)}
			aria-label={config.description}
			class="preset-outline-primary btn flex items-center justify-center gap-2"
		>
			<div class="grid grid-cols-1 justify-items-center">
				<iconify-icon icon={config.icon} width="28" class="text-tertiary-500 dark:text-primary-500"></iconify-icon>
				<span class="capitalize">{name}</span>
			</div>
		</button>
	{/each}
</div>
