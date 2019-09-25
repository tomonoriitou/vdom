import { consoleError, consoleWarn, consoleDebug, consoleLog } from './console'
import VDom from './VDom'
import {VDomItem} from './VDomItem'
import { CALL_NONE, CALL_EVENT_HANDLER, CALL_FUNCS } from './ReactiveVars'
import {ELEMENT_NODE} from './template'
import {addListener, removeListener, ListenEventInfo} from './eventListener'



// tslint:disable max-classes-per-file
export default class Transition {

  // transition name
  private transition?: string | false
  // transition dom
  private transitionVDom?: VDom

  // transition end listener
  private transitionEndListner?: ListenEventInfo
  // transition cancel listener
  private transitionCancelListner?: ListenEventInfo

  // transition custom events
  private transitionEvents: {[key: string]: any} = {}
  private transitionListenEvents: ListenEventInfo[] = []

  // transition type
  private transitionType: string = 'transition'

  // transition info
  private inTransision?: {elements: Node[], kind: string, callback?: (eles: Node[]) => void}

  //
  protected resetTransitions(){
    this.transitionEndEvent()
  }

  //
  protected umountTransition(){
    if(this.transitionEndListner){
      removeListener(this.transitionEndListner)
      this.transitionEndListner = undefined
    }
    if(this.transitionCancelListner){
      removeListener(this.transitionCancelListner)
      this.transitionCancelListner = undefined
    }
    for(const evInfo of this.transitionListenEvents){  // tslint:disable-line forin
      removeListener(evInfo)
    }
    this.transitionListenEvents = []
  }


  // setup
  protected setupTransition(){

    //
    if(this.transition || this.transition === false){
      return
    }
    //
    const vDomItem = (this as any) as VDomItem
    if(!vDomItem.parent){
      return
    }
    if(vDomItem.parent.tagName !== 'TRANSITION'){
      this.transition = false
      return
    }

    //
    this.transition = vDomItem.parent.attributes.name || 'v'
    this.transitionVDom = vDomItem.vDom
    this.transitionType = vDomItem.parent.attributes.type || 'transition'
    this.transitionEvents = vDomItem.Public('parent').parseEvents() || {}
    //
  }

  //
  protected isTransitionTarget(){
    return this.transition
  }

