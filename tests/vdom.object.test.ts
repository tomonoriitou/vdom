/**
 * @jest-environment jsdom
 */
// tslint:disable: no-unused-expression
// tslint:disable: max-classes-per-file
import VDom from './TestVDom'

//
test('array', async () => {
  //
  class Test extends VDom {
    public static template: string = '<div><span v-for="testObject">X</span></div>'
    public testObject = {a:100,b:300,c:500}
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div><span>X</span><span>X</span><span>X</span></div>')
    }
  })
  //
})

//
test('array w item', async () => {
  //
  class Test extends VDom {
    public static template: string = '<div><span v-for="item in testObject">[<span v-text="item"></span>]</span></div>'
    public testObject = {a:100,b:300,c:500}
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div><span>[100]</span><span>[300]</span><span>[500]</span></div>')
    }
  })
  //
})

//
test('array w item key index', async () => {
  //
  class Test extends VDom {
    public static template: string = '<div><span v-for="(item, key, index) in testObject">[<span v-text="item"></span>:<span v-text="key"></span>:<span v-text="index"></span>]</span></div>'
    public testObject = {a:100,b:300,c:500}
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div><span>[100:a:0]</span><span>[300:b:1]</span><span>[500:c:2]</span></div>')
    }
  })
  //
})

//
test('template array', async () => {
  //
  class Test extends VDom {
    public static template: string = '<div><template v-for="testObject">X</template></div>'
    public testObject = {a:100,b:300,c:500}
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div>XXX</div>')
    }
  })
  //
})

//
test('template array w item', async () => {
  //
  class Test extends VDom {
    public static template: string = '<div><template v-for="item in testObject">[<span v-text="item"></span>]</template></div>'
    public testObject = {a:100,b:300,c:500}
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div>[100][300][500]</div>')
    }
  })
  //
})

//
test('template array w item key index', async () => {
  //
  class Test extends VDom {
    public static template: string = '<div><template v-for="(item, key, index) in testObject">[<span v-text="item"></span>:<span v-text="key"></span>:<span v-text="index"></span>]</template></div>'
    public testObject = {a:100,b:300,c:500}
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div>[100:a:0][300:b:1][500:c:2]</div>')
    }
  })
  //
})
