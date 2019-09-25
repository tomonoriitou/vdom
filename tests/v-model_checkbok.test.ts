/**
 * @jest-environment jsdom
 */
// tslint:disable: no-unused-expression
// tslint:disable: max-classes-per-file
import VDom from '../src'
import TestVDom from './TestVDom'
import { VDomComponent, Component, Prop } from '../src'

//
test('checkbox', async () => {
  //
  document.body.innerHTML = '<div id="app"></div>'
  //
  @Component({
    template: `<div><input type="checkbox" id="input" v-model="vModel"></div>`
  })
  class Test extends TestVDom {
    public vModel: boolean = false
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount('#app')
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div><input type="checkbox" id="input"></div>')
    },
    execute: () => {
      const el = document.querySelector('#input')
      if(!el){
        expect(true).toBe(false)
        return
      }
      expect((el as HTMLInputElement).checked).toBe(false)
      //
      test.vModel = true
      //
    },
    updated: (output: Element) => {
      const el = document.querySelector('#input')
      if(!el){
        expect(true).toBe(false)
        return
      }
      expect((el as HTMLInputElement).checked).toBe(true)
    }
  })
  //
})

//
test('checkbox', async () => {
  //
  document.body.innerHTML = '<div id="app"></div>'
  //
  @Component({
    template: `<div><input type="checkbox" id="input" v-model="vModel"></div>`
  })
  class Test extends TestVDom {
    public vModel: boolean = false
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount('#app')
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div><input type="checkbox" id="input"></div>')
    },
    execute: () => {
      const ele = document.querySelector('#input')
      if(!ele){
        expect(true).toBe(false)
        return
      }
      expect(test.vModel).toBe(false)
      ;(ele as HTMLInputElement).checked = true
      //
      const e = new CustomEvent('change')
      ele.dispatchEvent(e)
      //
    },
    updated: (output: Element) => {
      const ele = document.querySelector('#input')
      if(!ele){
        expect(true).toBe(false)
        return
      }
      expect((ele as HTMLInputElement).checked).toBe(true)
      expect(test.vModel).toBe(true)
    }
  })
  //
})


//
test('checkbox', async () => {
  //
  document.body.innerHTML = '<div id="app"></div>'
  //
  @Component({
    template: '<div>'
      + '<input type="checkbox" id="input0" value="input0" v-model="vModel">'
      + '<input type="checkbox" id="input1" value="input1" v-model="vModel">'
      + '<input type="checkbox" id="input2" value="input2" v-model="vModel">'
      + '</div>'
  })
  class Test extends TestVDom {
    public vModel: string[] = ['input0']
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount('#app')
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div>'
        +'<input type="checkbox" id="input0" value="input0">'
        +'<input type="checkbox" id="input1" value="input1">'
        +'<input type="checkbox" id="input2" value="input2">'
        +'</div>')
    },
    execute: () => {
      //
      const ele0 = document.querySelector('#input0')
      const ele1 = document.querySelector('#input1')
      const ele2 = document.querySelector('#input2')
      if(!ele0 || !ele1 || !ele2){
        expect(true).toBe(false)
        return
      }
      //
      expect((ele0 as HTMLInputElement).checked).toBe(true)
      expect((ele1 as HTMLInputElement).checked).toBe(false)
      expect((ele2 as HTMLInputElement).checked).toBe(false)
      //
      ;(ele0 as HTMLInputElement).checked = true
      ;(ele1 as HTMLInputElement).checked = false
      ;(ele2 as HTMLInputElement).checked = true
      //
      const e = new CustomEvent('change')
      ele2.dispatchEvent(e)
      //
    },
    updated: (output: Element) => {
      //
      const ele0 = document.querySelector('#input0')
      const ele1 = document.querySelector('#input1')
      const ele2 = document.querySelector('#input2')
      if(!ele0 || !ele1 || !ele2){
        expect(true).toBe(false)
        return
      }
      expect((ele0 as HTMLInputElement).checked).toBe(true)
      expect((ele1 as HTMLInputElement).checked).toBe(false)
      expect((ele2 as HTMLInputElement).checked).toBe(true)
      //
      // console.log("=========================>", test.vModel)
      //
      expect(test.vModel.indexOf('input0') >= 0).toBe(true)
      expect(test.vModel.indexOf('input1') >= 0).toBe(false)
      expect(test.vModel.indexOf('input2') >= 0).toBe(true)
      //
    }
  })
  //
})


