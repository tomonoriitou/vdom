/**
 * @jest-environment jsdom
 */
// tslint:disable: no-unused-expression
// tslint:disable: max-classes-per-file
import VDom from './TestVDom'
import { VDomComponent, Component, Prop } from '../src'

//
@Component({
  template: '<span :class="cl" class="COMPONENT_CLASS" style="color: #fff;">{{prop}}</span>'
})
class CompD extends VDomComponent {
  //
  @Prop({default: ''})
  public prop!: string
  //
  public cl: string = 'XXX'
  //
}

//
test('component class marge', async () => {
  //
  @Component({
    components: {
      CompD,
    },
    template: `<div><CompD :prop="'D'" :class="cl" class="PARENT_CLASS" style="color: #f00;"></CompC></div>`
  })
  class Test extends VDom {
    public cl: string = 'YYY'
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div><span class="YYY PARENT_CLASS XXX COMPONENT_CLASS" style="color: #f00; color: #fff;">D</span></div>')
    },
    execute: () => {
      test.cl = 'ZZZ'
    },
    updated: (output: Element) => {
      expect(output.innerHTML).toBe('<div><span class="ZZZ PARENT_CLASS XXX COMPONENT_CLASS" style="color: #f00; color: #fff;">D</span></div>')
    }
  })
  //
})
