import {equal, dcopy} from './deep'
import VarProxy from './VarProxy'
import { consoleError, consoleWarn, consoleDebug } from './console'
import VDom from './VDom'
import { VDomItem } from './VDomItem'
import LRU from './lru'

//
export const CALL_NONE = 0            //
export const CALL_FUNCS = 1           // CALL FROM FUNC etc
export const CALL_EVENT_HANDLER = 2   // CALL FROM EVENT HANDLER

//
export default class ReactiveVar {

  //////////////////////////////////////////////////////////////////////////////

  // VDom instance
  public vDom: any

  // updated vars
  public updatedElements: {[key: string]: number } = {}

  //////////////////////////////////////////////////////////////////////////////

  // updated functions
  private updatedFunctions: {[key: string]: boolean } = {}
  // reactive vars list
  private reactiveVars: {[key: string]: any } = {}
  // reactive funcs list
  private reactiveVarsForFunc: {[key: string]: any } = {}

  //////////////////////////////////////////////////////////////////////////////

  // for ext context
  private vExtContexts: Array<{[key: string]: any}> = []

  //////////////////////////////////////////////////////////////////////////////

  // processing nodeId
  private proceccingNodeId: string = ''
  // processing function
  private callKind: number = CALL_NONE
  // processing function
  private proceccingFunction: string = ''

  //////////////////////////////////////////////////////////////////////////////

  // for watch vars info
  private watchies: {[key:string]:{callback: any, option: {deep:boolean}}} = {}

  //////////////////////////////////////////////////////////////////////////////

  // reactived vars list
  private deepVars: {[key:string]: any} = {}

  // reactived vars list
  private reactived: {[key: string]: boolean } = {}

  //////////////////////////////////////////////////////////////////////////////

  // private functionCache?: LRU<any>

  //////////////////////////////////////////////////////////////////////////////

  //
  constructor(){
    //
  }

  public initVDom(vDom: VDom){
    this.vDom = vDom
  }

  //
  public initReactive(deepVars: {[key:string]: any}){
    if(!this.vDom){
      consoleDebug('VDom Invalid this.VDom')
    }
    this.deepVars = deepVars
    for(const key in this.vDom){ // tslint:disable-line: forin
      this.reactive(key, true)
    }
  }

  //
  public watch(target: string, callback: any, option: {deep:boolean} = {deep:false}){
    this.watchies[target] = {callback, option}
  }

  // umount nodeid
  public umountNodeId(nodeId: string){
    //
    delete this.updatedElements[nodeId]
    //
    for(const key in this.reactiveVars){
      if(this.reactiveVars[key][nodeId]){
        delete this.reactiveVars[key][nodeId]
      }
    }
    //
  }

  //
  public extContexts(context: any, cb: () => void){
    this.vExtContexts.unshift(context)
    cb()
    this.vExtContexts.shift()
  }

