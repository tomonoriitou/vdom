//
const commentX = /\/\*[\s\S]*?\*\//g
const lineAttrX = /([^\:]+):([^\;]*);/
const altX = /(\/\*[\s\S]*?\*\/)|([^\s\;\{\}][^\;\{\}]*(?=\{))|(\})|([^\;\{\}]+\;(?!\s*\*\/))/gmi

// Capture groups
const capSelector = 2
const capEnd = 3
const capAttr = 4

//
const isEmpty = (x: any) => {
  return typeof x === 'undefined' || x.length === 0 || x == null
}

//
const isCssJson = (node: any) => {
  return !isEmpty(node) ? (node.attributes && node.children) : false
}

//
const strAttr = (name: string, value: string, depth: number) => {
  return name + ': ' + value + ';\n'
}

//
const strNode = (name: string, value: string, depth: number) => {
  let cssString = name + ' {\n'
  cssString += toCSS(value, depth + 1)
  cssString += '}\n'
  return cssString
}

//
export const toJSON = (cssString: string) => {
  //
  const node: any = {
    children: {},
    attributes: {}
  }
  let count = 0

  //
  cssString = cssString.replace(commentX, '')

  for (; ;) {
    //
    const match = altX.exec(cssString)
    if (!match) {
      break
    }
    if (!isEmpty(match[capSelector])) {
      //
      const name = match[capSelector].trim()
      const newNode = toJSON(cssString)
      //
      const bits = [name]
      for (const bit of bits) {
        const sel = bit.trim()
        if (sel in node.children) {
          for (const att in newNode.attributes) {// tslint:disable-line: forin
            node.children[sel].attributes[att] = newNode.attributes[att]
          }
        } else {
          node.children[sel] = newNode
        }
      }
      //
    } else if (!isEmpty(match[capEnd])) {
      // Node has finished
      return node
    } else if (!isEmpty(match[capAttr])) {
      const line = match[capAttr].trim()
      const attr = lineAttrX.exec(line)
      if (attr) {
        // Attribute
        const name = attr[1].trim()
        const value = attr[2].trim()
        if (name in node.attributes) {
          const currVal = node.attributes[name]
          if (!(currVal instanceof Array)) {
            node.attributes[name] = [currVal]
          }
          node.attributes[name].push(value)
        } else {
          node.attributes[name] = value
        }
      } else {
        node[count++] = line
      }
    }
  }
  //
  return node
}
//
export const toCSS = (node: any, depth?: any, breaks?: any) => {
  //
  let cssString = ''
  if (typeof depth === 'undefined') {
    depth = 0
  }
  if (typeof breaks === 'undefined') {
    breaks = false
  }
  //
  if (node.attributes) {
    for (const i in node.attributes) {// tslint:disable-line: forin
      const att = node.attributes[i]
      if (att instanceof Array) {
        for (const at of att) {
          cssString += strAttr(i, at, depth)
        }
      } else {
        cssString += strAttr(i, att, depth)
      }
    }
  }
  if (node.children) {
    let first = true
    for (const i in node.children) {// tslint:disable-line: forin
      if (breaks && !first) {
        cssString += '\n'
      } else {
        first = false
      }
      cssString += strNode(i, node.children[i], depth)
    }
  }
  return cssString
}
//
export const toHEAD = (data: string) => {
  //
  const head = document.getElementsByTagName('head')[0]
  //
  if (isEmpty(data) || !(head instanceof HTMLHeadElement)) {
    return
  }

  //
  if (isCssJson(data)) {
    data = toCSS(data)
  }

  const node: any = document.createElement('style')
  node.type = 'text/css'
  //
  if (node.styleSheet) {
    node.styleSheet.cssText = data
  } else {
    node.appendChild(document.createTextNode(data))
  }
  //
  head.appendChild(node)
  //
  return node
  //
}

