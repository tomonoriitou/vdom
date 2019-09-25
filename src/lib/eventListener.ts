import {consoleError, consoleWarn, consoleDebug} from './console'

//
export interface ListenEventInfo {
  element: EventTarget
  eventName: string
  eventFunc: (ev:any) => void
  bindedEventFunc: (ev:any) => void
  option?: boolean | {capture?: boolean, once?: boolean, passive?: boolean}
}

/*
export const isEqualListener = (evInfo: ListenEventInfo, element: EventTarget, eventName?: string, eventFunc?: (ev:any) => void): boolean => {
  //
  if(eventFunc !== undefined){
    if(evInfo.eventFunc !== eventFunc){
      return false
    }
  }
  //
  if(eventName !== undefined){
    if(evInfo.eventName !== eventName){
      return false
    }
  }
  //
  if(evInfo.element !== element){
    return false
  }
  //
  return true
  //
}
*/

//
export const addListener = (element: EventTarget, eventName: string, eventFunc: (ev:any) => void, bindedEventFunc: (ev:any) => void, option?: boolean | {capture?: boolean, once?: boolean, passive?: boolean}): ListenEventInfo => {
  const evinfo: ListenEventInfo = {element, eventName, bindedEventFunc, eventFunc, option}

  // console.log("ADD EVENT !!!", element, eventName, bindedEventFunc, option)

  element.addEventListener(eventName, bindedEventFunc, option)
  return evinfo
}

//
export const removeListener = (evInfo?: ListenEventInfo) => {
  /* istanbul ignore next */
  if(evInfo === undefined){
    consoleDebug('VDom invalid listener info')
    return
  }
  evInfo.element.removeEventListener(evInfo.eventName, evInfo.bindedEventFunc, evInfo.option)
}







