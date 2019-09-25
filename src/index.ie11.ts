import 'core-js/es/object/assign'
import 'core-js/es/number/is-integer'

//
import
  VDom,
  {
    VDomComponent, VDomItem,
    Component, Prop, Watch, Emit, Deep,
    WATCH, COMPONENTS,
    equal, dcopy,
    consoleError, consoleDebug, consoleTrace, consoleWarn, consoleLog
  }
  from './index'

//
export default VDom
export {
  VDomComponent, VDomItem,
  Component, Prop, Watch, Emit, Deep,
  WATCH, COMPONENTS,
  equal, dcopy,
  consoleError, consoleDebug, consoleTrace, consoleWarn, consoleLog
}
