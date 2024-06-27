<script lang="ts">
	import type { WordData } from "../data"
	import ChevronPrev from "../icons/chevron-left.svelte"
	import ChevronNext from "../icons/chevron-right.svelte"
	let partOfSpeech: string
	export let word: WordData

	$: if (word.fetched) {
		partOfSpeech = word.meanings.partOfSpeech[word.selectedDefinition]
	}
	function switchPrev() {
		if (word.selectedDefinition == 0) word.selectedDefinition = word.numMeanings - 1
		else word.selectedDefinition = word.selectedDefinition - 1
	}
	function switchNext() {
		if (word.selectedDefinition == word.numMeanings - 1) word.selectedDefinition = 0
		else word.selectedDefinition = word.selectedDefinition + 1
	}
</script>

<div class="meaning-container">
	<button
		disabled={!word.fetched}
		class="meaning-switch meaning-switch-prev"
		on:click={switchPrev}
	>
		<ChevronPrev class="meaning-switch-svg" />
	</button>
	<span class="pos">{partOfSpeech.slice(0, 4)}</span>
	<span class="currentDefinition">
		{word.selectedDefinition + 1 + "/" + word.numMeanings}
	</span>
	<button
		disabled={!word.fetched}
		class="meaning-switch meaning-switch-next"
		on:click={switchNext}
	>
		<ChevronNext class="meaning-switch-svg" />
	</button>
</div>

<style>
	.meaning-container {
		display: inline-grid;
		align-items: center;
		grid-auto-flow: column;
		justify-content: flex-start;
		width: 100%;
		grid-template-columns: 0fr 3.5em 0fr;
	}
	.pos {
		font-weight: bold;
		font-style: italic;
		background-color: var(--accent-color);
		color: var(--accent-bgcolor);
		padding: 0 0.5em;
		border-radius: 10%;
		grid-column: 2;
		grid-row: 1;
	}
	.currentDefinition {
		font-style: italic;
		color: var(--accent-color);
		font-size: smaller;
		grid-column: 2;
		grid-row: 2;
	}
	.meaning-switch {
		background: none;
		border: none;
		padding: 0.5em 0.1em;
		margin: 0;
		grid-row: span 2;
	}
	.meaning-switch-prev {
		grid-column: 1;
	}
	.meaning-switch-next {
		grid-column: 3;
	}
	.meaning-switch:hover {
		background: rgb(from var(--accent-color) r g b / 0.1);
		color: var(--accent-color);
	}
</style>
