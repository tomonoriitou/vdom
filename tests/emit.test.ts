/**
 * @jest-environment jsdom
 */
// tslint:disable: no-unused-expression
// tslint:disable: max-classes-per-file
import TestVDom from './TestVDom'
import { VDomComponent, Component, Prop, Emit } from '../src'

//
@Component({
  template: '<div>A</div>'
})
class Comp extends VDomComponent {

  //
  public mounted(){
    // console.log("COMP MOUNTED")
    //this.$emit('test', 'done')
    this.emit()
  }

  //
  @Emit('test')
  private emit(){
    return 'done'
  }
  //
}

//
test('basic no dom', async (done) => {
  //
  @Component({
    components: {
      Comp
    },
    template: '<div><Comp @test="EventHandler"></Comp></div>'
  })
  class Test extends TestVDom {
    public EventHandler(param: string){
      // console.log("COMP MOUNTED", param)
      expect(param).toBe('done')
      done()
    }
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div><div>A</div></div>')
    }
  })
  //
})
