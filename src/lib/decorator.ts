import VDom from './VDom'
import {VDomItem} from './VDomItem'
// import { consoleError } from './console'

//
interface DebugOption {
  OUTPUT_NODEID?: boolean
  //
  CONSOLE_LOG?: boolean
  CONSOLE_TRACE?: boolean
  CONSOLE_WARN?: boolean
  CONSOLE_ERROR?: boolean
  CONSOLE_DEBUG?: boolean
  CONSOLE_TIME?: boolean
}

//
export const debugOption: DebugOption = {}
//
export const deepVars: {[key:string]: {[key:string]: any}} = {}
export const propDefaut: {[key:string]: {[key:string]: {default: string} | true}} = {}
export const watchesVars: {[key:string]: {[key:string]: {callback: any, option: {deep: boolean, immediate?: boolean}}}} = {}

//
export function Deep(option?: any) {
  return (target: VDom, varName: string) => {
    const className = target.constructor.name
    deepVars[className] = deepVars[className] || {}
    deepVars[className][varName] = true
  }
}

//
export function Watch(key: string, option: {deep: boolean, immediate?: boolean} = {deep: false}) {
  return (target: any, name: string, descriptor: PropertyDescriptor) => {
    const className = target.constructor.name
    watchesVars[className] = watchesVars[className] || {}
    watchesVars[className][key] = {callback: descriptor.value, option}
  }
}

//
export function Emit(eventName: string, option?: any) {
  return (target: any, name: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value
    descriptor.value = function(...args: any){
      const result = method.apply(this, args)
      ;(this as any).$emit(eventName, result)
    }
  }
}

//
export function Prop(option?: {default: any}) {
  return (target: VDom, props: string) => {
    const className = target.constructor.name
    propDefaut[className] = propDefaut[className] || {}
    if(option !== undefined){
      propDefaut[className][props] = option
    }else{
      propDefaut[className][props] = true
    }
  }
}

//
export function Component(option?: {
    components?: any,
    template?: string,
    css?: string,
    delimiters?: [string, string],
    comments?: boolean
    directives?: {[key: string]: (el: Element, binding: { name: string, value: any, expression: string }, vnode: VDomItem) => void},
    debug?: DebugOption
  }) {
  return (target: any) => {
    /* istanbul ignore next */
    if(!option){
      return
    }
    target.components = option.components
    target.template = option.template
    target.delimiters = option.delimiters
    target.comments = option.comments
    target.css = option.css
    target.directives = option.directives
    Object.assign(debugOption, option.debug)
  }
}
