import { readable, writable, type Readable, type Writable } from "svelte/store"
import { loadData, saveData, type WordData } from "./data"
import { localStore } from "svelte-ux"
import type { sortKeysLabels } from "./constants"

export let data = writable([] as WordData[])

loadData().then((ld) => {
	data.set(ld)
	console.log("Table Receieved data:")
	console.log(ld)
})

// Reactive statement to save whenever data changes
data.subscribe((value) => {
	saveData(value)
})

// Not persisted:
export let editMode = writable(false)
export let isDark = writable(true)

// Persisted:
export let customSeparator = localStore("customSep", "\n")
export let sepIndex = localStore("sepIndex", 1)

export let useBg = localStore("useBg", "")

export let sortToggleOrder = writable(0)
export let sortOrder = writable("asc")
export let sortKey : Writable<keyof typeof sortKeysLabels> = writable("dateAdded")
