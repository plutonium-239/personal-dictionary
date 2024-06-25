class SingleDefinition {
  constructor(
    public definition: string,
    public example: string = "",
  ) { }
  static makefrom(obj: any): SingleDefinition {
    return new SingleDefinition(
      obj.definition,
      obj.example,
    );
  }
}

class POSDefinition {
  constructor(
    public partOfSpeech: string,
    public definitions: SingleDefinition[],
    public synonyms: string[],
    public antonyms: string[],
  ) { }
  static makefrom(obj: any): POSDefinition {
    return new POSDefinition(
      obj.partOfSpeech,
      obj.definitions.map((def: any) => SingleDefinition.makefrom(def)),
      obj.synonyms,
      obj.antonyms,
    );
  }
}

export class WordData {
  constructor(
    public word: string,
    public dateAdded: number,
    public fetched: boolean = false,
    public meanings: POSDefinition[] = [],
    public selectedPOS: number = 0,
    public selectedDefinition: number = 0,
  ) { }
  static makefrom(obj: any): WordData {
    return new WordData(
      obj.word,
      obj.dateAdded,
      obj.meanings ? true: false,
      obj.meanings ? obj.meanings.map((pos: any) => POSDefinition.makefrom(pos)): [],
      obj.selectedPOS ? obj.selectedPOS : 0,
      obj.selectedDefinition ? obj.selectedDefinition : 0,
    );
  }
}

// Function to load data from localStorage
export function loadData() {
  const storedData = localStorage.getItem("wordsData");
  var parsedWords: WordData[] = [];
  console.log("storedData")
  console.log(storedData)
  if (storedData !== null) {
    JSON.parse(storedData).forEach((element: any) => {
      parsedWords.push(WordData.makefrom(element));
      console.log("parsedWords")
      console.log(parsedWords)
    });
  } else {
    parsedWords.push(new WordData("personal", 0))
  }

  return Promise.all(parsedWords.map(word => updateMeanings(word)))

  // var newParsedWords: WordData[] = parsedWords;
  // parsedWords.map((word, index) => {
  //   updateMeanings(word).then(outword => {
  //     newParsedWords[index] = outword
  //   })
  // })
  // console.log("newParsedWords")
  // console.log(newParsedWords)

  // return newParsedWords;
};
// Function to save data to localStorage
export function saveData(newData: Array<WordData>) {
  console.log("saving...");
  console.log(newData);
  localStorage.setItem("wordsData", JSON.stringify(newData));
};

export function updateMeanings(word: WordData) {
  console.log("update called with");
  console.log(word);
  if (!word.fetched) {
    console.log("skip fetch");
    return Promise.resolve(word)
  }
  return fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.word}`)
    .then(res => {
      if (!res.ok) { throw new Error(res.statusText) }
      return res.json()
    })
    .then(data => {
      console.log(data)
      word.meanings = data[0].meanings.map((pos: any) => POSDefinition.makefrom(pos))
      word.fetched = true
      // word.meaning = data[0].meanings[0].definitions[0].definition
      // word.synonyms = data[0].meanings[0].definitions[0].synonyms
      return word
    })
    .catch(err => {
      console.error(`${word}: ${err}`)
      return word
    })
}