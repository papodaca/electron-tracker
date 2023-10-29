<script>
  export let players = []
  export let initiative = true
</script>

<div class="list-group {initiative ? 'initiative-list' : ''}">
  {#each players as player}
  <div class="list-group-item list-group-item-action {player['active'] ? 'active' : ''}">
    <div class="text"><span class="initiative">{player['initiative']}</span> - <span class="name">{player['name']}</span></div>
  </div>
  {/each}
</div>

<style>
.list-group.initiative-list .list-group-item {
  opacity: 0.8;
  transition: opacity 0.2s;
}

.list-group.initiative-list .list-group-item div.text {
  opacity: 0.9;
  background-color: var(--bs-body-bg);
}
.list-group.initiative-list .list-group-item.active div.text {
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
