<script lang="ts">
	import type { WordData } from "../data"
	export let word: WordData
	
</script>

<div class="grid grid-cols-[repeat(auto-fill, 0.25fr)] gap-2">
	{#each word.meanings.definitions as def}
		<div class="card outline outline-1">
			<div class="card-header font-bold">{def.definition}</div>
			<div class="card-footer italic">{def.example}</div>
		</div>
	{/each}
</div>