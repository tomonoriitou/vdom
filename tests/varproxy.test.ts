// tslint:disable: no-unused-expression
// tslint:disable: max-classes-per-file

import VarProxy from '../src/lib/VarProxy'

//
test('computed', (done) => {
  //
  let doGet = false
  let doAfterGet = false
  let doSet = false
  let doAfterSet = false
  let doUpdate = false
  //
  class Test {
    //
    public testValue: number = 5
    //
    public get computed(){
      return this.testValue + 1000
    }
    //
    public set computed(v){
      this.testValue = v
    }
    //
    constructor(){
      //
      new VarProxy(this, 'computed', {
        //
        get: () => {
          doGet = true
        },
        afterGet: () => {
          doAfterGet = true
        },
        set: (newVal: any) => {
          doSet = true
          // expect(target).toBe(1005)
          expect(newVal).toBe(100)
        },
        afterSet: () => {
          doAfterSet = true
        },
        update: (newVal: any/*, oldVal: any*/) => {
          doUpdate = true
          ////expect(oldVal).toBe(1005)
          expect(newVal).toBe(100)
        }
        //
      })
      //
    }
    //
  }
  //
  const test = new Test()

  //
  const x = test.computed
  expect(x).toBe(1005)
  //
  test.computed = 100
  expect(test.computed).toBe(1100)

  //
  expect(doGet).toBe(true)
  expect(doAfterGet).toBe(true)
  expect(doSet).toBe(true)
  expect(doAfterSet).toBe(true)
  expect(doUpdate).toBe(true)

  //
  done()
  //

})

//
test('computed change get', (done) => {
  //
  let doGet = false
  let doSet = false
  let doUpdate = false
  //
  class Test {
    //
    public testValue: number = 5
    //
    public get computed(){
      return this.testValue + 1000
    }
    //
    public set computed(v){
      this.testValue = v
    }
    //
    constructor(){
      //
      new VarProxy(this, 'computed', {
        //
        get: () => {
          doGet = true
          return 999
        },
        set: (newVal: any) => {
          doSet = true
        },
        update: (newVal: any/*, oldVal: any*/) => {
          doUpdate = true
        }
        //
      })
      //
    }
    //
  }
  //
  const test = new Test()
  //
  const x = test.computed
  expect(x).toBe(999)

  //
  expect(doGet).toBe(true)
  expect(doSet).toBe(false)
  expect(doUpdate).toBe(false)

  //
  done()
  //

})

//
test('computed change set', (done) => {
  //
  let doGet = false
  let doSet = false
  let doUpdate = false
  //
  class Test {
    //
    public testValue: number = 5
    //
    public get computed(){
      return this.testValue + 1000
    }
    //
    public set computed(v){
      this.testValue = v
    }
    //
    constructor(){
      //
      new VarProxy(this, 'computed', {
        //
        get: () => {
          doGet = true
        },
        set: (newVal: any) => {
          doSet = true
          return 5000
        },
        update: (newVal: any/*, oldVal: any*/) => {
          doUpdate = true
          expect(newVal).toBe(5000)
          ////expect(oldVal).toBe(1005)
        }
        //
      })
      //
    }
    //
  }
  //
  const test = new Test()
  //
  test.computed = 2000
  //
  expect(doGet).toBe(false)
  //
  expect(doSet).toBe(true)
  expect(doUpdate).toBe(true)

  //
  expect(test.computed).toBe(6000)
  expect(doGet).toBe(true)

  //
  done()
  //

})

//
test('func', (done) => {
  //
  let doApply = false
  let doExecuted = false
  //
  class Test {
    //
    constructor(){
      //
      new VarProxy(this, 'func1', {
        //
        apply: (thisArg: any, argumentsList: any) => {
          doApply = true
          expect(thisArg).toBe(this)
          expect(argumentsList.length).toBe(2)
          expect(argumentsList[0]).toBe(100)
          expect(argumentsList[1]).toBe('XXX')
        },
        executed: (thisArg: any, argumentsList: any, result: any) => {
          doExecuted = true
          expect(thisArg).toBe(this)
          expect(argumentsList.length).toBe(2)
          expect(argumentsList[0]).toBe(100)
          expect(argumentsList[1]).toBe('XXX')
          expect(result).toBe('100XXX')
        }
        //
      })
      //
    }
    //
    public func1(num: number, txt: string): string{
      return num + txt
    }
    //
  }
  //
  const test = new Test()

  //
  const testResult = test.func1(100, 'XXX')
  expect(testResult).toBe('100XXX')

  //
  expect(doApply).toBe(true)
  expect(doExecuted).toBe(true)

  done()
  //

})

