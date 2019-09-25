/**
 * @jest-environment jsdom
 */
// tslint:disable: no-unused-expression
// tslint:disable: max-classes-per-file
import VDom from '../src'
import TestVDom from './TestVDom'
import { VDomComponent, Component, Prop } from '../src'

//
test('radio test', async () => {
  //
  document.body.innerHTML = '<div id="app"></div>'
  //
  @Component({
    template: `<div>`
      +`<input id="input0" type="radio" value="input0" v-model="vModel">`
      +`<input id="input1" type="radio" value="input1" v-model="vModel">`
      +`</div>`
  })
  class Test extends TestVDom {
    public vModel: string = 'input0'
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount('#app')
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe(`<div>`
        +`<input id="input0" type="radio" value="input0">`
        +`<input id="input1" type="radio" value="input1">`
        +`</div>`)
    },
    execute: () => {
      //
      const ele0 = document.querySelector('#input0')
      const ele1 = document.querySelector('#input1')
      if(!ele0 || !ele1){
        expect(true).toBe(false)
        return
      }
      //
      expect((ele0 as HTMLInputElement).checked).toBe(true)
      expect((ele1 as HTMLInputElement).checked).toBe(false)
      test.vModel = 'input1'
    },
    updated: (output: Element) => {
      //
      const ele0 = document.querySelector('#input0')
      const ele1 = document.querySelector('#input1')
      if(!ele0 || !ele1){
        expect(true).toBe(false)
        return
      }
      //
      expect((ele0 as HTMLInputElement).checked).toBe(false)
      expect((ele1 as HTMLInputElement).checked).toBe(true)
    }
  })
  //
})


//
test('radio test', async () => {
  //
  document.body.innerHTML = '<div id="app"></div>'
  //
  @Component({
    template: `<div>`
      +`<input id="input0" type="radio" value="input0" v-model="vModel">`
      +`<input id="input1" type="radio" value="input1" v-model="vModel">`
      +`</div>`
  })
  class Test extends TestVDom {
    public vModel: string = 'input0'
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount('#app')
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe(`<div>`
        +`<input id="input0" type="radio" value="input0">`
        +`<input id="input1" type="radio" value="input1">`
        +`</div>`)
    },
    execute: () => {
      //
      const ele0 = document.querySelector('#input0')
      const ele1 = document.querySelector('#input1')
      if(!ele0 || !ele1){
        expect(true).toBe(false)
        return
      }
      //
      (ele1 as HTMLInputElement).checked = true
      //
      const e = new CustomEvent('change')
      ele1.dispatchEvent(e)
      //
    },
    updated: (output: Element) => {
      //
      const ele0 = document.querySelector('#input0')
      const ele1 = document.querySelector('#input1')
      if(!ele0 || !ele1){
        expect(true).toBe(false)
        return
      }
      //
      expect((ele0 as HTMLInputElement).checked).toBe(false)
      expect((ele1 as HTMLInputElement).checked).toBe(true)
    }
  })
  //
})
