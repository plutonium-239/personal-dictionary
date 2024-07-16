import { writable } from "svelte/store"
import { loadData, saveData, type WordData } from "./data"
import { persisted } from "svelte-persisted-store"

export let globalTheme = persisted("skeletontheme", {name: "skeleton"})

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

export let editMode = writable(false)

export let isDark = writable(true)