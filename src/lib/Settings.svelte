<script lang="ts">
	import { Button, ButtonGroup, Dialog, Icon, Switch } from "svelte-ux"
	import SettingsIcon from "./icons/settings.svg?raw"
	import { useBg } from "./store"
	let open: boolean = false
</script>

<Button
	variant="fill"
	color="secondary"
	icon={SettingsIcon}
	on:click={() => {
		open = true
	}}
	class="hover:animate-spin"
/>
<Dialog
	bind:open
	classes={{ dialog: "max-w-[85%] max-h-[85%] border-2 border-primary" }}
>
	<div slot="title" class="text-center">
		<Icon data={SettingsIcon} class="hover:animate-spin" width="2em" height="auto" />
		settings
	</div>
	<div class="grid grid-cols-2 justify-between items-center gap-4 p-4">
		<span>use background?</span>
		<Switch classes={{ root: "w-max" }} bind:checked={$useBg} />

		<!-- TODO: Add sharing stuff -->
		<span>share</span>
		<Button variant="fill" color="primary">copy shareable link</Button>

		<span>export</span>
		<Button variant="fill" color="primary">
			export words as <code class="rounded bg-neutral/75 text-neutral-content"
				>.txt</code
			>
		</Button>
	</div>
</Dialog>
