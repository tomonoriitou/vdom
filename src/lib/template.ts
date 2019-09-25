import VDom from './VDom'
import {VDomItem} from './VDomItem'
import {consoleError, consoleWarn, consoleDebug} from './console'

//
export const ELEMENT_NODE = 1
export const TEXT_NODE = 3
export const COMMENT_NODE = 8
//
export const V_TEMPLATE_NODE = 1000
export const V_TEXT_NODE = 1001
export const V_FOR_NODE = 1002
export const V_COMPONENT_NODE = 1003
export const V_HTML_NODE = 1004
export const V_SLOT_NODE = 1005
export const V_COMPONENT_IS_NODE = 1006

/*
export const replaceElement = (newItem: Node, oldItem: Node): void => {
  if(oldItem.parentNode){
    oldItem.parentNode.replaceChild(newItem, oldItem)
  }
}
*/

//
export const insertAfter = (newItem: Node, target: Node): Node => {
  /* istanbul ignore next */
  if(!target.parentNode){
    consoleDebug('VDomItem invalid insertAfter')
    return newItem
  }
  if(newItem !== target.nextSibling){
    target.parentNode.insertBefore(newItem, target.nextSibling)
  }
  return newItem
}

//
export const removeElement = (element: Node): void => {
  if(!element.parentNode){
    // consoleDebug('VDomItem already removeChild')
    return
  }
  element.parentNode.removeChild(element)
}

//
export const parseElementAttributes = (attrs: NamedNodeMap): {[key:string]: string} => {
  //
  const result: {[key:string]: string} = {}
  for (let i = 0; i < attrs.length; i++) { // tslint:disable-line prefer-for-of
    const attr = attrs[i]
    // if(attr.name){
    // }
    if(attr.nodeValue){
      result[attr.name] = attr.nodeValue
    }else{
      result[attr.name] = ''
    }
  }
  return result
  //
}

