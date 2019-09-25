/**
 * @jest-environment jsdom
 */
// tslint:disable: no-unused-expression
// tslint:disable: max-classes-per-file
import VDom from '../src'
import TestVDom from './TestVDom'
import { VDomComponent, Component, Prop } from '../src'

//
test('select test', async () => {
  //
  document.body.innerHTML = '<div id="app"></div>'
  //
  @Component({
    template: `<div><select id="selectTag" v-model="vModel">`
      +`<option value="input0">s1</option>`
      +`<option value="input1">s2</option>`
      +`<option value="input2">s3</option>`
      +`</select></div>`
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
      expect(output.innerHTML).toBe(`<div><select id="selectTag">`
      +`<option value="input0">s1</option>`
      +`<option value="input1">s2</option>`
      +`<option value="input2">s3</option>`
      +`</select></div>`)
    },
    execute: () => {
      //
      const ele = document.querySelector('#selectTag')
      if(!ele){
        expect(true).toBe(false)
        return
      }
      //
      expect((ele as HTMLSelectElement).selectedIndex).toBe(0)
      test.vModel = 'input1'
    },
    updated: (output: Element) => {
      //
      const ele = document.querySelector('#selectTag')
      if(!ele){
        expect(true).toBe(false)
        return
      }
      //
      expect((ele as HTMLSelectElement).selectedIndex).toBe(1)
    }
  })
  //
})

//
test('select test', async () => {
  //
  document.body.innerHTML = '<div id="app"></div>'
  //
  @Component({
    template: `<div><select id="selectTag" v-model="vModel">`
      +`<option value="input0">s1</option>`
      +`<option value="input1">s2</option>`
      +`<option value="input2">s3</option>`
      +`</select></div>`
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
      expect(output.innerHTML).toBe(`<div><select id="selectTag">`
      +`<option value="input0">s1</option>`
      +`<option value="input1">s2</option>`
      +`<option value="input2">s3</option>`
      +`</select></div>`)
    },
    execute: () => {
      //
      const ele = document.querySelector('#selectTag')
      if(!ele){
        expect(true).toBe(false)
        return
      }
      //
      (ele as HTMLSelectElement).selectedIndex = 1
      const e = new CustomEvent('change')
      ele.dispatchEvent(e)
      //
    },
    updated: (output: Element) => {
      //
      const ele = document.querySelector('#selectTag')
      if(!ele){
        expect(true).toBe(false)
        return
      }
      //
      expect(test.vModel).toBe('input1')
    }
  })
  //
})


