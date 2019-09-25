import vid from './vid'
import VDom from './VDom'
import VDomComponent from './VDomComponent'
import { consoleError, consoleWarn, consoleTrace, consoleDebug, consoleLog } from './console'
import { CALL_NONE, CALL_EVENT_HANDLER, CALL_FUNCS } from './ReactiveVars'
import {
  insertAfter, removeElement/*, replaceElement*/,
  ELEMENT_NODE, TEXT_NODE, COMMENT_NODE,
  V_TEMPLATE_NODE, V_TEXT_NODE, V_FOR_NODE, V_COMPONENT_NODE, V_HTML_NODE, V_SLOT_NODE,
  V_COMPONENT_IS_NODE
} from './template'
import Transition from './transition'
import {addListener, removeListener, /*isEqualListener, */ListenEventInfo} from './eventListener'
import LRU from './lru'
import {debugOption} from './decorator'
import {equal, dcopy} from './deep'

//
let OUTPUT_NODEID = false
const $INDEX_KEY = '$index'

//
const excludeAttributesEx = [
  /^v-if(|\..+)$/,
  /^v-else(|\..+)$/,
  // /^v-else-if(|\..+)$/,
  /^v-for(|\..+)$/,
  /^v-text(|\..+)$/,
  /^v-html(|\..+)$/,
  /^v-model(|\..+)$/,
  /^v-show(|\..+)$/,
  /^v-style(|\..+)$/,
  /^v-once(|\..+)$/,
  /^v-pre(|\..+)$/,
  /^ref(|\..+)$/,
  /^:key(|\..+)$/,
  /^:is(|\..+)$/,
]

const isExcludeAttribute = (key: string): boolean => {
  for(const testKey of excludeAttributesEx){
    if(testKey.test(key)){
      return true
    }
  }
  return false
}

//
export class VDomItem extends Transition {

  //////////////////////////////////////////////////////////////////////////////

  // node id
  public nodeId: string = vid()

  // raw(template) node
  public rawNode?: Node
  // VDom instance
  public vDom!: VDom
  // parent vDomItem
  public parent?: VDomItem

  // node type
  public nodeType: number = COMMENT_NODE
  // tag name (ELEMENT_NODE)
  public tagName: string = ''
  // attributes (ELEMENT_NODE)
  public attributes: { [key: string]: string } = {}
  // children items (ELEMENT_NODE)
  public children: VDomItem[] = []

  // node value (for TEXT_NODE COMMENT_NODE)
  public nodeValue: string = ''

  // v-for VDomItem
  public vForVDomItem?: VDomItem
  // v-for enderd items
  private vForRenderdItems: { [key: string]: { vDomItem: VDomItem, context: any } } = {}
  // v-for cache items
  private vForCacheItems?: LRU<{ vDomItem: VDomItem, context: any }>
  //
  private vForRenderdContextKeys: string[] = []
  //
  private vForContext: {[key: string]: any} = {}

  // v-component
  public vComponent?: any  // tslint:disable-line member-ordering
  // v-component instance
  private vComponentInstance?: VDomComponent
  // v-for cache items
  private vComponentInstanceCache?: LRU<VDomComponent >

  //////////////////////////////////////////////////////////////////////////////

  // vOutput result
  public directiveFuncCache?: LRU<any>  // tslint:disable-line member-ordering

  //////////////////////////////////////////////////////////////////////////////

  // vOutput result
  public renderd: boolean = false  // tslint:disable-line member-ordering
  // vOutput result
  public vOutput?: boolean  // tslint:disable-line member-ordering
  // transition
  private lazyTransition: boolean= false  // tslint:disable-line member-ordering

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // real dom elements
  private elements: Node[] = []
  // marker element
  private markerElement!: Node
  // marker element inserted
  private markerElementInserted: boolean = false
  // worker element(v-html, v-style)
  private vWorkerElement?: Element

  //////////////////////////////////////////////////////////////////////////////

  // attributes (ELEMENT_NODE)
  private bindAttributes: { [key: string]: string } = {}
  // rebderd attr
  private renderdAttributes: { [key: string]: string } = {}

  //////////////////////////////////////////////////////////////////////////////

  // events (ELEMENT_NODE)
  private bindEvents?: ListenEventInfo[]
  // @['events'] (ELEMENT_NODE)
  private bindEventsEx: { [key: string]: ListenEventInfo} = {}

  //////////////////////////////////////////////////////////////////////////////

  // v-model event mounted event
  private vModelEventsMounted: boolean = false
  // v-model event info
  private vModelEventInfo?: ListenEventInfo

  //////////////////////////////////////////////////////////////////////////////

  // update ?
  private replaceAll: boolean = false

  // un mounted
  private umounted: boolean = false

  // render nodes funs
  private renderNodeFuncs?: any[]

  //////////////////////////////////////////////////////////////////////////////

  // constructor
  constructor(init?: Partial<VDomItem>) {
    super()
    //
    if(debugOption.OUTPUT_NODEID === true){
      OUTPUT_NODEID = true
    }
    //
    if (init) {
      Object.assign(this, init)
    }
    // create Marker
    if (OUTPUT_NODEID) {
      /* istanbul ignore next */
      this.markerElement = this.vDom.$document.createComment(`MARKER - ${this.nodeId} ${this.tagName} ${this.nodeType}`)
    } else {
      this.markerElement = this.vDom.$document.createTextNode('')
    }
    //
    /* istanbul ignore next */
    if (!this.vDom) {
      consoleDebug('INVALID vDom', init)
      return
    }
    //
    /* istanbul ignore next */
    if (!this.markerElement) {
      consoleDebug('INVALID markerElement', init)
      return
    }
    //
  }

  /* istanbul ignore next */
  public Public(key: string){
    const target = (this as any)[key]
    if(target === undefined){
      consoleDebug(`VDomItem '${key}' member/method is not implemented`)
    }
    if(typeof target === 'function'){
      return target.bind(this)
    }
    return target
  }
  //

  //////////////////////////////////////////////////////////////////////////////

  // copy for v-for
  public clone(): VDomItem {
    //
    const result = new VDomItem({
      vDom: this.vDom,
      rawNode: this.rawNode,
      nodeType: this.nodeType,
      tagName: this.tagName,
      nodeValue: this.nodeValue,
      attributes: this.attributes,
      vForVDomItem: this.vForVDomItem,
      vComponent: this.vComponent,
      parent: this.parent,
    })
    //
    for (const child of this.children) {
      result.children.push(child.clone())
    }
    //
    return result
    //
  }

