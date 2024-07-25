<script lang="ts">
	import { createTable, Subscribe, Render, createRender } from "svelte-headless-table"
	import { addTableFilter } from "svelte-headless-table/plugins"
	import { WordData, totalWords, updateMeanings } from "./data"
	import Meaning from "./table-elements/Meaning.svelte"
	import POS from "./table-elements/POS.svelte"
	import { data } from "./store"
	import Actions from "./table-elements/Actions.svelte"
	import { search20, loadWordList } from "./load_wordlist"
	import { Button, ListItem, TextField } from "svelte-ux"
	import Word from "./table-elements/Word.svelte"
	import Synonyms from "./table-elements/Synonyms.svelte"
	import BulkImport from "./BulkImport.svelte"
	import AddIcon from "./icons/add-circle.svg?raw"

	export let searchTerm: string

	const table = createTable(data, {
		tableFilter: addTableFilter(),
	})
	// Make it reactive so that new entries show up instantly
	$data

	const columns = table.createColumns([
		table.column({
			header: "Word",
			accessor: (item) => item,
			cell: ({ value }) => createRender(Word, { word: value }),
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
	function handleInputEnter(event: KeyboardEvent | MouseEvent) {
		if (newWord === "" || (event instanceof KeyboardEvent && event.key !== "Enter")) 
			return
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
		// $data = data
		console.log(newWord)
	}
	let listedOptions: string[] = []
	let hintNode: HTMLDivElement
	let hintHeight: number = 38
	let textField: TextField
	let innerWidth: number = 1000

	$: hintHeight = hintNode?.clientHeight

	$: if (!newWord) completionSelected = false
</script>

<!-- <ThemeInit /> -->
<svelte:window bind:innerWidth />
<div class="pt-8 flex max-md:flex-wrap justify-center items-stretch gap-2 bg-surface-200">
	<TextField
		bind:this={textField}
		placeholder="Enter a new word"
		classes={{
			root: "w-full",
			container: "bg-primary-50/75 dark:bg-primary-900/75 rounded-xl px-4 py-2 border-2 border-secondary",
			input: "text-base font-bold text-accent-900 dark:text-accent text-center placeholder:text-secondary-700 dark:placeholder:text-secondary"
		}}
		on:change={() => {
			search20(newWord).then(res => {
				listedOptions = res
			})
		}}
		debounceChange={200}
		bind:value={newWord}
		on:keypress={handleInputEnter}
	>
		<svelte:fragment slot="append">
			<Button 
				variant="fill-light"
				color="primary"
				icon={AddIcon}
				on:click={handleInputEnter}
				disabled={!newWord}
				class="max-md:px-2"
			>
				<span class="max-md:hidden">Add</span>
			</Button>
		</svelte:fragment>
	</TextField>
	<BulkImport class="w-auto h-auto content-center"/>
</div>
<div class="overflow-y-hidden" bind:this={hintNode}>
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
<div style:--hintHeight="{hintHeight}px"
class="m-2 mb-6 overflow-y-auto text-center 
{!newWord ? 'hidden' : ''} 
{completionSelected ? "":"-mt-[--hintHeight]"}"
>
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

<div class="pb-6 w-full">
	<table {...$tableAttrs} class="w-full">
		<thead>
			{#each $headerRows as headerRow (headerRow.id)}
				<Subscribe rowAttrs={headerRow.attrs()} let:rowAttrs>
					<tr {...rowAttrs}>
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs>
								{@const synclass = cell.label === "Synonyms" ? 
									"hidden lg:table-cell" : ""}
								{@const posclass = cell.label === "POS" ? 
									"hidden md:table-cell" : ""}
								<!-- {@const synclass =
									cell.label === "Synonyms"
										? "hidden lg:table-cell"
										: ""} -->
								<th
									{...attrs}
									class={"border-y p-2 border-solid border-secondary-900 " +
										synclass + posclass}
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
								{@const synclass = cell.column.header === "Synonyms" ? 
									"hidden lg:table-cell" : ""}
								{@const posclass = cell.column.header === "POS" ? 
									"hidden md:table-cell" : ""}
								<td
									{...attrs}
									class={"border-b p-2 border-solid border-secondary-900 " +
										synclass + posclass}
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

	<!-- on:input={() => search20(newWord)} -->
	<!-- <Autocomplete 
		options={listedOptions}
	bind:input={newWord}
	on:selection={handleInputEnter}
	/> -->
	
</div>

<style>
	.word-input {
		@apply w-full border-2 border-secondary text-accent-900 dark:text-accent text-center rounded-xl p-4 text-base font-bold;
	}
</style>
