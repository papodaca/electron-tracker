<script>
  import { onMount } from "svelte";
  import PlayerList from "./components/PlayerList.svelte";
  import { toTitleCase } from "./utils"
  import ImageList from "./components/ImageList.svelte";

  const DEFAULT_HEALTH = 10

  const openPresenter = consoleAPI.openPresenter
  let state = {}, sortable = false, newCampaignName

  const loadState = async () => {
    state = await consoleAPI.getState()
    let changed = false
    if (state.dislaySize == null) {
      state.dislaySize = 1.0
      changed = true
    }
    if (state.currentCampaign == null) {
      state.currentCampaign = "default"
      state.campaigns = [state.currentCampaign]
      changed = true
    }
    if (state[state.currentCampaign] == null) {
      state[state.currentCampaign] = defaultCampaing()
      changed = true
    }
    // retrofit old campaings that lack health info
    state.campaigns.forEach((campaign) => {
      state[campaign].players.forEach((player) => {
        if(player.health == null) {
          player.health = DEFAULT_HEALTH
          player.maxHealth = DEFAULT_HEALTH
          changed = true
        }
      })
    })
    console.log("images", state[state.currentCampaign].images)
    if (changed) broadcastState()
  }
  const defaultCampaing = () => ({
    players: [
      {
        id: crypto.randomUUID(),
        name: "Player 1",
        health: DEFAULT_HEALTH,
        maxHealth: DEFAULT_HEALTH,
        initiative: 3
      },{
        id: crypto.randomUUID(),
        name: "Player 2",
        health: DEFAULT_HEALTH,
        maxHealth: DEFAULT_HEALTH,
        initiative: 2
      },{
        id: crypto.randomUUID(),
        name: "Player 3",
        health: DEFAULT_HEALTH,
        maxHealth: DEFAULT_HEALTH,
        initiative: 1
      }
    ],
    images: []
  })
  onMount(() => loadState())
  const setSate = () => {
    updateCampaign(defaultCampaing())
  }
  const playersChange = (e) => {
    updateCampaign({
      players: e.detail
    }, false)
    sortList()
    broadcastState()
  }
  const toggleSortable = (_e) => {
    sortable = !sortable
  }
  const sortList = () => {
    updateCampaign({
      players: state[state.currentCampaign].players.sort((a, b) => Number(b.initiative) - Number(a.initiative))
    })
  }

  const addCampaign = (_el) => {
    state = {
      ...state,
      campaigns: [...state.campaigns, newCampaignName],
      [newCampaignName]: defaultCampaing()
    }
    newCampaignName = undefined
  }
  const addPlayer = (kind) =>((_e) => {
    updateCampaign({
      players: [
        ...state[state.currentCampaign].players,
        {
          id: crypto.randomUUID(),
          name: `New ${toTitleCase(kind)}`,
          initiative: 0,
          health: DEFAULT_HEALTH,
          maxHealth: DEFAULT_HEALTH,
          kind
        }
      ]
    }, false)
  })
  const clearMonsters = (_e) => {
    updateCampaign({
      players: state[state.currentCampaign].players.filter(p => p.kind !== 'monster')
    })
  }
  const updatePlayerActive = () => {
    updateCampaign({
      players: state[state.currentCampaign].players.map((p, i) => {
          if (i === state[state.currentCampaign].currentPlayer) {
            p.active = true
          } else {
            p.active = false
          }
          return p
        })
    })
  }
  const startInitiative = (_e) => {
    state[state.currentCampaign].currentPlayer = 0
    updatePlayerActive()
    broadcastState()
  }
  const nextPlayer = (_e) => {
    state[state.currentCampaign].currentPlayer += 1
    if (state[state.currentCampaign].currentPlayer >= state[state.currentCampaign].players.length) {
      state[state.currentCampaign].currentPlayer = 0
    }
    updatePlayerActive()
    broadcastState()

  }
  const previousPlayer = (_e) => {
    state[state.currentCampaign].currentPlayer -= 1
    if (state[state.currentCampaign].currentPlayer < 0) {
      state[state.currentCampaign].currentPlayer = state[state.currentCampaign].players.length - 1
    }
    updatePlayerActive()
    broadcastState()
  }
  const endInitiative = (_e) => {
    state[state.currentCampaign].currentPlayer = null
    updatePlayerActive()
    broadcastState()
  }

  const updateCampaign = (data, update = true) => {
    state = {
      ...state,
      [state.currentCampaign]: {
        ...state[state.currentCampaign],
        ...data
      }
    }
    if (update) broadcastState()
  }

  const toggle = (field) => ((_e) => {
    updateCampaign({
      [field]: !state[state.currentCampaign][field]
    })
    broadcastState()
  })
  const broadcastState = () => consoleAPI.broadcastState(state)
  const imagesChange = (e) => {
    updateCampaign({
      images: e.detail
    })
  }
  const initiateRest = (kind) => (() => {
    if (kind === 'long') {
      updateCampaign({
        players: state[state.currentCampaign].players.map(p => {
          if (p.kind === 'player' || p.kind === 'npc') p.health = p.maxHealth
          return p
        })
      })
    }
  })
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
<input placeholder="Name" type="text" class="form-control" bind:value={newCampaignName}/>
<button class="btn btn-success" on:click={addCampaign} disabled={newCampaignName == null || newCampaignName.length < 1}>
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
<button class="btn btn-primary" on:click={toggle('initiativeVisible')}>
  {#if state[state.currentCampaign] && state[state.currentCampaign].initiativeVisible}
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
</button><br/>
<button class="btn btn-primary" on:click={toggle('initiativeVisible')}>
  {#if state[state.currentCampaign] && state[state.currentCampaign].initiativeVisible}
    <i class="fa-solid fa-eye-slash"></i>
  {:else}
    <i class="fa-solid fa-eye"></i>
  {/if}&nbsp;Initiative
</button>
<button class="btn btn-primary" on:click={toggle('healthVisible')}>
  {#if state[state.currentCampaign] && state[state.currentCampaign].healthVisible}
    <i class="fa-solid fa-eye-slash"></i>
  {:else}
    <i class="fa-solid fa-eye"></i>
  {/if}&nbsp;Enemy Health
</button>
<button class="btn btn-primary" on:click={toggle('enemyHealthVisible')}>
  {#if state[state.currentCampaign] && state[state.currentCampaign].enemyHealthVisible}
    <i class="fa-solid fa-eye-slash"></i>
  {:else}
    <i class="fa-solid fa-eye"></i>
  {/if}&nbsp;Player Health
</button>
<button class="btn btn-primary" on:click={initiateRest('long')}>
  <i class="fa-solid fa-bed"></i>&nbsp;Long Rest
</button><br/>
Dsiplay Size: <input type="range" min="1" max="5" step="0.1" bind:value={state.dislaySize} on:change={broadcastState} />&nbsp;{state.dislaySize}
<div class="display">
  <PlayerList
    players={state[state.currentCampaign] && state[state.currentCampaign].players}
    on:update={playersChange}
    sortable={sortable}
    initiative={false}
    healthVisible={true}
    enemyHealthVisible={true} />
</div>
<ImageList
  images={state[state.currentCampaign] && state[state.currentCampaign].images}
  on:update={imagesChange} />
