/**
 * @jest-environment jsdom
 */
// tslint:disable: no-unused-expression
// tslint:disable: max-classes-per-file
import VDom from '../src'
import TestVDom from './TestVDom'
import { VDomComponent, Component, Prop } from '../src'

//
test('mountTest base test', async () => {
  //
  document.body.innerHTML = '<div id="app"></div>'
  //
  @Component({
    template: `<div><input id="input" type="text" v-model="vModel"></div>`
  })
  class Test extends TestVDom {
    public vModel: string = 'SS'
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount('#app')
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div><input id="input" type="text"></div>')
    },
    execute: () => {
      const el = document.querySelector('#input')
      if(!el){
        expect(true).toBe(false)
        return
      }
      expect((el as HTMLInputElement).value).toBe('SS')
      test.vModel = 'AAAAA'
    },
    updated: (output: Element) => {
      const el = document.querySelector('#input')
      if(!el){
        expect(true).toBe(false)
        return
      }
      expect((el as HTMLInputElement).value).toBe('AAAAA')
    }
  })
  //
})

//
test('mountTest base test', async () => {
  //
  document.body.innerHTML = '<div id="app"></div>'
  //
  @Component({
    template: `<div><input id="input" type="text" v-model="vModel"></div>`
  })
  class Test extends TestVDom {
    public vModel: string = ''
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount('#app')
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div><input id="input" type="text"></div>')
    },
    execute: () => {
      //
      const ele = document.querySelector('#input')
      if(!ele){
        expect(true).toBe(false)
        return
      }
      //
      (ele as HTMLInputElement).value = 'CCC'
      const e = new CustomEvent('input')
      ele.dispatchEvent(e)
      //
    },
    updated: (output: Element) => {
      expect(test.vModel).toBe('CCC')
    }
  })
  //
})

//
test('input trim', async () => {
  //
  document.body.innerHTML = '<div id="app"></div>'
  //
  @Component({
    template: `<div><input id="input" type="text" v-model.trim="vModel"></div>`
  })
  class Test extends TestVDom {
    public vModel: string = ''
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount('#app')
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div><input id="input" type="text"></div>')
    },
    execute: () => {
      //
      const ele = document.querySelector('#input')
      if(!ele){
        expect(true).toBe(false)
        return
      }
      //
      (ele as HTMLInputElement).value = ' CCAAC '
      const e = new CustomEvent('input')
      ele.dispatchEvent(e)
      //
    },
    updated: (output: Element) => {
      expect(test.vModel).toBe('CCAAC')
    }
  })
  //
})

//
test('input number valid', async () => {
  //
  document.body.innerHTML = '<div id="app"></div>'
  //
  @Component({
    template: `<div><input id="input" type="text" v-model.number="vModel"></div>`
  })
  class Test extends TestVDom {
    public vModel: number = 100
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount('#app')
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div><input id="input" type="text"></div>')
      expect(test.vModel).toBe(100)
    },
    execute: () => {
      //
      const ele = document.querySelector('#input')
      if(!ele){
        expect(true).toBe(false)
        return
      }
      //
      (ele as HTMLInputElement).value = '200'
      const e = new CustomEvent('input')
      ele.dispatchEvent(e)
      //
    },
    updated: (output: Element) => {
      expect(test.vModel).toBe(200)
    }
  })
  //
})

/*
test('input number invalid', async () => {
  //
  document.body.innerHTML = '<div id="app"></div>'
  //
  @Component({
    template: `<div><input id="input" type="text" v-model.number="vModel"></div>`
  })
  class Test extends TestVDom {
    public vModel: string = ''
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount('#app')
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div><input id="input" type="text"></div>')
      expect(test.vModel).toBe('')
    },
    execute: () => {
      //
      console.log("□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□")
      //
      const ele = document.querySelector('#input')
      if(!ele){
        expect(true).toBe(false)
        return
      }
      //
      (ele as HTMLInputElement).value = ' CCAAC '
      const e = new CustomEvent('input')
      ele.dispatchEvent(e)
      //
    },
    updated: (output: Element) => {
      //
      console.log("□□□□□□□□□□□□□□□□□□□□□□□SSSSSSSSSSSSSSSSSSS□□□□□□□□□□□□□□")
      //
      expect(test.vModel).toBe('')
    }
  })
  //
})
*/

//
test('input lazy', async () => {
  //
  document.body.innerHTML = '<div id="app"></div>'
  //
  @Component({
    template: `<div><input id="input" type="text" v-model.lazy="vModel"></div>`
  })
  class Test extends TestVDom {
    public vModel: string = ''
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount('#app')
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div><input id="input" type="text"></div>')
    },
    execute: () => {
      //
      const ele = document.querySelector('#input')
      if(!ele){
        expect(true).toBe(false)
        return
      }
      //
      (ele as HTMLInputElement).value = 'CCC'
      const e = new CustomEvent('change')
      ele.dispatchEvent(e)
      //
    },
    updated: (output: Element) => {
      expect(test.vModel).toBe('CCC')
    }
  })
  //
})
