import {equal, dcopy} from './deep'

//
export default class VarProxy {

  constructor(obj: any, prop: string, handler: any, option: {deep: boolean} = {deep :false}){

    //
    const target = obj[prop]

    //
    const vTargetType = typeof target

    // functions hook
    if(vTargetType === 'function'){
      this.functionsHook(obj, prop, handler, option)
      return
    }

    // getter setter hook
    const varObject = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(obj), prop)
    if(varObject){
      this.getterSetterHook(varObject, obj, prop, handler, option)
      return
    }

    // array hook
    if(Array.isArray(target)){
      this.arrayHook(obj, prop, handler, option)
      this.varsHook(obj, prop, handler, option)
      return
    }

    // vars hook
    this.varsHook(obj, prop, handler, option)

  }

  //
  public functionsHook(obj: any, prop: string, handler: any, option?: {deep: boolean}){
    //
    const target = obj[prop]
    //
    const orgFunc = target
    Object.defineProperty(obj, prop, {
      value: (...argv: any[]) => {
        if(handler.apply){
          const resultEx = handler.apply(obj, argv, option)
          if(resultEx !== undefined){
            return resultEx
          }
        }
        const result = orgFunc.bind(obj)(...argv)
        if(handler.executed){
          const resultEx = handler.executed(obj, argv, result, option)
          if(resultEx !== undefined){
            return resultEx
          }
        }
        return result
      },
      enumerable: true,
      writable: false
    })
  }

  //
  public arrayHook(obj: any, prop: string, handler: any, option?: {deep: boolean}){
    //
    const target = obj[prop] as any[]
    //
    if(Object.getOwnPropertyDescriptor(target, 'proxied') !== undefined){
      /* istanbul ignore next */
      return
    }

    //
    const oldMethods: {[key:string]: any} = {}

    //
    const targetMethods = [
      'push',
      'pop',
      'shift',
      'unshift',
      'splice',
      'sort',
      'reverse',
    ]
    //
    for(const m of targetMethods){
      oldMethods[m] = target[(m as any)]
      Object.defineProperty(target, m, {
        get() {
          if(!option || !option.deep){
            //const oldVal = dcopy(target)
            ;(process as any).nextTick(() => {
              if(handler.set){
                handler.set(target, option)
              }
              if(handler.update){
                handler.update(target/*, oldVal*/, option)
              }
            })
          }
          return oldMethods[m]
        },
        enumerable: false,
      })
    }

    //
    /* istanbul ignore next */
    Object.defineProperty(target, 'proxied', {
      get() { return true },
      enumerable: false,
    })
    //

  }

  //
  public varsHook(obj: any, prop: string, handler: any, option?: {deep: boolean}){

    const proxy = this

    // recent val
    let recentValue: any = obj[prop]
    // old val
    let oldValue: any = obj[prop]

    //
    let inHandler = false
    //

    // seter geter
    Object.defineProperty(obj, prop, {
      get() {
        //
        if(inHandler){
          return recentValue
        }
        inHandler = true
        //
        let result = recentValue
        if(handler.get){
          const resultEx = handler.get(option)
          if(resultEx !== undefined){
            result = resultEx
          }
        }
        //
        if(typeof recentValue === 'object' && option && option.deep === true){
          const oldVal = dcopy(recentValue)
          //
          ;(process as any).nextTick(() => {
            inHandler = true
            const testVal = dcopy(recentValue)
            if(!equal(testVal, oldVal)){
              if(handler.set){
                handler.set(recentValue, option)
              }
              if(handler.update){
                handler.update(recentValue, /*oldVal, */option)
              }
              oldValue = testVal
            }
            inHandler = false
          })
        }

        //
        if(handler.afterGet){
          handler.afterGet(result, option)
        }

        //
        inHandler = false
        return result
        //
      },
      set(v) {
        //
        if(inHandler){
          return
        }
        inHandler = true

        // call set
        let setV = v
        if(handler.set){
          const resultEx = handler.set(v, option)
          if(resultEx !== undefined){
            setV = resultEx
          }
        }

        // check
        //
        if(option && option.deep === true){
          const testVal = dcopy(setV)
          if(!equal(testVal, oldValue)){
            //
            // oldValue = dcopy(recentValue)
            recentValue = setV
            //
            if(handler.update){
              handler.update(recentValue, /*oldValue, */option)
            }
            oldValue = testVal // dcopy(recentValue)
            //
          }
        }else{
          if(recentValue !== setV){
            //
            // oldValue = recentValue
            recentValue = setV
            //
            if(handler.update){
              handler.update(recentValue, /*oldValue, */option)
            }
            oldValue = recentValue
            //
          }
        }

        // array hook
        if(Array.isArray(setV)){
          proxy.arrayHook(obj, prop, handler, option)
        }

        // call after set
        if(handler.afterSet){
          handler.afterSet(setV, option)
        }

        //
        inHandler = false
        //
      },
      enumerable: true,
      configurable: true
    })
    //
  }

  //
  public getterSetterHook(varObject: any, obj: any, prop: string, handler: any, option?: {deep: boolean}){
    //
    const getter = varObject.get
    const setter = varObject.set
    //
    let oldValue: any
    //
    Object.defineProperty(obj, prop, {
      get() {
        if(getter){
          //
          if(handler.get){
            const resultEx = handler.get(option)
            if(resultEx !== undefined){
              // oldValue = resultEx
              if(option && option.deep){
                oldValue = dcopy(resultEx)
              }else{
                oldValue = resultEx
              }
              return resultEx
            }
          }

          //
          const result = getter.bind(obj)()

          //
          if(handler.afterGet){
            handler.afterGet(result, option)
          }

          //
          if(option && option.deep){
            oldValue = dcopy(result)
          }else{
            oldValue = result
          }
          return result
          //
        }
        /* istanbul ignore next */
        return undefined
      },
      set(v){
        if(setter){
          //
          let setV = v
          //
          if(handler.set){
            const resultEx = handler.set(v, option)
            if(resultEx !== undefined){
              setV = resultEx
            }
          }
          //
          if(oldValue === undefined){
            if(option && option.deep){
              oldValue = dcopy(getter.bind(obj)())
            }else{
              oldValue = getter.bind(obj)()
            }
          }
          //
          setter.bind(obj)(setV)

          //
          if(handler.afterSet){
            handler.afterSet(setV, option)
          }

          //
          if(option && option.deep){
            const testVal = dcopy(setV)
            if(handler.update && (!equal(oldValue, testVal))){
              handler.update(setV, oldValue, option)
            }
            oldValue = testVal
          }else{
            if(handler.update && oldValue !== setV){
              handler.update(setV, oldValue, option)
            }
            oldValue = setV
          }
        }
      },
      enumerable: true,
      configurable: true
    })
    //
  }
  //
}