  // umount all
  public destroy(): void {

    // transition
    this.umountTransition()

    // v-model
    if(this.vModelEventInfo !== undefined){
      removeListener(this.vModelEventInfo)
      this.vModelEventInfo = undefined
    }

    // @['event]
    for (const evKey in this.bindEventsEx) {  // tslint:disable forin
      removeListener(this.bindEventsEx[evKey])
    }
    this.bindEventsEx = {}

    // @event
    if(this.bindEvents){
      for (const evInfo of this.bindEvents) {  // tslint:disable forin
        removeListener(evInfo)
      }
      this.bindEvents = undefined
    }

    // v-for items
    for (const renderdKey in this.vForRenderdItems) {  // tslint:disable-line forin
      this.vForRenderdItems[renderdKey].vDomItem.destroy()
    }
    this.vForRenderdItems = {}

    // remove v-model
    if (this.vComponentInstance) {
      this.vComponentInstance.$destroy()
    }
    this.vComponentInstance = undefined

    // remove marker
    if (this.markerElement) {
      removeElement(this.markerElement)
    }

    // remove worker
    if (this.vWorkerElement) {
      removeElement(this.vWorkerElement)
    }
    this.vWorkerElement = undefined

    // remove elements
    for (const ele of this.elements) {
      removeElement(ele)
    }
    this.elements = []

    // children
    for (const child of this.children) {
      child.destroy()
    }
    this.children = []

    //
    this.vDom.$reactiveVars.umountNodeId(this.nodeId)
    //
  }

  // umount
  public umount(): void {
    // remove elements
    for (const ele of this.elements) {
      removeElement(ele)
    }
    this.umounted = true
    //
  }

  // remount
  public remount(): void {
    //
    if(!this.umounted){
      return
    }
    this.umounted = false
    // mount elements
    let boforeInsertPos = this.markerElement
    for (const ele of this.elements) {
      boforeInsertPos = insertAfter(ele, boforeInsertPos)
    }
    //
  }

  //////////////////////////////////////////////////////////////////////////////

  // render entry point
  public render(startEle: Node, vPrevDomItem: VDomItem | null, forceUpdate: boolean): Node[] {
    //
    if (!this.markerElementInserted) {
      this.renderMarker(startEle)
    }
    //
    const result = this.renderMain(vPrevDomItem, forceUpdate)
    this.renderd = true
    return result
    //
  }

  // render marker and HTMLElement
  private renderMarker(startEle: Node): Node[] {

    //
    /* istanbul ignore next */
    if (!this.vDom.$componentId) {
      consoleDebug('INVALID vDom.$componentId', this)
      return []
    }

    //
    this.markerElementInserted = true
    insertAfter(this.markerElement, startEle)

    // ELEMENT_NODE
    if (this.nodeType === ELEMENT_NODE) {
      // create element
      let newElement
      if (this.tagName.toLocaleLowerCase() === 'v-style') {
        newElement = this.vDom.$document.createElement('style')
        newElement.type = 'text/css'
      } else {
        newElement = this.vDom.$document.createElement(this.tagName)
      }
      if ((this.vDom.constructor as any).css) {
        newElement.setAttribute(this.vDom.$componentId, '')
      }
      // create render before point
      let renderElementBefore: Node
      if (OUTPUT_NODEID) {
        /* istanbul ignore next */
        renderElementBefore = this.vDom.$document.createComment(` *INSERT MARKER* ${this.nodeId} ${this.tagName} ${this.nodeType}`)
      } else {
        renderElementBefore = this.vDom.$document.createTextNode('')
      }
      newElement.appendChild(renderElementBefore)
      insertAfter(newElement, this.markerElement)

      // children
      for (const child of this.children) {
        child.parent = this
        const elements = child.renderMarker(renderElementBefore)
        for (const ele of elements) {
          renderElementBefore = ele
        }
      }

      // result
      this.elements = [newElement]
      return this.elements
      //
    }

    //
    return [this.markerElement]
  }

  // render main
  private renderMain(vPrevDomItem: VDomItem | null = null, forceUpdate: boolean): Node[] {
    //
    /* istanbul ignore next */
    if (!this.markerElement) {
      consoleDebug('INVALID markerElement', this)
      return []
    }

    if(this.renderd && this.attributes['v-once'] !== undefined){
      return this.elements
    }

    // force update ?
    this.replaceAll = forceUpdate
    // detect update
    const updateKind = this.vDom.$reactiveVars.updatedElements[this.nodeId]
    if (updateKind !== CALL_NONE) {
      this.replaceAll = true
    }
    // clear update flag
    this.vDom.$reactiveVars.updatedElements[this.nodeId] = CALL_NONE

    // transition setup
    this.lazyTransition = false
    this.setupTransition()
    this.resetTransitions()

    // v-if
    if(!this.vIf(vPrevDomItem)){
      return []
    }

    // render targets
    if(this.renderNodeFuncs === undefined){
      this.renderNodeFuncs = []
      this.renderNodeFuncs[TEXT_NODE] = this.TextNode
      this.renderNodeFuncs[ELEMENT_NODE] = this.ElementNode
      this.renderNodeFuncs[V_TEMPLATE_NODE] = this.vTemplate
      this.renderNodeFuncs[V_COMPONENT_NODE] = this.vComponentElement
      this.renderNodeFuncs[V_FOR_NODE] = this.vFor
      this.renderNodeFuncs[V_TEXT_NODE] = this.vText
      this.renderNodeFuncs[V_HTML_NODE] = this.vHtml
      this.renderNodeFuncs[V_SLOT_NODE] = this.vSlot
      this.renderNodeFuncs[COMMENT_NODE] = this.CommentNode
      this.renderNodeFuncs[V_COMPONENT_IS_NODE] = this.vComponentIsElement
    }

    //
    const tgtRender = this.renderNodeFuncs[this.nodeType]
    if(tgtRender){
      const result = tgtRender.bind(this)(forceUpdate)
      // v-show and transition
      this.vShow(result)
      return result
    }

    /* istanbul ignore next */
    consoleDebug('INVALID NODE_TYPE', this)
    /* istanbul ignore next */
    return []
  }

  //////////////////////////////////////////////////////////////////////////////

