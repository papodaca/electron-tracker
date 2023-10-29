<script>
  import { onMount } from "svelte";
  import PlayerList from "./components/PlayerList.svelte";
  let state = {};
  onMount(() => {
    document.body.setAttribute("style", "background-image: url('/home/usr1/Projects/electron-tracker/public/assets/carsland.jpg')")
    presenterAPI.getState().then((s) => state = s)
  })
  presenterAPI.subscribeToStateChange((s) => state = s)
</script>

{#if state.players}
  <PlayerList players={state.players} initiative={true} />
{/if}