  //
  public eval(vDomItem: VDomItem, cacheKey:string, callKind: number, expr: string, raw: boolean, funcParams?: any): any {
    //
    /* istanbul ignore next */
    if(!vDomItem.vDom){
      consoleDebug('INVALID vDomItem.vDom', vDomItem)
      return
    }

    //
    if(expr === undefined || expr.trim() === ''){
      return
    }

    //
    if(!vDomItem.directiveFuncCache){
      vDomItem.directiveFuncCache = new LRU({
        max: this.vDom.$maxFunctionCache,
      })
    }

    //
    vDomItem.vDom.$reactiveVars.callKind = callKind
    vDomItem.vDom.$reactiveVars.proceccingNodeId = vDomItem.nodeId

    // for Result
    let resultNames: string = ''
    const paramNamesForResult: string[] = []
    // for eval
    const paramNames: string[] = []
    const params: any[] = []

    // ext contexts
    for(const extContext of this.vExtContexts){
      for(const ctxKey in extContext){  // tslint:disable-line forin
        if(paramNames.indexOf(ctxKey) < 0){
          paramNames.push(ctxKey)
          let value = extContext[ctxKey]
          if(typeof value === 'function'){
            value = value.bind(vDomItem.vDom)
          }
          params.push(value)
          //
          if(ctxKey === '$event'){
            this.vDom.$event = value
          }
          //
        }
      }
    }

    // vars in script
    const useParams = expr.split(/[ !-#%-/:-@[-^`{-~]/).map(item => item.trim())  // $ _ a-z A-Z 0-9
    for(const param of useParams){
      //
      if(!param){
        continue
      }
      let value = (vDomItem.vDom as any)[param]
      if(value === undefined){
        continue
      }

      // add reactive target
      this.reactive(param, true)

      //
      if(paramNames.indexOf(param) < 0){
        //
        resultNames += `${param},`
        paramNamesForResult.push(param)
        //
        paramNames.push(param)
        if(typeof value === 'function'){
          value = value.bind(vDomItem.vDom)
        }
        params.push(value)
      }

    }

    // tarminator
    resultNames += 'undefined'


    // eval
    let result: any = {result: '', params: []}
    try{

      // eval
      let f
      if(cacheKey){
        f = vDomItem.directiveFuncCache.get(cacheKey)
      }
      //
      if(!f){
        //
        const evalFuncBody = `var result = (${expr}); return {result: result, params: [${resultNames}]};`
        //
        f = Function(paramNames.join(','), evalFuncBody)
        if(cacheKey){
          vDomItem.directiveFuncCache.set(cacheKey, f)
        }
      }

      //
      result = f.apply(vDomItem.vDom, params)

      // result is function
      if(typeof result.result === 'function'){
        result = {result: (result.result as () => void).apply(vDomItem.vDom, funcParams), params: result.params}
      }
      //
    }catch(e){
      /* istanbul ignore next */
      this.updatedElements[vDomItem.nodeId] = CALL_FUNCS
      /* istanbul ignore next */
      consoleError(`VDom eval error ${e.message}`, vDomItem.rawNode)
    }

    // back to org vars
    for(let i = 0; i < paramNamesForResult.length; i++){ // tslint:disable-line prefer-for-of
      const paramName = paramNamesForResult[i]
      // $xxx
      if(paramName.substr(0,1) === '$'){continue}
      // func
      if(typeof (vDomItem.vDom as any)[paramName] === 'function'){continue}
      // target is unknown
      if(!(paramName in (vDomItem.vDom as any))){continue}
      // if((vDomItem.vDom as any)[paramName] === undefined){continue}
      // same
      if((vDomItem.vDom as any)[paramName] === result.params[i]){continue}
      // save back
      (vDomItem.vDom as any)[paramName] = result.params[i]
    }

    //
    vDomItem.vDom.$reactiveVars.proceccingNodeId = ''
    vDomItem.vDom.$reactiveVars.callKind = CALL_NONE

    // create result
    if(typeof result.result === 'object'){
      //
      if(raw){
        return result.result
      }
      // toString handler
      let strResult = ''
      try{
        strResult = String(result.result)
      }catch(e){
        /* istanbul ignore next */
        consoleWarn(`VDom can't convert to string`, result.result)   // TypeError!
      }
      return strResult
    }
    //
    return result.result
    //
  }

  //
  public forceUpdate(){
    //
    for(const nodeId in this.updatedElements){  // tslint:disable-line forin
      this.updatedElements[nodeId] = CALL_FUNCS
    }
    for(const funcName in this.updatedFunctions){  // tslint:disable-line forin
      this.updatedFunctions[funcName] = true
    }
    //
  }

  //
  public setUpdateFlag(object: object | any[], oldVal: any){
    //
    for(const key in this.vDom){
      if(this.vDom[key] === object){
        //
        if(this.watchies[key]){
          this.watchies[key].callback(object, oldVal)
        }
        //
        // console.log("■FROM C", key)
        this.setUpdates(key, CALL_FUNCS)
        break
      }
    }
  }

  //
  private setUpdates(key: string, callKindOrg: number){
    //
    const callKind = callKindOrg || CALL_FUNCS
    //
    let bChanged = false
    for(const nodeId in this.reactiveVars[key]){
      //
      if(this.reactiveVars[key][nodeId]){
        //
        if(nodeId === this.proceccingNodeId){
          continue
        }
        //
        this.updatedElements[nodeId] = callKind
        bChanged = true
      }
    }
    //
    for(const funcName in this.reactiveVarsForFunc[key]){
      if(this.reactiveVarsForFunc[key][funcName]){
        if(funcName === this.proceccingFunction){
          continue
        }
        this.updatedFunctions[funcName] = true
        bChanged = true
      }
    }

    //
    if(bChanged){
      this.vDom.$requestRender.bind(this.vDom)()
    }
    //
  }

  //
  private reactive(varName: string, defaultOnly: boolean): void{

    //
    if(this.reactived[varName] !== undefined){
      return
    }

    //
    if(defaultOnly){
      //
      const reserved = [
        //
        'constructor',
        'el',
        //
        'updated',
        'beforeDestroy',
        'destroyed',
        //
      ]
      // inner member reject
      if(varName.substr(0,1) === '$'){
        return
      }
      //
      if(reserved.indexOf(varName) >= 0){
        return
      }
      //
    }

    //
    let deep = false
    if(this.deepVars && !!(varName in this.deepVars)){
      deep = true
    }

    // set reactived
    this.reactived[varName] = true

    //////////////////////////////////////////////////////////////////////////

    const registUpdated = (key: string, nodeId: string, funcName: string) => {
      //
      if(nodeId){
        this.reactiveVars[key] = this.reactiveVars[key] || {}
        this.reactiveVars[key][nodeId] = true
      }
      //
      if(funcName){
        this.reactiveVarsForFunc[key] = this.reactiveVarsForFunc[key] || {}
        if(!this.reactiveVarsForFunc[key][funcName]){
          this.reactiveVarsForFunc[key][funcName] = true
        }
      }
      //
    }

    //////////////////////////////////////////////////////////////////////////

    // typeof var
    const vVarType = typeof this.vDom[varName]

    //////////////////////////////////////////////////////////////////////////
    // function
    //////////////////////////////////////////////////////////////////////////

    // functions hook
    if(vVarType === 'function'){
      return
    }

    //////////////////////////////////////////////////////////////////////////
    // computed var
    //////////////////////////////////////////////////////////////////////////

    const varObject = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this.vDom), varName)
    if(varObject){
      let oldResult: any
      const deepFlag = deep
      // tslint:disable-next-line: no-unused-expression
      new VarProxy(this.vDom, varName, {
        get: () => {
          //
          if(this.callKind !== CALL_EVENT_HANDLER && this.updatedFunctions[varName] === false){
            return oldResult
          }
          this.proceccingFunction = varName
          registUpdated(varName, this.proceccingNodeId, this.proceccingFunction)
          //
        },
        afterGet: (result: any) => {
          //
          this.proceccingFunction = ''
          this.updatedFunctions[varName] = false
          oldResult = result
          //
        },
        set: (newVal: any, option: boolean) => {
          // this.updatedFunctions[varName] = true
        },
        update: (newVal: any, /*oldVal: any, */as: boolean) => {
          //
        }
      }, {deep: deepFlag})
      return
    }

    //////////////////////////////////////////////////////////////////////////
    // normal var
    //////////////////////////////////////////////////////////////////////////

    //
    {
      let lastCallKind = CALL_FUNCS // NONE
      const deepFlag = deep
      // tslint:disable-next-line: no-unused-expression
      new VarProxy(this.vDom, varName, {
        afterGet: (result: any) => {
          //
          lastCallKind = this.callKind
          //
          registUpdated(varName, this.proceccingNodeId, this.proceccingFunction)
          //
          if(this.watchies[varName] && this.watchies[varName].option.deep === true){
            const oldVal = dcopy(result)
            ;(process as any).nextTick(() => {
              if(!equal(dcopy(result), oldVal)){
                this.watchies[varName].callback(result/* oldVal*/)
              }
            })
          }
          //
        },
        set: (newVal: any, option?: {deep: boolean}) => {
          // noop
        },
        update: (newVal: any, /*oldVal: any, */option: boolean) => {
          this.setUpdates.bind(this)(varName, lastCallKind)
          if(this.watchies[varName] && this.watchies[varName].option.deep !== true){
            this.watchies[varName].callback(newVal/*, oldVal*/)
          }
          //
        }
      }, {deep: deepFlag})
      //
    }
  }
  //
}
