<script lang="ts">
	import type { WordData } from "../data"
	export let word: WordData
	let definition: string

	$: if (word.fetched) {
		definition = word.meanings.definitions[word.selectedDefinition].definition
	}
</script>

<div class="meaning-container">
	<span class="definition">{definition}</span>
</div>

<style>
	.definition {
		text-align: center;
	}
</style>
