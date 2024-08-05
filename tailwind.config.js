const colors = require("tailwindcss/colors")
const svelteUx = require("svelte-ux/plugins/tailwind.cjs")
import { join } from 'path';
import { skeleton } from '@skeletonlabs/tw-plugin';
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
	content: [
		"./index.html",
		"./src/**/*.{svelte,js,ts,jsx,tsx}",
		"./src/lib/**/*.{svelte,js,ts,jsx,tsx}",
		"./node_modules/svelte-ux/**/*.{svelte,js}",
		join(require.resolve('@skeletonlabs/skeleton'),'../**/*.{html,js,svelte,ts}')
	],
	darkMode: 'class',

	// See customization docs: https://svelte-ux.techniq.dev/customization
	ux: {
		themes: require('./themes.json')
	},
	theme: {
		extend: {},
		fontFamily: {
			sans: ['Quicksand', ...defaultTheme.fontFamily.sans],
			mono: ['Maple Mono', ...defaultTheme.fontFamily.mono]
		}
	},

	plugins: [
		svelteUx(), // uses hsl() color space by default. To use oklch(), use: svelteUx({ colorSpace: 'oklch' }),
		skeleton({
			themes: { preset: [
				"skeleton",
				"wintry",
				"modern",
				"rocket",
				"seafoam",
				"vintage",
				"sahara",
				"hamlindigo",
				"gold-nouveau",
				"crimson"
			]}
		})
	],
}
