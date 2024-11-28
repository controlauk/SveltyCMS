<!-- 
@file src/components/Collections.svelte
@component
**Collections component to display & filter collections and categories.**

```tsx
<Collections />
```

@props
- `mode` - The current mode of the component. Can be 'view', 'edit', 'create', 'delete', 'modify', or 'media'.

Features: 
- display collections
- search collections with clear button
- support for nested categories with autocollapse
- responsive sidebar integration
- media gallery support
- improved subcategory search and padding	
-->

<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	// Types
	import type { Schema, CategoryData, Category } from '@src/collections/types';

	// Stores
	import { get } from 'svelte/store';
	import { shouldShowNextButton } from '@stores/store';
	import { mode, collection, categories, collections } from '@root/src/stores/collectionStore.svelte';
	import { handleSidebarToggle, sidebarState, toggleSidebar } from '@root/src/stores/sidebarStore.svelte';
	import { screenSize } from '@root/src/stores/screenSizeStore.svelte';

	// ParaglideJS
	import * as m from '@src/paraglide/messages';

	// Skeleton
	import { Accordion, Tooltip } from '@skeletonlabs/skeleton-svelte';

	// Accordion State
	let openCategories = $state<string[]>([]);

	// Import VirtualFolders component
	import VirtualFolders from '@components/VirtualFolders.svelte';

	type ModeType = 'view' | 'edit' | 'create' | 'delete' | 'modify' | 'media';

	// Props
	let modeSet = $state<ModeType>('view');

	// Search Collections
	let search = $state('');
	let searchShow = $state(false);

	interface FilteredCategory extends Category {
		open: boolean;
		level: number;
	}

	let filteredCategories = $state<FilteredCategory[]>([]);

	// Function to flatten and filter categories with improved subcategory search
	function filterCategories(searchTerm: string, cats: Record<string, CategoryData>): FilteredCategory[] {
		if (!cats || Object.keys(cats).length === 0) return [];

		function processCategory(category: CategoryData, level: number = 0): FilteredCategory | null {
			const idStr = category.id.replace(/\D/g, '');
			const id = idStr ? parseInt(idStr) : Date.now();

			const processed: FilteredCategory = {
				id,
				name: category.name,
				icon: category.icon,
				collections: [],
				level,
				open: searchTerm !== '', // Auto-open categories when searching
				subcategories: {}
			};

			// Process subcategories
			let hasMatchingContent = false;
			if (category.subcategories) {
				Object.entries(category.subcategories).forEach(([key, subCat]) => {
					if (subCat.isCollection) {
						const collectionId = parseInt(subCat.id.replace(/\D/g, '') || Date.now().toString());
						const collectionSchema = collections.value[key];

						if (collectionSchema) {
							const collection = {
								...collectionSchema,
								id: collectionId,
								icon: subCat.icon || collectionSchema.icon,
								fields: collectionSchema.fields || []
							};

							if (searchTerm === '' || (collection.name as string).toLowerCase().includes(searchTerm.toLowerCase())) {
								processed.collections.push(collection);
								hasMatchingContent = true;
							}
						}
					} else {
						const processedSub = processCategory(subCat, level + 1);
						if (processedSub) {
							processed.subcategories![key] = processedSub;
							hasMatchingContent = true;
						}
					}
				});
			}

			const searchLower = searchTerm.toLowerCase();
			const nameMatches = category.name.toLowerCase().includes(searchLower);

			return searchTerm === '' || nameMatches || hasMatchingContent ? processed : null;
		}

		// Process only root categories (Collections and Menu)
		return Object.entries(cats)
			.filter(([name]) => name === 'Collections' || name === 'Menu')
			.map(([, cat]) => processCategory(cat))
			.filter((cat): cat is FilteredCategory => cat !== null);
	}

	// Subscribe to categories and collections store changes and handle search
	$effect(() => {
		if ($categories && collections.value) {
			filteredCategories = filterCategories(search, $categories);
		}
	});

	// Handle search input
	function handleSearch(event: Event) {
		const target = event.target as HTMLInputElement;
		search = target.value;
		filteredCategories = filterCategories(search, $categories);
	}

	// Clear search
	function clearSearch() {
		search = '';
		filteredCategories = filterCategories('', $categories);
		// Focus the search input after clearing
		const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
		if (searchInput) searchInput.focus();
	}

	// Determine if the current mode is 'media'
	let isMediaMode = $derived(mode.value === 'media');

	onMount(() => {
		if ($categories && collections.value) {
			filteredCategories = filterCategories('', $categories);
		}
	});

	// Helper function to get indentation class based on level
	function getIndentClass(level: number): string {
		return `pl-${level * 2}`; // Reduced padding for better space utilization
	}

	// Handle collection selection
	function handleCollectionSelect(_collection: Schema) {
		if (_collection.id) {
			goto(`/collections/${_collection.id}`);
			if (mode.value === 'edit') {
				mode.set('view');
			} else {
				mode.set(modeSet);
				shouldShowNextButton.set(true);
			}
			collection.set(_collection);
			handleSidebarToggle();
		}
	}

	// Generate unique key for collection items
	function getCollectionKey(_collection: Schema, categoryId: string): string {
		// The collection should already have an ID from the category processing
		return `${categoryId}-${String(_collection.name)}-${_collection.id}`;
	}

	// Handlers
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			const target = event.target as HTMLElement;
			target.click();
		}
	}
