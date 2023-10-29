import 'bootstrap/dist/css/bootstrap.css'
import './presenter.css'
import Presenter from './Presenter.svelte'

const presenter = new Presenter({
  target: document.getElementById('app')
})

export default presenter
