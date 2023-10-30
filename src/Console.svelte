<script>
  import { onMount } from "svelte";
  import PlayerList from "./components/PlayerList.svelte";
  import { toTitleCase } from "./utils"

  const openPresenter = consoleAPI.openPresenter
  let state = {}, sortable = false, newCampaignName

  const loadState = async () => {
    state = await consoleAPI.getState()
    let changed = false
    if (state.currentCampaign == null) {
      state.currentCampaign = "default"
      state.campaigns = [state.currentCampaign]
      changed = true
    }
    if (state[state.currentCampaign] == null) {
      state[state.currentCampaign] = defaultCampaing()
      changed = true
    }
    if (changed) broadcastState()
  }
  const defaultCampaing = () => ({
    players: [
      {
        id: crypto.randomUUID(),
        name: "Player 1",
        initiative: 3
      },{
        id: crypto.randomUUID(),
        name: "Player 2",
        initiative: 2
      },{
        id: crypto.randomUUID(),
        name: "Player 3",
        initiative: 1
      }
    ]
  })
  onMount(() => loadState())
  const setSate = () => {
    state = {
      ...state,
      [state.currentCampaign]: defaultCampaing()
    }
    broadcastState()
  }
  const playersChange = (e) => {
    state = {
      ...state,
      [state.currentCampaign]: {
        ...state[state.currentCampaign],
        players: e.detail 
      }
    }
    sortList(null)
    broadcastState()
  }
  const toggleSortable = (_e) => {
    sortable = !sortable
  }
  const sortList = (_e) => {
    state = {
      ...state,
      [state.currentCampaign]: {
        ...state[state.currentCampaign],
        players: state[state.currentCampaign].players.sort((a, b) => Number(b.initiative) - Number(a.initiative)) 
      }
    }
    broadcastState()
  }

  const addCampaign = (_el) => {
    state = {
      ...state,
      currentCampaign: newCampaignName,
      campaigns: [...state.campaigns, newCampaignName],
      [newCampaignName]: defaultCampaing()
    }
    newCampaignName = undefined
    broadcastState()
  }
  const addPlayer = (kind) =>((_e) => {
    state = {
      ...state,
      [state.currentCampaign]: {
        ...state[state.currentCampaign],
        players: [
          ...state[state.currentCampaign].players,
          {
            id: crypto.randomUUID(),
            name: `New ${toTitleCase(kind)}`,
            initiative: 0,
            kind
          }
        ]
      }
    }
  })
  const clearMonsters = (_e) => {
    state = {
      ...state,
      [state.currentCampaign]: {
        ...state[state.currentCampaign],
        players: state[state.currentCampaign].players.filter(p => p.kind !== 'monster')
      }
    }
    broadcastState()
  }
  const updatePlayerActive = () => {
    state = {
      ...state,
      [state.currentCampaign]: {
        ...state[state.currentCampaign],
        players: state[state.currentCampaign].players.map((p, i) => {
          if (i === state.currentPlayer) {
            p.active = true
          } else {
            p.active = false
          }
          return p
        })
      }
    }
  }
  const startInitiative = (_e) => {
    state.currentPlayer = 0
    updatePlayerActive()
    broadcastState()
  }
  const nextPlayer = (_e) => {
    state.currentPlayer += 1
    if (state.currentPlayer >= state.players.length) {
      state.currentPlayer = 0
    }
    updatePlayerActive()
    broadcastState()
    
  }
  const previousPlayer = (_e) => {
    state.currentPlayer -= 1
    if (state.currentPlayer <= 0) {
      state.currentPlayer = state.players.length - 1
    }
    updatePlayerActive()
    broadcastState()
  }
  const endInitiative = (_e) => {
    state.currentPlayer = null
    updatePlayerActive()
    broadcastState()
  }

  const toggleVisibility = (_e) => {
    state = {
      ...state,
      initiativeVisible: !state.initiativeVisible
    }
    broadcastState()
  }
  const broadcastState = () => consoleAPI.broadcastState(state)
</script>
<style>
  .display {
    max-width: fit-content;
  }
  select.form-control {
    max-width: fit-content;
    display: inline-block;
  }
  input.form-control {
    max-width: 150px;
    display: inline-block;
  }
  button.btn {
    margin-bottom: 5px;
  }
</style>
Campaign:&nbsp;
<select class="form-control" bind:value={state.currentCampaign} on:change={broadcastState}>
  {#each state.campaigns || [] as campaign}
    <option value={campaign}>{toTitleCase(campaign)}</option>
  {/each}
</select>
<input placeholder="Name" type="text" class="form-control" bind:value={newCampaignName} disabled={state.currentCampaign == null || state.currentCampaign.length < 1}/>
<button class="btn btn-success" on:click={addCampaign}>
  <i class="fa-regular fa-square-plus"></i>&nbsp;Add Campaign
</button>
<br/>
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
  <PlayerList players={state[state.currentCampaign] && state[state.currentCampaign].players} on:update={playersChange} sortable={sortable} initiative={false} />
</div>
