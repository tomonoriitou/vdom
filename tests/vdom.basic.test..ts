/**
 * @jest-environment jsdom
 */
// tslint:disable: no-unused-expression
// tslint:disable: max-classes-per-file
import VDom from './TestVDom'

//
test('basic no dom', async () => {
  //
  class Test extends VDom {
    public static template: string = ''
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (output: Element) => {
      expect(output).toBe(undefined)
    }
  })
  //
})

//
test('basic', async () => {
  //
  class Test extends VDom {
    public static template: string = '<div>TEST</div>'
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div>TEST</div>')
    }
  })
  //
})

//
test('basic multi dom', async () => {
  //
  class Test extends VDom {
    public static template: string = 'GOMI<div>TEST1</div><div>TEST2</div>'
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div>TEST1</div>')
    }
  })
  //
})

//
test('basic comment', async () => {
  //
  class Test extends VDom {
    public static template: string = '<div><!--TEST--></div>'
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div><!--TEST--></div>')
    }
  })
  //
})

//
test('basic {{}} number', async () => {
  //
  class Test extends VDom {
    public static template: string = '<div>{{testValue}}</div>'
    public testValue: number = 5
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div>5</div>')
    }
  })
  //
})

//
test('basic {{}} number w calc', async () => {
  //
  class Test extends VDom {
    public static template: string = '<div>{{testValue * 2}}</div>'
    public testValue: number = 5
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div>10</div>')
    }
  })
  //
})

//
test('basic template v-text number', async () => {
  //
  class Test extends VDom {
    public static template: string = '<div><template v-text="testValue"></template></div>'
    public testValue: number = 5
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div>5</div>')
    }
  })
  //
})

//
test('basic span v-text string', async () => {
  //
  class Test extends VDom {
    public static template: string = '<div><span v-text="testValue"></span></div>'
    public testValue: string = 'XYZ'
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div>XYZ</div>')
    }
  })
  //
})

//
test('basic v-html', async () => {
  //
  class Test extends VDom {
    public static template: string = '<div><span v-html="testValue"></span></div>'
    public testValue: string = '<a href="">test</a>'
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div><a href="">test</a></div>')
    }
  })
  //
})

//
test('basic computed', async () => {
  //
  class Test extends VDom {
    public static template: string = '<div><span v-text="testComputed"></span>'
    get testComputed(){
      return 'ABCDE'
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
      expect(output.innerHTML).toBe('<div>ABCDE</div>')
    }
  })
  //
})

//
test('basic function', async () => {
  //
  class Test extends VDom {
    public static template: string = '<div><span v-text="testFunc()"></span>'
    public testFunc(){
      return 'ABCDE'
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
      expect(output.innerHTML).toBe('<div>ABCDE</div>')
    }
  })
  //
})

//
test('basic function object', async () => {
  //
  class Test extends VDom {
    public static template: string = '<div><span :style="testStyle()">DEF</span>'
    public testStyle(){
      return {
        color: 'red',
        'font-size': '12px',
      }
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
      expect(output.innerHTML).toBe('<div><span style="color: red; font-size: 12px;">DEF</span></div>')
    }
  })
  //
})

//
test('basic function array', async () => {
  //
  class Test extends VDom {
    public static template: string = '<div><span class="A" :class="classEx()">DEF</span>'
    public classEx(){
      return ['test', 'sample'].join(' ')
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
      expect(output.innerHTML).toBe('<div><span class="A test sample">DEF</span></div>')
    }
  })
  //
})
