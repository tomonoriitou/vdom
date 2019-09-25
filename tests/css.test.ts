/**
 * @jest-environment jsdom
 */
// tslint:disable: no-unused-expression
// tslint:disable: max-classes-per-file
import VDom from './TestVDom'
import { Component, Prop } from '../src'

//
test('basic no dom', async () => {
  //
  @Component({
    template : '<div><span></span></div>',
    css: '.dummy{ color: #f00; }'
  })
  class Test extends VDom {
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe(`<div ${test.$componentId}=""><span ${test.$componentId}=""></span></div>`)
    },
  })
  //
})
