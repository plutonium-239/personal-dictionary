<script lang="ts">
  import { readable, writable, type Writable } from "svelte/store";
  import { createTable, Subscribe, Render } from "svelte-headless-table";
  import { WordData, loadData, saveData } from "./data";

  let data = writable([] as WordData[]);
  loadData().then((ld) => {
    data.set(ld);
    console.log("Table Receieved data:");
    console.log(ld);
  });

  // Reactive statement to save whenever data changes
  data.subscribe((value) => {
    saveData(value);
  });

  const table = createTable(data);

  const columns = table.createColumns([
    table.column({
      header: "Word",
      accessor: "word",
    }),
    table.column({
      header: "Meaning",
      accessor: (item) => {
        return item.meanings[item.selectedPOS].definitions[item.selectedDefinition].definition
      },
    }),
    table.column({
      header: "Synonyms",
      accessor: (item) => {
        // return item.synonyms ? item.synonyms.join(", ") : "";
        return item.meanings[item.selectedPOS].synonyms.join(", ")
      },
    }),
  ]);

  const { headerRows, rows, tableAttrs, tableBodyAttrs } =
    table.createViewModel(columns);

  let newWord: string;
  function handleInputEnter(event: KeyboardEvent) {
    if (event.key !== "Enter" || newWord === "") return
    newWord = newWord.trim()
    console.log("Got new word");
    console.log(newWord);

    data.update((current) => {
      return [...current, new WordData(newWord, Date.now())];
    });
    data = data
    newWord = "";
  }
</script>

<table {...$tableAttrs}>
  <thead>
    {#each $headerRows as headerRow (headerRow.id)}
      <Subscribe rowAttrs={headerRow.attrs()} let:rowAttrs>
        <tr {...rowAttrs}>
          {#each headerRow.cells as cell (cell.id)}
            <Subscribe attrs={cell.attrs()} let:attrs>
              <th {...attrs}>
                <Render of={cell.render()} />
              </th>
            </Subscribe>
          {/each}
        </tr>
      </Subscribe>
    {/each}
  </thead>
  <tbody {...$tableBodyAttrs}>
    {#each $rows as row (row.id)}
      <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
        <tr {...rowAttrs}>
          {#each row.cells as cell (cell.id)}
            <Subscribe attrs={cell.attrs()} let:attrs>
              <td {...attrs}>
                <Render of={cell.render()} />
              </td>
            </Subscribe>
          {/each}
        </tr>
      </Subscribe>
    {/each}
    <tr>
      <td
        contenteditable="true"
        class="word-input"
        on:keyup={handleInputEnter}
        bind:innerText={newWord}
        colspan="3">
      </td>
    </tr>
  </tbody>
</table>

<style>
  table {
    border-spacing: 0;
    /* border-collapse: collapse; */
  }

  th {
    border-top: 1px solid var(--border-color);
    /* border-bottom adds to td.border-top to form double border as divider between header/body */
    border-bottom: 1px solid var(--border-color); 
    padding: 0.5rem;
  }
  td {
    border-top: 1px solid var(--border-color);
    padding: 0.5rem;
  }

  td.word-input {
    background: var(--border-color);
    color: var(--accent-color);
    border: 2px solid var(--accent-color);
    border-radius: 20px;
  }

  [contenteditable="true"]:empty::before {
    content: "Enter a new word";
    color: var(--placeholder-color);
  }
</style>
