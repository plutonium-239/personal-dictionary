<script lang="ts">
	import {
		Button,
		Dialog,
		TextField,
		ToggleGroup,
		ToggleOption,
		TogglePanel,
		ListItem,
		Tooltip,
	} from "svelte-ux"
	import listAddIcon from "./icons/list-add.svg?raw"
	import refreshIcon from "./icons/refresh-cw-alt.svg?raw"
	import { data, isDark, customSeparator, sepIndex } from "./store"
	import { updateMeanings, WordData } from "./data"
	import pThrottle from "p-throttle"
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
	let loading: boolean = false
	let errorText: string = ""
	let parsingState: keyof typeof errorStateColors = "info"

	const definedSeps = [
		{label: ",", raw: ","},
		{label: String.raw`\n`, raw: `\n`},
		{label: String.raw`\r\n`, raw: `\r\n`},
		{label: "(space)", raw: " "},
		{label: `Custom (${$customSeparator})`, raw: ""},
	]
	const numPredefSeps = 4

	const errorStateColors = {
		error: "bg-danger text-danger-content",
		success: "bg-success text-success-content",
		info: "bg-info text-success-content"
	}

	const throttle = pThrottle({
		limit: 5,
		interval: 2000,
		onDelay: () => {
			console.log("Reached interval limit, call is delayed")
		},
	})

	function parseMultiple(wordlist: string[]) {
		parsedData = []
		loadingDone = []

		wordlist.forEach(async (w, i) => {
			let word = new WordData(i, w.trim(), Date.now())
			parsedData.push(word)
			loadingDone.push(false)
			console.log("Made new word")
			await throttle(async () => {
				await updateMeanings(word)
				parsedData[i] = word
				loadingDone[i] = true
			})()
		})
		let timer = setInterval(() => {
			if (loadingDone.every((v) => v)) {
				loading = false
				clearInterval(timer)
			}
		}, 500)
		// (async () => {await Promise.all(promises)})();
	}
	function addParsed() {
		data.update((current) => {
			return current.concat(parsedData)
		})
		open = false
	}

	function formatList(text: string): string[] {
		loading = true
		let timer = setTimeout(() => {
			loading = false
		}, 100);
		let sep = definedSeps[$sepIndex].raw
		if (!text || !sep) return []
		let list = text.split(`${sep}`)
		console.log({ sep: sep, t: text })
		console.log(list)

		if (list.length == 1) {
			errorText = String.raw`Separating with ${definedSeps[$sepIndex].label} only gave 1 length array`
			parsingState = "error"
			return list
		}
		clearTimeout(timer)
		loading = true
		parsingState = "success"
		errorText = `Got ${list.length} words separated by ${definedSeps[$sepIndex].label}!`
		return list
	}
	// $: console.log(titleNode?.parentElement!.clientHeight)

	function calcH(innerHeight: number, titleHeight: number, actionsHeight: number) {
		return 0.8 * innerHeight - 64 - 36 - (titleHeight + actionsHeight)
	}

	if (window.location.pathname.includes("/import")) {
		console.log("Opening import dialog")
		let params = new URLSearchParams(document.location.search)
		let shared: string = ""
		if (params.has("sharedWords")) shared = params.get("sharedWords")!

		open = true
		inputText = shared
		$sepIndex = 3 // space
		parseMultiple(formatList(inputText))
	}
	$: textareaHeight = calcH(
		innerHeight,
		titleNode?.parentElement!.clientHeight,
		actionsNode?.parentElement!.clientHeight
	)
	$: if (!$customSeparator) $customSeparator = ""
	$: if ($customSeparator) {
		console.log(`custom sep is ${$customSeparator} ${$customSeparator}`);
		definedSeps[numPredefSeps].label = `Custom (${$customSeparator})`
		definedSeps[numPredefSeps].raw = $customSeparator
	}
</script>

