<script lang="ts">
	import {
		Button,
		Dialog,
		TextField,
		ToggleGroup,
		ToggleOption,
		TogglePanel,
		ListItem,
	} from "svelte-ux"
	import listAddIcon from "./icons/list-add.svg?raw"
	import { data, isDark, separator } from "./store"
	import { updateMeanings, WordData } from "./data"
	import pThrottle from "p-throttle";
	let cls: string = ""
	export { cls as class }
	let open: boolean = false
	let inputText: string = ""
	let titleNode: HTMLDivElement, actionsNode: HTMLDivElement
	let innerHeight: number
	let textareaHeight = 100
	// let separator: string = " "
	let parsedData: WordData[] = []
	let loadingDone: boolean[] = []

	// const maxAllowed = 5 // per minute
	// let currentConn = 0
	// let timeSinceLast = 0
	// async function limiter() {
		
	// }
	const throttle = pThrottle({
		limit: 5,
		interval: 2000,
		onDelay: () => {
			console.log('Reached interval limit, call is delayed');
		},
	});

	function parseMultiple(wordlist: string[]) {
		parsedData = []
		loadingDone = []
		
		wordlist.forEach(async (w, i) => {
			let word = new WordData(i, w.trim(), Date.now())
			parsedData.push(word)
			loadingDone.push(false)
			console.log("Made new word");
			await throttle(async () => {
				await updateMeanings(word)
				parsedData[i] = word
				loadingDone[i] = true
			})();
		});
		// (async () => {await Promise.all(promises)})();
	}
	function addParsed() {
		data.update((current) => {
			return current.concat(parsedData)
		})
		open = false
	}

	function formatList(text: string): string[] {
		if (!text) return []
		let list = text.split($separator)
		console.log({sep: $separator, t: text});
		console.log(list);
		
		
		if (list.length == 1)
			alert(`Separating with ${$separator} only gave 1 length array`)
		return list
	}
	$: console.log(titleNode?.parentElement!.clientHeight);
	
	function calcH(innerHeight: number, titleHeight: number, actionsHeight: number) {
		return 0.8 * innerHeight - 64 - 36 - (titleHeight + actionsHeight)
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
					bind:value={$separator}
					rounded
					class="font-mono"
					on:change={() => parseMultiple(formatList(inputText))}
				>
					<ToggleOption value=",">,</ToggleOption>
					<ToggleOption value={`\n`}>\n</ToggleOption>
					<ToggleOption value={`\r\n`}>\r\n</ToggleOption>
					<ToggleOption value=" ">(space)</ToggleOption>
				</ToggleGroup>
			</div>
		</div>
		<div slot="actions" bind:this={actionsNode} class="px-4">
			<Button
				variant="fill"
				color="success"
				disabled={parsedData.length === 0}
				on:click={() => {
					addParsed()
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
						on:change={() => parseMultiple(formatList(inputText))}
					/>
				</TogglePanel>
				<TogglePanel>
					{#each parsedData as w, i (w.id)}
						<ListItem
							title={w.word}
							loading={!loadingDone[i]}
							class="{w.fetched ? "text-success": "text-danger"}"
						/>
					{/each}
				</TogglePanel>
			</svelte:fragment>
		</ToggleGroup>
	</Dialog>
</div>
