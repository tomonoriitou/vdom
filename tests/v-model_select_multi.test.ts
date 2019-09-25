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
    template: `<div><select multiple id="selectTag" v-model="vModel">`
      +`<option value="input0">s1</option>`
      +`<option value="input1">s2</option>`
      +`<option value="input2">s3</option>`
      +`</select></div>`
  })
  class Test extends TestVDom {
    public vModel: string[] = ['input0']
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount('#app')
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe(`<div><select multiple="" id="selectTag">`
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
      expect((ele as HTMLSelectElement).options[0].selected).toBe(true)
      expect((ele as HTMLSelectElement).options[1].selected).toBe(false)
      expect((ele as HTMLSelectElement).options[2].selected).toBe(false)
      test.vModel = ['input0', 'input2']
    },
    updated: (output: Element) => {
      //
      const ele = document.querySelector('#selectTag')
      if(!ele){
        expect(true).toBe(false)
        return
      }
      //
      expect((ele as HTMLSelectElement).options[0].selected).toBe(true)
      expect((ele as HTMLSelectElement).options[1].selected).toBe(false)
      expect((ele as HTMLSelectElement).options[2].selected).toBe(true)
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
    template: `<div><select multiple id="selectTag" v-model="vModel">`
      +`<option value="input0">s1</option>`
      +`<option value="input1">s2</option>`
      +`<option value="input2">s3</option>`
      +`</select></div>`
  })
  class Test extends TestVDom {
    public vModel: string[] = ['input0']
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount('#app')
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe(`<div><select multiple="" id="selectTag">`
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
      (ele as HTMLSelectElement).options[2].selected = true
      //
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
      expect(test.vModel.indexOf('input0') >= 0).toBe(true)
      expect(test.vModel.indexOf('input1') >= 0).toBe(false)
      expect(test.vModel.indexOf('input2') >= 0).toBe(true)
    }
  })
  //
})


