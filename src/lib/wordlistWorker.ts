import { Searcher } from "fast-fuzzy";
import wordListUrl from "../assets/words_alpha.txt";

let words: string[]

async function getListAndSplit() {
    const file = await fetch(wordListUrl)
    const filecontent = await file.text()
    // console.log("Worker:")
    // console.log(filecontent)
    words = filecontent.split("\r\n")
    console.log(`Worker Loaded words, length = ${words.length}`);
}

onmessage = async (e) => {
    switch (e.data.command) {
        case "build":
            await getListAndSplit()
            build()
            // postMessage(words)
            postMessage("Built WordList")
        case "search":
            search(e.data.text, 10)
            postMessage(filteredOptions)
    }
};

// onmessage = async () => {
//     const response = await fetch(wordListUrl);
//     if (!response.body) return
//     const reader = response.body.getReader();
//     let decoder = new TextDecoder('utf-8');
//     let data = '';
//     let words = []

//     while(true) {
//         const { done, value } = await reader.read();
//         if (done) break;

//         data += decoder.decode(value);
//         let lines = data.split('\r\n');
//         data = lines.pop();  // In case the last line didn't end yet.
//         if (!data) data = ''

//         for(let line of lines) {
//             words.push(line.trim());
//         }
//     }

//     postMessage(words);
// };

let searcher: Searcher<string, {}>
let filteredOptions: string[]

function build() {
    searcher = new Searcher(words)
    filteredOptions = []
}

function search(text: string, size: number) {
	// console.log("search called with " + text)
	// console.log("filtered inputs is ")
	// console.log(filteredOptions)
	let filteredwords: string[]
	if (words.length == 0) {
		return []
	} else if (text === undefined || text === "") {
        // console.log("search returning")
		filteredwords = []
	} else {
		filteredwords = searcher.search(text)
		filteredwords = filteredwords.slice(0, Math.min(size, filteredwords.length))
	}
	// console.log("search returning")
	filteredOptions = filteredwords
	// return filteredOptions
}