//
test('func change apply', (done) => {
  //
  let doApply = false
  let doExecuted = false
  //
  class Test {
    //
    constructor(){
      //
      new VarProxy(this, 'func1', {
        //
        apply: (thisArg: string, argumentsList: any) => {
          doApply = true
          expect(thisArg).toBe(this)
          expect(argumentsList.length).toBe(2)
          expect(argumentsList[0]).toBe(100)
          expect(argumentsList[1]).toBe('XXX')
          return 'ZZZ'
        },
        executed: (thisArg: string, argumentsList: any, result: any) => {
          doExecuted = true
        }
        //
      })
      //
    }
    //
    public func1(num: number, txt: string): string{
      return num + txt
    }
    //
  }
  //
  const test = new Test()

  //
  const testResult = test.func1(100, 'XXX')
  expect(testResult).toBe('ZZZ')

  //
  expect(doApply).toBe(true)
  expect(doExecuted).toBe(false)

  done()
  //

})

//
test('func change executed', (done) => {
  //
  let doApply = false
  let doExecuted = false
  //
  class Test {
    //
    constructor(){
      //
      new VarProxy(this, 'func1', {
        //
        apply: (thisArg: string, argumentsList: any) => {
          doApply = true
          expect(thisArg).toBe(this)
          expect(argumentsList.length).toBe(2)
          expect(argumentsList[0]).toBe(100)
          expect(argumentsList[1]).toBe('XXX')
        },
        executed: (thisArg: string, argumentsList: any, result: any) => {
          doExecuted = true
          expect(thisArg).toBe(this)
          expect(argumentsList.length).toBe(2)
          expect(argumentsList[0]).toBe(100)
          expect(argumentsList[1]).toBe('XXX')
          expect(result).toBe('100XXX')
          return 'QQQ'
        }
        //
      })
      //
    }
    //
    public func1(num: number, txt: string): string{
      return num + txt
    }
    //
  }
  //
  const test = new Test()

  //
  const testResult = test.func1(100, 'XXX')
  expect(testResult).toBe('QQQ')

  //
  expect(doApply).toBe(true)
  expect(doExecuted).toBe(true)

  done()
  //

})

//
test('var', (done) => {
  //
  let doGet = false
  let doSet = false
  let doAfterSet = false
  let doUpdate = false
  //
  class Test {
    //
    public testValue: number = 5
    //
    constructor(){
      //
      new VarProxy(this, 'testValue', {
        //
        get: () => {
          doGet = true
        },
        set: (newVal: any) => {
          doSet = true
          expect(newVal).toBe(100)
        },
        afterSet: (newVal: any) => {
          doAfterSet = true
          expect(newVal).toBe(100)
        },
        update: (newVal: any/*, oldVal: any*/) => {
          doUpdate = true
          ////expect(oldVal).toBe(5)
          expect(newVal).toBe(100)
        }
        //
      })
      //
    }
    //
  }
  //
  const test = new Test()
  //
  test.testValue = 100

  //
  expect(doGet).toBe(false)
  expect(doSet).toBe(true)
  expect(doAfterSet).toBe(true)
  expect(doUpdate).toBe(true)

  //
  expect(test.testValue).toBe(100)

  //
  expect(doGet).toBe(true)
  expect(doSet).toBe(true)
  expect(doUpdate).toBe(true)

  //
  done()
  //

})

