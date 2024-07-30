<script lang="ts">
	import { Button, ButtonGroup, Dialog, Icon, ToggleGroup, ToggleOption, Tooltip } from "svelte-ux"
	import SettingsIcon from "./icons/settings.svg?raw"
	import CopyIcon from "./icons/copy-1.svg?raw"
	import DownloadIcon from "./icons/download-file-1.svg?raw"
	import { useBg, data } from "./store"

	let open: boolean = false

	function copyButtonClick() {
		let text = $data.map((word) => word.word).join("+")
		let baseurl = window.location.origin
		navigator.clipboard.writeText(`${baseurl}/import?sharedWords=${text}`)
	}
	function downloadButtonClick() {
		let text = $data.map((word) => word.word).join("\n")
		
		var element = document.createElement('a');
		const blob = new Blob([text], {type: "text/plain;charset=utf-8"}) // Create a blob (file-like object)
		const url = URL.createObjectURL(blob) // Create an object URL from blob
		element.href = url
		element.download = `personal-dictionary-${Date.now()}.txt`
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	}
</script>

<Button
	variant="fill"
	color="secondary"
	icon={SettingsIcon}
	on:click={() => {
		open = true
	}}
	class="hover:animate-spin"
/>
<Dialog bind:open classes={{ dialog: "md:max-w-[85%] max-h-[85%] border-2 border-primary" }}>
	<div slot="title" class="text-center cute text-4xl">
		♥
		<Icon data={SettingsIcon} class="hover:animate-spin" width="2.5rem" height="auto" />
		settings
		♥
	</div>
	<div class="grid grid-cols-2 justify-between items-center gap-4 p-4">
		<span>use background?</span>
		<ToggleGroup class="w-full" classes={{options: "max-md:grid-flow-row"}} bind:value={$useBg} variant="fill-light" rounded>
			<ToggleOption classes={{ option: "py-2 !mt-0" }} value="">None</ToggleOption>
			<ToggleOption
				classes={{ option: "py-2 !mt-0" }}
				value="url('/cuteicon_fullbg.svg')">Book</ToggleOption
			>
			<ToggleOption
				classes={{ option: "py-2 !mt-0" }}
				value="url('/cuteicon_bg.svg')">Face</ToggleOption
			>
		</ToggleGroup>

		<!-- <Tooltip title="This will ">
			<span>share</span>
		</Tooltip>
		<Button variant="fill" color="primary">copy shareable link</Button> -->

		<Tooltip title='This will copy to your clipboard. 
		Paste these in the import words dialog.'
		classes={{title: "whitespace-pre-line"}}>
			<span>export</span>
		</Tooltip>
		<ButtonGroup variant="fill" color="primary" class="inline-flex flex-wrap">
			<Button class="flex-1" icon={CopyIcon} on:click={copyButtonClick}>
				link
			</Button>
			<Button class="flex-1" icon={DownloadIcon} on:click={downloadButtonClick}>
				<code class="rounded bg-neutral/75 text-neutral-content">
					.txt
				</code>
			</Button>
		</ButtonGroup>
	</div>
</Dialog>
