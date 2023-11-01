<script>
  //based on https://svelte.dev/repl/29c1026dda3c47a187bd21afa0782df1?version=3.31.2
  import { createEventDispatcher, onMount } from 'svelte'

  export let value, required = true, editable = false

  const dispatch = createEventDispatcher()
  let editing = false, original, width

  onMount(() => {
    original = value
  })

  function edit(e) {
    width = e.target.offsetWidth + 5
    if(!editable) return
    editing = true
  }

  function submit() {
		if (value != original) {
      original = value
			dispatch('submit', value)
		}
		
    editing = false
  }

  function keydown(event) {
    if (event.key == 'Escape') {
      event.preventDefault()
      value = original
      editing = false
    }
  }
	
	function focus(element) {
		element.focus()
	}
</script>

{#if editable && editing}
  <form on:submit|preventDefault={submit}>
    <input bind:value on:blur={submit} {required} use:focus style="max-width: {width}px"/>
  </form>
{:else}
  <span on:click={edit} on:keydown={keydown} role="button" aria-label="edit" tabindex="-1">
    {value}
  </span>
{/if}

<style>
  form {
    display: inline-block;
    max-width: fit-content;
  }
  input {
    max-width: fit-content;
    border: none;
    background: none;
    font-size: inherit;
    color: inherit;
    font-weight: inherit;
    text-align: inherit;
    box-shadow: none;
  }
</style>
