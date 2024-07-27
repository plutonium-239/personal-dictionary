import { search } from "fast-fuzzy"

export let totalWords: number = 0

export class SingleDefinition {
	constructor(public definition: string, public example: string = "") {}
	static makefrom(obj: any): SingleDefinition {
		return new SingleDefinition(obj.definition, obj.example)
	}
}

class Meanings {
	constructor(
		// List of POS, definitions indexed by selectedDefinition
		public partOfSpeech: string[] = [],
		public definitions: SingleDefinition[] = [],
		// Maps from POS to list of synonyms to avoid storing duplicates
		public synonyms: Map<string, string[]> = new Map(),
		public antonyms: Map<string, string[]> = new Map()
	) {}

	static makefrom(obj: any): Meanings {
		return new Meanings(
			obj.partOfSpeech,
			obj.definitions.map((def: any) => SingleDefinition.makefrom(def)),
			new Map<string, string[]>(obj.synonyms),
			new Map<string, string[]>(obj.antonyms)
		)
	}
	
	appendOne(pos: string, def: SingleDefinition, syn: string[], ant: string[]) {
		this.partOfSpeech.push(pos)
		this.definitions.push(def)
		this.synonyms.set(pos, syn)
		this.antonyms.set(pos, ant)
	}

	toJSON() {
		return {
			partOfSpeech: this.partOfSpeech,
			definitions: this.definitions,
			synonyms: [...this.synonyms],
			antonyms: [...this.antonyms],
		}
	}
}

export class WordData {
	constructor(
		public id: number,
		public word: string,
		public dateAdded: number,
		public fetched: boolean = false,
		// public meanings: POSDefinition[] = [],
		public meanings: Meanings = new Meanings(),
		public selectedDefinition: number = 0,
		public numMeanings: number = 0
	) {}
	static makefrom(obj: any): WordData {
		return new WordData(
			obj.id,
			obj.word,
			obj.dateAdded,
			obj.fetched,
			// obj.meanings ? obj.meanings.map((pos: any) => POSDefinition.makefrom(pos)) : [],
			obj.meanings ? Meanings.makefrom(obj.meanings) : new Meanings(),
			obj.selectedDefinition ? obj.selectedDefinition : 0,
			obj.meanings ? obj.meanings.partOfSpeech.length : 0
		)
	}
}

// Function to load data from localStorage
export function loadData() {
	const storedData = localStorage.getItem("wordsData")
	var parsedWords: WordData[] = []
	// console.log("storedData")
	// console.log(storedData)
	if (storedData !== null) {
		JSON.parse(storedData).forEach((element: any) => {
			parsedWords.push(WordData.makefrom(element))
			// console.log("parsedWords")
			// console.log(parsedWords)
		})
	} else {
		// totalWords is 0
		parsedWords.push(new WordData(totalWords, "personal", 0))
	}
	totalWords = parsedWords.length
	console.log(`totalWords ${totalWords}`)
	return Promise.all(parsedWords.map((word) => updateMeanings(word)))

	// var newParsedWords: WordData[] = parsedWords;
	// parsedWords.map((word, index) => {
	//   updateMeanings(word).then(outword => {
	//     newParsedWords[index] = outword
	//   })
	// })
	// console.log("newParsedWords")
	// console.log(newParsedWords)

	// return newParsedWords;
}
// Function to save data to localStorage
export function saveData(newData: Array<WordData>) {
	if (newData.length == 0) {
		// console.log("not saving - got empty newdata")
		return
	}
	totalWords = newData.length
	console.log(`saving... total=${totalWords}`)
	// console.log(newData)
	localStorage.setItem("wordsData", JSON.stringify(newData))
}

export function updateMeanings(word: WordData) {
	// console.log("update called with")
	// console.log(word)
	if (word.fetched) {
		// console.log("skip fetch")
		return Promise.resolve(word)
	}
	return fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.word}`)
		.then((res) => {
			if (!res.ok) {
				throw new Error(res.statusText)
			}
			return res.json()
		})
		.then((data) => {
			// console.log(data)
			// word.meanings = data[0].meanings.map((pos: any) => POSDefinition.makefrom(pos))
			// word.meanings =
			data[0].meanings.forEach((posMeanings: any) => {
				const pos = posMeanings.partOfSpeech
				posMeanings.definitions.forEach((def: any) => {
					word.meanings.appendOne(
						pos,
						SingleDefinition.makefrom(def),
						posMeanings.synonyms,
						posMeanings.antonyms
					)
				})
			})
			word.numMeanings = word.meanings.partOfSpeech.length
			word.fetched = true
			// word.meaning = data[0].meanings[0].definitions[0].definition
			// word.synonyms = data[0].meanings[0].definitions[0].synonyms
			return word
		})
		.catch((err) => {
			console.error(`${word.word}: ${err}`)
			return word
		})
}


export function searchData(data: WordData[], searchTerm: string) {
	let matchingWords = search(searchTerm, data, {keySelector: (w: WordData) => w.word})
	return data.filter((word) => {
		return matchingWords.includes(word)
	})
}
