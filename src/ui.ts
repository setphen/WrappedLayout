window.onload = function() {
  document.getElementById('create').onclick = () => {
    let rowGap = (<HTMLInputElement>document.getElementById("rowGap")).value
    let colGap = (<HTMLInputElement>document.getElementById("colGap")).value
    parent.postMessage({ pluginMessage: { type: 'apply-layout', rowGap, colGap } }, '*')
  }
}