  // v-if v-pre
  private vIf(vPrevDomItem: VDomItem | null = null){

    // vOutput
    let vOutput = this.parseVIf(vPrevDomItem)
    // v-pre
    if(this.attributes['v-pre'] !== undefined){
      vOutput = false
    }

    // change output status
    if (this.vOutput !== vOutput) {
      //
      this.replaceAll = true
      //
      if (vOutput) {
        //
        let renderElementBefore = this.markerElement
        for (const ele of this.elements) {
          renderElementBefore = insertAfter(ele, renderElementBefore)
        }
        if(this.isTransitionTarget()){
          this.lazyTransition = true
        }
        //
      } else {
        // vOutput === false
        if(this.isTransitionTarget() && this.renderd){
          // w transition
          this.doTransition(this.elements, false, (eles: Node[]) => {
            for (const ele of eles) {
              removeElement(ele)
            }
          })
          //
        }else{
          // no transition
          for (const ele of this.elements) {
            removeElement(ele)
          }
          //
        }
        //
      }
    }
    // result
    this.vOutput = vOutput
    return vOutput
    //
  }

  // v-show and transition
  private vShow(elements: Node[]){

    // vShow
    if(this.nodeType !== ELEMENT_NODE && this.nodeType !== V_COMPONENT_NODE){
      return
    }

    //
    const vShow = this.parseDirective('v-show')
    if(vShow.value === undefined){
      if(this.isTransitionTarget() && this.lazyTransition){
        this.doTransition(elements, true)
      }
      return
    }

    //
    const element = elements[0] as HTMLElement
    if(vShow.value){
      // w transition
      if(element.style.display || !this.renderd){
        element.style.display = null
        if(this.isTransitionTarget()){
          this.doTransition([element], true)
        }
      }
      //
    }else{
      if(element.style.display !== 'none'){
        if(this.isTransitionTarget() && this.renderd){
          this.doTransition([element], false, (eles: Node[]) => {
            for (const ele of eles) {
              if(ele.nodeType === ELEMENT_NODE){
                (ele as HTMLElement).style.display = 'none'
              }
            }
          })
        }else{
          element.style.display = 'none'
        }
      }
    }
    //
  }

  //////////////////////////////////////////////////////////////////////////////

  //
  private vSlot(forceUpdate: boolean): Node[] {

    // get slot name
    const slot = this.parseDirective('name', true)
    let slotName = slot.value
    if (slotName === undefined) {
      // default slot
      slotName = 'default'
    }

    //
    let renderd = false
    const renderdElements: Node[] = []

    //
    let renderElementBefore = this.markerElement
    let prevVDomItem: VDomItem | null = null

    // slot exists
    for (const child of this.vDom.$slotVDomItems) {
      //
      /* istanbul ignore next */
      if (!child.vDom || !child.vDom.$reactiveVars) {
        consoleDebug('INVALID SLOT child.vDom')
        consoleDebug('INVALID SLOT child.vDom.$reactiveVars')
        continue
      }

      // get slot info
      const slotInfo = child.parseSlot() || ['default', '']
      if (slotInfo[0] !== slotName) {
        continue
      }

      //
      renderd = true

      // slot context
      const vSlotCtx: { [key: string]: any } = {}
      if (slotInfo[1]) {
        vSlotCtx[slotInfo[1]] = this.vDom
      }

      // add slot context
      child.vDom.$reactiveVars.extContexts(vSlotCtx, () => {
        // render
        const elements = child.render(renderElementBefore, prevVDomItem, forceUpdate)
        for (const ele of elements) {
          renderdElements.push(ele)
          renderElementBefore = ele
        }
        if (child.nodeType === V_COMPONENT_NODE || child.nodeType === ELEMENT_NODE || child.nodeType === V_TEMPLATE_NODE) {
          prevVDomItem = child
        }
        //
      })

    }

    // foll back
    if (!renderd) {
      prevVDomItem = null
      for (const child of this.children) {
        child.parent = this
        const elements = child.render(renderElementBefore, prevVDomItem, forceUpdate)
        for (const ele of elements) {
          renderdElements.push(ele)
          renderElementBefore = ele
        }
        if (child.nodeType === V_COMPONENT_NODE || child.nodeType === ELEMENT_NODE || child.nodeType === V_TEMPLATE_NODE) {
          prevVDomItem = child
        }
      }
    }

    // result
    this.elements = renderdElements
    return this.elements
  }

  //
  private vComponentImplElement(vComponent: any, componentIs: boolean, forceUpdate: boolean): Node[] {
    //
    /* istanbul ignore next */
    if(!(this.vDom.constructor as any).components){
      consoleWarn('VDom no components impl', this)
      return []
    }

    // no rerender
    if (!forceUpdate && !this.replaceAll) {
      //
      if (this.vComponentInstance) {
        this.vComponentInstance.$render(false, (vDom: VDom, updateedEle: Node) => {
          this.elements = [updateedEle]
        })
      }
      return this.elements
      //
    }

    //
    if(this.vComponentInstanceCache === undefined){
      this.vComponentInstanceCache = new LRU({
        max: this.vDom.$maxComponentCache,
        dispose: (key: string, n: VDomComponent) => {n.$destroy()}
      })
    }

    //
    const componentName = vComponent.name
    // conponent :is
    if(componentIs){
      // get cache
      const cachedComponentInstance = this.vComponentInstanceCache.get(componentName)
      //
      if(cachedComponentInstance !== this.vComponentInstance){
        if(this.vComponentInstance){
          this.vComponentInstance.$umount()
        }
        this.vComponentInstance = cachedComponentInstance
        if(this.vComponentInstance){
          this.vComponentInstance.$remount()
        }
      }
      //
    }

    // create new
    if(!this.vComponentInstance){
      //
      // consoleTrace('■■ NEW COMPONENT', vComponent)
      this.vComponentInstance = new vComponent()
      if (this.vComponentInstance) {
        //
        this.vComponentInstanceCache.set(componentName, this.vComponentInstance)

        // copy slot content
        for (const child of this.children) {
          this.vComponentInstance.$slotVDomItems.push(child.clone())
        }

        // $root $parent $instanceId
        if (this.parent && this.parent.vDom) {
          this.vComponentInstance.$root = this.parent.vDom.$root
          this.vComponentInstance.$parent = this.parent.vDom
          this.vComponentInstance.$instanceId = this.parent.vDom.$instanceId
        }

        // inject component params
        const vAttributesFirst = this.parseAttributes(true, true)
        for (const key in vAttributesFirst) { // tslint:disable-line forin
          //
          if(key in this.vComponentInstance.$props){
            this.vComponentInstance.$props[key] = vAttributesFirst[key]
            ;(this.vComponentInstance as any)[key] = vAttributesFirst[key]
          }else{
            /* istanbul ignore next */
            if(key !== 'class' && key !== 'style' && key !== 'ref'){
              consoleWarn(`VDom invalid component property '${this.vComponentInstance.constructor.name}.${key}'`, this.rawNode)
            }
          }
          //
        }

        // mount real dom
        this.vComponentInstance.$mountAfter(this.markerElement, (vDom: VDom, createdEle: Node) => {

          //
          this.elements = [createdEle]

          // set parent component id
          if (this.parent && this.parent.vDom && this.parent.vDom.$componentId && (this.parent.vDom.constructor as any).css) {
            (createdEle as Element).setAttribute(this.parent.vDom.$componentId, '')
          }
          // do dorevtives
          this.doDirective(createdEle as Element, this.vComponentInstance)

          // set $refs
          const ref = this.parseRef()
          if (ref.value && this.vComponentInstance) {
            this.vDom.$refs[ref.value] = this.vComponentInstance
            this.vDom.$vrefs[ref.value] = this
          }
          //
        })
        //
      }
      //
      return this.elements
      //
    }else{
      // inject component params
      const vAttributes = this.parseAttributes(true, true)
      for (const key in vAttributes) { // tslint:disable-line forin
        if(key in this.vComponentInstance.$props){
          this.vComponentInstance.$props[key] = vAttributes[key]
          ;(this.vComponentInstance as any)[key] = vAttributes[key]
        }
      }

      // do dorevtives
      const targetElement = this.elements[0] as Element
      this.doDirective(targetElement, this.vComponentInstance)

      // render request
      const element = this.vComponentInstance.$render(forceUpdate, () => {})
      if (element) {
        this.elements = [element]
      }

      // result
      return this.elements
      //
    }

    //
  }

