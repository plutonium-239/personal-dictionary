<script lang="ts">
	import type { WordData } from "../data"

	export let word: WordData

    $: existing = word.meanings.synonyms.get(
        word.meanings.partOfSpeech[word.selectedDefinition]
    )
</script>

<div class="text-center">
	<span>{existing ? existing.slice(0, 3).join(", ") : ""}</span>
</div>
