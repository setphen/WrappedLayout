import { getBoundingRect } from '@figma-plugin/helpers';

figma.showUI(__html__, { width: 236, height: 150 });

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
  if (msg.type === 'apply-layout') {

    // Store row and column gap values
    let rowGap = parseInt(msg.rowGap)
    let colGap = parseInt(msg.colGap)

    let selection = figma.currentPage.selection

    if (selection.length === 0) {
      figma.notify("Make a selection to apply the layout to")
    } else if (selection.length === 1 && selection[0].type === "FRAME") {
      // Apply a layout to the children of one frame node
      let frame = selection[0]

      applyLayout(frame, rowGap, colGap)
    } else {

      // check that all objects have the same parent
      let idealParent = selection[0].parent
      if (!selection.every(n => n.parent === idealParent)) {
        figma.notify("All selected items must have the same parent node.")
        return
      }

      // Wrap a selection of one (non-frame node) or multiple nodes (any type)
      // in a wrapped layout frame!

      let frame = figma.createFrame()
      frame.fills = []
      frame.clipsContent = false

      idealParent.appendChild(frame)

      frame.x = selection.reduce((prev, curr) => prev.x < curr.x ? prev : curr).x
      frame.y = selection.reduce((prev, curr) => prev.y < curr.y ? prev : curr).y

      let baseWidth = getBoundingRect(selection).width
      frame.resizeWithoutConstraints(baseWidth, frame.height)

      selection.forEach(n => frame.appendChild(n))

      applyLayout(frame, rowGap, colGap)
    }
  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  // figma.closePlugin();
};


// Apply layout

function applyLayout(frame, rowGap, colGap) {
  if (frame.children.length === 0) {
    figma.notify("Frame must have children to apply a layout")
    return
  }

  frame.layoutMode = "NONE"
  let children = frame.children.slice()

  children.sort(sortXY)

  let placedChildren = []

  let maxWidth = frame.width

  // These are the "cursor" values, for placing the content
  let x = 0
  let y = 0

  let placeChild = (children) => {
    //place first child
    let child = children.shift()

    placedChildren.push(child)

    let rect = getBoundingRect([child])

    child.x = x + (child.absoluteTransform[0][2] - rect.x)
    child.y = y + (child.absoluteTransform[1][2] - rect.y)

    x = x + rect.width + colGap
  }

  while(children.length > 0) {

    //place first child
    placeChild(children)

    //continue placing children
    while(children.length > 0 &&  x + children[0].width <= maxWidth) {
      placeChild(children)
    }

    // move back to the lefthand side
    x = 0

    // new y is total height of all placed children, plus a gap
    y = getBoundingRect(placedChildren).height + rowGap
  }

  frame.resizeWithoutConstraints(frame.width, getBoundingRect(placedChildren).height)

  figma.currentPage.selection = [frame]
}

// Utils

// Sort objects by Y coord, then X coord
function sortXY(ob1,ob2) {
    if (ob1.y > ob2.y) {
        return 1;
    } else if (ob1.y < ob2.y) {
        return -1;
    }

    // Else go to the 2nd item
    if (ob1.x < ob2.x) {
        return -1;
    } else if (ob1.x > ob2.x) {
        return 1
    } else { // nothing to split them
        return 0;
    }
}
