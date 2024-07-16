<script lang="ts">
	import { Button } from "svelte-ux"
	import type { WordData } from "../data"
	import ChevronPrev from "../icons/chevron-left.svg?raw"
	import ChevronNext from "../icons/chevron-right.svg?raw"
	import DeleteIcon from "../icons/delete-2.svg?raw"
	import { data, editMode, isDark } from "../store"
	export let word: WordData
	
	// $: if (word.fetched) {
		// 	// partOfSpeech = word.meanings.partOfSpeech[word.selectedDefinition]
		// }
	$data
	function switchPrev() {
		if (word.selectedDefinition == 0) word.selectedDefinition = word.numMeanings - 1
		else word.selectedDefinition = word.selectedDefinition - 1
		data.update((current) => {
			current[indexInData] = word
			return current
		})
		// data[]
	}
	function switchNext() {
		if (word.selectedDefinition == word.numMeanings - 1) word.selectedDefinition = 0
		else word.selectedDefinition = word.selectedDefinition + 1
		data.update((current) => {
			current[indexInData] = word
			return current
		})
	}
	function deleteWord() {
		data.update((current) => {
			console.log('deleted, now is');
			current.splice(indexInData, 1); 
			console.log(current);
			return current;
		});
	}
	$: indexInData = $data.findIndex((iterword) => iterword.id === word.id);

</script>

<div class="inline-grid actions-container w-full justify-center items-center">
	<Button
		disabled={!word.fetched}
		variant={$isDark?"fill-light":"fill"}
		color="primary"
		on:click={switchPrev}
		icon={ChevronPrev}
	>
		<!-- <ChevronPrev class="w-8 h-auto" /> -->
	</Button>
	{#if $editMode}
		<Button 
			icon={DeleteIcon}
			variant="fill"
			color="danger"
			class="mx-2"
			on:click={deleteWord}
		/>
	{:else}
		<span class="italic text-primary text-sm text-center">
			{word.selectedDefinition + 1 + "/" + word.numMeanings}
		</span>
	{/if}
	<Button
		disabled={!word.fetched}
		variant={$isDark?"fill-light":"fill"}
		color="primary"
		on:click={switchNext}
		icon={ChevronNext}
		>
		<!-- class="btn-icon variant-soft-primary px-2" -->
		<!-- <ChevronNext class="w-8 h-auto" /> -->
	</Button>

</div>

<style>
	@media screen(md) {
		.actions-container {
			/* display: inline-grid; */
			grid-auto-flow: column;
			grid-template-columns: 0fr 3.5em 0fr 0fr;
		}
	}
</style>
