import VDom, {WATCH, COMPONENTS}  from './lib/VDom'
import VDomComponent  from './lib/VDomComponent'
import {VDomItem} from './lib/VDomItem'
import {Component, Prop, Watch, Emit, Deep} from './lib/decorator'
import {equal, dcopy} from './lib/deep'
//
import {consoleError, consoleDebug, consoleTrace, consoleWarn, consoleLog} from './lib/console'

//
export default VDom
export {VDomComponent, VDomItem, Component, Prop, Watch, Deep, Emit, WATCH, COMPONENTS}
export {consoleError, consoleDebug, consoleTrace, consoleWarn, consoleLog}
export {equal, dcopy}
