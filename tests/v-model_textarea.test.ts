/**
 * @jest-environment jsdom
 */
// tslint:disable: no-unused-expression
// tslint:disable: max-classes-per-file
import VDom from '../src'
import TestVDom from './TestVDom'
import { VDomComponent, Component, Prop } from '../src'

//
test('mountTest base test', async () => {
  //
  document.body.innerHTML = '<div id="app"></div>'
  //
  @Component({
    template: `<div><textarea id="input" v-model="vModel"></textarea></div>`
  })
  class Test extends TestVDom {
    public vModel: string = 'EE'
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount('#app')
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div><textarea id="input"></textarea></div>')
    },
    execute: () => {
      const el = document.querySelector('#input')
      if(!el){
        expect(true).toBe(false)
        return
      }
      expect((el as HTMLInputElement).value).toBe('EE')
      test.vModel = 'AAAAA'
    },
    updated: (output: Element) => {
      const el = document.querySelector('#input')
      if(!el){
        expect(true).toBe(false)
        return
      }
      expect((el as HTMLInputElement).value).toBe('AAAAA')
    }
  })
  //
})

//
test('mountTest base test', async () => {
  //
  document.body.innerHTML = '<div id="app"></div>'
  //
  @Component({
    template: `<div><textarea id="input" v-model="vModel"></textarea></div>`
  })
  class Test extends TestVDom {
    public vModel: string = ''
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount('#app')
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div><textarea id="input"></textarea></div>')
    },
    execute: () => {
      //
      const ele = document.querySelector('#input')
      if(!ele){
        expect(true).toBe(false)
        return
      }
      //
      (ele as HTMLInputElement).value = 'CCC'
      const e = new CustomEvent('input')
      ele.dispatchEvent(e)
      //
    },
    updated: (output: Element) => {
      expect(test.vModel).toBe('CCC')
    }
  })
  //
})
