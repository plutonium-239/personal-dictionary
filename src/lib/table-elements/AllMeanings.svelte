<script lang="ts">
	import { ExpansionPanel } from "svelte-ux"
	import type { WordData, SingleDefinition } from "../data"
	import { PackingGrid } from "@egjs/svelte-grid"
	export let word: WordData
	import { data } from "../store"

	// let items = getItems(0, 10);

	// function getItems(nextGroupKey: number, count: number) {
	// 	const nextItems = [];

	// 	for (let i = 0; i < count; ++i) {
	// 		const nextKey = nextGroupKey * count + i;

	// 		nextItems.push({ groupKey: nextGroupKey, key: nextKey });
	// 	}
	// 	return nextItems;
	// }
	$data
	$: indexInData = $data.findIndex((iterword) => iterword.id === word.id);

	function select(index: number) {
		word.selectedDefinition = index
		data.update((current) => {
			current[indexInData] = word
			return current
		})
	}

	let filteredByPOS: Map<string, SingleDefinition[]> = new Map()
	$: word.meanings.definitions.forEach((definition, i) => {
		const pos = word.meanings.partOfSpeech[i]
		let list = filteredByPOS.get(pos)
		if (list === undefined) list = []
		filteredByPOS.set(pos, [...list, definition])
	})
	
</script>

<!-- <div class="mx-4 grid grid-flow-row-dense grid-cols-[repeat(auto-fit,minmax(15em,1fr))] gap-2">
	{#each word.meanings.definitions as def}
		<div class="card outline outline-1 flex flex-col justify-between">
		<ExpansionPanel class="mx-4" disabled={def.example === ""}>
			<div class="card-header font-bold pb-4 bg-surface-[400]">
				{def.definition}
			</div>
			{#if def.example !== ""}
			<div class="card-footer p-4 text-secondary-content dark:text-secondary bg-secondary-50/40 dark:bg-secondary-900/40 border-t">
				<div class="font-bold italic text-accent">Example</div>
				{def.example}
			</div>
			{/if}
		</ExpansionPanel>
		</div>
	{/each}
</div> -->

<!-- <PackingGrid
gap=2
sizeWeight=1
ratioWeight=10
percentage=true
> -->
<!-- <div class="mx-4 grid grid-flow-row-dense grid-cols-[repeat(auto-fit,minmax(15em,1fr))] gap-2"> -->
{#each filteredByPOS as [pos, definitions] }
<!-- <span class="center bg-primary italic font-bold mx-4 w-auto">
	{pos} -->
<!-- </span> -->
{@const selectedPOS = pos == word.meanings.partOfSpeech[word.selectedDefinition]}

<div class="m-4 p-4 flex flex-col gap-4 outline outline-1 rounded-xl {selectedPOS?"outline-primary":"outline-secondary"}">
<span class="pos px-2 w-fit rounded font-bold italic text-primary-content bg-primary">
	{pos}
</span>

<div class="flex flex-wrap gap-4">
	{#each definitions as def, index (index)}
		{@const selected = word.meanings.definitions[word.selectedDefinition] == def}
		<button
			class="{selected ? 'btn-meaning-selected' : ''} btn-meaning md:max-w-[25%]"
			on:click={() => select(index)}
		>
			<!-- <ExpansionPanel class="mx-4" disabled={def.example === ""}> -->
			<div class="card-header font-bold pb-4">
				{def.definition}
			</div>
			{#if def.example !== ""}
				<div
					class="card-footer p-4 text-secondary-content dark:text-secondary bg-secondary-50/40 dark:bg-secondary-900/40 border-t"
				>
					<div class="font-bold italic text-accent">Example</div>
					{def.example}
				</div>
			{/if}
			<!-- </ExpansionPanel> -->
		</button>
	{/each}
</div>

</div>
{/each}

<!-- </PackingGrid> -->

<style>
	.btn-meaning {
		@apply !bg-secondary-50/5 hover:!bg-primary/35 transition-colors duration-150 text-left items-stretch card rounded-xl outline outline-1 outline-secondary/40 w-auto h-auto flex flex-col justify-between;
	}
	.btn-meaning-selected {
		@apply outline-primary !bg-primary/50;
	}
</style>