  //
  private vComponentIsElement(forceUpdate: boolean): Node[] {
    //
    /* istanbul ignore next */
    if(!(this.vDom.constructor as any).components){
      consoleWarn('VDom no components impl', this)
      return []
    }
    //
    const componentName = this.parseDirective(':is')
    /* istanbul ignore next */
    //
    if(!componentName.value){
      consoleWarn(`VDom invalid component :is='${this.attributes[':is']}'`/*, this*/)
      return []
    }
    //
    const vComponent = (this.vDom.constructor as any).components[componentName.value]
    /* istanbul ignore next */
    if(!vComponent){
      consoleWarn(`VDom no component '${this.attributes[':is']}'`, this)
      return []
    }
    return this.vComponentImplElement(vComponent, true, forceUpdate)
  }

  //
  private vComponentElement(forceUpdate: boolean): Node[] {
    //
    /* istanbul ignore next */
    if (!this.vComponent) {
      consoleDebug('INVALID vComponent', this)
      return []
    }
    //
    return this.vComponentImplElement(this.vComponent, false, forceUpdate)
    //
  }

  //
  private vFor(forceUpdate: boolean): Node[] {
    //
    /* istanbul ignore next */
    if (!this.vForVDomItem) {
      consoleDebug('INVALID vForVDomItem', this)
      return []
    }

    // get v-for info
    const vForInfo = this.parseVFor()
    /* istanbul ignore next */
    if (!vForInfo) {
      consoleDebug('INVALID vForInfo', this)
      return []
    }

    //
    if(this.vForCacheItems === undefined){
      this.vForCacheItems = new LRU({
        max: this.vDom.$maxCache,
      })
    }

    //
    let beforeElement: Node = this.markerElement
    const renderdElements: Node[] = []

    // no rerender
    //
    if (!forceUpdate && !this.replaceAll) {
      //
      for (const key in this.vForRenderdItems) {  // tslint:disable-line forin

        // set v-for context
        const vForVDomItem = this.vForRenderdItems[key]
        //
        this.vDom.$reactiveVars.extContexts(vForVDomItem.context, () => {
          // render
          const elements = vForVDomItem.vDomItem.render(beforeElement, null, forceUpdate)
          for (const ele of elements) {
            renderdElements.push(ele)
            beforeElement = ele
          }
        })
      }
      // result
      this.elements = renderdElements
      return this.elements
      //
    }
    //

    // v-for context
    let object = this.vDom.$reactiveVars.eval(this, 'v-for', CALL_FUNCS, vForInfo.data, true)
    /* istanbul ignore next */
    if (object === undefined) {
      consoleDebug('INVALID v-for context', this)
      return []
    }

    // is Integer for ?
    if (Number.isInteger(object)) {
      const workObject: number[] = []
      if (object > 0) {
        for (let i = 0; i < object; i++) {
          workObject.push(i)
        }
      }
      object = workObject
    }

    // index
    let $indexkey = 0

    // v-for context keys
    const vForContextKeys = Object.keys(object)
    //
    let sameContextKey = false
    if(equal(vForContextKeys, this.vForRenderdContextKeys)){
      sameContextKey = true
    }
    this.vForRenderdContextKeys = vForContextKeys

    // copy cache
    const vForRenderdItems = Object.assign({}, this.vForRenderdItems)
    // and clear cache store
    this.vForRenderdItems = {}

    //
    for (const key of vForContextKeys) {
      //
      const vForContext: { [key: string]: any } = {}

      // set context values
      if (vForInfo.index.length > 0) {
        vForContext[vForInfo.index[0]] = $indexkey
      }
      if (vForInfo.index.length > 1) {
        vForContext[vForInfo.index[1]] = object[key]
      }
      //
      if (vForInfo.index.length > 2) {
        vForContext[vForInfo.index[2]] = key
      }
      if (vForInfo.index.length > 3) {
        vForContext[vForInfo.index[3]] = $indexkey
      }
      ++$indexkey
      //

      // set v-for context
      this.vDom.$reactiveVars.extContexts(vForContext, () => {

        /* istanbul ignore next */
        if(this.vForCacheItems === undefined){
          consoleDebug('INVALID vForCacheItems', this)
          return
        }
        /* istanbul ignore next */
        if(this.vForVDomItem === undefined){
          consoleDebug('INVALID vForVDomItem', this)
          return
        }

        // operation target vDom
        let vForVDom
        // child key
        let vChildKey = this.parseKey()

        // operation target vDom
        const vCachedVDomItem = this.vForCacheItems.get(vChildKey)
        if (vCachedVDomItem === undefined) {
          //
          // create new vDomItem
          vForVDom = this.vForVDomItem.clone()
          vForVDom.parent = this
          //
          const elements = vForVDom.render(beforeElement, null, true)
          for (const ele of elements) {
            renderdElements.push(ele)
            beforeElement = ele
          }
          // cache
          this.vForCacheItems.set(vChildKey, {vDomItem: vForVDom, context: vForContext })

          //
        } else {
          //
          vForVDom = vCachedVDomItem.vDomItem
          //
          if(vForVDom.umounted){
            // insert marker
            beforeElement = insertAfter(vForVDom.markerElement, beforeElement)
            // remount
            vForVDom.remount()
          }

          // render
          const elements = vForVDom.render(beforeElement, null, true)
          for (const ele of elements) {
            renderdElements.push(ele)
            beforeElement = ele
          }

          // remove renderd
          delete vForRenderdItems[vChildKey]
        }

        //
        vForVDom.vForContext = Object.assign({}, vForContext)
        /*
        if(this.vDom.constructor.name === 'Buttons'){
          console.log("■■■■■AA■■■■■", this.vDom.constructor.name, vForVDom.nodeId, vForVDom.vForContext)
        }
        */

        // save renderd
        /* istanbul ignore next */
        if (this.vForRenderdItems[vChildKey]) {
          consoleWarn(`VDom duplicate keys detected "${vChildKey}"`, this.rawNode)
          vChildKey = vid()
        }
        this.vForRenderdItems[vChildKey] = { vDomItem: vForVDom, context: vForVDom.vForContext/*Object.assign({}, vForContext)*/ }

      })
      //
    }

    // clear unused vDomItem
    for (const renderdKey in vForRenderdItems) {  // tslint:disable-line forin
      const tgtVDomItem = vForRenderdItems[renderdKey].vDomItem
      tgtVDomItem.umount()
      const onCache = this.vForCacheItems.peek(renderdKey)
      if(onCache === undefined){
        tgtVDomItem.destroy()
      }
    }

    // set $refs
    const ref = this.parseRef() // this.parseDirective('ref', true)
    if (ref.value) {
      //
      this.vDom.$refs[ref.value] = []
      for(const key in this.vForRenderdItems){
        if(this.vForRenderdItems[key].vDomItem.nodeType === V_COMPONENT_IS_NODE || this.vForRenderdItems[key].vDomItem.nodeType === V_COMPONENT_NODE){
          this.vDom.$refs[ref.value].push(this.vForRenderdItems[key].vDomItem.vComponentInstance)
        }else{
          this.vDom.$refs[ref.value].push(this.vForRenderdItems[key].vDomItem.elements[0])
        }
      }
      //
      this.vDom.$vrefs[ref.value] = this
      //
    }

    // result
    this.elements = renderdElements // Real // renderdElements
    return this.elements
    //
  }