</script>

<div class="mt-2">
	{#if !isMediaMode}
		<!-- Search Input -->
		{#if sidebarState.sidebar.value.left === 'collapsed'}
			<button
				type="button"
				onclick={() => {
					if (get(screenSize) === 'sm') {
						toggleSidebar('left', 'hidden');
					} else {
						sidebarState.sidebar.update((state) => ({ ...state, left: 'full' }));
					}
					searchShow = true;
				}}
				class="btn input mb-2 w-full"
				aria-label="Search Collections"
			>
				<iconify-icon icon="ic:outline-search" width="24"></iconify-icon>
			</button>
		{:else}
			<div class="input-group-divider input-group mb-2 grid grid-cols-[1fr_auto]">
				<input
					type="text"
					placeholder={m.collections_search()}
					bind:value={search}
					oninput={handleSearch}
					onfocus={() => (searchShow = false)}
					class="input h-12 outline-none transition-all duration-500 ease-in-out"
				/>
				<button onclick={clearSearch} class="w-12 preset-filled-surface-500" aria-label="Clear search">
					<iconify-icon icon="ic:outline-search-off" width="24"></iconify-icon>
				</button>
			</div>
		{/if}

		<!-- Collections Accordion -->
		<Accordion bind:value={openCategories} multiple>
			{#each filteredCategories as category}
				<Accordion.Item value={category.name}>
					{#snippet lead()}
						<Tooltip positioning={{ placement: 'right' }} openDelay={200}>
							{#snippet trigger()}
								<iconify-icon icon={category.icon} width="24" class="text-error-500 rtl:ml-2"></iconify-icon>
							{/snippet}
							{#snippet content()}
								<div class="card p-4 preset-filled-secondary-500">
									<p>{category.name}</p>
								</div>
							{/snippet}
						</Tooltip>
					{/snippet}
					{#snippet control()}
						{#if sidebarState.sidebar.value.left === 'full'}
							<p class="text-white">{category.name}</p>
						{/if}
					{/snippet}
					{#snippet panel()}
						<div class={`divide-y rounded-md bg-surface-300 dark:divide-black ${getIndentClass(category.level)}`}>
							<!-- Collections in this category -->
							{#if category.collections?.length}
								{#each category.collections as _collection (getCollectionKey(_collection, category.name.toString()))}
									<div
										role="button"
										tabindex={0}
										class="-mx-4 flex {sidebarState.sidebar.value.left === 'full'
											? 'flex-row items-center pl-3'
											: 'flex-col items-center'} py-1 hover:bg-surface-400 hover:text-white"
										onkeydown={handleKeydown}
										onclick={() => handleCollectionSelect(_collection)}
									>
										{#if sidebarState.sidebar.value.left === 'full'}
											<Tooltip positioning={{ placement: 'right' }} openDelay={200}>
												{#snippet trigger()}
													<iconify-icon icon={_collection.icon} width="24" class="px-2 py-1 text-error-600"></iconify-icon>
												{/snippet}
												{#snippet content()}
													<div class="card p-4 preset-filled-secondary-500">
														<p>{_collection.name}</p>
													</div>
												{/snippet}
											</Tooltip>
											<p class="mr-auto text-center capitalize">{_collection.name}</p>
										{:else}
											<p class="text-xs capitalize">{_collection.name}</p>
											<Tooltip positioning={{ placement: 'right' }} openDelay={200}>
												{#snippet trigger()}
													<iconify-icon icon={_collection.icon} width="24" class="text-error-600"></iconify-icon>
												{/snippet}
												{#snippet content()}
													<div class="card p-4 preset-filled-secondary-500">
														<p>{_collection.name}</p>
													</div>
												{/snippet}
											</Tooltip>
										{/if}
									</div>
								{/each}
							{/if}

							<!-- Subcategories -->
							{#if category.subcategories && Object.keys(category.subcategories).length > 0}
								{#each Object.entries(category.subcategories) as [subKey, subCategory]}
									<Accordion.Item value={`${category.name}-${subKey}`}>
										{#snippet lead()}
											<Tooltip positioning={{ placement: 'right' }} openDelay={200}>
												{#snippet trigger()}
													<iconify-icon icon={subCategory.icon} width="24" class="text-error-500 rtl:ml-2"></iconify-icon>
												{/snippet}
												{#snippet content()}
													<div class="card p-4 preset-filled-secondary-500">
														<p class="uppercase">{subCategory.name}</p>
													</div>
												{/snippet}
											</Tooltip>
										{/snippet}
										{#snippet control()}
											{#if sidebarState.sidebar.value.left === 'full'}
												<p class="uppercase text-white">{subCategory.name}</p>
											{/if}
										{/snippet}
										{#snippet panel()}
											<div class={`divide-y rounded-md bg-surface-300 dark:divide-black ${getIndentClass(category.level + 1)}`}>
												{#if subCategory.collections?.length}
													{#each subCategory.collections as _collection (getCollectionKey(_collection, subCategory.name.toString()))}
														<div
															role="button"
															tabindex={0}
															class="-mx-4 flex {sidebarState.sidebar.value.left === 'full'
																? 'flex-row items-center pl-3'
																: 'flex-col items-center'} py-1 hover:bg-surface-400 hover:text-white"
															onkeydown={handleKeydown}
															onclick={() => handleCollectionSelect(_collection)}
														>
															{#if sidebarState.sidebar.value.left === 'full'}
																<Tooltip positioning={{ placement: 'right' }} openDelay={200}>
																	{#snippet trigger()}
																		<iconify-icon icon={_collection.icon} width="24" class="px-2 py-1 text-error-600"></iconify-icon>
																	{/snippet}
																	{#snippet content()}
																		<div class="card p-4 preset-filled-secondary-500">
																			<p>{_collection.name}</p>
																		</div>
																	{/snippet}
																</Tooltip>
																<p class="mr-auto text-center capitalize">{_collection.name}</p>
															{:else}
																<p class="text-xs capitalize">{_collection.name}</p>
																<Tooltip positioning={{ placement: 'right' }} openDelay={200}>
																	{#snippet trigger()}
																		<iconify-icon icon={_collection.icon} width="24" class="text-error-600"></iconify-icon>
																	{/snippet}
																	{#snippet content()}
																		<div class="card p-4 preset-filled-secondary-500">
																			<p>{_collection.name}</p>
																		</div>
																	{/snippet}
																</Tooltip>
															{/if}
														</div>
													{/each}
												{/if}
											</div>
										{/snippet}
									</Accordion.Item>
								{/each}
							{/if}
						</div>
					{/snippet}
				</Accordion.Item>
				<hr class="!border-t-2 !border-surface-500" />
			{/each}
		</Accordion>

		<!-- Media Gallery Button -->
		<button
			class="btn mt-1 flex w-full {sidebarState.sidebar.value.left === 'full'
				? 'flex-row justify-start pl-2'
				: 'flex-col'} items-center bg-surface-400 py-{sidebarState.sidebar.value.left === 'full'
				? '2'
				: '1'} hover:!bg-surface-400 hover:text-white dark:bg-surface-500"
			onclick={() => {
				mode.set('media');
				goto('/mediagallery');
				if (get(screenSize) === 'sm') {
					toggleSidebar('left', 'hidden');
				}
				if (sidebarState.sidebar.value.left !== 'full') handleSidebarToggle();
			}}
		>
			{#if sidebarState.sidebar.value.left === 'full'}
				<iconify-icon icon="bi:images" width="24" class="px-2 py-1 text-primary-600 rtl:ml-2"></iconify-icon>
				<p class="mr-auto text-center uppercase text-white">{m.Collections_MediaGallery()}</p>
			{:else}
				<p class="text-xs uppercase text-white">{m.Collections_MediaGallery()}</p>
				<iconify-icon icon="bi:images" width="24" class="text-primary-500"></iconify-icon>
			{/if}
		</button>
	{:else if sidebarState.sidebar.value.left === 'full'}
		<button
			class="btn mt-1 flex w-full flex-row items-center justify-start bg-surface-400 py-2 pl-2 text-white dark:bg-surface-500"
			onclick={() => {
				mode.set('view');
				if (get(screenSize) === 'sm') {
					toggleSidebar('left', 'hidden');
				}
			}}
		>
			<iconify-icon icon="bi:collection" width="24" class="px-2 py-1 text-error-500 rtl:ml-2"></iconify-icon>
			<p class="mr-auto text-center uppercase">Collections</p>
		</button>
	{:else}
		<!-- Display Virtual Folders -->
		<VirtualFolders />
	{/if}
</div>
