/**
 * @file tailwind.config.ts
 * @description Tailwind CSS configuration for a SvelteKit project.
 * This file includes:
 * - Dark mode support via class method
 * - Custom responsive breakpoints
 * - Integration of Tailwind plugins for forms and typography
 * - Configuration of the Skeleton plugin with a custom theme (SveltyCMSTheme)
 */

import type { Config } from 'tailwindcss';

// Import Tailwind plugins
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

// Import the Skeleton plugin
import { skeleton, contentPath } from '@skeletonlabs/skeleton/plugin';

// Import Custom Theme
import SveltyCMSTheme from './src/themes/SveltyCMS/SveltyCMSTheme';

export default {
	darkMode: 'class',

	content: [
        './src/**/*.{html,js,svelte,ts}',
        contentPath(import.meta.url, 'svelte')
	],

	theme: {
		extend: {
			screens: {
				//----------------- min-width------------------------------------------------
				xs: '360px', // => @media (min-width: 360px) { ... }
				sm: '567px', // => @media (min-width: 576px) { ... }
				md: '768px', // => @media (min-width: 768px) { ... }
				lg: '992px', // => @media (min-width: 992px) { ... }
				xl: '1200px', // => @media (min-width: 1200px) { ... }
				'2xl': '1536px', // => @media (min-width: 1536px) { ... }

				//----------------- max-width------------------------------------------------
				'max-xs': { max: '360px' }, // => @media (min-width: 360px) { ... }
				'max-sm': { max: '567px' }, // => @media (min-width: 576px) { ... }
				'max-md': { max: '768px' }, // => @media (min-width: 768px) { ... }
				'max-lg': { max: '992px' }, // => @media (min-width: 992px) { ... }
				'max-xl': { max: '1200px' }, // => @media (min-width: 1200px) { ... }
				'max-2xl': { max: '1536px' } // => @media (min-width: 1536px) { ... }
			}
		}
	},

	plugins: [
		forms,
		typography,
		// The Skeleton plugin
		skeleton({
			themes: [
				// Add custom theme to the array
				SveltyCMSTheme
			]
		})
	]
} satisfies Config;
