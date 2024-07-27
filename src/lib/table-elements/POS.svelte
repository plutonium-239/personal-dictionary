<script lang="ts">
	import type { WordData } from "../data"
	let partOfSpeech: string
	export let word: WordData

	$: if (word.fetched) {
		partOfSpeech = word.meanings.partOfSpeech[word.selectedDefinition]
	}
</script>

<div class="flex items-center justify-center font-mono max-md:hidden">
	{#if word.fetched}
		<span class="pos px-2 rounded font-bold italic text-primary-content bg-primary">{partOfSpeech.slice(0, 4)}</span>
	{/if}
</div>

