<!-- 
@file src/components/system/inputs/Slider.svelte
@description Range slider component with customizable value and max range

Features:
- Customizable value range
- Step-based increments
- Visual tick marks
- Accessible input
-->

<script lang="ts">
	import { Slider } from '@skeletonlabs/skeleton-svelte';

	let value = $state([0, 100]);
</script>

<label class="label" for="range-slider">
	<span>Rating</span>
	<Slider bind:value markers={[25, 50, 75]} />
</label>