<svelte:window bind:innerHeight />
<div class={cls}>
	<Button
		on:click={() => (open = true)}
		variant={$isDark ? "fill-light" : "fill"}
		color="secondary"
		rounded
		icon={listAddIcon}
		class="font-bold"
	>
		Import words
	</Button>
	<Dialog
		bind:open
		classes={{
			title: "bg-gradient-to-b from-primary/25 to-transparent",
			dialog: "w-[85%] max-h-[85%] border-2 border-primary",
		}}
	>
		<!-- class="w-[80%] h-[80%]"> -->
		<!-- classes={{title: "h-[10%] box-border", actions: "h-[10%] box-border"}} -->
		<div slot="title" bind:this={titleNode} class="flex w-full justify-between items-center">
			Import a list of words
			<div
				class="inline-flex gap-2 flex-col md:flex-row items-center outline-offset-8 outline outline-1 outline-accent/10"
			>
				<label for="separator_choice" class="text-accent font-normal"> Separator: </label>
				<ToggleGroup
					id="separator_choice"
					variant="fill"
					bind:value={$sepIndex}
					rounded
					class="font-mono"
					on:change={() => parseMultiple(formatList(inputText))}
				>
					{#each definedSeps as sep, i (i) }
						<ToggleOption classes={{ option: "py-2 !mt-0" }} value={i}>{sep.label}</ToggleOption>
					{/each}
					<!-- <ToggleOption classes={{ option: "py-2 !mt-0" }} value=",">,</ToggleOption>
					<ToggleOption classes={{ option: "py-2 !mt-0" }} value={String.raw`\n`}>\n</ToggleOption>
					<ToggleOption classes={{ option: "py-2 !mt-0" }} value={String.raw`\r\n`}
						>\r\n</ToggleOption
					>
					<ToggleOption classes={{ option: "py-2 !mt-0" }} value=" ">(space)</ToggleOption
					> 
					<ToggleOption classes={{ option: "py-2 !mt-0" }} value={-1}>
						Custom ({customSep})
					</ToggleOption> -->
				</ToggleGroup>
				<Tooltip title="Enter a custsom separator. 
				Escape characters cannot be entered. 
				If needed, please use a text editor to reformat your input."
				classes={{title: "whitespace-pre-line text-center"}}>
					<TextField
						class="{$sepIndex === numPredefSeps? "": "hidden"}"
						bind:value={$customSeparator}
						classes={{ input: "w-[4ch] text-center py-2" }}
					/>
				</Tooltip>
			</div>
		</div>

		<div slot="actions" bind:this={actionsNode} class="w-full px-4 gap-2 flex justify-end items-center">
			<div class="font-mono text-center content-center px-2 mr-auto
			h-full rounded whitespace-break-spaces {errorStateColors[parsingState]}">
				{">"}
				{#if errorText}
					{errorText}
				{:else}
						Errors will be shown here.
				{/if}
			</div>
			<Button
				variant="default"
				color="primary"
				icon={refreshIcon}
				{loading}
				disabled={loading}
				on:click={(e) => {
					e.stopPropagation()
					parseMultiple(formatList(inputText))
				}}
			/>
			<Button
				variant="fill"
				color="success"
				disabled={parsedData.length === 0}
				on:click={() => {
					addParsed()
					inputText = ""
				}}
			>
				Confirm
			</Button>
			<Button variant="fill-light" color="primary">Close</Button>
		</div>

		<ToggleGroup variant="underline" rounded value="input">
			<ToggleOption classes={{ option: "py-1 !mt-1" }} value="input">Input</ToggleOption>
			<ToggleOption classes={{ option: "py-1 !mt-1" }} value="output">Output</ToggleOption>
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
					{#if parsedData.length === 0}
					<div class="min-h-24 text-primary font-bold text-center content-center">
						Your imported words will be shown here.
					</div>
					{/if}
					{#each parsedData as w, i (w.id)}
						<ListItem
							title={w.word}
							loading={!loadingDone[i]}
							class={w.fetched ? "text-success" : "text-danger"}
						/>
					{/each}
				</TogglePanel>
			</svelte:fragment>
		</ToggleGroup>
	</Dialog>
</div>
