import {consoleError, consoleDebug, consoleWarn, consoleLog} from './console'
import {addListener, removeListener, /*isEqualListener, */ListenEventInfo} from './eventListener'
//

export default class EmitOn {

  //
  private $targetEl? : Element
  // added render
  private $addedEvents: ListenEventInfo[] = []

  //
  public $emitOnInit(el: Element){
    this.$targetEl = el
  }

  //
  public $umountEmitOn(){
    for(const eveInfo of this.$addedEvents){
      removeListener(eveInfo)
    }
    this.$addedEvents = []
  }

  //
  public $emit(eventName: string, data: any){
    //
    /* istanbul ignore next */
    if(!this.$targetEl){
      consoleDebug('INVALID $el', this)
      return
    }
    const event = new CustomEvent(eventName, {detail: data})
    this.$targetEl.dispatchEvent(event)
    //
  }
  /*
  //
  public $once(eventName: string, callback: (ev: any) => void){
    this.$on(eventName, callback, true)
  }

  //
  public $on(eventName: string, callback: (ev: any) => void, once: boolean = false){
    //
    if(!this.$targetEl){
      consoleDebug('INVALID $targetEl', this)
      return
    }
    //
    const eventFunc = (e: any) => {
      callback.bind(this)(e.detail)
    }
    //
    const eleInfo = addListener(this.$targetEl, eventName, callback, eventFunc, once?{once:true}:false)
    this.$addedEvents.push(eleInfo)
    //
  }

  //
  public $off(eventName?: string, callback?: (ev: any) => void){
    //
    if(!this.$targetEl){
      consoleDebug('INVALID $targetEl', this)
      return
    }

    //
    const stayEvents: ListenEventInfo[] = []
    const removeEvents: ListenEventInfo[] = []

    //
    for(const eleInfo of this.$addedEvents){
      if(isEqualListener(eleInfo, this.$targetEl, eventName, callback)){
        removeEvents.push(eleInfo)
      }else{
        stayEvents.push(eleInfo)
      }
    }
    //
    for(const eleInfo of removeEvents){
      removeListener(eleInfo)
    }
    //
    this.$addedEvents = stayEvents
    //
  }
  //
  */
}
