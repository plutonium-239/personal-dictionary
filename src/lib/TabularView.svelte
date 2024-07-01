<script lang="ts">
	// import { SelectField, type MenuOption } from "svelte-ux"
	import {
		Autocomplete,
		type AutocompleteOption,
		ListBox,
		ListBoxItem,
	} from "@skeletonlabs/skeleton"
	import { createTable, Subscribe, Render, createRender } from "svelte-headless-table"
	import { WordData, loadData, saveData, totalWords } from "./data"
	import Meaning from "./table-elements/Meaning.svelte"
	import POS from "./table-elements/POS.svelte"
	import { data } from "./store"
	import Actions from "./table-elements/Actions.svelte"
	import { filteredOptions, loadWordList, search20, words } from "./load_wordlist"
	import { ThemeInit } from "svelte-ux"
	import Word from "./table-elements/Word.svelte"
	import Synonyms from "./table-elements/Synonyms.svelte"

	// $data
	const table = createTable(data)
	// Make it reactive so that new entries show up instantly
	$data

	const columns = table.createColumns([
		table.column({
			header: "Word",
			accessor: "word",
			cell: ({ value }) => createRender(Word, { wordString: value }),
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
			accessor: (item) => item,
			cell: ({ value }) => createRender(Synonyms, { word: value }),
		}),
		table.column({
			header: "Actions",
			accessor: (item) => item,
			cell: ({ value }) => createRender(Actions, { word: value }),
		}),
	])

	const { headerRows, rows, tableAttrs, tableBodyAttrs } =
		table.createViewModel(columns)

	let newWord: string = ""
	function handleInputEnter(event: CustomEvent<AutocompleteOption>) {
		// if (event.key !== "Enter" || newWord === "") return
		// newWord = newWord.trim()

		console.log("Got new word")
		console.log(newWord)
		console.log(event)

		data.update((current) => {
			return [...current, new WordData(totalWords, newWord, Date.now())]
		})
		newWord = ""
		// $data = data
		console.log(newWord)
	}
	let listedOptions: AutocompleteOption[] = []
	$: search20(newWord).then((options) => {
		listedOptions = options
	})
	// $: {
	// 	listedOptions.push({label: "start", value: "start"})
	// 	listedOptions = listedOptions
	// }
	// $: filteredOptions
	// let options: MenuOption[] = [{label: 'axe', value: 0}]
	// let options: MenuOption[] = words.map((word, index) => ({
	// 	value: index,
	// 	label: word,
	// }))
	// options = [{value: 0, label: ""}, ...options]
</script>

<ThemeInit />
<div class="w-full py-8">
	<table {...$tableAttrs} class="w-full">
		<thead>
			{#each $headerRows as headerRow (headerRow.id)}
				<Subscribe rowAttrs={headerRow.attrs()} let:rowAttrs>
					<tr {...rowAttrs}>
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs>
								{@const synclass =
									cell.label === "Synonyms"
										? "hidden lg:table-cell"
										: ""}
								<th
									{...attrs}
									class={"border-y p-2 border-solid border-secondary-900 " +
										synclass}
								>
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
								{@const synclass =
									cell.column.header === "Synonyms"
										? "hidden lg:table-cell"
										: ""}
								<td
									{...attrs}
									class={"border-b p-2 border-solid border-secondary-900 " +
										synclass}
								>
									<Render of={cell.render()} />
								</td>
							</Subscribe>
						{/each}
					</tr>
				</Subscribe>
			{/each}
		</tbody>
	</table>
	<!-- on:keyup={handleInputEnter} -->
	<!-- <SelectField
		options={filteredOptions}
		bind:value={newWord}
		class="word-input bg-primary w-full text-secondary"
		on:change={handleInputEnter}
		placeholder="Enter a new word"
		search={search20}
		/> -->

	<input
		placeholder="Enter a new word"
		type="text"
		class="word-input bg-primary-50/75 dark:bg-primary-900/75 placeholder:text-secondary"
		bind:value={newWord}
	/>
	<!-- on:input={() => search20(newWord)} -->
	<!-- <Autocomplete 
		options={listedOptions}
	bind:input={newWord}
	on:selection={handleInputEnter}
	/> -->
	<div
		class="p-4 card w-full overflow-y-auto text-center"
		style:visibility={newWord === "" ? "hidden" : "visible"}
		tabindex="-1"
	>
		{#await loadWordList() then}
			<ListBox>
				{#each listedOptions as option}
					<ListBoxItem
						bind:group={newWord}
						value={option.value}
						name="wordSelector"
					>
						{option.label}
					</ListBoxItem>
				{/each}
			</ListBox>
			<!-- filter={() => search20(newWord)} -->
		{/await}
	</div>
</div>

<style>
	.word-input {
		border: 2px solid;
		border-radius: 20px;
		width: 100%;
		@apply text-accent text-center rounded-xl p-4 text-base font-bold mt-4 border-secondary;
	}
</style>
