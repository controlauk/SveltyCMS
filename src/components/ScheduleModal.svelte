<!-- 
@file src/components/ScheduleModal.svelte
@description ScheduleModal component for scheduling actions on entries
Features:
- Schedule publish, unpublish, delete actions
- Date and time picker for scheduling
- Action type selection
- Responsive design
- Accessibility improvements
- Error handling and validation
- Improved type safety
Usage:
Import and use <ScheduleModal /> in your Svelte application.
Ensure that the necessary stores and utility functions are available.
-->

<script lang="ts">
	import { page } from '$app/stores';
	import { modifyEntry, selectedEntries, collectionValue, collection } from '@root/src/stores/collectionStore.svelte';
	import { saveFormData } from '@utils/data';

	// Auth
	import type { User } from '@src/auth/types';

	// ParaglideJS
	import * as m from '@src/paraglide/messages';

	// Skeleton
	import { Modal } from '@skeletonlabs/skeleton-svelte';
	let openState = $state(false);

	function modalClose() {
		openState = false;
		scheduleDate = '';
		errorMessage = '';
	}

	// Types
	type ActionType = 'published' | 'unpublished' | 'deleted' | 'scheduled' | 'cloned' | 'testing';

	let scheduleDate: string = $state('');
	let action: ActionType = $state('scheduled');
	let errorMessage: string = $state('');

	const actionOptions: Array<{ value: ActionType; label: string }> = [
		{ value: 'published', label: m.entrylist_multibutton_publish() },
		{ value: 'unpublished', label: m.entrylist_multibutton_unpublish() },
		{ value: 'deleted', label: m.button_delete() }
	];

	let isFormValid = $derived(scheduleDate !== '' && action !== undefined);

	function validateForm(): boolean {
		if (!scheduleDate) {
			errorMessage = 'Please select a date and time';
			return false;
		}

		const scheduledDate = new Date(scheduleDate);
		if (scheduledDate < new Date()) {
			errorMessage = 'Schedule date must be in the future';
			return false;
		}

		errorMessage = '';
		return true;
	}

	async function handleSchedule(): Promise<void> {
		if (!validateForm()) return;

		try {
			if ($selectedEntries && $selectedEntries.length > 0) {
				const scheduledTime = new Date(scheduleDate).getTime();

				for (const entry of $selectedEntries) {
					const updatedEntry = {
						...entry,
						scheduledAction: {
							action,
							date: scheduleDate
						}
					};

					await modifyEntry(updatedEntry);
				}

				$selectedEntries = [];
			} else {
				$modifyEntry(action);
			}

			modalClose();
		} catch (error) {
			console.error('Error scheduling entries:', error);
			errorMessage = 'An error occurred while scheduling. Please try again.';
		}
	}
</script>

<Modal
	bind:open={openState}
	triggerBase="card p-4 w-modal shadow-xl space-y-4 bg-white"
	contentBase="border border-surface-500 p-4 space-y-4 rounded-container-token"
	backdropClasses="backdrop-blur-sm"
>
	{#snippet trigger()}
		<button class="variant-filled btn">Schedule Action</button>
	{/snippet}

	{#snippet content()}
		<header class="flex items-center justify-between">
			<h2 class="h2">Schedule Action</h2>
		</header>

		<article class="space-y-4">
			<div class="form-field">
				<label for="action">Action</label>
				<select id="action" class="select" bind:value={action}>
					{#each actionOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</div>

			<div class="form-field">
				<label for="schedule-date">Schedule Date</label>
				<input
					id="schedule-date"
					type="datetime-local"
					class="input"
					bind:value={scheduleDate}
					min={new Date().toISOString().slice(0, 16)}
					aria-describedby="schedule-date-error"
				/>
			</div>

			{#if errorMessage}
				<div class="alert variant-filled-error" id="schedule-date-error" role="alert">{errorMessage}</div>
			{/if}
		</article>

		<footer class="flex justify-end gap-4">
			<button type="button" class="variant-soft btn" onclick={modalClose}>Cancel</button>
			<button type="button" class="variant-filled-primary btn" onclick={handleSchedule} disabled={!isFormValid}> Schedule </button>
		</footer>
	{/snippet}
</Modal>
