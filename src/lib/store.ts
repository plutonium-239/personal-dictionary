import { writable } from "svelte/store"
import { loadData, saveData, type WordData } from "./data"
import { localStore } from "svelte-ux"

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
export let separator = localStore("separator", "\n")

export let useBg = localStore("useBg", "")
