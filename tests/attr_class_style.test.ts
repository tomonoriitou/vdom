/**
 * @jest-environment jsdom
 */
// tslint:disable: no-unused-expression
// tslint:disable: max-classes-per-file
import VDom from './TestVDom'

//
test('attr class', async () => {
  //
  class Test extends VDom {
    public static template: string = '<div><span :class="ext" class="base-class"></span></div>'
    //
    public ext:string = 'ext-class'
    //
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div><span class="ext-class base-class"></span></div>')
    },
  })
  //
})

//
test('attr class w array', async () => {
  //
  class Test extends VDom {
    public static template: string = '<div><span :class="ext" class="base-class"></span></div>'
    //
    public ext:string[] = ['ext-class', 'ext2-class']
    //
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div><span class="ext-class ext2-class base-class"></span></div>')
    },
  })
  //
})

//
test('attr class w object', async () => {
  //
  class Test extends VDom {
    public static template: string = '<div><span :class="ext" class="base-class"></span></div>'
    //
    public ext: {[key:string]: boolean} = {'ext-class': true, 'ext2-class': true}
    //
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div><span class="ext-class ext2-class base-class"></span></div>')
    },
    execute: () => {
      test.$set(test.ext, 'ext2-class', false)
      // test.ext['ext2-class'] = false
    },
    updated: (output: Element) => {
      expect(output.innerHTML).toBe('<div><span class="ext-class base-class"></span></div>')
    },
  })
  //
})

////////////////////////////////////////////////////////////////////////////////

//
test('attr style', async () => {
  //
  class Test extends VDom {
    public static template: string = '<div><span :style="ext" style="font-size: 12px;"></span></div>'
    //
    public ext:string = 'color: #f00;'
    //
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div><span style="color: #f00; font-size: 12px;"></span></div>')
    },
  })
  //
})

//
test('attr style w object', async () => {
  //
  class Test extends VDom {
    public static template: string = '<div><span :style="ext" style="font-size: 12px;"></span></div>'
    //
    public ext:{[key:string]: string} = {'color': '#f00'}
    //
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div><span style="color: #f00; font-size: 12px;"></span></div>')
    },
  })
  //
})

//
test('attr style w array', async () => {
  //
  class Test extends VDom {
    public static template: string = '<div><span :style="ext" style="font-size: 12px;"></span></div>'
    //
    public ext: Array<{[key:string]: string}> = [{'color': '#f00'},{'margin': '0', 'padding':'0'}]
    //
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div><span style="color: #f00; margin: 0; padding: 0; font-size: 12px;"></span></div>')
    },
  })
  //
})
