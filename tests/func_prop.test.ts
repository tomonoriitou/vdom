/**
 * @jest-environment jsdom
 */
// tslint:disable: no-unused-expression
// tslint:disable: max-classes-per-file
import VDom from './TestVDom'
import { Component,Prop } from '../src'

//
@Component({
  template: '<span>{{a}}@{{b}}</span>'
})
class Comp extends VDom {
  @Prop()
  public a: number = 1

  @Prop()
  public b: number = 2
}

//
test('funcparam', async () => {
  //
  @Component({
    components: {
      Comp
    },
    template: '<div><Comp :a="funcA()" :b="funcB"></Comp></div>'

  })
  class Test extends VDom {

    //
    public srcA: number = 100
    public srcB: number = 200

    //
    public funcA(){
      return this.srcA + this.srcB
    }
    //
    public funcB(){
      return this.srcA - this.srcB
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
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div><span>300@-100</span></div>')
    },
    execute: () => {
      test.srcA = 500
    },
    updated: (output: Element) => {
      expect(output.innerHTML).toBe('<div><span>700@300</span></div>')
    },
  })
  //
})


//
test('funcparam', async () => {
  //
  @Component({
    components: {
      Comp
    },
    template: '<div><Comp :a="funcA" :b="funcB"></Comp></div>'

  })
  class Test extends VDom {

    //
    public srcA: number = 100
    public srcB: number = 200

    //
    get funcA(){
      return this.srcA + this.srcB
    }
    //
    get funcB(){
      return this.srcA - this.srcB
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
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div><span>300@-100</span></div>')
    },
    execute: () => {
      test.srcA = 500
    },
    updated: (output: Element) => {
      expect(output.innerHTML).toBe('<div><span>700@300</span></div>')
    },
  })
  //
})
