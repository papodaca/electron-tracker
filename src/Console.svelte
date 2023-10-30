<script>
  import { onMount } from "svelte";
  import PlayerList from "./components/PlayerList.svelte";

  const openPresenter = consoleAPI.openPresenter
  let state = {}, sortable = false

  const loadState = async () => {
    state = await consoleAPI.getState()
  }
  onMount(() => loadState())
  const setSate = () => {
    state = {
      players: [
        {
          id: crypto.randomUUID(),
          name: "Player 1",
          initiative: 1
        },{
          id: crypto.randomUUID(),
          name: "Player 2",
          initiative: 2
        },{
          id: crypto.randomUUID(),
          name: "Player 3",
          initiative: 3
        }
      ]
    }
    consoleAPI.broadcastState(state)
  }
  const playersChange = (e) => {
    state = {
      ...state,
      players: e.detail
    }
    sortList(null)
    consoleAPI.broadcastState(state)
  }
  const toggleSortable = (_e) => {
    sortable = !sortable
  }
  const sortList = (_e) => {
    state = {
      ...state,
      players: state.players.sort((a, b) => Number(b.initiative) - Number(a.initiative))
    }
    consoleAPI.broadcastState(state)
  }

  const toTitleCase = (str) => {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

  const addPlayer = (kind) =>((_e) => {
    state = {
      ...state,
      players: [
        ...state.players,
        {
          id: crypto.randomUUID(),
          name: `New ${toTitleCase(kind)}`,
          initiative: 0,
          kind
        }
      ]
    }
  })
  const clearMonsters = (_e) => {
    state = {
      ...state,
      players: state.players.filter(p => p.kind !== 'monster')
    }
    consoleAPI.broadcastState(state)
  }
  const updatePlayerActive = () => {
    state = {
      ...state,
      players: state.players.map((p, i) => {
        if (i === state.currentPlayer) {
          p.active = true
        } else {
          p.active = false
        }
        return p
      })
    }
  }
  const startInitiative = (_e) => {
    state.currentPlayer = 0
    updatePlayerActive()
    consoleAPI.broadcastState(state)
  }
  const nextPlayer = (_e) => {
    state.currentPlayer += 1
    if (state.currentPlayer >= state.players.length) {
      state.currentPlayer = 0
    }
    updatePlayerActive()
    consoleAPI.broadcastState(state)
    
  }
  const previousPlayer = (_e) => {
    state.currentPlayer -= 1
    if (state.currentPlayer <= 0) {
      state.currentPlayer = state.players.length - 1
    }
    updatePlayerActive()
    consoleAPI.broadcastState(state)
  }
  const endInitiative = (_e) => {
    state.currentPlayer = null
    updatePlayerActive()
    consoleAPI.broadcastState(state)
  }

  const toggleVisibility = (_e) => {
    state = {
      ...state,
      initiativeVisible: !state.initiativeVisible
    }
    consoleAPI.broadcastState(state)
  }
</script>
<style>
  .display {
    max-width: fit-content;
  }
</style>

<button class="btn btn-primary" on:click={openPresenter}>
  <i class="fa-solid fa-arrow-up-right-from-square"></i>&nbsp;Open Presenter
</button>
<button class="btn btn-primary" on:click={setSate}>
  <i class="fa-solid fa-rotate-right"></i>&nbsp;Set Default
</button>
<button class="btn btn-primary" on:click={toggleSortable}>
  {#if sortable}
    <i class="fa-solid fa-arrow-down-wide-short"></i>&nbsp;Disable Sortable
  {:else}
    <i class="fa-solid fa-arrow-down-wide-short"></i>&nbsp;Make Sortable
  {/if}
</button>
<button class="btn btn-primary" on:click={toggleVisibility}>
  {#if state.initiativeVisible}
    <i class="fa-solid fa-eye-slash"></i>&nbsp;Hide
  {:else}
    <i class="fa-solid fa-eye"></i>&nbsp;Show
  {/if}
</button><br/>
<button class="btn btn-success" on:click={addPlayer('player')}>
  <i class="fa-regular fa-square-plus"></i>&nbsp;Add Player
</button>
<button class="btn btn-info" on:click={addPlayer('npc')}>
  <i class="fa-regular fa-square-plus"></i>&nbsp;Add NPC
</button>
<button class="btn btn-danger" on:click={addPlayer('monster')}>
  <i class="fa-regular fa-square-plus"></i>&nbsp;Add Monster
</button>
<button class="btn btn-danger" on:click={clearMonsters}>
  <i class="fa-solid fa-square-xmark"></i>&nbsp;Clear Monsters
</button><br/>
<button class="btn btn-primary" on:click={startInitiative}>
  <i class="fa-solid fa-play"></i>&nbsp;Start
</button>
<button class="btn btn-primary" on:click={nextPlayer}>
  <i class="fa-solid fa-arrow-down-long"></i>&nbsp;Next
</button>
<button class="btn btn-primary" on:click={previousPlayer}>
  <i class="fa-solid fa-arrow-up-long"></i>&nbsp;Previous
</button>
<button class="btn btn-primary" on:click={endInitiative}>
  <i class="fa-solid fa-hand"></i>&nbsp;End
</button>
<div class="display">
  <PlayerList players={state.players} on:update={playersChange} sortable={sortable} initiative={false} />
</div>
