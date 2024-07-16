<script lang="ts">
	import { AppBar, Button, getSettings, Icon, TextField } from "svelte-ux"
	import svelteUXthemes from "../themes.json"
	import { getThemeNames } from "./main"
	import { settings } from "svelte-ux"
	settings({
		themes: getThemeNames(svelteUXthemes),
	})
	const { currentTheme, themes, showDrawer } = getSettings()

	import TabularView from "./lib/TabularView.svelte"
	import { editMode, globalTheme, isDark } from "./lib/store"
	import { ThemeSelect, AppLayout, ThemeInit } from "svelte-ux"
	import DeleteIcon from "./lib/icons/delete-2.svg?raw"
	import SearchIcon from "./lib/icons/search.svg?raw"
	import BulkImport from "./lib/BulkImport.svelte"

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
	$: $isDark = $currentTheme.dark

	function setTheme() {
		console.log(`Setting body to ${$globalTheme.name}`)
		// document.body.setAttribute("data-theme", $globalTheme.name)
	}
	if ($globalTheme.name !== undefined) {
		setTheme()
	}
	$showDrawer = false
	console.log(`editMode is ${$editMode}`)
	let searchTerm: string
</script>

<ThemeInit />
<AppLayout areas="'header header' 'aside main'">
	<svelte:fragment slot="nav">
		<!-- Nav menu -->
	</svelte:fragment>
	<AppBar
		title="personal dictionary"
		class="bg-primary text-primary-content"
		menuIcon={null}
	>
		<div slot="actions" class="flex items-center">
			<div class="mr-auto"></div>
			<TextField
				label="Search your dictionary"
				labelPlacement="float"
				type="search"
				class="lg:w-[40%]"
				classes={{
					container:
						"p-2 border-none bg-surface-100/10 group-focus-within:bg-surface-100/50 group-hover:bg-surface-100/35",
					input: "text-secondary group-hover:[display:unset] max-lg:hidden",
					label: "group-hover:flex hidden lg:flex text-primary-content group-hover:text-primary-content",
				}}
				bind:value={searchTerm}
			>
				<Icon slot="prepend" data={SearchIcon}/>
			</TextField>
			<!-- App actions, goes at the end -->
			<Button
				variant="fill"
				color={$editMode ? "danger" : "secondary"}
				class="rounded-xl mx-4 ml-auto"
				icon={DeleteIcon}
				on:click={() => {
					$editMode = !$editMode
				}}
			>
				Edit Mode
			</Button>
			<div class="mx-4 bg-info/50 rounded-full self-center theme-selector-parent">
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
		<BulkImport class="mt-8 mx-8 lg:mx-24 self-end w-auto"/>
		<div class="max-w-[100vw] px-8 lg:px-24 pt-0">
			<TabularView searchTerm={searchTerm} />
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

	:global(.theme-selector-parent > .Button:hover, .theme-selector-parent > .Button:focus) {
		@apply animate-[animateBg_1s_linear_infinite];
		background-size: 300% 100%;
		background-image: linear-gradient(to right,
			theme("colors.accent"),
			theme("colors.secondary"),
			theme("colors.accent"),
			theme("colors.secondary")
		);
	}
	
</style>
