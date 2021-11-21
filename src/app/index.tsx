import { render, h } from 'preact';

import Logo from './assets/logo.svg';
import ColSpacing from './assets/col-spacing.svg';
import RowSpacing from './assets/row-spacing.svg';

import './style.scss';

const select = e => e.target.select();

const validate = e => {
  let t = e.target
  let v = parseInt(t.value)
  if (isNaN(v) || v < 0) t.value = "0"; return
}

const app = (
    <div>

      <p className="section-title">
        Wrapped Layout
      </p>

      <div className="input-row">
        <div className="input">
          <img src={ ColSpacing } alt="" />
          <input type="number" id="colGap" value="10" min="0" onFocus={ select } onChange={ validate }/>
        </div>
        <div className="input">
          <img src={ RowSpacing } alt="" />
          <input type="number" id="rowGap" value="10" min="0" onFocus={ select } onChange={ validate }/>
        </div>
      </div>

      <button onClick={ e => parent.postMessage({ pluginMessage: { type: 'apply-layout', rowGap: 10, colGap: 10 } }, '*') }>
        Apply Layout
      </button>
    </div>
)

window.onload = function() {
  render(app, document.getElementById("app"));
}
