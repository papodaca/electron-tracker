<script>
  import { onMount } from "svelte";
  let state = {};
  onMount(() => {
    document.body.setAttribute("style", "background-image: url('/home/usr1/Projects/electron-tracker/public/assets/carsland.jpg')")
    presenterAPI.getState().then((s) => state = s)
  })
  presenterAPI.subscribeToStateChange((s) => state = s)
</script>

{#if state.players}
<div class="list-group initiative-list">
  {#each state.players as player}
  <div class="list-group-item list-group-item-action {player['active'] ? 'active' : ''}">
    <div class="text"><span class="initiative">{player['initiative']}</span> - <span class="name">{player['name']}</span></div>
  </div>
  {/each}
</div>
{/if}

<style>
.list-group .list-group-item {
  opacity: 0.8;
  transition: opacity 0.2s;
}

.list-group .list-group-item div.text {
  opacity: 0.9;
  background-color: var(--bs-body-bg);
}
.list-group .list-group-item.active div.text {
  opacity: 0.9;
  background-color: var(--bs-active-bg);
}

.list-group .list-group-item div.text .initiative {
  width: 1.5em;
  display: inline-block;
}
.list-group .list-group-item div.text .name {
  margin-left: 0.5em;
  margin-right: 0.5em;
}
</style>