//
test('var change get', (done) => {
  //
  let doGet = false
  let doSet = false
  let doAfterSet = false
  let doUpdate = false
  //
  class Test {
    //
    public testValue: number = 5
    //
    constructor(){
      //
      new VarProxy(this, 'testValue', {
        //
        get: () => {
          doGet = true
          return 999
        },
        set: (newVal: any) => {
          doSet = true
          //
        },
        afterSet: (newVal: any) => {
          doAfterSet = true
          //
        },
        update: (newVal: any/*, oldVal: any*/) => {
          doUpdate = true
          //
        }
        //
      })
      //
    }
    //
  }
  //
  const test = new Test()
  //
  const x = test.testValue
  expect(x).toBe(999)
  //
  expect(doGet).toBe(true)
  expect(doSet).toBe(false)
  expect(doAfterSet).toBe(false)
  expect(doUpdate).toBe(false)

  //
  done()
  //

})

//
test('var change set', (done) => {
  //
  let doGet = false
  let doSet = false
  let doAfterSet = false
  let doUpdate = false
  //
  class Test {
    //
    public testValue: number = 5
    //
    constructor(){
      //
      new VarProxy(this, 'testValue', {
        //
        get: () => {
          doGet = true
          //
        },
        set: (newVal: any) => {
          doSet = true
          return 5000
        },
        afterSet: (newVal: any) => {
          doAfterSet = true
          expect(newVal).toBe(5000)
        },
        update: (newVal: any/*, oldVal: any*/) => {
          doUpdate = true
          ////expect(oldVal).toBe(5)
          expect(newVal).toBe(5000)
        }
        //
      })
      //
    }
    //
  }
  //
  const test = new Test()
  //
  const x = test.testValue
  expect(x).toBe(5)
  //
  test.testValue = 200
  expect(test.testValue).toBe(5000)

  //
  expect(doGet).toBe(true)
  expect(doSet).toBe(true)
  expect(doAfterSet).toBe(true)
  expect(doUpdate).toBe(true)
  //
  done()
  //

})

//
test('object', (done) => {
  //
  let doGet = false
  let doSet = false
  let doUpdate = false
  //
  class Test {
    //
    public testObject: any = {a: 5, b: 10}
    //
    constructor(){
      //
      new VarProxy(this, 'testObject', {
        //
        get: () => {
          doGet = true
        },
        set: (newVal: any) => {
          doSet = true
          expect(newVal.z).toBe(100)
          expect(newVal.y).toBe(200)
        },
        update: (newVal: any/*, oldVal: any*/) => {
          doUpdate = true
          //expect(oldVal.a).toBe(5)
          //expect(oldVal.b).toBe(10)
          expect(newVal.z).toBe(100)
          expect(newVal.y).toBe(200)
        }
        //
      })
      //
    }
    //
  }
  //
  const test = new Test()
  //
  test.testObject = {z: 100, y: 200}
  //
  expect(doGet).toBe(false)
  expect(doSet).toBe(true)
  expect(doUpdate).toBe(true)

  //
  expect(test.testObject.z).toBe(100)
  expect(test.testObject.y).toBe(200)


  //
  done()
  //

})

//
test('object non deep', (done) => {
  //
  let doGet = false
  let doSet = false
  let doUpdate = false
  //
  class Test {
    //
    public testObject: any = {a: 5, b: 10}
    //
    constructor(){
      //
      new VarProxy(this, 'testObject', {
        //
        get: () => {
          doGet = true
        },
        set: (newVal: any) => {
          doSet = true
        },
        update: (newVal: any/*, oldVal: any*/) => {
          doUpdate = true
        }
        //
      })
      //
    }
    //
  }
  //
  const test = new Test()

  //
  const x = test.testObject
  expect(x.a).toBe(5)
  expect(x.b).toBe(10)

  //
  test.testObject.c = 3
  expect(test.testObject.a).toBe(5)
  expect(test.testObject.b).toBe(10)
  expect(test.testObject.c).toBe(3)

  //
  expect(doGet).toBe(true)
  expect(doSet).toBe(false)
  expect(doUpdate).toBe(false)
  //

  //
  done()
  //

})

