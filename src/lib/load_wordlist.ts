import { Searcher } from "fast-fuzzy"
import wordLoader from "./wordlistWorker?worker";
// import wordListUrl from "../assets/words_alpha.txt";

export let words: string[] = []
export let filteredOptions: string[]
const worker = new wordLoader(); // Path to your worker file

let workerReady = false;
let wordlistBuiltResolver: (value: any) => void;
let searchResolver: ((value: string[]) => void) | null

export async function loadWordList() {
    worker.postMessage({command: "build"})
    return new Promise(resolve => {
        wordlistBuiltResolver = resolve
    })
}

// export async function loadWordList() {
// 	const filecontent = (await import("../assets/words_alpha.txt?raw")).default
// 	words = filecontent.split("\r\n")
// 	console.log(`Loaded words, length = ${words.length}`)
// 	// console.log(words.slice(0, 10))
// 	searcher = new Searcher(words)
// 	filteredOptions = makeItems(words.slice(0, 20))
// }

worker.onmessage = (e) => {
    // console.log(e.data);
    if (e.data === "Built WordList") {
        workerReady = true;
        wordlistBuiltResolver(true);
    }
    else if (searchResolver) {
        filteredOptions = e.data
        searchResolver(filteredOptions)      
        searchResolver = null
    }
}

export async function search20(text: string) {
    if (!workerReady) await loadWordList()
    return new Promise<string[]>((resolve) => {
        searchResolver = resolve
        worker.postMessage({command: "search", text: text})
    })
}