  //
  private CommentNode(forceUpdate: boolean): Node[] {
    //
    // no rerender
    if (!forceUpdate && !this.replaceAll) {
      return this.elements
    }
    //
    let targetElement: Comment
    if (this.elements.length === 0) {
      targetElement = this.vDom.$document.createComment(this.nodeValue)
      insertAfter(targetElement, this.markerElement)
      //
      this.elements = [targetElement]
      //
    } else {
      targetElement = this.elements[0] as Comment
      insertAfter(targetElement, this.markerElement)
      const oldData = targetElement.data
      if (oldData !== this.nodeValue) {
        targetElement.data = this.nodeValue
      }
      //
    }
    //
    return this.elements
    //
  }

  //
  private TextNode(forceUpdate: boolean): Node[] {
    //
    // no rerender
    if (!forceUpdate && !this.replaceAll) {
      return this.elements
    }

    // output value
    const value = this.nodeValue

    // render
    let targetElement
    if (this.elements.length === 0) {
      // create new text node
      targetElement = this.vDom.$document.createTextNode(value)
      insertAfter(targetElement, this.markerElement)
      this.elements = [targetElement]
      //
    } else {
      // update text node
      targetElement = this.elements[0]
      insertAfter(targetElement, this.markerElement)
      const oldData = (targetElement as Text).data
      if (oldData !== value) {
        (targetElement as Text).data = value
      }
      //
    }

    // result
    return this.elements
    //
  }

  //
  private vHtml(forceUpdate: boolean): Node[] {

    // no rerender
    if (!forceUpdate && !this.replaceAll) {
      return this.elements
    }

    // output value
    const html = this.parseDirective('v-html')
    let value = html.value
    if (value === undefined) {
      value = ''
    }

    // create worker element
    this.vWorkerElement = this.vWorkerElement || this.vDom.$document.createElement('div')

    // import html
    this.vWorkerElement.innerHTML = value

    // remove old elements
    for (const ele of this.elements) {
      removeElement(ele)
    }
    this.elements = []

    // render
    let beforeElement = this.markerElement
    const length = this.vWorkerElement.childNodes.length
    for (let i = 0; i < length; i++) {  // tslint:disable-line prefer-for-of
      const node = this.vWorkerElement.childNodes[0]
      beforeElement = insertAfter(node, beforeElement)
      this.elements.push(node)
    }

    // result
    return this.elements
    //
  }

  //
  private vText(forceUpdate: boolean): Node[] {

    // no rereder
    if (!forceUpdate && !this.replaceAll) {
      return this.elements
    }

    // output value
    const text = this.parseDirective('v-text')
    let value = text.value
    if (value === undefined) {
      value = ''
    }

    // render
    let targetElement: Text
    if (this.elements.length === 0) {
      // create new node
      targetElement = this.vDom.$document.createTextNode(value)
      insertAfter(targetElement, this.markerElement)
      this.elements = [targetElement]
    } else {
      // update node
      targetElement = this.elements[0] as Text
      const oldData = targetElement.data
      if (oldData !== value) {
        targetElement.data = value
      }
    }

    // result
    return this.elements
    //
  }

  //
  private ElementNode(forceUpdate: boolean): Node[] {
    //
    /* istanbul ignore next */
    if (!this.elements[0].firstChild) {
      consoleDebug('INVALID this.elements[0].firstChild', this)
      return []
    }

    // target
    const targetElement = this.elements[0] as Element
    let renderElementBefore: Node = this.elements[0].firstChild

    // children
    let prevVDomItem = null
    for (const child of this.children) {
      child.parent = this
      const elements = child.render(renderElementBefore, prevVDomItem, forceUpdate)
      for (const ele of elements) {
        renderElementBefore = ele
      }
      if (child.nodeType === V_COMPONENT_NODE || child.nodeType === ELEMENT_NODE || child.nodeType === V_TEMPLATE_NODE) {
        prevVDomItem = child
      }
    }

    // event mount
    if (!forceUpdate && !this.replaceAll) {
      return this.elements
    }

    // do directives
    this.doDirective(targetElement)

    // set $refs
    const ref = this.parseRef()
    if (ref.value) {
      this.vDom.$refs[ref.value] = targetElement
      this.vDom.$vrefs[ref.value] = this
    }

    // result
    return this.elements
    //
  }

