import 'bootstrap/dist/css/bootstrap.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './console.css'
import Console from './Console.svelte'

const console = new Console({
  target: document.getElementById('app')
})

export default console
