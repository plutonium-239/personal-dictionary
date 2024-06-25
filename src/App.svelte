<script lang="ts">
  import TabularView from "./lib/TabularView.svelte";
</script>

<main>
  <div class="table-container">
    <TabularView />
  </div>
</main>


<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }

  .table-container {
    /* Table styling */
    max-width: 100vw;

  }
</style>
  