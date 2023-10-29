<script>
  import { onMount } from "svelte";
  import PlayerList from "./components/PlayerList.svelte";

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
    <PlayerList players={state.players} initiative={false} />
  </div>
</main>

<style>
</style>
