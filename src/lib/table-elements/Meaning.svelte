<script lang="ts">
	import { Button, Dialog } from "svelte-ux"
	import type { WordData } from "../data"
	import AllMeanings from "./AllMeanings.svelte"
	export let word: WordData
	let definition = "fetching..."

	$: if (word.fetched) {
		definition = word.meanings.definitions[word.selectedDefinition].definition
	}
	let expanded: boolean
</script>

<button
	class="text-center w-full btn-full-text select-text"
	on:click={() => {
		expanded = true
	}}
>
	<span>{definition}</span>
</button>
<Dialog bind:open={expanded} classes={{ dialog: "max-w-[85%] " }}>
	<div slot="title" class="text-secondary">All definitions for {word.word}</div>
	<div>
		<AllMeanings word={word}/>
	</div>
	<div slot="actions">
		<Button
			variant="fill"
			color="primary"
			on:click={() => {
				expanded = false
			}}
		>
			Close
		</Button>
	</div>
</Dialog>

<style>
	/* derived from the svelte-ux Button component's style */
	.btn-full-text {
		@apply transition duration-200 touch-manipulation focus:outline-none focus-visible:ring-1 rounded px-4 py-2 hover:[--bg-color:theme(colors.surface-content/10%)] [--ring-color:theme(colors.surface-content/60%)] bg-[--bg-color] ring-[--ring-color];
	}
</style>
