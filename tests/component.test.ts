/**
 * @jest-environment jsdom
 */
// tslint:disable: no-unused-expression
// tslint:disable: max-classes-per-file
import VDom from './TestVDom'
import { VDomComponent, Component, Prop } from '../src'

//
@Component({
  template: '<div>A<slot></slot><slot name="ext"></slot></div>'
})
class CompA extends VDomComponent {
}

//
@Component({
  template: '<span>B{{prop}}<slot></slot><slot name="ext"></slot></span>'
})
class CompB extends VDomComponent {
  //
  @Prop({default: '*'})
  public prop!: string
  //
}

//
@Component({
  template: '<span>C{{prop}}</span>'
})
class CompC extends VDomComponent {
  //
  @Prop({default: ''})
  public prop!: string
  //
}

//
test('component base test', async () => {
  //
  @Component({
    components: {
      CompC,
    },
    template: '<div><CompC></CompC></div>'
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
      expect(output.innerHTML).toBe('<div><span>C</span></div>')
    }
  })
  //
})

//
test('component base test', async () => {
  //
  @Component({
    components: {
      CompA,
      CompB,
    },
    template: '<div><CompA></CompA></div>'
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
      expect(output.innerHTML).toBe('<div><div>A</div></div>')
    }
  })
  //
})

//
test('component base test', async () => {
  //
  @Component({
    components: {
      CompA,
      CompB,
    },
    template: '<div><CompB></CompB></div>'
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
      expect(output.innerHTML).toBe('<div><span>B*</span></div>')
    }
  })
  //
})

//
test('component base test', async () => {
  //
  @Component({
    components: {
      CompA,
      CompB,
    },
    template: `<div><component :is="'CompA'"></component></div>`
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
      expect(output.innerHTML).toBe('<div><div>A</div></div>')
    }
  })
  //
})
//
test('component base test', async () => {
  //
  @Component({
    components: {
      CompA,
      CompB,
    },
    template: `<div><component :is="'CompB'"></component></div>`
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
      expect(output.innerHTML).toBe('<div><span>B*</span></div>')
    }
  })
  //
})
