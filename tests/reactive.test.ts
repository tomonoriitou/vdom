/**
 * @jest-environment jsdom
 */
// tslint:disable: no-unused-expression
// tslint:disable: max-classes-per-file
import VDom from './TestVDom'
import { Component } from '../src'

//
class CompA extends VDom {
  //
  public static template: string = '<div>A<slot></slot><slot name="ext"></slot></div>'
  //
}
//
class CompB extends VDom {
  //
  public static template: string = '<span>B<slot></slot><slot name="ext"></slot></span>'
  //
}

//
test('basic number', async () => {

  //
  @Component({
    template: '<div>{{v}}</div>'
  })
  class Test extends VDom {
    public v: number = 0
  }
  const test = new Test()

  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (ele: Element) => {
      expect(ele.innerHTML).toBe('<div>0</div>')
    },
    execute: () => {
      test.v = 5
    },
    updated: (ele: Element) => {
      expect(ele.innerHTML).toBe('<div>5</div>')
    },
  })
  //
  await test.$test({
    execute: () => {
      test.v = 8
    },
    updated: (ele: Element) => {
      expect(ele.innerHTML).toBe('<div>8</div>')
    },
  })
  //

})

//
test('basic component is', async () => {
  //
  @Component({
    components: {
      CompA,
      CompB,
    },
    template: '<div><component :is="comp"></component></div>'
  })
  class Test extends VDom {
    public comp: string = 'CompA'
  }
  //
  const test = new Test()

  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (ele: Element) => {
      expect(ele.innerHTML).toBe('<div><div>A</div></div>')
    },
    execute: () => {
      test.comp = 'CompB'
    },
    updated: (ele: Element) => {
      expect(ele.innerHTML).toBe('<div><span>B</span></div>')
    },
  })
  //
  await test.$test({
    execute: () => {
      test.comp = 'CompA'
    },
    updated: (ele: Element) => {
      expect(ele.innerHTML).toBe('<div><div>A</div></div>')
    },
  })
  //
})

//
test('basic component is no cache', async () => {
  //
  @Component({
    components: {
      CompA,
      CompB,
    },
    template: '<div><component :is="comp"></component></div>'
  })
  class Test extends VDom {
    public comp: string = 'CompA'
    constructor(){
      super()
      this.$maxComponentCache = 1
    }
  }
  //
  const test = new Test()

  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (ele: Element) => {
      expect(ele.innerHTML).toBe('<div><div>A</div></div>')
    },
    execute: () => {
      test.comp = 'CompB'
    },
    updated: (ele: Element) => {
      expect(ele.innerHTML).toBe('<div><span>B</span></div>')
    },
  })
  //
  await test.$test({
    execute: () => {
      test.comp = 'CompA'
    },
    updated: (ele: Element) => {
      expect(ele.innerHTML).toBe('<div><div>A</div></div>')
    },
  })
  //
})
