import { render, h } from 'preact';
import Logo from './assets/logo.svg';

const app = (
    <div id="foo">
      <img src={ Logo } />

      <p><label>Column Gap:</label> <input type="number" id="colGap" value="10" min="0" /></p>
      <p><label>Row Gap:</label>    <input type="number" id="rowGap" value="10" min="0" /></p>

      <button onClick={ e => parent.postMessage({ pluginMessage: { type: 'apply-layout', rowGap: 10, colGap: 10 } }, '*') }>
        Apply Layout
      </button>
    </div>
)

window.onload = function() {
  render(app, document.getElementById("app"));
}
