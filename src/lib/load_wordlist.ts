import { Searcher } from "fast-fuzzy"
import type { AutocompleteOption } from '@skeletonlabs/skeleton';
import { debounce } from "ts-debounce";

export let words: string[] = []
export let filteredOptions: AutocompleteOption<string, string>[]
let searcher: Searcher<string, {}>

export async function loadWordList() {
	const filecontent = (await import("../assets/words_alpha.txt?raw")).default
	words = filecontent.split("\r\n")
	console.log(`Loaded words, length = ${words.length}`)
	// console.log(words.slice(0, 10))
	searcher = new Searcher(words)
	filteredOptions = makeItems(words.slice(0, 20))
}

export function makeItems(strings: string[]): AutocompleteOption<string, string>[] {
	return strings.map((word) => ({
		label: word,
		value: word,
	}))
}


export const search20 = debounce(_search20, 200)

export function _search20(text: string) {
	// console.log("search called with " + text)
	// console.log("filtered inputs is ")
	// console.log(filteredOptions)
	let filteredwords: string[]
	if (words.length == 0) {
		return []
	} else if (text === "" || text === undefined) {
        // console.log("search returning")
		filteredwords = words.slice(0, 20)
	} else {
		filteredwords = searcher.search(text)
		filteredwords = filteredwords.slice(0, Math.min(20, filteredwords.length))
	}
	console.log("search returning")
	filteredOptions = makeItems(filteredwords)
	return filteredOptions
}
