//
// tslint:disable: no-console
//
//
import {debugOption} from './decorator'

//
export const consoleTime = (...args: any) => {
  if(debugOption.CONSOLE_TIME === true){
    return console.time(...args)
  }
  return (...unuse: any) => {/*noop*/}
}

//
export const consoleTimeEnd = (...args: any) => {
  if(debugOption.CONSOLE_TIME === true){
    return console.timeEnd(...args)
  }
  return (...unuse: any) => {/*noop*/}
}

//
export const consoleLog = (...args: any) => {
  if(debugOption.CONSOLE_LOG === true){
    return console.log(...args)
  }
  return (...unuse: any) => {/*noop*/}
}

//
export const consoleTrace = (...args: any) => {
  if(debugOption.CONSOLE_TRACE === true){
    return console.log(...args)
  }
  return (...unuse: any) => {/*noop*/}
}

//
export const consoleError = (...args: any) => {
  if(debugOption.CONSOLE_ERROR !== false){
    return console.error(...args)
  }
  return (...unuse: any) => {/*noop*/}
}

//
export const consoleWarn = (...args: any) => {
  if(debugOption.CONSOLE_WARN !== false){
    return console.warn(...args)
  }
  return (...unuse: any) => {/*noop*/}
}

//
export const consoleDebug = (...args: any) => {
  if(debugOption.CONSOLE_DEBUG === true){
    return console.error(...args)
  }
  return (...unuse: any) => {/*noop*/}
}