//
export const readTemplate = (vDom: VDom, template: string, $document: Document, componentModules: any): VDomItem | undefined => {

  //
  const parseElementNode = (node: Element/*, parent?: VDomItem*/): VDomItem => {

    // read attrbutes
    const attributes = parseElementAttributes(node.attributes)

    //
    let targetChildNode: NodeListOf<ChildNode> = node.childNodes
    let nodeType = ELEMENT_NODE

    // transition node
    if((node as Element).tagName === 'TRANSITION'){
      nodeType = V_TEMPLATE_NODE
    }

    // template node
    if((node as Element).tagName === 'TEMPLATE'){
      // DocumentFragment
      if ('content' in (node as any)) {
        targetChildNode = (node as any).content.childNodes
      }
      nodeType = V_TEMPLATE_NODE
    }

    // slot node
    if((node as Element).tagName === 'SLOT'){
      nodeType = V_SLOT_NODE
    }

    // v-text node
    if(attributes && attributes['v-text']){
      const vdValueItem = new VDomItem({
        rawNode: node,
        vDom,
        nodeType: V_TEXT_NODE,
        tagName: 'v-text',
        attributes: {'v-text': attributes['v-text']},
        //////////////////parent
      })
      return vdValueItem
    }

    // v-html node
    if(attributes && attributes['v-html']){
      const vdHtmlItem = new VDomItem({
        rawNode: node,
        vDom,
        nodeType: V_HTML_NODE,
        tagName: 'v-html',
        attributes: {'v-html': attributes['v-html']},
        ///////////////////////parent
      })
      return vdHtmlItem
    }

    // component node
    if((node as Element).tagName === 'COMPONENT'){
      //
      const vdComponentItem = new VDomItem({
        rawNode: node,
        vDom,
        nodeType: V_COMPONENT_IS_NODE,
        tagName: node.tagName,
        attributes,
        ////////////////////////parent,
      })
      // read slot
      vdComponentItem.children =  readTemplateSub(node.childNodes/*, vdComponentItem*/)
      return vdComponentItem
      //
    }

    // component node
    if(componentModules){
      let vComponent
      for(const key in componentModules){ // tslint:disable-line forin
        if(node.tagName.toLowerCase() === key.toLowerCase()){
          //
          vComponent = new VDomItem({
            rawNode: node,
            vDom,
            nodeType: V_COMPONENT_NODE,
            tagName: node.tagName,
            attributes,
            vComponent: componentModules[key],
            ///////////////////////parent,
          })
          // read slot
          vComponent.children =  readTemplateSub(node.childNodes/*, vComponent*/)
          break
          //
        }
      }
      if(vComponent){
        return vComponent
      }
    }

    // element or template node
    const vdElementItem = new VDomItem({
      rawNode: node,
      vDom,
      nodeType,
      tagName: node.tagName,
      attributes,
      /////////////////////////parent
    })
    vdElementItem.children =  readTemplateSub(targetChildNode/*, vdElementItem*/)
    return vdElementItem

  }

  //
  const readTemplateSub = (nodes: NodeListOf<ChildNode>/*, parent?: VDomItem*/): VDomItem[] => {
    //
    const subResult: VDomItem[] = []

    for (let i = 0; i < nodes.length; i++) {  // tslint:disable-line prefer-for-of
      //
      const node = (nodes[i] as Element)
      //
      switch(node.nodeType){
        case ELEMENT_NODE:{
          //
          const tgtEleVDomItem = parseElementNode(node/*, parent*/)

          // vFor element
          if(tgtEleVDomItem.attributes['v-for']){
            //
            const vForAttr = Object.assign({}, tgtEleVDomItem.attributes)
            //
            const vForItemParent = new VDomItem({
              rawNode: node,
              vDom,
              nodeType: V_FOR_NODE,
              tagName: 'v-for',
              attributes: vForAttr,
              ////////////////////////////parent
            })
            vForItemParent.vForVDomItem = parseElementNode(node/*, vForItemParent*/)
            delete vForItemParent.vForVDomItem.attributes['v-for']
            delete vForItemParent.vForVDomItem.attributes['ref']
            delete vForItemParent.vForVDomItem.attributes[':ref']
            //
            subResult.push(vForItemParent)
            //
            break
            //
          }

          // normal elements
          subResult.push(tgtEleVDomItem)

          //
        }break
        case TEXT_NODE:{
          //
          /* istanbul ignore next */
          if(!node.nodeValue){
            consoleDebug('INVALID nodeValue', node)
            break
          }

          const delimiters = (vDom.constructor as any).delimiters || ['{{','}}']
          //
          if(node.nodeValue.indexOf(delimiters[0]) < 0){
            //
            const vdItem = new VDomItem({
              rawNode: node,
              vDom,
              nodeType: TEXT_NODE,
              nodeValue: node.nodeValue,
              //////////////////////////parent
            })
            subResult.push(vdItem)
            //
          }else{
            //
            let vValueParam = `''`

            //
            const escapeChars = (str: string) => {
              return str
              .replace(/\t/g, '\\t')
              .replace(/\r/g, '\\r')
              .replace(/\n/g, '\\n')
              .replace(/'/g, `\\'`)
            }

            //
            const vTags = node.nodeValue.split(delimiters[0])
            for(const tag of vTags){
              //
              const closeTagPos = tag.lastIndexOf(delimiters[1])
              if(closeTagPos >= 0){
                // split v-text & after text
                const vValue = tag.substr(0, closeTagPos)
                const afterText = tag.substr(closeTagPos + 2)
                //
                vValueParam += `+ (${vValue}) + '${escapeChars(afterText)}'`
                //
              }else{
                // pure text node
                vValueParam += `+ '${escapeChars(tag)}'`
                //
              }
            }
            //
            const vdItem = new VDomItem({
              rawNode: node,
              vDom,
              nodeType: V_TEXT_NODE,
              tagName: 'v-text',
              attributes: {'v-text': vValueParam},
              ////////////////////////////parent
            })
            subResult.push(vdItem)
            //
          }
          //
        }break
        case COMMENT_NODE:{
          //
          if((vDom.constructor as any).comments === false){
            break
          }
          //
          /* istanbul ignore next */
          if(!node.nodeValue){
            consoleDebug('INVALID nodeValue', node)
            break
          }

          // ignore comment node
          if(node.nodeValue.substr(0, 1) === '-'){
            // ignore
            break
          }

          //
          const vdItem = new VDomItem({
            rawNode: node,
            vDom,
            nodeType: COMMENT_NODE,
            nodeValue: node.nodeValue,
            ////////////////////////parent
          })
          subResult.push(vdItem)
          //
        }break
        /* istanbul ignore next */
        default:{
          consoleDebug('UNSUPPORTED NODE TYPE', node)
        }break
      }
    }
    //
    return subResult
    //
  }

  //
  const workEle = $document.createElement('div')
  workEle.innerHTML = template
  //
  let targetDom
  let domCount = 0
  for(let i = 0; i < workEle.childNodes.length; i++){ // tslint:disable-line prefer-for-of
    const tgtEle = workEle.childNodes[i]
    if(tgtEle.nodeType !== ELEMENT_NODE){
      continue
    }
    if(targetDom === undefined){
      targetDom = i
    }
    ++domCount
  }
  //
  if(domCount === 0 || targetDom === undefined){
    consoleError(`VDom no element in template. ${template}`)
    return
  }
  if(domCount > 1){
    consoleWarn(`VDom too many elements(${domCount}). ${template}`)
  }

  //
  const rootDom: Element = (workEle.childNodes[targetDom] as Element)
  //
  const result = new VDomItem({
    rawNode: rootDom,
    vDom,
    nodeType: ELEMENT_NODE,
    attributes: parseElementAttributes(rootDom.attributes),
    tagName: rootDom.tagName,
  })
  result.children = readTemplateSub(rootDom.childNodes/*, result*/)
  //
  return result
  //
}
