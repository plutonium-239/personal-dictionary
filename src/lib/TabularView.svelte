<script lang="ts">
	import { createTable, Subscribe, Render, createRender } from "svelte-headless-table"
	import { addTableFilter } from "svelte-headless-table/plugins"
	import { WordData, totalWords, updateMeanings } from "./data"
	import Meaning from "./table-elements/Meaning.svelte"
	import POS from "./table-elements/POS.svelte"
	import { data } from "./store"
	import Actions from "./table-elements/Actions.svelte"
	import { search20, loadWordList } from "./load_wordlist"
	import { debounceEvent, ListItem, ThemeInit } from "svelte-ux"
	import Word from "./table-elements/Word.svelte"
	import Synonyms from "./table-elements/Synonyms.svelte"

	export let searchTerm: string

	const table = createTable(data, {
		tableFilter: addTableFilter(),
	})
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

	const { headerRows, rows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns)
	const { filterValue } = pluginStates.tableFilter
	$: $filterValue = searchTerm !== null ? searchTerm : ""

	let newWord: string = ""
	let completionSelected: boolean = false
	function handleInputEnter(event: KeyboardEvent) {
		if (newWord === "") {
			completionSelected = false
			return
		}
		if (event.key !== "Enter") return
		// newWord = newWord.trim()

		console.log("Got new word")
		console.log(newWord)
		// console.log(event)
		let word = new WordData(totalWords, newWord, Date.now())
		// This also increments totalWords (data.update)
		data.update((current) => {
			return [...current, word]
		})
		updateMeanings(word).then(() => {
			data.update((current) => {
				current[totalWords - 1] = word
				return current
			})
		})
		newWord = ""
		completionSelected = false
		// $data = data
		console.log(newWord)
	}
	let listedOptions: string[] = []
	// $: search20(newWord).then((options) => {
	// 	listedOptions = options
	// })
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
							<Subscribe
								attrs={cell.attrs()}
								let:attrs
								props={cell.props()}
								let:props
							>
								{@const synclass =
									cell.column.header === "Synonyms"
										? "hidden lg:table-cell"
										: ""}
								<td
									{...attrs}
									class={"border-b p-2 border-solid border-secondary-900 " +
										synclass}
									class:matches={props.tableFilter.matches}
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
		class="word-input bg-primary-50/75 dark:bg-primary-900/75 placeholder:text-secondary-700 dark:placeholder:text-secondary"
		bind:value={newWord}
		use:debounceEvent={{
			type: "input",
			listener: () => {
				search20(newWord).then(res => {
					listedOptions = res
				})
			},
			timeout: 200,
		}}
		on:keypress={handleInputEnter}
	/>
	<!-- on:input={() => search20(newWord)} -->
	<!-- <Autocomplete 
		options={listedOptions}
	bind:input={newWord}
	on:selection={handleInputEnter}
	/> -->
	<div class="overflow-y-hidden">
		<div
			class="transition-transform duration-200 bg-success mx-2 p-2 text-center rounded-b-xl 
			border border-t-0 text-sm font-bold text-neutral-content dark:text-neutral
			{completionSelected ? 'translate-y-0':'-translate-y-full'}"
		>
			Completion
			<span>{newWord}</span>
			has been selected! Press <kbd>Enter</kbd> to add to your list.
		</div>
	</div>
	<div class="m-2 overflow-y-auto text-center {newWord === '' ? 'hidden' : ''}">
		{#await loadWordList() then}
			<!-- <ListBox> -->
			{#each listedOptions as option}
				<ListItem
					class="hover:bg-secondary hover:text-secondary-content cursor-pointer"
					on:click={() => {
						completionSelected = true
						newWord = option
						// handleInputEnter()
					}}
					title={option}
				/>
			{/each}
			<!-- </ListBox> -->
			<!-- filter={() => search20(newWord)} -->
		{/await}
	</div>
</div>

<style>
	.word-input {
		border: 2px solid;
		border-radius: 20px;
		width: 100%;
		@apply text-accent-900 dark:text-accent text-center rounded-xl p-4 text-base font-bold mt-4 border-secondary;
	}
</style>
