/**
 * @jest-environment jsdom
 */
// tslint:disable: no-unused-expression
// tslint:disable: max-classes-per-file
import VDom, {sleep} from './TestVDom'
import { VDomComponent, Component, Prop } from '../src'

//
test('v-if', async () => {
  //
  @Component({
    components: {
    },
    template: `<div><transition
      @before-enter="trBeforeEnter"
      @enter="trEnter"
      @after-enter="trAfterEnter"
      @enter-cancelled="trEnterCancelled"
      @before-leave="trBeforeLeave"
      @leave="trLeave"
      @after-leave="trAfterLeave"
      @leave-cancelled="trLeaveCancelled"
    >`
    +'<span ref="vif" v-if="show">TRANSITION-IF</span>'
    +'<span ref="vshow" v-show="show">TRANSITION-SHOW</span>'
    +'</transition></div>',
    css: `
    .v-enter-active, .v-leave-active {
      transition: opacity 1.0s, color 1.0s;
    }
    .v-enter-to, .v-leave {
      opacity: 1.0;
    }
    .v-enter, .v-leave-to {
      opacity: 0;
    }`
  })
  class Test extends VDom {
    public show: boolean = true
    //
    public trBeforeEnter(){
      // console.log('■■■■ trBeforeEnter', this.$event)
    }
    //
    public trEnter(){
      // console.log('■■■■ trEnter', this.$event)
    }
    //
    public trAfterEnter(){
      // console.log('■■■■ trAfterEnter', this.$event)
    }
    //
    public trEnterCancelled(){
      // console.log('■■■■ trEnterCancelled', this.$event)
    }
    //
    public trBeforeLeave(){
      // console.log('■■■■ trBeforeLeave', this.$event)
    }
    //
    public trLeave(){
      // console.log('■■■■ trLeave', this.$event)
    }
    //
    public trAfterLeave(){
      // console.log('■■■■ trAfterLeave', this.$event)
    }
    //
    public trLeaveCancelled(){
      // console.log('■■■■ trLeaveCancelled', this.$event)
    }
    //
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: async (output: Element) => {
      //
      expect(output.innerHTML).toBe(`<div ${test.$componentId}="">`
        + `<span ${test.$componentId}="" class="v-enter v-enter-active">TRANSITION-IF</span>`
        + `<span ${test.$componentId}="" class="v-enter v-enter-active">TRANSITION-SHOW</span>`
        + '</div>')
      //
      await sleep(1500)
      //
      test.$vrefs['vif'].Public('resetTransitions')()
      test.$vrefs['vshow'].Public('resetTransitions')()
      //
      expect(output.innerHTML).toBe(`<div ${test.$componentId}="">`
        + `<span ${test.$componentId}="" class="">TRANSITION-IF</span>`
        + `<span ${test.$componentId}="" class="">TRANSITION-SHOW</span>`
        + '</div>')
      //
    },
    execute: () => {
      test.show = false
    },
    updated: async (output: Element) => {
      //
      expect(output.innerHTML).toBe(`<div ${test.$componentId}="">`
        + `<span ${test.$componentId}="" class="v-leave v-leave-active">TRANSITION-IF</span>`
        + `<span ${test.$componentId}="" class="v-leave v-leave-active">TRANSITION-SHOW</span>`
        + '</div>')
      //
      await sleep(1500)
      //
      test.$vrefs['vif'].Public('resetTransitions')()
      test.$vrefs['vshow'].Public('resetTransitions')()
      //
      expect(output.innerHTML).toBe(`<div ${test.$componentId}="">`
        + `<span ${test.$componentId}="" class="" style="display: none;">TRANSITION-SHOW</span>`
        + '</div>')
      //
    }
  })
  //
})

