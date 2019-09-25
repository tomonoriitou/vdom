/**
 * @jest-environment jsdom
 */
// tslint:disable: no-unused-expression
// tslint:disable: max-classes-per-file
import VDom from './TestVDom'
import { Component } from '../src'

//
test('basic', async () => {
  //
  @Component({
    template: '<div><!--COMMENT1--><!---COMMENT_IGUNORE--></div>'
  })
  class Test extends VDom {
  }
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div><!--COMMENT1--></div>')
    }
  })
  //
})

//
test('basic', async () => {
  //
  @Component({
    template: '<div><!--COMMENT1--><!---COMMENT_IGUNORE--></div>',
    comments: false
  })
  class Test extends VDom {
  }
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div></div>')
    }
  })
  //
})