  //
  private vTemplate(forceUpdate: boolean): Node[] {

    // render before pos
    let renderElementBefore: Node = this.markerElement

    // renderd elements
    const renderdElements = []

    // render
    let prevVDomItem = null
    for (const child of this.children) {
      child.parent = this
      const elements = child.render(renderElementBefore, prevVDomItem, forceUpdate)
      for (const ele of elements) {
        renderdElements.push(ele)
        renderElementBefore = ele
      }
      if (child.nodeType === V_COMPONENT_NODE || child.nodeType === ELEMENT_NODE || child.nodeType === V_TEMPLATE_NODE) {
        prevVDomItem = child
      }
    }

    // result
    this.elements = renderdElements
    return this.elements
    //
  }

  ////////////////////////////////////////////////////////////////////////////

  // do dorective
  private doDirective(element: Element, exclude?: any) {
    // attr= :attr=
    this.directiveAttributes(element, exclude)
    // v-mode
    this.directiveVModel(element)
    // @event
    this.directiveEvent(element)
    // @['event']
    this.directiveEventEx(element)
    // ext directive
    this.doExtDirective(element)
  }

  ////////////////////////////////////////////////////////////////////////////

  //
  private extDirectives() {
    return Object.keys(this.vDom.$root.$customDirectives)
  }

  //
  private doExtDirective(element: Element) {
    //
    const directives = Object.keys(this.vDom.$root.$customDirectives)
    for (const vName of directives) {
      if (this.attributes[vName]) {
        const value = this.vDom.$reactiveVars.eval(this, vName, CALL_FUNCS, this.attributes[vName], true)
        this.vDom.$root.$customDirectives[vName](element, { name: vName, value, expression: this.attributes[vName] }, this)
      }
    }
    //
  }
  //

  //////////////////////////////////////////////////////////////////////////////

  //
  private directiveVModel(element: Element) {

    //
    const vModel = this.parseDirective('v-model', true)
    const model = vModel.value
    const option = vModel.option
    //
    if (model === undefined || option === undefined) {
      return
    }

    //
    const value = this.vDom.$reactiveVars.eval(this, 'v-model', CALL_FUNCS, model, true)

    //
    if (this.tagName === 'INPUT') {
      //
      const inputEle = element as HTMLInputElement
      //
      if (this.attributes.type === 'checkbox') {
        if (typeof value === 'boolean') {
          //
          inputEle.checked = value
          //
          if (!this.vModelEventsMounted) {
            this.vModelEventsMounted = true
            const eventFunc = () => {
              (this as any).vDom[model] = inputEle.checked
            }
            this.vModelEventInfo = addListener(element, 'change', eventFunc, eventFunc)
          }
          //
        } else {
          //
          if (value.indexOf(this.attributes.value) >= 0) {
            inputEle.checked = true
          } else {
            inputEle.checked = false
          }
          //
          if (!this.vModelEventsMounted) {
            this.vModelEventsMounted = true
            const eventFunc = () => {
              if (inputEle.checked) {
                if ((this as any).vDom[model].indexOf(this.attributes.value) < 0) {
                  (this as any).vDom[model].push(this.attributes.value)
                }
              } else {
                (this as any).vDom[model] = (this as any).vDom[model].filter((item: string) => item !== this.attributes.value)
              }
            }
            this.vModelEventInfo = addListener(element, 'change', eventFunc, eventFunc)
          }
          //
        }
      } else if (this.attributes.type === 'radio') {
        //
        if (value === this.attributes.value) {
          inputEle.checked = true
        } else {
          inputEle.checked = false
        }
        //
        if (!this.vModelEventsMounted) {
          this.vModelEventsMounted = true
          const eventFunc = () => {
            (this as any).vDom[model] = inputEle.value
          }
          this.vModelEventInfo = addListener(element, 'change', eventFunc, eventFunc)
        }
        //
      } else {
        //
        if(option.indexOf('number') >= 0){
          const outVal = parseFloat(value)
          if(Number.isNaN(outVal)){
            consoleWarn(`VDom invalid input value(only number) '${model}'`, this.rawNode)
            inputEle.value = ''
          }else{
            inputEle.value = String(outVal)
          }
        }else{
          inputEle.value = value
        }
        //
        if (!this.vModelEventsMounted) {
          this.vModelEventsMounted = true
          //
          let isLazy = false
          if(option.indexOf('lazy') >= 0){
            isLazy = true
          }
          //
          let isTrim = false
          if(option.indexOf('trim') >= 0){
            isTrim = true
          }
          //
          const eventFunc = () => {
            if(option.indexOf('number') >= 0){
              const outVal = parseFloat(inputEle.value)
              if(Number.isNaN(outVal)){
                consoleWarn(`VDom invalid input value(only number) '${model}'`, this.rawNode)
                ;(this as any).vDom[model] = ''
              }else{
                (this as any).vDom[model] = outVal
              }
            }else{
              (this as any).vDom[model] = isTrim?inputEle.value.trim():inputEle.value
            }
          }
          this.vModelEventInfo = addListener(element, isLazy?'change':'input', eventFunc, eventFunc)
        }
        //
      }
      //
      return
      //
    }

    //
    if (this.tagName === 'TEXTAREA') {
      //
      const textAreaEle = element as HTMLTextAreaElement
      textAreaEle.value = value
      //
      if (!this.vModelEventsMounted) {
        this.vModelEventsMounted = true
        const eventFunc = () => {
          (this as any).vDom[model] = textAreaEle.value
        }
        this.vModelEventInfo = addListener(element, 'input', eventFunc, eventFunc)
      }
      //
      return
      //
    }

    //
    if (this.tagName === 'SELECT') {
      //
      const selectEle = element as HTMLSelectElement
      //
      if (this.attributes.multiple !== undefined) {
        //
        for (let i = 0; i < selectEle.options.length; i++) {  // tslint:disable-line prefer-for-of
          if (value.indexOf(selectEle.options[i].value) >= 0) {
            selectEle.options[i].selected = true
          } else {
            selectEle.options[i].selected = false
          }
        }
        //
        if (!this.vModelEventsMounted) {
          this.vModelEventsMounted = true
          const eventFunc = () => {
            //
            for (let i = 0; i < selectEle.options.length; i++) {  // tslint:disable-line prefer-for-of
              //
              const tgtValue = selectEle.options[i].value
              //
              if (selectEle.options[i].selected) {
                if ((this as any).vDom[model].indexOf(tgtValue) < 0) {
                  (this as any).vDom[model].push(tgtValue)
                }
              } else {
                (this as any).vDom[model] = (this as any).vDom[model].filter((item: string) => item !== tgtValue)
              }
            }
            //
          }
          this.vModelEventInfo = addListener(element, 'change', eventFunc, eventFunc)
        }
        //
      } else {
        //
        for (let i = 0; i < selectEle.options.length; i++) {  // tslint:disable-line prefer-for-of
          if (selectEle.options[i].value === value) {
            selectEle.selectedIndex = i
            break
          }
        }
        //
        if (!this.vModelEventsMounted) {
          this.vModelEventsMounted = true
          const eventFunc = () => {
            (this as any).vDom[model] = selectEle.options[selectEle.selectedIndex].value
          }
          this.vModelEventInfo = addListener(element, 'change', eventFunc, eventFunc)
        }
        //
      }
      //
      return
      //
    }
    //
  }

