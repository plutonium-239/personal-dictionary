<script lang="ts">
	import type { WordData } from "../data"
	let partOfSpeech: string
	export let word: WordData

	$: if (word.fetched) {
		partOfSpeech = word.meanings.partOfSpeech[word.selectedDefinition]
	}
</script>

<div class="text-center font-bold text-accent-900 dark:text-accent-50">
	<div>{word.word}</div>
	<span
		class="pos px-2 rounded font-mono font-bold italic text-primary-content bg-primary md:hidden"
	>
		{partOfSpeech.slice(0, 4)}
	</span>
</div>
