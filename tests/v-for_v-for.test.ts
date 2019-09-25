/**
 * @jest-environment jsdom
 */
// tslint:disable: no-unused-expression
// tslint:disable: max-classes-per-file
import VDom from './TestVDom'
import { VDomComponent, Component, Prop } from '../src'

//
@Component({
  template: '<span>{{x}}-{{y}}-{{z}}</span>'
})
class Comp extends VDomComponent {
  @Prop()
  public x: number = 0
  @Prop()
  public y: number = 0
  @Prop()
  public z: number = 0
}

//
doTest(0)
doTest(1)
doTest(100)

//
function doTest(maxCache: number){

  //
  test('component base test', async () => {
    //
    @Component({
      components: {
        Comp,
      },
      template: '<div><template v-for="y in yList"><template v-for="x in xList"><Comp :x="x" :y="y" :z="z"></Comp></template></template></div>'
    })
    class Test extends VDom {
      //
      public $maxCache: number = maxCache
      public $maxComponentCache: number = maxCache
          //
      public xList: number[] = [0]
      public yList: number[] = [0]
      public z: number = 0
    }
    //
    const test = new Test()
    //
    await test.$test({
      init: () => {
        test.$mount(document.createElement('div'))
      },
      mounted: (output: Element) => {
        expect(output.innerHTML).toBe('<div><span>0-0-0</span></div>')
      },
    })
    //
    await test.$test({
      execute: () => {
        test.xList.push(9)
      },
      updated: (output: Element) => {
        expect(output.innerHTML).toBe('<div><span>0-0-0</span><span>9-0-0</span></div>')
      },
    })
    //
    await test.$test({
      execute: () => {
        test.xList.push(99)
      },
      updated: (output: Element) => {
        expect(output.innerHTML).toBe('<div><span>0-0-0</span><span>9-0-0</span><span>99-0-0</span></div>')
      },
    })
    //
    await test.$test({
      execute: () => {
        test.xList.splice(1,1)
      },
      updated: (output: Element) => {
        expect(output.innerHTML).toBe('<div><span>0-0-0</span><span>99-0-0</span></div>')
      },
    })
    //
    await test.$test({
      execute: () => {
        test.xList.push(9)
      },
      updated: (output: Element) => {
        expect(output.innerHTML).toBe('<div><span>0-0-0</span><span>99-0-0</span><span>9-0-0</span></div>')
      },
    })

    //
    await test.$test({
      execute: () => {
        test.yList.push(5)
      },
      updated: (output: Element) => {
        expect(output.innerHTML).toBe('<div>'
        +'<span>0-0-0</span><span>99-0-0</span><span>9-0-0</span>'
        +'<span>0-5-0</span><span>99-5-0</span><span>9-5-0</span>'
        +'</div>')
      },
    })
    //
    await test.$test({
      execute: () => {
        test.yList.push(55)
      },
      updated: (output: Element) => {
        expect(output.innerHTML).toBe('<div>'
        +'<span>0-0-0</span><span>99-0-0</span><span>9-0-0</span>'
        +'<span>0-5-0</span><span>99-5-0</span><span>9-5-0</span>'
        +'<span>0-55-0</span><span>99-55-0</span><span>9-55-0</span>'
        +'</div>')
      },
    })
    //
    await test.$test({
      execute: () => {
        test.yList.splice(1,1)
      },
      updated: (output: Element) => {
        expect(output.innerHTML).toBe('<div>'
        +'<span>0-0-0</span><span>99-0-0</span><span>9-0-0</span>'
        +'<span>0-55-0</span><span>99-55-0</span><span>9-55-0</span>'
        +'</div>')
      },
    })
    //
    await test.$test({
      execute: () => {
        test.yList.push(5)
      },
      updated: (output: Element) => {
        expect(output.innerHTML).toBe('<div>'
        +'<span>0-0-0</span><span>99-0-0</span><span>9-0-0</span>'
        +'<span>0-55-0</span><span>99-55-0</span><span>9-55-0</span>'
        +'<span>0-5-0</span><span>99-5-0</span><span>9-5-0</span>'
        +'</div>')
      },
    })

    //
    await test.$test({
      execute: () => {
        test.z = 88
      },
      updated: (output: Element) => {
        expect(output.innerHTML).toBe('<div>'
        +'<span>0-0-88</span><span>99-0-88</span><span>9-0-88</span>'
        +'<span>0-55-88</span><span>99-55-88</span><span>9-55-88</span>'
        +'<span>0-5-88</span><span>99-5-88</span><span>9-5-88</span>'
        +'</div>')
      },
    })



    //
  })

}
