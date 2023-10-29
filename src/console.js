import './app.css'
import Console from './Console.svelte'

const console = new Console({
  target: document.getElementById('app')
})

export default console
