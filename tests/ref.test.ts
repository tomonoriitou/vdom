/**
 * @jest-environment jsdom
 */
// tslint:disable: no-unused-expression
// tslint:disable: max-classes-per-file
import VDom from './TestVDom'
import { VDomComponent, Component, Prop } from '../src'

//
@Component({
  template: '<div>{{n}}</div>'
})
class Comp extends VDomComponent {
  @Prop()
  public n: number = 100
}

//
test('array', async () => {
  //
  @Component({
    components:{
      Comp
    },
    template: '<div><span ref="span"></span><Comp ref="comp"></Comp></div>'
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
      expect(test.$refs['span'] instanceof HTMLSpanElement).toBe(true)
      expect(test.$refs['comp'] instanceof Comp).toBe(true)
    }
  })
  //
})

//
test('array', async () => {
  //
  @Component({
    components:{
      Comp
    },
    template: '<div><span v-for="n in 3" ref="spans">{{n}}</span></div>'
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
      //
      expect(test.$refs['spans'][0] instanceof HTMLSpanElement).toBe(true)
      expect(test.$refs['spans'][1] instanceof HTMLSpanElement).toBe(true)
      expect(test.$refs['spans'][2] instanceof HTMLSpanElement).toBe(true)
      //
      expect(test.$refs['spans'][0].outerHTML).toBe('<span>0</span>')
      expect(test.$refs['spans'][1].outerHTML).toBe('<span>1</span>')
      expect(test.$refs['spans'][2].outerHTML).toBe('<span>2</span>')
      //
    }
  })
  //
})

//
test('array', async () => {
  //
  @Component({
    components:{
      Comp
    },
    template: '<div><Comp v-for="n in 3" ref="comps" :n="n"></Comp></div>'
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
      //
      expect(test.$refs['comps'][0] instanceof Comp).toBe(true)
      expect(test.$refs['comps'][1] instanceof Comp).toBe(true)
      expect(test.$refs['comps'][2] instanceof Comp).toBe(true)
      //
      expect(test.$refs['comps'][0].$el.outerHTML).toBe('<div>0</div>')
      expect(test.$refs['comps'][1].$el.outerHTML).toBe('<div>1</div>')
      expect(test.$refs['comps'][2].$el.outerHTML).toBe('<div>2</div>')
      //
    }
  })
  //
})
//
