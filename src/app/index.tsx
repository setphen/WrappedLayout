import { render, h, Component } from 'preact';

import Logo from './assets/logo.svg';
import ColSpacing from './assets/col-spacing.svg';
import RowSpacing from './assets/row-spacing.svg';

import './style.scss';

const select = e => e.target.select();

const validate = n => {
  let v = parseInt(n)
  if (isNaN(v) || v < 0) return "0";
  return n;
}

class App extends Component {

  state = { rowGap: "10", colGap: "10" }

  handleMessage = e => {
    let msg = e.data.pluginMessage;
    this.setState({ colGap: msg.colGap, rowGap: msg.rowGap });
  }

  componentDidMount() {
    window.addEventListener('message', this.handleMessage)
  }

  onColInput = e => {
    let v = validate(e.target.value)
    this.setState({ colGap: v });
  }

  onRowInput = e => {
    let v = validate(e.target.value)
    this.setState({ rowGap: v });
  }

  render() {
    return (
      <div>

        <p className="section-title">
          Wrapped Layout
        </p>

        <div className="input-row">
          <div className="input">
            <img src={ ColSpacing } alt="" />
            <input type="number" id="colGap" value={ this.state.colGap } min="0" onFocus={ select } onChange={ this.onColInput }/>
          </div>
          <div className="input">
            <img src={ RowSpacing } alt="" />
            <input type="number" id="rowGap" value={ this.state.rowGap } min="0" onFocus={ select } onChange={ this.onRowInput }/>
          </div>
        </div>

        <button onClick={ e => parent.postMessage({ pluginMessage: { type: 'apply-layout', ...this.state } }, '*') }>
          Apply Layout
        </button>
      </div>
    );
  }
}

window.onload = function() {
  render(<App />, document.getElementById("app"));
}
