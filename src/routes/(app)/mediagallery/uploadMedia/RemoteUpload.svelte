<!-- 
@files src/routes/(app)/mediagallery/uploadMedia/RemoteUpload.svelte
@component
**This page is used to Remote Urls to the media gallery**

```tsx
<RemoteUpload remoteUrls={remoteUrls} />
```
- `remoteUrls` {string[]} - Array of remote URLs
-->
<script lang="ts">
	import { getContext } from 'svelte';
	import { type ToastContext } from '@skeletonlabs/skeleton-svelte';

	let remoteUrls: string[] = $state([]);
	export const toast: ToastContext = getContext('toast');

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

	function handleRemoteUrlInput(event: Event) {
		const target = event.target as HTMLTextAreaElement | null;
		if (target) {
			remoteUrls = target.value.split('\n').filter((url) => url.trim() !== '');
		}
	}

	async function uploadRemoteUrls() {
		if (remoteUrls.length === 0) {
			showToast('No URLs entered for upload', 'error');
			return;
		}

		const formData = new FormData();
		formData.append('remoteUrls', JSON.stringify(remoteUrls));

		try {
			const response = await fetch('/api/media/saveMedia', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				throw Error('Upload failed');
			}

			const result = await response.json();

			if (result.success) {
				showToast('URLs uploaded successfully', 'success');
				remoteUrls = []; // Clear the remote URLs array after successful upload
			} else {
				throw Error(result.error || 'Upload failed');
			}
		} catch (error) {
			console.error('Error uploading URLs:', error);
			showToast('Error uploading URLs: ' + (error instanceof Error ? error.message : 'Unknown error'), 'error');
		}
	}
</script>

<div class="space-y-4">
	<textarea
		bind:value={remoteUrls}
		placeholder="Paste Remote URLs here, one per line..."
		class="textarea w-full"
		rows="6"
		oninput={handleRemoteUrlInput}
	></textarea>
	<!-- Upload Button -->
	<button class="btn mt-2 preset-filled-primary-500" onclick={uploadRemoteUrls}> Upload URLs </button>
</div>
