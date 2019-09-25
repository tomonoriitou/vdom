/**
 * @jest-environment jsdom
 */
// tslint:disable: no-unused-expression
// tslint:disable: max-classes-per-file
import VDom from './TestVDom'

//
test('style dom', async () => {
  //
  class Test extends VDom {
    public static template: string = '<v-style>.sample{color:{{col}};}</v-style>'
    public col: string = '#F00'
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<style type="text/css">.sample{color:#F00;}</style>')
    }
  })
  //
})

//
