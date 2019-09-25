/**
 * @jest-environment jsdom
 */
// tslint:disable: no-unused-expression
// tslint:disable: max-classes-per-file
import VDom from './TestVDom'
import { Component, Watch } from '../src'
import equal from 'deep-equal'

//
test('basic watch number', async (done) => {
  //
  class Test extends VDom {
    public static template: string = '<div></div>'
    //
    public num: number = 0
    //
    @Watch('num')
    public onChange(newVal: number/*, oldVal: number*/){
      expect(newVal).toBe(100)
      // expect(oldVal).toBe(0)
      done()
    }
    //
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    execute: () => {
      test.num = 100
    }
  })
  //
})

//
test('basic watch string', async (done) => {
  //
  class Test extends VDom {
    public static template: string = '<div></div>'
    //
    public str: string = ''
    //
    @Watch('str')
    public onChange(newVal: number/*, oldVal: number*/){
      expect(newVal).toBe('XX')
      // expect(oldVal).toBe('')
      done()
    }
    //
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    execute: () => {
      test.str = 'XX'
    }
  })
  //
})

//
test('basic watch boolean', async (done) => {
  //
  class Test extends VDom {
    public static template: string = '<div></div>'
    //
    public bool: boolean = false
    //
    @Watch('bool')
    public onChange(newVal: number/*, oldVal: number*/){
      expect(newVal).toBe(true)
      // expect(oldVal).toBe(false)
      done()
    }
    //
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    execute: () => {
      test.bool = true
    }
  })
  //
})

////////////////////////////////////////////////////////////////////////////////
// object
////////////////////////////////////////////////////////////////////////////////

//
test('basic watch objct', async (done) => {
  //
  class Test extends VDom {
    public static template: string = '<div></div>'
    //
    public obj: any = {}
    //
    @Watch('obj')
    public onChange(newVal: number/*, oldVal: number*/){
      expect(equal(newVal, {a:5})).toBe(true)
      // expect(equal(oldVal, {})).toBe(true)
      done()
    }
    //
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    execute: () => {
      test.obj = {a: 5}
    }
  })
  //
})

//
test('basic watch objct deep', async (done) => {
  //
  class Test extends VDom {
    public static template: string = '<div></div>'
    //
    public obj: any = {}
    //
    @Watch('obj', {deep: true})
    public onChange(newVal: number/*, oldVal: number*/){
      expect(equal(newVal, {a:5})).toBe(true)
      // expect(equal(oldVal, {})).toBe(true)
      done()
    }
    //
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    execute: () => {
      test.obj.a = 5
    }
  })
  //
})

//
test('basic watch objct $set', async (done) => {
  //
  class Test extends VDom {
    public static template: string = '<div></div>'
    //
    public obj: any = {}
    //
    @Watch('obj')
    public onChange(newVal: number/*, oldVal: number*/){
      expect(equal(newVal, {a:5})).toBe(true)
      // expect(equal(oldVal, {})).toBe(true)
      done()
    }
    //
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    execute: () => {
      test.$set(test.obj, 'a', 5)
    }
  })
  //
})


//
test('basic watch objct $delete', async (done) => {
  //
  class Test extends VDom {
    public static template: string = '<div></div>'
    //
    public obj: any = {x: 5}
    //
    @Watch('obj')
    public onChange(newVal: number/*, oldVal: number*/){
      expect(equal(newVal, {})).toBe(true)
      // expect(equal(oldVal, {x: 5})).toBe(true)
      done()
    }
    //
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    execute: () => {
      test.$delete(test.obj, 'x')
    }
  })
  //
})

////////////////////////////////////////////////////////////////////////////////
// array
////////////////////////////////////////////////////////////////////////////////

//
test('basic watch array', async (done) => {
  //
  class Test extends VDom {
    public static template: string = '<div></div>'
    //
    public arr: number[] = []
    //
    @Watch('arr')
    public onChange(newVal: number/*, oldVal: number*/){
      expect(equal(newVal, [2])).toBe(true)
      // // expect(equal(oldVal, [])).toBe(true)
      done()
    }
    //
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    execute: () => {
      test.arr = [2]
    }
  })
  //
})

