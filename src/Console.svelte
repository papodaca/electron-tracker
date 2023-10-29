<script>
  import { onMount } from "svelte";

  const openPresenter = consoleAPI.openPresenter
  let state = {}
  onMount(() => {
    consoleAPI.getState().then((s) => state = s)
  })
</script>

<main>
  <h1>Vite + Svelte</h1>

  <div class="card">
    <button on:click={openPresenter}>
      Open Presenter
    </button>
    <pre>{JSON.stringify(state)}</pre>
  </div>
</main>

<style>
</style>
