<script lang="ts">
	import { AppBar, getSettings } from "svelte-ux"
	import svelteUXthemes from "../themes.json"
	import { getThemeNames } from "./main"
	import { settings } from "svelte-ux"
	settings({
		themes: getThemeNames(svelteUXthemes),
	})
	const { currentTheme, themes, showDrawer } = getSettings()

	import TabularView from "./lib/TabularView.svelte"
	import { ListBox, ListBoxItem } from "@skeletonlabs/skeleton"
	import { MenuButton, MenuItem, ToggleGroup, ToggleOption } from "svelte-ux"
	import { globalTheme } from "./lib/store"
	import { ThemeSelect, AppLayout, ThemeInit } from "svelte-ux"

	const skeletonthemes = [
		{ label: "Skeleton", value: "skeleton" },
		{ label: "Wintry", value: "wintry" },
		{ label: "Modern", value: "modern" },
		{ label: "Rocket", value: "rocket" },
		{ label: "Seafoam", value: "seafoam" },
		{ label: "Vintage", value: "vintage" },
		{ label: "Sahara", value: "sahara" },
		{ label: "Hamlindigo", value: "hamlindigo" },
		{ label: "Gold Nouveau", value: "gold-nouveau" },
		{ label: "Crimson", value: "crimson" },
	]

	$: console.log(`Changing globalTheme to ${$globalTheme.name}`)
	$: console.log($currentTheme.theme)

	function setTheme() {
		console.log(`Setting body to ${$globalTheme.name}`)
		// document.body.setAttribute("data-theme", $globalTheme.name)
	}
	if ($globalTheme.name !== undefined) {
		setTheme()
	}
	$showDrawer = false
</script>

<ThemeInit/>
<AppLayout 
	areas="'header header' 'aside main'"
	
>
	<svelte:fragment slot="nav">
		<!-- Nav menu -->
	</svelte:fragment>
	<AppBar title="Example" class="bg-primary text-primary-content" menuIcon={null}>
		<div slot="actions">
			<!-- App actions, goes at the end -->
			<div class="self-end m-8 bg-info/50 rounded-full">
				<ThemeSelect />
			</div>
		</div>
	</AppBar>
	<main class="flex flex-col">
		<!-- <ListBox>
			{#each skeletonthemes as theme}
				<ListBoxItem
					bind:group={$globalTheme.name}
					value={theme.value}
					name="themeSelector"
					on:change={setTheme}
				>
					{theme.label}
				</ListBoxItem>
			{/each}
		</ListBox> -->
		<div class="max-w-[100vw] px-8 lg:px-24">
			<TabularView />
		</div>
	</main>
</AppLayout>

<style>
	.logo {
		height: 6em;
		padding: 1.5em;
		will-change: filter;
		transition: filter 300ms;
	}
	.logo:hover {
		filter: drop-shadow(0 0 2em #646cffaa);
	}

	.root-app-layout {
		--drawerWidth: 0px;
	}
</style>
