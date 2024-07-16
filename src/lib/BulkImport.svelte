<script lang="ts">
	import {
		Button,
		Dialog,
		TextField,
		Field,
		ToggleGroup,
		ToggleOption,
		TogglePanel,
		ListItem,
	} from "svelte-ux"
	import listAddIcon from "./icons/list-add.svg?raw"
	import { data, isDark } from "./store"
	import { totalWords, updateMeanings, WordData } from "./data"
	let cls: string = ""
	export { cls as class }
	let open: boolean = false
	let inputText: string = ""
	let titleNode: HTMLDivElement, actionsNode: HTMLDivElement
	let innerHeight: number
	let textareaHeight = 100
	let separator: string = " "
	let parsedData: WordData[] = []
	let loadingDone: boolean[] = []

	function addMultiple(wordlist: string[]) {
		wordlist.forEach((w, i) => {
			let word = new WordData(i, w.trim(), Date.now())
			parsedData.push(word)
			loadingDone.push(false)
			updateMeanings(word).then(() => {
				parsedData[i] = word
				loadingDone[i] = true
			})
		})
		// data.update((current) => {
		// 	return current.concat(parsedData)
		// })
	}

	function formatList(text: string): string[] {
		let list = text.split(separator)
		if (list.length == 1)
			alert(`Separating with ${separator} only gave 1 length array`)
		return list
	}
	$: console.log(titleNode?.parentElement!.clientHeight);
	
	function calcH(innerHeight: number, titleHeight: number, actionsHeight: number) {
		return 0.8 * innerHeight - 20 - 32 - (titleHeight + actionsHeight)
	}
	$: textareaHeight = calcH(innerHeight, titleNode?.parentElement!.clientHeight, actionsNode?.parentElement!.clientHeight, )
</script>

<svelte:window bind:innerHeight />
<div class={cls}>
	<Button
		on:click={() => (open = true)}
		variant={$isDark ? "fill-light" : "fill"}
		color="secondary"
		rounded
		icon={listAddIcon}
	>
		Import words
	</Button>
	<Dialog bind:open class="w-[80%] h-[80%]">
		<!-- classes={{title: "h-[10%] box-border", actions: "h-[10%] box-border"}} -->
		<div
			slot="title"
			bind:this={titleNode}
			class="flex w-full justify-between items-center"
		>
			Import a list of words
			<div class="inline-flex gap-2 flex-col md:flex-row justify-center outline-offset-8 outline outline-1 outline-accent/10">
				<label for="separator_choice" class="text-accent font-normal">
					Separator:
				</label>
				<ToggleGroup
					id="separator_choice"
					variant="fill"
					bind:value={separator}
					rounded
					class="font-mono"
				>
					<ToggleOption value=",">,</ToggleOption>
					<ToggleOption value="\n">\n</ToggleOption>
					<ToggleOption value=" ">(space)</ToggleOption>
				</ToggleGroup>
			</div>
		</div>
		<div slot="actions" bind:this={actionsNode} class="px-4">
			<Button
				variant="fill"
				color="success"
				disabled={inputText !== ""}
				on:click={() => {
					addMultiple(formatList(inputText))
					inputText = ""
				}}>Confirm</Button
			>
			<Button variant="fill-light" color="primary">Close</Button>
		</div>
		<ToggleGroup variant="underline" rounded value="input">
			<ToggleOption value="input">Input</ToggleOption>
			<ToggleOption value="output">Output</ToggleOption>
			<svelte:fragment slot="panes">
				<TogglePanel>
					<TextField
						label="Enter words here"
						multiline
						placeholder=""
						class="w-full p-6"
						--textareaHeight="{textareaHeight}px"
						classes={{ input: `h-[var(--textareaHeight)] box-border` }}
						autofocus
						bind:value={inputText}
					/>
				</TogglePanel>
				<TogglePanel>
					{#each parsedData as w, i (w.id)}
						<ListItem
							title={w.word}
							loading={loadingDone[i]}
							class="text-{w.fetched ? "success": "danger"}"
						/>
					{/each}
				</TogglePanel>
			</svelte:fragment>
		</ToggleGroup>
	</Dialog>
</div>