//
test('checkbox', async () => {
  //
  document.body.innerHTML = '<div id="app"></div>'
  //
  @Component({
    template: '<div>'
      + '<input type="checkbox" id="input0" value="input0" v-model="vModel">'
      + '<input type="checkbox" id="input1" value="input1" v-model="vModel">'
      + '<input type="checkbox" id="input2" value="input2" v-model="vModel">'
      + '</div>'
  })
  class Test extends TestVDom {
    public vModel: string[] = ['input0', 'input2']
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount('#app')
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div>'
        +'<input type="checkbox" id="input0" value="input0">'
        +'<input type="checkbox" id="input1" value="input1">'
        +'<input type="checkbox" id="input2" value="input2">'
        +'</div>')
    },
    execute: () => {
      //
      const ele0 = document.querySelector('#input0')
      const ele1 = document.querySelector('#input1')
      const ele2 = document.querySelector('#input2')
      if(!ele0 || !ele1 || !ele2){
        expect(true).toBe(false)
        return
      }
      //
      expect((ele0 as HTMLInputElement).checked).toBe(true)
      expect((ele1 as HTMLInputElement).checked).toBe(false)
      expect((ele2 as HTMLInputElement).checked).toBe(true)
      //
      ;(ele0 as HTMLInputElement).checked = true
      ;(ele1 as HTMLInputElement).checked = false
      ;(ele2 as HTMLInputElement).checked = false
      //
      const e = new CustomEvent('change')
      ele2.dispatchEvent(e)
      //
    },
    updated: (output: Element) => {
      //
      const ele0 = document.querySelector('#input0')
      const ele1 = document.querySelector('#input1')
      const ele2 = document.querySelector('#input2')
      if(!ele0 || !ele1 || !ele2){
        expect(true).toBe(false)
        return
      }
      expect((ele0 as HTMLInputElement).checked).toBe(true)
      expect((ele1 as HTMLInputElement).checked).toBe(false)
      expect((ele2 as HTMLInputElement).checked).toBe(false)
      //
      // console.log("=========================>", test.vModel)
      //
      expect(test.vModel.indexOf('input0') >= 0).toBe(true)
      expect(test.vModel.indexOf('input1') >= 0).toBe(false)
      expect(test.vModel.indexOf('input2') >= 0).toBe(false)
      //
    }
  })
  //
})


//
test('checkbox', async () => {
  //
  document.body.innerHTML = '<div id="app"></div>'
  //
  @Component({
    template: '<div>'
      + '<input type="checkbox" id="input0" value="input0" v-model="vModel">'
      + '<input type="checkbox" id="input1" value="input1" v-model="vModel">'
      + '<input type="checkbox" id="input2" value="input2" v-model="vModel">'
      + '</div>'
  })
  class Test extends TestVDom {
    public vModel: string[] = ['input0']
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount('#app')
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div>'
        +'<input type="checkbox" id="input0" value="input0">'
        +'<input type="checkbox" id="input1" value="input1">'
        +'<input type="checkbox" id="input2" value="input2">'
        +'</div>')
    },
    execute: () => {
      //
      const ele0 = document.querySelector('#input0')
      const ele1 = document.querySelector('#input1')
      const ele2 = document.querySelector('#input2')
      if(!ele0 || !ele1 || !ele2){
        expect(true).toBe(false)
        return
      }
      //
      expect((ele0 as HTMLInputElement).checked).toBe(true)
      expect((ele1 as HTMLInputElement).checked).toBe(false)
      expect((ele2 as HTMLInputElement).checked).toBe(false)
      //
      test.vModel.push('input1')
      //
    },
    updated: (output: Element) => {
      //
      const ele0 = document.querySelector('#input0')
      const ele1 = document.querySelector('#input1')
      const ele2 = document.querySelector('#input2')
      if(!ele0 || !ele1 || !ele2){
        expect(true).toBe(false)
        return
      }
      //
      expect((ele0 as HTMLInputElement).checked).toBe(true)
      expect((ele1 as HTMLInputElement).checked).toBe(true)
      expect((ele2 as HTMLInputElement).checked).toBe(false)
      //
      expect(test.vModel.indexOf('input0') >= 0).toBe(true)
      expect(test.vModel.indexOf('input1') >= 0).toBe(true)
      expect(test.vModel.indexOf('input2') >= 0).toBe(false)
      //
    }
  })
  //
})
