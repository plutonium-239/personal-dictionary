<script lang="ts">
	import type { WordData } from "../data"
	import ChevronPrev from "../icons/chevron-left.svelte"
	import ChevronNext from "../icons/chevron-right.svelte"
	import { data } from "../store"
	export let word: WordData

	// $: if (word.fetched) {
	// 	// partOfSpeech = word.meanings.partOfSpeech[word.selectedDefinition]
	// }
	$data
	function switchPrev() {
		if (word.selectedDefinition == 0) word.selectedDefinition = word.numMeanings - 1
		else word.selectedDefinition = word.selectedDefinition - 1
		data.update((current) => {
			current[word.index] = word
			return current
		})
		// data[]
	}
	function switchNext() {
		if (word.selectedDefinition == word.numMeanings - 1) word.selectedDefinition = 0
		else word.selectedDefinition = word.selectedDefinition + 1
		data.update((current) => {
			current[word.index] = word
			return current
		})
	}
</script>

<div class="actions-container w-full justify-center items-center">
	<button
		disabled={!word.fetched}
		class="btn-icon variant-soft-primary px-2"
		on:click={switchPrev}
	>
		<ChevronPrev class="w-8 h-auto" />
	</button>
    <span class="italic text-primary text-sm text-center">
        {word.selectedDefinition + 1 + "/" + word.numMeanings}
    </span>
	<button
		disabled={!word.fetched}
		class="btn-icon variant-soft-primary px-2"
		on:click={switchNext}
	>
		<ChevronNext class="w-8 h-auto" />
	</button>

</div>

<style>
	.actions-container {
		display: inline-grid;
		grid-auto-flow: column;
		grid-template-columns: 0fr 3.5em 0fr;
	}
</style>