//
test('basic watch array', async (done) => {
  //
  class Test extends VDom {
    public static template: string = '<div></div>'
    //
    public arr: number[] = [0]
    //
    @Watch('arr', {deep: true})
    public onChange(newVal: number/*, oldVal: number*/){
      expect(equal(newVal, [0,4])).toBe(true)
      // // expect(equal(oldVal, [0])).toBe(true)
      done()
    }
    //
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    execute: () => {
      test.arr[1] = 4
    }
  })
  //
})

//
test('basic watch array', async (done) => {
  //
  class Test extends VDom {
    public static template: string = '<div></div>'
    //
    public arr: number[] = [0]
    //
    @Watch('arr')
    public onChange(newVal: number/*, oldVal: number*/){
      expect(equal(newVal, [0,4])).toBe(true)
      // // expect(equal(oldVal, [0])).toBe(true)
      done()
    }
    //
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    execute: () => {
      test.arr.push(4)
    }
  })
  //
})

//
test('basic watch array', async (done) => {
  //
  class Test extends VDom {
    public static template: string = '<div></div>'
    //
    public arr: number[] = [0,1,2]
    //
    @Watch('arr')
    public onChange(newVal: number/*, oldVal: number*/){
      expect(equal(newVal, [0,1])).toBe(true)
      // // expect(equal(oldVal, [0,1,2])).toBe(true)
      done()
    }
    //
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    execute: () => {
      test.arr.pop()
    }
  })
  //
})

//
test('basic watch array', async (done) => {
  //
  class Test extends VDom {
    public static template: string = '<div></div>'
    //
    public arr: number[] = [0]
    //
    @Watch('arr')
    public onChange(newVal: number/*, oldVal: number*/){
      expect(equal(newVal, [4,0])).toBe(true)
      // // expect(equal(oldVal, [0])).toBe(true)
      done()
    }
    //
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    execute: () => {
      test.arr.unshift(4)
    }
  })
  //
})

//
test('basic watch array', async (done) => {
  //
  class Test extends VDom {
    public static template: string = '<div></div>'
    //
    public arr: number[] = [0,1,2]
    //
    @Watch('arr')
    public onChange(newVal: number/*, oldVal: number*/){
      expect(equal(newVal, [1,2])).toBe(true)
      // // expect(equal(oldVal, [0,1,2])).toBe(true)
      done()
    }
    //
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    execute: () => {
      test.arr.shift()
    }
  })
  //
})

//
test('basic watch array', async (done) => {
  //
  class Test extends VDom {
    public static template: string = '<div></div>'
    //
    public arr: number[] = [0,1,2]
    //
    @Watch('arr')
    public onChange(newVal: number/*, oldVal: number*/){
      expect(equal(newVal, [0,2])).toBe(true)
      // // expect(equal(oldVal, [0,1,2])).toBe(true)
      done()
    }
    //
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    execute: () => {
      test.arr.splice(1,1)
    }
  })
  //
})

//
test('basic watch array', async (done) => {
  //
  class Test extends VDom {
    public static template: string = '<div></div>'
    //
    public arr: number[] = [1,2,0]
    //
    @Watch('arr')
    public onChange(newVal: number/*, oldVal: number*/){
      expect(equal(newVal, [0,1,2])).toBe(true)
      // // expect(equal(oldVal, [1,2,0])).toBe(true)
      done()
    }
    //
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    execute: () => {
      test.arr.sort()
    }
  })
  //
})

//
test('basic watch array', async (done) => {
  //
  class Test extends VDom {
    public static template: string = '<div></div>'
    //
    public arr: number[] = [1,2,0]
    //
    @Watch('arr')
    public onChange(newVal: number/*, oldVal: number*/){
      expect(equal(newVal, [0,2,1])).toBe(true)
      // // expect(equal(oldVal, [1,2,0])).toBe(true)
      done()
    }
    //
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    execute: () => {
      test.arr.reverse()
    }
  })
  //
})
