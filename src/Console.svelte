<script>
  const openPresenter = consoleAPI.openPresenter
  const brodcastState = () => {
    consoleAPI.broadcastState({
      players: [{
        name: 'Player 1',
        initiative: 1,
      },{
        name: 'Player 2',
        initiative: 2,
      }, {
        name: 'Player 3',
        initiative: 3,
      }]
    })
  }
</script>

<main>
  <h1>Vite + Svelte</h1>

  <div class="card">
    <button on:click={openPresenter}>
      Open Presenter
    </button>
    <button on:click={brodcastState}>
      Set State
    </button>
  </div>
</main>

<style>
</style>
