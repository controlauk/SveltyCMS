/**
 * @file src/themes/SveltyCMS/SveltyCMSTheme.ts
 * @description SveltyCMS theme configuration.
 */

import type { Theme } from '@skeletonlabs/skeleton/themes';

const SveltyCMSTheme = {
  "name": "SveltyCMSTheme",
  "properties": {
	// =~= Theme Properties =~=
    "--type-scale-factor": "1.067",
    "--type-scale-1": "calc(0.75rem * var(--type-scale-factor))",
    "--type-scale-2": "calc(0.875rem * var(--type-scale-factor))",
    "--type-scale-3": "calc(1rem * var(--type-scale-factor))",
    "--type-scale-4": "calc(1.125rem * var(--type-scale-factor))",
    "--type-scale-5": "calc(1.25rem * var(--type-scale-factor))",
    "--type-scale-6": "calc(1.5rem * var(--type-scale-factor))",
    "--type-scale-7": "calc(1.875rem * var(--type-scale-factor))",
    "--type-scale-8": "calc(2.25rem * var(--type-scale-factor))",
    "--type-scale-9": "calc(3rem * var(--type-scale-factor))",
    "--type-scale-10": "calc(3.75rem * var(--type-scale-factor))",
    "--type-scale-11": "calc(4.5rem * var(--type-scale-factor))",
    "--type-scale-12": "calc(6rem * var(--type-scale-factor))",
    "--type-scale-13": "calc(8rem * var(--type-scale-factor))",
    "--base-font-color": "var(--color-surface-950)",
    "--base-font-color-dark": "var(--color-surface-50)",
    "--base-font-family": "system-ui, sans-serif",
    "--base-font-size": "inherit",
    "--base-line-height": "inherit",
    "--base-font-weight": "normal",
    "--base-font-style": "normal",
    "--base-letter-spacing": "0em",
    "--heading-font-color": "inherit",
    "--heading-font-color-dark": "inherit",
    "--heading-font-family": "Avenir, Montserrat, Corbel, URW Gothic, source-sans-pro, sans-serif",
    "--heading-font-weight": "normal",
    "--heading-font-style": "normal",
    "--heading-letter-spacing": "inherit",
    "--anchor-font-color": "var(--color-primary-500)",
    "--anchor-font-color-dark": "var(--color-primary-500)",
    "--anchor-font-family": "inherit",
    "--anchor-font-size": "inherit",
    "--anchor-line-height": "inherit",
    "--anchor-font-weight": "inherit",
    "--anchor-font-style": "inherit",
    "--anchor-letter-spacing": "inherit",
    "--anchor-text-decoration": "none",
    "--anchor-text-decoration-hover": "underline",
    "--anchor-text-decoration-active": "none",
    "--anchor-text-decoration-focus": "none",
    "--space-scale-factor": "1",
    "--radii-default": "2px",
    "--radii-container": "2px",
    "--border-width-default": "1px",
    "--divide-width-default": "1px",
    "--outline-width-default": "1px",
    "--ring-width-default": "1px",
    "--body-background-color": "255 255 255",
    "--body-background-color-dark": "var(--color-surface-950)",
	// =~= Theme Colors  =~=
	// primary | #5fd317
    "--color-primary-50": "231 248 220", // #e7f8dc
    "--color-primary-100": "204 241 181", // #ccf1b5
    "--color-primary-200": "177 233 141", // #b1e98d
    "--color-primary-300": "149 226 102", // #95e266
    "--color-primary-400": "122 218 62", // #7ada3e
    "--color-primary-500": "95 211 23", // #5fd317
    "--color-primary-600": "76 187 18", // #4cbb12
    "--color-primary-700": "57 162 14", // #39a20e
    "--color-primary-800": "38 138 9", // #268809
    "--color-primary-900": "19 113 5", // #137105
    "--color-primary-950": "0 89 0", // #005d00
    "--color-primary-contrast-dark": "var(--color-primary-950)",
    "--color-primary-contrast-light": "var(--color-primary-50)",
    "--color-primary-contrast-50": "var(--color-primary-contrast-dark)",
    "--color-primary-contrast-100": "var(--color-primary-contrast-dark)",
    "--color-primary-contrast-200": "var(--color-primary-contrast-dark)",
    "--color-primary-contrast-300": "var(--color-primary-contrast-dark)",
    "--color-primary-contrast-400": "var(--color-primary-contrast-dark)",
    "--color-primary-contrast-500": "var(--color-primary-contrast-dark)",
    "--color-primary-contrast-600": "var(--color-primary-contrast-dark)",
    "--color-primary-contrast-700": "var(--color-primary-contrast-light)",
    "--color-primary-contrast-800": "var(--color-primary-contrast-light)",
    "--color-primary-contrast-900": "var(--color-primary-contrast-light)",
    "--color-primary-contrast-950": "var(--color-primary-contrast-light)",
	// secondary | #757575
    "--color-secondary-50": "234 234 234", // #eaeaea
    "--color-secondary-100": "211 211 211", // #d3d3d3
    "--color-secondary-200": "187 187 187", // #bbbbbb
    "--color-secondary-300": "164 164 164",	// #a4a4a4
    "--color-secondary-400": "140 140 140",	// #8c8c8c
    "--color-secondary-500": "117 117 117",	// #757575
    "--color-secondary-600": "104 104 104",	// #686868
    "--color-secondary-700": "92 92 92", // #5c5c5c
    "--color-secondary-800": "79 79 79", // #4f4f4f
    "--color-secondary-900": "67 67 67", // #434343
    "--color-secondary-950": "54 54 54", // #363636
    "--color-secondary-contrast-dark": "var(--color-secondary-950)",
    "--color-secondary-contrast-light": "var(--color-secondary-50)",
    "--color-secondary-contrast-50": "var(--color-secondary-contrast-dark)",
    "--color-secondary-contrast-100": "var(--color-secondary-contrast-dark)",
    "--color-secondary-contrast-200": "var(--color-secondary-contrast-dark)",
    "--color-secondary-contrast-300": "var(--color-secondary-contrast-dark)",
    "--color-secondary-contrast-400": "var(--color-secondary-contrast-dark)",
    "--color-secondary-contrast-500": "var(--color-secondary-contrast-light)",
    "--color-secondary-contrast-600": "var(--color-secondary-contrast-light)",
    "--color-secondary-contrast-700": "var(--color-secondary-contrast-light)",
    "--color-secondary-contrast-800": "var(--color-secondary-contrast-light)",
    "--color-secondary-contrast-900": "var(--color-secondary-contrast-light)",
    "--color-secondary-contrast-950": "var(--color-secondary-contrast-light)",
	// tertiary | #0078d4
    "--color-tertiary-50": "217 235 253", // #d9ebfd
    "--color-tertiary-100": "174 212 250", // #aec4fa
    "--color-tertiary-200": "130 189 248", // #82bdf8
    "--color-tertiary-300": "87 166 245", // #57a6f5
    "--color-tertiary-400": "43 143 243", // #2b8ff3
    "--color-tertiary-500": "0 120 240", // #0078f0
    "--color-tertiary-600": "0 106 212", // #006ad4
    "--color-tertiary-700": "0 92 184", // #0058b8
    "--color-tertiary-800": "1 79 157", // #004f9d
    "--color-tertiary-900": "1 65 129", // #004581
    "--color-tertiary-950": "1 51 101",	// #003365
    "--color-tertiary-contrast-dark": "var(--color-tertiary-950)",
    "--color-tertiary-contrast-light": "var(--color-tertiary-50)",
    "--color-tertiary-contrast-50": "var(--color-tertiary-contrast-dark)",
    "--color-tertiary-contrast-100": "var(--color-tertiary-contrast-dark)",
    "--color-tertiary-contrast-200": "var(--color-tertiary-contrast-dark)",
    "--color-tertiary-contrast-300": "var(--color-tertiary-contrast-dark)",
    "--color-tertiary-contrast-400": "var(--color-tertiary-contrast-dark)",
    "--color-tertiary-contrast-500": "var(--color-tertiary-contrast-light)",
    "--color-tertiary-contrast-600": "var(--color-tertiary-contrast-light)",
    "--color-tertiary-contrast-700": "var(--color-tertiary-contrast-light)",
    "--color-tertiary-contrast-800": "var(--color-tertiary-contrast-light)",
    "--color-tertiary-contrast-900": "var(--color-tertiary-contrast-light)",
    "--color-tertiary-contrast-950": "var(--color-tertiary-contrast-light)",
	// success | #4CAF50
    "--color-success-50": "224 236 224", // #e0ece0
    "--color-success-100": "188 214 189", // #bcd6bd
    "--color-success-200": "153 192 154", // #99c0a6
    "--color-success-300": "117 169 120", // #75a978
    "--color-success-400": "82 147 85", // #529355
    "--color-success-500": "46 125 50", // #2e7d32
    "--color-success-600": "41 110 44", // #2a6e2c
    "--color-success-700": "35 94 38", // #235e26
    "--color-success-800": "30 79 32", // #1e4f20
    "--color-success-900": "24 63 26", // #183f1a
    "--color-success-950": "19 48 20", // #133014
    "--color-success-contrast-dark": "var(--color-success-950)",
    "--color-success-contrast-light": "var(--color-success-50)",
    "--color-success-contrast-50": "var(--color-success-contrast-dark)",
    "--color-success-contrast-100": "var(--color-success-contrast-dark)",
    "--color-success-contrast-200": "var(--color-success-contrast-dark)",
    "--color-success-contrast-300": "var(--color-success-contrast-dark)",
    "--color-success-contrast-400": "var(--color-success-contrast-dark)",
    "--color-success-contrast-500": "var(--color-success-contrast-light)",
    "--color-success-contrast-600": "var(--color-success-contrast-light)",
    "--color-success-contrast-700": "var(--color-success-contrast-light)",
    "--color-success-contrast-800": "var(--color-success-contrast-light)",
    "--color-success-contrast-900": "var(--color-success-contrast-light)",
    "--color-success-contrast-950": "var(--color-success-contrast-light)",
	// warning | #FFC107
    "--color-warning-50": "253 246 217",
    "--color-warning-100": "250 235 174",
    "--color-warning-200": "248 224 130",
    "--color-warning-300": "245 214 87",
    "--color-warning-400": "243 203 43",
    "--color-warning-500": "240 192 0",
    "--color-warning-600": "212 169 1",
    "--color-warning-700": "183 147 2",
    "--color-warning-800": "155 124 2",
    "--color-warning-900": "126 102 3",
    "--color-warning-950": "98 79 4",
    "--color-warning-contrast-dark": "var(--color-warning-950)",
    "--color-warning-contrast-light": "var(--color-warning-50)",
    "--color-warning-contrast-50": "var(--color-warning-contrast-dark)",
    "--color-warning-contrast-100": "var(--color-warning-contrast-dark)",
    "--color-warning-contrast-200": "var(--color-warning-contrast-dark)",
    "--color-warning-contrast-300": "var(--color-warning-contrast-dark)",
    "--color-warning-contrast-400": "var(--color-warning-contrast-dark)",
    "--color-warning-contrast-500": "var(--color-warning-contrast-dark)",
    "--color-warning-contrast-600": "var(--color-warning-contrast-dark)",
    "--color-warning-contrast-700": "var(--color-warning-contrast-dark)",
    "--color-warning-contrast-800": "var(--color-warning-contrast-light)",
    "--color-warning-contrast-900": "var(--color-warning-contrast-light)",
    "--color-warning-contrast-950": "var(--color-warning-contrast-light)",
	// error | #F44336
    "--color-error-50": "252 217 217",
    "--color-error-100": "249 174 174",
    "--color-error-200": "245 130 130",
    "--color-error-300": "242 87 87",
    "--color-error-400": "238 43 43",
    "--color-error-500": "235 0 0",
    "--color-error-600": "209 0 0",
    "--color-error-700": "184 0 0",
    "--color-error-800": "158 0 0",
    "--color-error-900": "133 0 0",
    "--color-error-950": "107 0 0",
    "--color-error-contrast-dark": "var(--color-error-950)",
    "--color-error-contrast-light": "var(--color-error-50)",
    "--color-error-contrast-50": "var(--color-error-contrast-dark)",
    "--color-error-contrast-100": "var(--color-error-contrast-dark)",
    "--color-error-contrast-200": "var(--color-error-contrast-dark)",
    "--color-error-contrast-300": "var(--color-error-contrast-dark)",
    "--color-error-contrast-400": "var(--color-error-contrast-light)",
    "--color-error-contrast-500": "var(--color-error-contrast-light)",
    "--color-error-contrast-600": "var(--color-error-contrast-light)",
    "--color-error-contrast-700": "var(--color-error-contrast-light)",
    "--color-error-contrast-800": "var(--color-error-contrast-light)",
    "--color-error-contrast-900": "var(--color-error-contrast-light)",
    "--color-error-contrast-950": "var(--color-error-contrast-light)",
	// surface | #F5F5F5
    "--color-surface-50": "222 223 223",
    "--color-surface-100": "185 186 186",
    "--color-surface-200": "148 149 150",
    "--color-surface-300": "110 113 113",
    "--color-surface-400": "73 76 77",
    "--color-surface-500": "36 39 40",
    "--color-surface-600": "32 34 35",
    "--color-surface-700": "28 29 30",
    "--color-surface-800": "23 25 26",
    "--color-surface-900": "19 20 21",
    "--color-surface-950": "15 15 16",
    "--color-surface-contrast-dark": "var(--color-surface-950)",
    "--color-surface-contrast-light": "var(--color-surface-50)",
    "--color-surface-contrast-50": "var(--color-surface-contrast-dark)",
    "--color-surface-contrast-100": "var(--color-surface-contrast-dark)",
    "--color-surface-contrast-200": "var(--color-surface-contrast-dark)",
    "--color-surface-contrast-300": "var(--color-surface-contrast-dark)",
    "--color-surface-contrast-400": "var(--color-surface-contrast-light)",
    "--color-surface-contrast-500": "var(--color-surface-contrast-light)",
    "--color-surface-contrast-600": "var(--color-surface-contrast-light)",
    "--color-surface-contrast-700": "var(--color-surface-contrast-light)",
    "--color-surface-contrast-800": "var(--color-surface-contrast-light)",
    "--color-surface-contrast-900": "var(--color-surface-contrast-light)",
    "--color-surface-contrast-950": "var(--color-surface-contrast-light)"
  },
  "metadata": {
    "version": "3.0.0"
  }
} satisfies Theme;

export default SveltyCMSTheme;