  //
  protected doTransition(elements: Node[], isEnter: boolean, callback?: (eles: Node[]) => void) {
    //
    if(!this.transition){
      return
    }

    //
    let isTarget = false
    for(const ele of elements){
      if(ele.nodeType === ELEMENT_NODE){
        isTarget = true
        break
      }
    }
    if(!isTarget){
      return
    }

    //
    const setElementEvent = (tgtEventEle: EventTarget) => {

      // add event listener
      const transitionListenEvents: ListenEventInfo[] = []
      for(const evKey in this.transitionEvents){  // tslint:disable-line forin
        //
        const pickListener = (element: EventTarget, eventName: string): ListenEventInfo | undefined => {
          //
          for(let i = 0; i < this.transitionListenEvents.length; i++){  // tslint:disable-line prefer-for-of
            const targetvInfo = this.transitionListenEvents[i]
            if(targetvInfo.element === element && targetvInfo.eventName === eventName){
              this.transitionListenEvents.splice(i, 1)
              return targetvInfo
            }
          }
          return undefined
        }
        //
        let evInfo = pickListener(tgtEventEle, evKey)
        if(!evInfo){
          const targetEvent = this.transitionEvents[evKey]
          const eventFunc = (ev: any) => {
            if (this.transitionVDom && this.transitionVDom.$reactiveVars) {

              const $event = (ev instanceof CustomEvent)? ev.detail: ev
              this.transitionVDom.$reactiveVars.extContexts({$event}, () => {
                if(this.transitionVDom){
                  this.transitionVDom.$reactiveVars.eval((this as any) as VDomItem, `$transition-${evKey}`, CALL_FUNCS, targetEvent.value, true, [ev.detail])
                }
              })
              //
            }
          }
          evInfo = addListener(tgtEventEle, evKey, eventFunc, eventFunc.bind(this.transitionVDom), false)
        }
        transitionListenEvents.push(evInfo)
        //
      }
      for(const evInfo of this.transitionListenEvents){  // tslint:disable-line forin
        removeListener(evInfo)
      }
      this.transitionListenEvents = transitionListenEvents

      // transition end event
      if(this.transitionEndListner){
        if(this.transitionEndListner.element !== tgtEventEle){
          removeListener(this.transitionEndListner)
          this.transitionEndListner = undefined
        }
      }
      if(this.transitionCancelListner){
        if(this.transitionCancelListner.element !== tgtEventEle){
          removeListener(this.transitionCancelListner)
          this.transitionCancelListner = undefined
        }
      }
      if(this.transitionEndListner === undefined){
        this.transitionEndListner = addListener(tgtEventEle, this.transitionType + 'end', this.transitionEndEvent, this.transitionEndEvent.bind(this))
      }
      if(this.transitionCancelListner === undefined){
        this.transitionCancelListner = addListener(tgtEventEle, this.transitionType + 'cancel', this.transitionCancelEvent, this.transitionCancelEvent.bind(this))
      }
      //
    }

    //
    const kind = isEnter? 'enter': 'leave'
    this.inTransision = {kind, elements, callback}

    //
    let firstElement
    // start transition
    for(const ele of this.inTransision.elements){
      if(ele.nodeType !== ELEMENT_NODE){continue}
      const tgtEle = ele as HTMLElement
      this.clearTransitionClasses(tgtEle)

      // first element (for event)
      if(firstElement === undefined){
        firstElement = tgtEle
        setElementEvent(tgtEle)
      }

      // before-xxx
      tgtEle.dispatchEvent(new CustomEvent(`before-${kind}`, {detail: this}))

      tgtEle.classList.add(`${this.transition}-${kind}`)
      tgtEle.classList.add(`${this.transition}-${kind}-active`)

      // xxx
      tgtEle.dispatchEvent(new CustomEvent(`${kind}`, {detail: this}))
      //
    }

    // activete transition
    for(const ele of this.inTransision.elements){
      if(ele.nodeType !== ELEMENT_NODE){continue}
      const tgtEle = ele as HTMLElement
      //
      setTimeout(() => {
        if(this.inTransision){
          tgtEle.classList.remove(`${this.transition}-${kind}`)
          tgtEle.classList.add(`${this.transition}-${kind}-to`)
        }
      }, 10)
      //
    }
    //
  }

  // w transition
  private transitionEndEvent(){

    //
    if(!this.inTransision){
      return
    }

    //
    if(this.inTransision && this.inTransision.callback){
      this.inTransision.callback.bind(this)(this.inTransision.elements)
    }
    //
    for(const ele of this.inTransision.elements){
      if(ele.nodeType !== ELEMENT_NODE){continue}
      const tgtEle = ele as HTMLElement
      this.clearTransitionClasses(tgtEle)
      tgtEle.dispatchEvent(new CustomEvent(`after-${this.inTransision.kind}`, {detail: this}))
      //
    }
    //
    this.inTransision = undefined
    //
  }

  // w transition
  private transitionCancelEvent(){

    //
    if(!this.inTransision){
      return
    }

    //
    if(this.inTransision && this.inTransision.callback){
      this.inTransision.callback.bind(this)(this.inTransision.elements)
    }
    //
    for(const ele of this.inTransision.elements){
      if(ele.nodeType !== ELEMENT_NODE){continue}
      const tgtEle = ele as HTMLElement
      this.clearTransitionClasses(tgtEle)
      // xxx
      tgtEle.dispatchEvent(new CustomEvent(`${this.inTransision.kind}-cancelled`, {detail: this}))
      //
    }
    //
    this.inTransision = undefined
    //
  }

  // clear transision
  private clearTransitionClasses(target: HTMLElement){
    //
    if(!this.transition){
      return
    }
    //
    target.classList.remove(`${this.transition}-enter-active`)
    target.classList.remove(`${this.transition}-enter`)
    target.classList.remove(`${this.transition}-enter-to`)
    target.classList.remove(`${this.transition}-leave-active`)
    target.classList.remove(`${this.transition}-leave`)
    target.classList.remove(`${this.transition}-leave-to`)
    //
  }

}
