<script>
  import { onMount } from "svelte";
  import PlayerList from "./components/PlayerList.svelte";
  let state = {};

  const incomingState = (s) => {
    state = s
    state.currentImage = state[state.currentCampaign].images.find(i => i.active)
    document.body.setAttribute("style", `background-image: url('${state.currentImage.url}')`)
  }
  onMount(() => {
    presenterAPI.getState().then(incomingState)
  })
  presenterAPI.subscribeToStateChange(incomingState)
</script>

{#if state[state.currentCampaign] && state[state.currentCampaign].players && state.initiativeVisible}
  <PlayerList players={state[state.currentCampaign].players} initiative={true} />
{/if}
