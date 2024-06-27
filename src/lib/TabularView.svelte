<script lang="ts">
	import { readable, writable, type Writable } from "svelte/store"
	import { createTable, Subscribe, Render, createRender } from "svelte-headless-table"
	import { WordData, loadData, saveData } from "./data"
	import Meaning from "./table-elements/Meaning.svelte"
	import POS from "./table-elements/POS.svelte"

	let data = writable([] as WordData[])
	loadData().then((ld) => {
		data.set(ld)
		console.log("Table Receieved data:")
		console.log(ld)
	})

	// Reactive statement to save whenever data changes
	data.subscribe((value) => {
		saveData(value)
	})

	const table = createTable(data)

	const columns = table.createColumns([
		table.column({
			header: "Word",
			accessor: "word",
		}),
		table.column({
			header: "POS",
			accessor: (item) => item,
			cell: ({ value }) => createRender(POS, { word: value }),
		}),
		table.column({
			header: "Meaning",
			accessor: (item) => item,
			cell: ({ value }) => createRender(Meaning, { word: value }),
		}),
		table.column({
			header: "Synonyms",
			accessor: (item) => {
				// return item.synonyms ? item.synonyms.join(", ") : "";
				const existing = item.meanings.synonyms.get(
					item.meanings.partOfSpeech[item.selectedDefinition]
				)
				return existing ? existing.slice(0, 3).join(", ") : ""
			},
		}),
	])

	const { headerRows, rows, tableAttrs, tableBodyAttrs } =
		table.createViewModel(columns)

	let newWord: string
	function handleInputEnter(event: KeyboardEvent) {
		if (event.key !== "Enter" || newWord === "") return
		newWord = newWord.trim()
		console.log("Got new word")
		console.log(newWord)

		data.update((current) => {
			return [...current, new WordData(newWord, Date.now())]
		})
		newWord = ""
		data = data
		console.log(newWord)
	}
</script>

<div class="table-container">
	<table {...$tableAttrs}>
		<thead>
			{#each $headerRows as headerRow (headerRow.id)}
				<Subscribe rowAttrs={headerRow.attrs()} let:rowAttrs>
					<tr {...rowAttrs}>
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs>
								<th {...attrs}>
									<Render of={cell.render()} />
								</th>
							</Subscribe>
						{/each}
					</tr>
				</Subscribe>
			{/each}
		</thead>
		<tbody {...$tableBodyAttrs}>
			{#each $rows as row (row.id)}
				<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
					<tr {...rowAttrs}>
						{#each row.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs>
								<td {...attrs}>
									<Render of={cell.render()} />
								</td>
							</Subscribe>
						{/each}
					</tr>
				</Subscribe>
			{/each}
		</tbody>
	</table>
	<input
		placeholder="Enter a new word"
		type="text"
		class="word-input"
		on:keyup={handleInputEnter}
		bind:value={newWord}
	/>
</div>

<style>
	.table-container {
		/* Table styling */
		width: 100%;
	}

	table {
		border-spacing: 0;
		width: 100%;
		/* border-collapse: collapse; */
	}

	th {
		border-top: 1px solid var(--border-color);
		/* border-bottom adds to td.border-top to form double border as divider between header/body */
		border-bottom: 1px solid var(--border-color);
		padding: 0.5rem;
	}
	td {
		border-top: 1px solid var(--border-color);
		padding: 0.5rem;
	}

	.word-input {
		background: var(--border-color);
		color: var(--accent-color);
		border: 2px solid var(--accent-color);
		border-radius: 20px;
		width: 100%;
		padding: 1em;
	}

	.word-input::placeholder {
		color: var(--placeholder-color);
		text-align: center;
		font-weight: bold;
		font-size: medium;
	}
</style>