//
test('object deep', (done) => {
  //
  let doGet = false
  let doSet = false
  let doUpdate = false
  //
  class Test {
    //
    public testObject: any = {a: 5, b: 10}
    //
    constructor(){
      //
      new VarProxy(this, 'testObject', {
        //
        get: () => {
          doGet = true
        },
        set: (newVal: any) => {
          doSet = true
          //
          expect(newVal.a).toBe(5)
          expect(newVal.b).toBe(10)
          expect(newVal.c).toBe(3)
          //
        },
        update: (newVal: any/*, oldVal: any*/) => {
          doUpdate = true
          //
          //expect(oldVal.a).toBe(5)
          //expect(oldVal.b).toBe(10)
          //expect(oldVal.c).toBe(undefined)
          //
          expect(newVal.a).toBe(5)
          expect(newVal.b).toBe(10)
          expect(newVal.c).toBe(3)
          ///
          expect(doGet).toBe(true)
          expect(doSet).toBe(true)
          expect(doUpdate).toBe(true)
          //
          done()
          //
        }
        //
      }, {deep: true})
      //
    }
    //
  }

  //
  const test = new Test()
  test.testObject.c = 3

  //
  expect(doGet).toBe(true)
  expect(doSet).toBe(false)
  expect(doUpdate).toBe(false)

  //
  expect(test.testObject.a).toBe(5)
  expect(test.testObject.b).toBe(10)
  expect(test.testObject.c).toBe(3)

  //
})

//
test('object deep 2', (done) => {
  //
  let doGet = false
  let doSet = false
  let doUpdate = false
  //
  class Test {
    //
    public testObject: any = {a: 5, b: 10}
    //
    constructor(){
      //
      new VarProxy(this, 'testObject', {
        //
        get: () => {
          doGet = true
        },
        set: (newVal: any) => {
          doSet = true
          //
          expect(newVal.x).toBe(100)
          expect(newVal.y).toBe(200)
          expect(newVal.z).toBe(300)
          //
        },
        update: (newVal: any/*, oldVal: any*/) => {
          doUpdate = true
          //
          expect(newVal.x).toBe(100)
          expect(newVal.y).toBe(200)
          expect(newVal.z).toBe(300)
          //
          //expect(oldVal.a).toBe(5)
          //expect(oldVal.b).toBe(10)
          //expect(oldVal.c).toBe(undefined)
          ///
          expect(doGet).toBe(false)
          expect(doSet).toBe(true)
          expect(doUpdate).toBe(true)
          //
        }
        //
      }, {deep: true})
      //
    }
    //
  }
  //
  const test = new Test()
  test.testObject = {x:100, y:200, z:300}
  //
  expect(doGet).toBe(false)
  expect(doSet).toBe(true)
  expect(doUpdate).toBe(true)

  //
  expect(test.testObject.x).toBe(100)
  expect(test.testObject.y).toBe(200)
  expect(test.testObject.z).toBe(300)

  //
  expect(doGet).toBe(true)
  expect(doSet).toBe(true)
  expect(doUpdate).toBe(true)

  //
  done()
  //
})

//
test('array', (done) => {
  //
  let doGet = false
  let doSet = false
  let doUpdate = false
  //
  class Test {
    //
    public testArray: any[] = [5,10]
    //
    constructor(){
      //
      new VarProxy(this, 'testArray', {
        //
        get: () => {
          doGet = true
        },
        set: (newVal: any) => {
          doSet = true
          expect(newVal[0]).toBe(100)
          expect(newVal[1]).toBe(200)
        },
        update: (newVal: any/*, oldVal: any*/) => {
          doUpdate = true
          //expect(oldVal[0]).toBe(5)
          //expect(oldVal[1]).toBe(10)
          expect(newVal[0]).toBe(100)
          expect(newVal[1]).toBe(200)
        }
        //
      })
      //
    }
    //
  }
  //
  const test = new Test()

  //
  test.testArray = [100, 200]
  //
  //
  expect(doGet).toBe(false)
  expect(doSet).toBe(true)
  expect(doUpdate).toBe(true)
  //
  expect(test.testArray[0]).toBe(100)
  expect(test.testArray[1]).toBe(200)

  //
  expect(doGet).toBe(true)
  expect(doSet).toBe(true)
  expect(doUpdate).toBe(true)

  //
  done()
  //

})

