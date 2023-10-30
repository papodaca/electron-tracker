<script>
  import { onMount } from "svelte";
  import PlayerList from "./components/PlayerList.svelte";
  let state = {};

  const incomingState = (s) => {
    state = s
    state.currentImage = "/home/usr1/Projects/electron-tracker/public/assets/carsland.jpg"
    document.body.setAttribute("style", `background-image: url('${state.currentImage}')`)
  }
  onMount(() => {
    presenterAPI.getState().then(incomingState)
  })
  presenterAPI.subscribeToStateChange(incomingState)
</script>

{#if state.players && state.initiativeVisible}
  <PlayerList players={state.players} initiative={true} />
{/if}
