<!-- 
@file src/components/LeftSidebar.svelte 
@component
**LeftSidebar component displaying collection fields, publish options and translation status.**

```tsx
<LeftSidebar collection={collection} />
```
#### Props
- `collection` {object} - Collection object
-->

<script module lang="ts">
	declare const __VERSION__: string;
</script>

<script lang="ts">
	import { publicEnv } from '@root/config/public';
	import { goto, invalidateAll } from '$app/navigation';
	import axios from 'axios';

	// Import necessary utilities and types
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import { avatarSrc, pkgBgColor, systemLanguage } from '@stores/store';
	import { mode } from '@stores/collectionStore.svelte';
	import { toggleSidebar, sidebarState, userPreferredState, handleSidebarToggle } from '@root/src/stores/sidebarStore.svelte';
	import { screenSize } from '@stores/screenSizeStore.svelte';
	// Import components and utilities
	import SveltyCMSLogo from '@components/system/icons/SveltyCMS_Logo.svelte';
	import SiteName from '@components/SiteName.svelte';
	import Collections from '@components/Collections.svelte';
	import { getLanguageName } from '@utils/languageUtils';

	// Skeleton
	import { Avatar, Tooltip } from '@skeletonlabs/skeleton-svelte';

	// Theme mode
	import { themeStore } from '@stores/themeStore.svelte';
	import { onMount, onDestroy } from 'svelte';

	let isDark = $state(false);
	let mediaQuery: MediaQueryList;
	let handleChange: (e: MediaQueryListEvent) => Promise<void>;

	$effect(() => {
		// Update isDark state when theme changes
		isDark = themeStore.currentTheme?.name === 'dark';
	});

	async function toggleTheme() {
		try {
			await themeStore.updateTheme(isDark ? 'light' : 'dark');
		} catch (error) {
			console.error('Failed to update theme:', error);
		}
	}

	// Initialize theme handling
	handleChange = async (e: MediaQueryListEvent) => {
		if (!themeStore.currentTheme) {
			await themeStore.updateTheme(e.matches ? 'dark' : 'light');
		}
	};

	onMount(async () => {
		await themeStore.initialize().catch(console.error);

		// Listen for system theme changes if no theme is set
		mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		mediaQuery.addEventListener('change', handleChange);
	});

	onDestroy(() => {
		if (mediaQuery) {
			mediaQuery.removeEventListener('change', handleChange);
		}
	});

	// Define user data and state variables
	const user = $page.data.user;
	avatarSrc.set(user?.avatar);

	// Tooltip states
	let userTooltip = $state(false);
	let languageTooltip = $state(false);
	let themeTooltip = $state(false);
	let signOutTooltip = $state(false);
	let configTooltip = $state(false);
	let githubTooltip = $state(false);

	// Language and messaging setup
	import * as m from '@src/paraglide/messages';
	import { languageTag } from '@src/paraglide/runtime';

	// Define language type based on available languages
	type AvailableLanguage = (typeof publicEnv.AVAILABLE_SYSTEM_LANGUAGES)[number];

	let _languageTag = $state(languageTag()); // Get the current language tag

	// Enhanced language selector
	let searchQuery = $state('');
	let isDropdownOpen = $state(false);
	let searchInput: HTMLInputElement | undefined = $state();
	let dropdownRef = $state<HTMLElement | null>(null);
	let debounceTimeout: ReturnType<typeof setTimeout>;

	// Computed values
	const availableLanguages = $derived(
		[...publicEnv.AVAILABLE_SYSTEM_LANGUAGES].sort((a, b) => getLanguageName(a, 'en').localeCompare(getLanguageName(b, 'en')))
	);

	const filteredLanguages = $derived(
		availableLanguages.filter(
			(lang: string) =>
				getLanguageName(lang, systemLanguage.value).toLowerCase().includes(searchQuery.toLowerCase()) ||
				getLanguageName(lang, 'en').toLowerCase().includes(searchQuery.toLowerCase())
		) as AvailableLanguage[]
	);

	// Click outside effect
	$effect(() => {
		const handleClick = (event: MouseEvent) => {
			if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
				isDropdownOpen = false;
				searchQuery = '';
			}
		};

		document.addEventListener('click', handleClick);
		return () => document.removeEventListener('click', handleClick);
	});

	// Event handlers
	function handleLanguageSelection(lang: AvailableLanguage) {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(() => {
			systemLanguage.set(lang);
			_languageTag = lang;
			isDropdownOpen = false;
			searchQuery = '';
		}, 300);
	}

	// SignOut function
	async function signOut() {
		try {
			console.log('Starting sign-out process...');

			// Call the logout API endpoint
			const response = await axios.post(
				'/api/user/logout',
				{},
				{
					withCredentials: true // This is important to include cookies
				}
			);

			console.log('Logout response:', response.data);

			// Always invalidate and redirect, even if the server response isn't as expected
			await invalidateAll();
			console.log('All data invalidated');
			await goto('/login');
			console.log('Redirected to login page');
		} catch (error) {
			console.error('Error during sign-out:', error instanceof Error ? error.message : 'Unknown error');

			// Even if there's an error, we should still invalidate and redirect
			await invalidateAll();
			await goto('/login');
		}
	}

	// GitHub version and theme toggle
	const pkg = __VERSION__ || '';
	let githubVersion = '';

	axios
		.get('https://api.github.com/repos/Rar9/SveltyCMS/releases/latest')
		.then((response) => {
			githubVersion = response.data.tag_name.slice(1);
			const [localMajor, localMinor] = pkg.split('.').map(Number);
			const [githubMajor, githubMinor] = githubVersion.split('.').map(Number);

			if (githubMinor > localMinor) {
				$pkgBgColor = 'preset-filled-warning-500';
			} else if (githubMajor !== localMajor) {
				$pkgBgColor = 'preset-filled-error-500';
			}
		})
		.catch((error) => {
			console.error('Error von Github Release found:', error);
			githubVersion = pkg;
			$pkgBgColor = 'preset-filled-tertiary-500';
		});

	function handleSelectChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		if (target) {
			handleLanguageSelection(target.value as AvailableLanguage);
		}
	}
