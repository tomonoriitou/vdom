/**
 * @jest-environment jsdom
 */
// tslint:disable: no-unused-expression
// tslint:disable: max-classes-per-file
import VDom from './TestVDom'

//
test('basic no dom', async () => {
  //
  class Test extends VDom {
    public static template: string = '<div><span v-html="html"><span></div>'
    //
    public html:string = '<a href="#">TEST</a>'
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
      expect(output.innerHTML).toBe('<div><a href="#">TEST</a></div>')
    },
    execute: () => {
      test.html = '[<a href="#">TEST</a>][<a href="#2">TEST2</a>]'
    },
    updated: (output: Element) => {
      expect(output.innerHTML).toBe('<div>[<a href="#">TEST</a>][<a href="#2">TEST2</a>]</div>')
    }
  })
  //
})
