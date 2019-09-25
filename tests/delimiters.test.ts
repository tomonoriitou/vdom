/**
 * @jest-environment jsdom
 */
// tslint:disable: no-unused-expression
// tslint:disable: max-classes-per-file
import VDom from './TestVDom'
import { Component } from '../src'

//
test('delimiters default', async () => {
  //
  @Component({
    template: '<div>{{message}}</div>',
  })
  class Test extends VDom {
    public message: string = 'MSG'
  }
  //
  const test = new Test()
  //
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (ele: Element) => {
      expect(ele.innerHTML).toBe('<div>MSG</div>')
    },
  })
  //
})

//
test('delimiters default', async () => {
  //
  @Component({
    template: '<div>[[message]]</div>',
    delimiters: ['[[', ']]']
  })
  class Test extends VDom {
    public message: string = 'MSG'
  }
  //
  const test = new Test()
  //
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (ele: Element) => {
      expect(ele.innerHTML).toBe('<div>MSG</div>')
    },
  })
  //
})