</script>

<div class="flex h-full w-full flex-col justify-between">
	<!-- Corporate Identity Full-->
	{#if sidebarState.sidebar.value.left === 'full'}
		<a href="/" aria-label="SveltyCMS Logo" class="flex pt-2 !no-underline">
			<SveltyCMSLogo fill="red" className="h-9 -ml-2" />
			<span class="text-token relative text-2xl font-bold"><SiteName /> </span>
		</a>
	{:else}
		<!-- Corporate Identity Collapsed-->
		<div class="gap flex justify-start">
			<button type="button" onclick={() => toggleSidebar('left', 'hidden')} aria-label="Open Sidebar" class="btn-icon mt-1 preset-tonal-surface">
				<iconify-icon icon="mingcute:menu-fill" width="24"></iconify-icon>
			</button>

			<a href="/" aria-label="SveltyCMS Logo" class="flex justify-center pt-2 !no-underline">
				<SveltyCMSLogo fill="red" className="h-9 -ml-2 ltr:mr-2 rtl:ml-2 rtl:-mr-2" />
			</a>
		</div>
	{/if}

	<!-- Button to expand/collapse sidebar -->
	<button
		type="button"
		onclick={() => {
			toggleSidebar('left', sidebarState.sidebar.value.left === 'full' ? 'collapsed' : 'full');
			userPreferredState.set(sidebarState.sidebar.value.left === 'full' ? 'collapsed' : 'full');
		}}
		aria-label="Expand/Collapse Sidebar"
		class="absolute top-2 z-20 flex items-center justify-center !rounded-full border-[3px] dark:border-black ltr:-right-3 rtl:-left-3"
	>
		<iconify-icon
			icon="bi:arrow-left-circle-fill"
			width="30"
			class={`rounded-full bg-surface-500 text-white hover:cursor-pointer hover:bg-error-600 dark:bg-white dark:text-surface-600 dark:hover:bg-error-600 ${sidebarState.sidebar.value.left === 'full' ? 'rotate-0 rtl:rotate-180' : 'rotate-180 rtl:rotate-0'}`}
		></iconify-icon>
	</button>

	<!--SideBar Middle -->
	<Collections />

	<!-- Sidebar Left Footer -->
	<div class="mb-2 mt-auto bg-white dark:bg-gradient-to-r dark:from-surface-700 dark:to-surface-950">
		<div class="mx-1 mb-1 border-0 border-t border-surface-400"></div>

		<div
			class="{sidebarState.sidebar.value.left === 'full' ? 'grid-cols-3 grid-rows-3' : 'grid-cols-2 grid-rows-2'} grid items-center justify-center"
		>
			<!-- User Profile -->
			<div class={sidebarState.sidebar.value.left === 'full' ? 'order-1 row-span-2' : 'order-1'}>
				<Tooltip bind:open={userTooltip} positioning={{ placement: 'right' }} contentBase="card preset-filled p-4" openDelay={200}>
					{#snippet trigger()}
						<button
							type="button"
							onclick={() => {
								if (!$page.url.href.includes('user')) {
									mode.set('view');
									// Only handle sidebar on mobile
									if (get(screenSize) === 'sm') {
										toggleSidebar('left', 'hidden');
									}
									goto('/user');
								}
							}}
							class="btn-icon hover:bg-surface-500 hover:text-white"
							aria-label="User Profile"
						>
							<Avatar
								name={user?.name ?? 'User'}
								background={$pkgBgColor}
								size={sidebarState.sidebar.value.left === 'full' ? 'w-[40px]' : 'w-[35px]'}
								rounded="rounded-full"
								border="border-2 border-surface-300-600-token hover:!border-primary-500"
								src={$avatarSrc && $avatarSrc.startsWith('data:') ? $avatarSrc : $avatarSrc ? `/${$avatarSrc}?t=${Date.now()}` : '/Default_User.svg'}
							/>
						</button>
					{/snippet}
					{#snippet content()}
						<p>{m.applayout_userprofile()}</p>
					{/snippet}
				</Tooltip>
			</div>

			<!-- Enhanced System Language Selector -->
			<div class={sidebarState.sidebar.value.left === 'full' ? 'order-3 row-span-2' : 'order-2'}>
				<Tooltip bind:open={languageTooltip} positioning={{ placement: 'right' }} contentBase="card preset-filled p-4" openDelay={200}>
					{#snippet trigger()}
						<div class="language-selector relative" bind:this={dropdownRef}>
							{#if publicEnv.AVAILABLE_SYSTEM_LANGUAGES.length > 5}
								<button
									type="button"
									class="variant-filled-surface btn-icon flex items-center justify-between uppercase text-white {sidebarState.sidebar.value.left ===
									'full'
										? 'px-2.5 py-2'
										: 'px-1.5 py-0'}"
									onclick={(e) => {
										e.stopPropagation();
										isDropdownOpen = !isDropdownOpen;
									}}
								>
									<span>{_languageTag}</span>
									<svg
										class="h-4 w-4 transition-transform {isDropdownOpen ? 'rotate-180' : ''}"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
									</svg>
								</button>

								{#if isDropdownOpen}
									<div class="absolute -top-40 left-20 z-50 mt-1 w-48 rounded-lg border bg-surface-700 shadow-lg">
										<div class="border-b border-surface-600 p-2">
											<input
												type="text"
												bind:this={searchInput}
												bind:value={searchQuery}
												placeholder="Search language..."
												class="w-full rounded-md bg-surface-800 px-3 py-2 text-white placeholder:text-surface-400 focus:outline-none focus:ring-2"
											/>
										</div>

										<div class="max-h-48 divide-y divide-surface-600 overflow-y-auto py-1">
											{#each filteredLanguages as lang}
												<button
													type="button"
													class="flex w-full items-center justify-between px-4 py-2 text-left text-white hover:bg-surface-600 {_languageTag === lang
														? 'bg-surface-600'
														: ''}"
													onclick={() => handleLanguageSelection(lang)}
												>
													<span>{getLanguageName(lang)} ({lang.toUpperCase()})</span>
												</button>
											{/each}
										</div>
									</div>
								{/if}
							{:else}
								<select
									bind:value={_languageTag}
									onchange={handleSelectChange}
									class="variant-filled-surface !appearance-none rounded-full uppercase text-white {sidebarState.sidebar.value.left === 'full'
										? 'btn-icon px-2.5 py-2'
										: 'btn-icon-sm px-1.5 py-0'}"
								>
									{#each availableLanguages as lang}
										<option value={lang} selected={lang === _languageTag}>{lang.toUpperCase()}</option>
									{/each}
								</select>
							{/if}
						</div>
					{/snippet}
					{#snippet content()}
						<p>{m.applayout_systemlanguage()}</p>
					{/snippet}
				</Tooltip>
			</div>

			<!-- Light/Dark mode switch -->
			<div class={sidebarState.sidebar.value.left === 'full' ? 'order-2' : 'order-3'}>
				<Tooltip bind:open={themeTooltip} positioning={{ placement: 'right' }} contentBase="card preset-filled p-4" openDelay={200}>
					{#snippet trigger()}
						<button type="button" onclick={toggleTheme} aria-label="Toggle Theme" class="btn-icon hover:bg-surface-500 hover:text-white">
							{#if !isDark}
								<iconify-icon icon="material-symbols:light-mode" width="32" aria-hidden="true"></iconify-icon>
							{:else}
								<iconify-icon icon="material-symbols:dark-mode" width="32" aria-hidden="true"></iconify-icon>
							{/if}
						</button>
					{/snippet}
					{#snippet content()}
						<p>{m.applayout_switchmode({ $modeCurrent: isDark ? 'Dark' : 'Light' })}</p>
					{/snippet}
				</Tooltip>
			</div>

			<!-- Sign Out -->
			<div class={sidebarState.sidebar.value.left === 'full' ? 'order-4' : 'order-4'}>
				<Tooltip bind:open={signOutTooltip} positioning={{ placement: 'right' }} contentBase="card preset-filled p-4" openDelay={200}>
					{#snippet trigger()}
						<button type="button" onclick={signOut} aria-label="Sign Out" class="btn-icon hover:bg-surface-500 hover:text-white">
							<iconify-icon icon="uil:signout" width="26"></iconify-icon>
						</button>
					{/snippet}
					{#snippet content()}
						<p>{m.applayout_signout()}</p>
					{/snippet}
				</Tooltip>
			</div>

			<!-- System Configuration -->
			<div class={sidebarState.sidebar.value.left === 'full' ? 'order-5' : 'order-6'}>
				<Tooltip bind:open={configTooltip} positioning={{ placement: 'right' }} contentBase="card preset-filled p-4" openDelay={200}>
					{#snippet trigger()}
						<a
							href="/config"
							aria-label="System Configuration"
							class="btn-icon pt-1.5 no-underline hover:bg-surface-500 hover:text-white"
							onclick={(e) => {
								e.preventDefault();
								mode.set('view');
								handleSidebarToggle();
								if (get(screenSize) === 'sm') toggleSidebar('left', 'hidden');
							}}
						>
							<iconify-icon icon="material-symbols:build-circle" width="32" aria-hidden="true"></iconify-icon>
						</a>
					{/snippet}
					{#snippet content()}
						<p>{m.applayout_systemconfiguration()}</p>
					{/snippet}
				</Tooltip>
			</div>

			<!-- Github discussions -->
			<div class={sidebarState.sidebar.value.left === 'full' ? 'order-7' : 'order-7 hidden'}>
				<Tooltip bind:open={githubTooltip} positioning={{ placement: 'right' }} contentBase="card preset-filled p-4" openDelay={200}>
					{#snippet trigger()}
						<a href="https://github.com/Rar9/SvelteCMS/discussions" target="_blank" rel="noopener" aria-label="Open GitHub Discussions">
							<button type="button" aria-label="Open GitHub Discussions" class="btn-icon hover:bg-surface-500 hover:text-white">
								<iconify-icon icon="mingcute:github-line" width="24"></iconify-icon>
							</button>
						</a>
					{/snippet}
					{#snippet content()}
						<p>{m.applayout_githubdiscussion()}</p>
					{/snippet}
				</Tooltip>
			</div>

			<!-- CMS Version -->
			<div class={sidebarState.sidebar.value.left === 'full' ? 'order-6' : 'order-5'}>
				<a href="https://github.com/SveltyCMS/SveltyCMS/" target="blank">
					<span class="{sidebarState.sidebar.value.left === 'full' ? 'py-1' : 'py-0'} {$pkgBgColor} badge rounded-xl text-black hover:text-white"
						>{#if sidebarState.sidebar.value.left === 'full'}
							{m.applayout_version()}
						{/if}
						{pkg}
					</span>
				</a>
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	/* Scrollbar styling */
	.overflow-y-auto {
		scrollbar-width: thin;
		scrollbar-color: rgb(var(--color-surface-500)) transparent;
	}

	.overflow-y-auto::-webkit-scrollbar {
		width: 6px;
	}

	.overflow-y-auto::-webkit-scrollbar-track {
		background: transparent;
	}

	.overflow-y-auto::-webkit-scrollbar-thumb {
		background-color: rgb(var(--color-surface-500));
		border-radius: 3px;
		border: transparent;
	}
</style>