  //
  private directiveAttributes(element: Element, component?: VDom) {

    //
    const vAttributes = this.parseAttributes(false)

    if(component && component.$rootVDom){
      // merge attributes
      for(const cmpKey in component.$rootVDom.renderdAttributes){ // tslint:disable-line forin
        //
        vAttributes[cmpKey] = vAttributes[cmpKey] || ''
        //
        if(cmpKey === 'class' || cmpKey === 'style'){
          vAttributes[cmpKey] += ' ' + (component.$rootVDom.renderdAttributes[cmpKey] || '')
        }else{
          vAttributes[cmpKey] = component.$rootVDom.renderdAttributes[cmpKey]
        }
        //
        vAttributes[cmpKey] = vAttributes[cmpKey].trim()
        //
      }
    }

    //
    this.renderdAttributes = {}
    //
    for (const key in vAttributes) {  // tslint:disable-line forin
      //
      if(component){
        if(key in component.$props || key in (component as any)){
          continue
        }
      }
      //
      if (key.substr(0, 1) === '[' && key.substr(key.length - 1, 1) === ']') {
        // :['bindname']
        if (this.bindAttributes[key]) {
          element.removeAttribute(this.bindAttributes[key])
        }
        //
        const exKey = this.vDom.$reactiveVars.eval(this, key, CALL_FUNCS, key.substr(1, key.length - 2), false)
        if (!isExcludeAttribute(exKey) && this.extDirectives().indexOf(exKey) < 0) {
          element.setAttribute(exKey, vAttributes[key])
          this.renderdAttributes[exKey] = vAttributes[key]
          this.bindAttributes[key] = exKey
        }
      } else {
        // :bindname
        if (!isExcludeAttribute(key) && this.extDirectives().indexOf(key) < 0) {
          element.setAttribute(key, vAttributes[key])
          this.renderdAttributes[key] = vAttributes[key]
        }
        //
      }
      //
    }

  }

  //
  private addEvent(key: string, eventDef: {value: string, option: any} ,element: Element): ListenEventInfo {

    // event option
    const option = eventDef.option

    //
    const eventFunc = (ev: any) => {
      //
      if (this.vDom && this.vDom.$reactiveVars) {
        //
        if(option.indexOf('self') >= 0){ if (ev.target !== ev.currentTarget){return}}
        //
        if(option.indexOf('enter') >= 0){if (ev.keyCode !== 13){ return}}
        if(option.indexOf('ctrl') >= 0){if (!ev.ctrlKey){ return}}
        if(option.indexOf('alt') >= 0){if (!ev.altKey){ return}}
        if(option.indexOf('shift') >= 0){if (!ev.shiftKey){ return}}
        if(option.indexOf('meta') >= 0){if (!ev.metaKey){ return}}
        //
        if(option.indexOf('left') >= 0){if (ev.button !== 0){ return}}
        if(option.indexOf('right') >= 0){if (ev.button !== 2){ return}}
        if(option.indexOf('middle') >= 0){if (ev.button !== 1){ return}}
        //
        const $event = (ev instanceof CustomEvent)? ev.detail: ev

        // create context
        let context = {}
        //
        const contextList = []
        let me : VDomItem | undefined = this
        while(me){
          contextList.unshift(me.vForContext)
          me = me.parent
        }
        while(contextList.length > 0){
          context = Object.assign(context, contextList.pop())
        }
        context = Object.assign(context, {$event})

        //
        this.vDom.$reactiveVars.extContexts(context, () => {
          this.vDom.$reactiveVars.eval(this, `$event-${key}`, CALL_EVENT_HANDLER, eventDef.value, true, [$event])
        })
        //
        if(option.indexOf('stop') >= 0){ev.stopPropagation()}
        if(option.indexOf('prevent') >= 0){ev.preventDefault()}
        //
      }
    }
    //
    let captureMode = false
    if(option.indexOf('capture') >= 0){captureMode = true}
    let onceMode = false
    if(option.indexOf('once') >= 0){onceMode = true}
    let passiveMode = false
    if(option.indexOf('passive') >= 0){passiveMode = true}
    //
    const eventOption = {
      capture: captureMode,
      once: onceMode,
      passive: passiveMode
    }
    //
    return addListener(element, key, eventFunc, eventFunc.bind(this), eventOption)
    //
  }

  // @['eventname]
  private directiveEventEx(element: Element) {

    // remove old events
    for (const evKey in this.bindEventsEx) {  // tslint:disable forin
      removeListener(this.bindEventsEx[evKey])
    }
    this.bindEventsEx = {}

    //
    const vEvents = this.parseEvents()
    for (const key in vEvents) {  // tslint:disable-line forin
      if (key.substr(0, 1) === '[' && key.substr(key.length - 1, 1) === ']') {
        //
        if (this.bindAttributes[key]) {
          element.removeAttribute(this.bindAttributes[key])
        }
        //
        const bindedKey = key.substr(1, key.length - 2)
        //
        const eventKey = this.vDom.$reactiveVars.eval(this, `$event-${bindedKey}`, CALL_FUNCS, bindedKey, false)
        //
        const bindEventInfo = this.addEvent(eventKey, vEvents[key], element)
        if(bindEventInfo){
          this.bindEventsEx[eventKey] = bindEventInfo
        }
        //
      }
    }
    //
  }

  // @eventname
  private directiveEvent(element: Element) {
    //
    if(this.bindEvents !== undefined){
      return
    }

    //
    this.bindEvents = []
    //
    const vEvents = this.parseEvents()
    for (const key in vEvents) {  // tslint:disable-line forin
      if (key.substr(0, 1) === '[' && key.substr(key.length - 1, 1) === ']') {
        continue
      }
      const eleInfo = this.addEvent(key, vEvents[key], element)
      this.bindEvents.push(eleInfo)
    }

  }