//
test('array non deep', (done) => {
  //
  let doGet = false
  let doSet = false
  let doUpdate = false
  //
  class Test {
    //
    public testArray: any[] = [5,10]
    //
    constructor(){
      //
      new VarProxy(this, 'testArray', {
        //
        get: () => {
          doGet = true
        },
        set: (newVal: any) => {
          doSet = true
        },
        update: (newVal: any/*, oldVal: any*/) => {
          doUpdate = true
        }
        //
      })
      //
    }
    //
  }
  //
  const test = new Test()

  //
  test.testArray[10] = 500

  //
  expect(doGet).toBe(true)
  expect(doSet).toBe(false)
  expect(doUpdate).toBe(false)

  //
  expect(test.testArray[0]).toBe(5)
  expect(test.testArray[1]).toBe(10)
  expect(test.testArray[10]).toBe(500)

  //
  const x = test.testArray
  expect(x[0]).toBe(5)
  expect(x[1]).toBe(10)

  //
  expect(doGet).toBe(true)
  expect(doSet).toBe(false)
  expect(doUpdate).toBe(false)

  //
  done()
  //


})

//
test('array deep', (done) => {
  //
  let doGet = false
  let doSet = false
  let doUpdate = false
  //
  class Test {
    //
    public testArray: any[] = [5,10]
    //
    constructor(){
      //
      new VarProxy(this, 'testArray', {
        //
        get: () => {
          doGet = true
        },
        set: (newVal: any) => {
          doSet = true
          //
          // expect(newVal.length).toBe(3)
          expect(newVal[0]).toBe(5)
          expect(newVal[1]).toBe(10)
          expect(newVal[10]).toBe(500)
          //
        },
        update: (newVal: any/*, oldVal: any*/) => {
          doUpdate = true
          //
          //expect(oldVal[0]).toBe(5)
          //expect(oldVal[1]).toBe(10)
          //expect(oldVal[10]).toBe(undefined)
          //
          // expect(newVal.length).toBe(3)
          expect(newVal[0]).toBe(5)
          expect(newVal[1]).toBe(10)
          expect(newVal[10]).toBe(500)

          //
          expect(doGet).toBe(true)
          expect(doSet).toBe(true)
          expect(doUpdate).toBe(true)
          //
          done()
          //
        }
        //
      }, {deep: true})
      //
    }
    //
  }
  //
  const test = new Test()
  //
  test.testArray[10] = 500
  //
  expect(doGet).toBe(true)
  expect(doSet).toBe(false)
  expect(doUpdate).toBe(false)

  //
  expect(test.testArray[0]).toBe(5)
  expect(test.testArray[1]).toBe(10)
  expect(test.testArray[10]).toBe(500)

  //
  expect(doGet).toBe(true)
  expect(doSet).toBe(false)
  expect(doUpdate).toBe(false)

})

//
test('array non deep push', (done) => {
  //
  let doGet = false
  let doSet = false
  let doUpdate = false
  //
  class Test {
    //
    public testArray: any[] = [5,10]
    //
    constructor(){
      //
      new VarProxy(this, 'testArray', {
        //
        get: () => {
          doGet = true
        },
        set: (newVal: any) => {
          doSet = true
          //
          expect(newVal[0]).toBe(5)
          expect(newVal[1]).toBe(10)
          expect(newVal[2]).toBe(500)
          //
        },
        update: (newVal: any/*, oldVal: any*/) => {
          doUpdate = true
          //
          ///console.log(oldVal)
          //
          //expect(oldVal[0]).toBe(5)
          //expect(oldVal[1]).toBe(10)
          //// //expect(oldVal[2]).toBe(undefined) // TODO:
          //
          expect(newVal[0]).toBe(5)
          expect(newVal[1]).toBe(10)
          expect(newVal[2]).toBe(500)
          //
          expect(doGet).toBe(true)
          expect(doSet).toBe(true)
          expect(doUpdate).toBe(true)
          //
          done()
          //
        }
        //
      })
      //
    }
    //
  }
  //
  const test = new Test()
  //
  test.testArray.push(500)
  //
  expect(doGet).toBe(true)
  expect(doSet).toBe(false)
  expect(doUpdate).toBe(false)

  //
  expect(test.testArray[0]).toBe(5)
  expect(test.testArray[1]).toBe(10)
  expect(test.testArray[2]).toBe(500)


})
