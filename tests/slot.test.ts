/**
 * @jest-environment jsdom
 */
// tslint:disable: no-unused-expression
// tslint:disable: max-classes-per-file
import VDom from './TestVDom'
import { VDomComponent, Component, Prop } from '../src'

//
@Component({
  template: '<span>B-{{prop}}[<slot>FOLLBACK</slot>]{<slot name="ext"></slot>}</span>'
})
class Comp extends VDomComponent {
  //
  @Prop({default: '*'})
  public prop!: string
  //
  public sample: string = 'SAMPLE'
  //
}

//
test('component base test', async () => {
  //
  @Component({
    components: {
      Comp,
    },
    template: `<div><Comp :prop="'#'"></Comp></div>`
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
      expect(output.innerHTML).toBe('<div><span>B-#[FOLLBACK]{}</span></div>')
    }
  })
  //
})

//
test('component base test', async () => {
  //
  @Component({
    components: {
      Comp,
    },
    template: '<div><Comp></Comp></div>'
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
      expect(output.innerHTML).toBe('<div><span>B-*[FOLLBACK]{}</span></div>')
    }
  })
  //
})

//
test('component base test', async () => {
  //
  @Component({
    components: {
      Comp,
    },
    template: '<div><Comp>XYZ</Comp></div>'
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
      expect(output.innerHTML).toBe('<div><span>B-*[XYZ]{}</span></div>')
    }
  })
  //
})

//
test('component base test', async () => {
  //
  @Component({
    components: {
      Comp,
    },
    template: '<div><Comp><template>XYZ</template></Comp></div>'
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
      expect(output.innerHTML).toBe('<div><span>B-*[XYZ]{}</span></div>')
    }
  })
  //
})

//
test('component base test', async () => {
  //
  @Component({
    components: {
      Comp,
    },
    template: '<div><Comp><template #default="aaa">XYZ-{{aaa.sample}}</template></Comp></div>'
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
      expect(output.innerHTML).toBe('<div><span>B-*[XYZ-SAMPLE]{}</span></div>')
    }
  })
  //
})

//
test('component base test', async () => {
  //
  @Component({
    components: {
      Comp,
    },
    template: '<div><Comp><template #ext>XYZ</template></Comp></div>'
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
      expect(output.innerHTML).toBe('<div><span>B-*[FOLLBACK]{XYZ}</span></div>')
    }
  })
  //
})

//
test('component base test', async () => {
  //
  @Component({
    components: {
      Comp,
    },
    template: '<div><Comp><template>ABC</template><template #ext>XYZ</template></Comp></div>'
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
      expect(output.innerHTML).toBe('<div><span>B-*[ABC]{XYZ}</span></div>')
    }
  })
  //
})