  //////////////////////////////////////////////////////////////////////////////
  //
  private parseVIf(prevVDomItem: VDomItem | null): boolean {

    //
    let vIf: boolean | undefined
      //
    if (this.attributes['v-if'] !== undefined) {
      vIf = !!(this.vDom.$reactiveVars.eval(this, 'v-if', CALL_FUNCS, this.attributes['v-if'], true))
    }
    if (this.attributes['v-else'] !== undefined) {
      if (prevVDomItem) {
        if (prevVDomItem.vOutput === true) {
          vIf = false
        }
        if (prevVDomItem.vOutput === false) {
          vIf = true
        }
      }
    }
    //
    if (vIf === undefined) {
      return true
    }
    //
    return vIf
    //
  }

  //
  private parseEvents(): { [key: string]: {value: string, option: string[]} } {
    //
    const vEvents: { [key: string]: {value: string, option: string[]} } = {}
    //
    for (const key in this.attributes) {
      if (key.substr(0, 1) === '@') {
        const outEvents = key.substr(1).split('.')
        vEvents[outEvents[0]] = {value: this.attributes[key], option: outEvents}
        continue
      }
    }
    //
    return vEvents
    //
  }

  //
  private parseAttributes(raw: boolean, vBindOnly: boolean = false): { [key: string]: string } {

    //
    const vAttributes: { [key: string]: string } = {}
    //
    for (const key in this.attributes) {
      //
      if (key.substr(0, 1) === '@') {continue}
      if (key.substr(0, 1) === '#') {continue}
      if (isExcludeAttribute(key)) {continue}
      if (this.extDirectives().indexOf(key) >= 0) {continue}

      // :attr=
      if (key.substr(0, 1) === ':') {
        const outKey = key.substr(1)
        //
        let vOut = ''
        if (outKey === 'class') {
          //
          const v = this.vDom.$reactiveVars.eval(this, key, CALL_FUNCS, this.attributes[key], true)
          if (Array.isArray(v)) {
            for (const cKey of v) {
              vOut += `${cKey} `
            }
          } else if (typeof v === 'object') {
            for (const cKey in v) { // tslint:disable-line forin
              if(v[cKey]){
                vOut += `${cKey} `
              }
            }
          } else {
            vOut = v
          }
          //
        } else if (outKey === 'style') {
          //
          const v = this.vDom.$reactiveVars.eval(this, key, CALL_FUNCS, this.attributes[key], true)
          if (Array.isArray(v)) {
            for (const cStyle of v) {
              for (const cKey in cStyle) { // tslint:disable-line forin
                vOut += `${cKey}: ${cStyle[cKey]}; `
              }
            }
          } else if (typeof v === 'object') {
            for (const cKey in v) { // tslint:disable-line forin
              vOut += `${cKey}: ${v[cKey]}; `
            }
          } else {
            vOut = v
          }
          //
        } else {
          vOut = this.vDom.$reactiveVars.eval(this, key, CALL_FUNCS, this.attributes[key], true)
        }
        //
        if(raw){
          vAttributes[outKey] = vOut
        }else{
          let vOutStr = ''
          try {
            vOutStr = String(vOut).trim()
          } catch (e) {
            /* istanbul ignore next */
            consoleWarn(`VDom can't convert to string`, vOut)   // TypeError!
          }
          if (!vAttributes[outKey]) {
            vAttributes[outKey] = vOutStr
          } else {
            vAttributes[outKey] += ' ' + vOutStr
          }
        }
        //
        continue
      }

      // attr=
      if (!vBindOnly) {
        let vStaticStr = ''
        try {
          vStaticStr = String(this.attributes[key]).trim()
        } catch (e) {
          /* istanbul ignore next */
          consoleWarn(`VDom can't convert to string`, this.attributes[key])   // TypeError!
        }
        if (!vAttributes[key]) {
          vAttributes[key] = vStaticStr
        } else {
          vAttributes[key] += ' ' + vStaticStr
        }
      }

      //
    }

    //
    return vAttributes

  }

  //
  private parseVFor(): { index: string[], data: string } | undefined {
    //
    /* istanbul ignore next */
    if (!this.attributes['v-for']) {
      consoleDebug('INVALID v-for attributes', this)
      return undefined
    }
    //
    const vF = this.attributes['v-for']
    //
    let pos = vF.indexOf(' in ')
    if (pos < 0) {
      pos = vF.indexOf(' of ')
      if (pos < 0) {
        return { index: [$INDEX_KEY], data: vF }
      }
    }
    //
    let index = vF.substr(0, pos).trim()
    if (index.substr(0, 1) === '(') {
      index = index.substr(1, index.length - 2)
    }
    index = `${$INDEX_KEY},${index}`
    //
    index.split(',').map(item => item.trim())
    //
    return { index: index.split(',').map(item => item.trim()), data: vF.substr(pos + 4).trim() }
    //
  }

  //
  private parseKey(): string {
    //
    this.attributes[':key'] = this.attributes[':key'] || $INDEX_KEY
    const appendKey = this.vDom.$reactiveVars.eval(this, ':key', CALL_FUNCS, this.attributes[':key'], false)
    /* istanbul ignore next */
    if (appendKey === undefined) {
      return this.nodeId
    }
    //
    return this.nodeId + '-' + appendKey
  }

  //
  private parseRef(): {value?: string, option?: string[]} {
    //
    let value = this.attributes['ref']  // tslint:disable-line no-string-literal
    if(!value){
      value = this.vDom.$reactiveVars.eval(this, ':ref', CALL_FUNCS, this.attributes[':ref'], false)
    }
    if(!value){
      return {}
    }
    return {value, option: []} // tslint:disable-line no-string-literal
    //
  }

  //
  private parseDirective(directive: string, noEval: boolean = false): {value?: string, option?: string[]} {
    //
    let key
    let value
    for (const attrKey in this.attributes) {
      //
      if (attrKey === directive || attrKey.substr(0, directive.length + 1) === `${directive}.`) {
        key = attrKey
        value = this.attributes[attrKey]
        break
      }
    }
    //
    if(!key || !value){
      return {}
    }

    //
    const directives = key.split('.')
    if (noEval) {
      return {value, option: directives} // tslint:disable-line no-string-literal
    }
    return {value: this.vDom.$reactiveVars.eval(this, key, CALL_FUNCS, value, true), option: directives}
    //
  }

  //
  private parseSlot(): [string, string] | undefined {
    for (const key in this.attributes) {
      if (key.substr(0, 1) === '#') {
        return [key.substr(1), this.attributes[key]]
      }
    }
    return
  }

}
