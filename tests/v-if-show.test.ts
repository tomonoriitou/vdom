/**
 * @jest-environment jsdom
 */
// tslint:disable: no-unused-expression
// tslint:disable: max-classes-per-file
import VDom from './TestVDom'
import { VDomComponent, Component, Prop } from '../src'

//
@Component({
  template: '<span><slot></slot></span>'
})
class SpanComp extends VDomComponent {
}

//
test('v-if', async () => {
  //
  @Component({
    components: {
      SpanComp
    },
    template: '<div>'
    +'<SpanComp v-if="show">IFOK</SpanComp>'
    +'<SpanComp v-else>IFNG</SpanComp>'
    +'<SpanComp v-if="!show">IFOK2</SpanComp>'
    +'<SpanComp v-else>IFNG2</SpanComp>'
    +'</div>'
  })
  class Test extends VDom {
    public show: boolean = true
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div>'
        + '<span>IFOK</span>'
        // + '<span>IFNG</span>'
        // + '<span>IFOK2</span>'
        + '<span>IFNG2</span>'
        + '</div>')
    },
    execute: () => {
      test.show = false
    },
    updated: (output: Element) => {
      expect(output.innerHTML).toBe('<div>'
        // +'<span>IFOK</span>'
        + '<span>IFNG</span>'
        + '<span>IFOK2</span>'
        // + '<span>IFNG2</span>'
        + '</div>')
    }
  })
  //
})


//
test('v-if', async () => {
  //
  @Component({
    components: {
      SpanComp
    },
    template: '<div>'
    +'<SpanComp v-if="show">IFOK</SpanComp>'
    +'<SpanComp v-else>IFNG</SpanComp>'
    +'</div>'
  })
  class Test extends VDom {
    public show: boolean = true
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div>'
        + '<span>IFOK</span>'
        // + '<span>IFNG</span>'
        + '</div>')
    },
    execute: () => {
      test.show = false
    },
    updated: (output: Element) => {
      expect(output.innerHTML).toBe('<div>'
        // +'<span>IFOK</span>'
        + '<span>IFNG</span>'
        + '</div>')
    }
  })
  //
})

//
test('v-if', async () => {
  //
  @Component({
    components: {
      SpanComp
    },
    template: '<div>'
    +'<template v-if="show"><SpanComp>IFOK</SpanComp></template>'
    +'<template v-else><SpanComp>IFNG</SpanComp></template>'
    +'<template v-if="!show"><SpanComp>IFOK2</SpanComp></template>'
    +'<template v-else><SpanComp>IFNG2</SpanComp></template>'
    +'</div>'
  })
  class Test extends VDom {
    public show: boolean = true
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div>'
        + '<span>IFOK</span>'
        // + '<span>IFNG</span>'
        // + '<span>IFOK2</span>'
        + '<span>IFNG2</span>'
        + '</div>')
    },
    execute: () => {
      test.show = false
    },
    updated: (output: Element) => {
      expect(output.innerHTML).toBe('<div>'
        // +'<span>IFOK</span>'
        + '<span>IFNG</span>'
        + '<span>IFOK2</span>'
        // + '<span>IFNG2</span>'
        + '</div>')
    }
  })
  //
})


//
test('v-show', async () => {
  //
  @Component({
    components: {
      SpanComp
    },
    template: '<div>'
    +'<SpanComp v-show="show">IFOK</SpanComp>'
    +'<SpanComp v-show="!show">IFNG</SpanComp>'
    +'</div>'
  })
  class Test extends VDom {
    public show: boolean = true
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div>'
        + '<span>IFOK</span>'
        + '<span style="display: none;">IFNG</span>'
        + '</div>')
    },
    execute: () => {
      test.show = false
    },
    updated: (output: Element) => {
      expect(output.innerHTML).toBe('<div>'
        + '<span style="display: none;">IFOK</span>'
        + '<span style="">IFNG</span>'
        + '</div>')
    }
  })
  //
})
