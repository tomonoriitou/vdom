/**
 * @jest-environment jsdom
 */
// tslint:disable: no-unused-expression
// tslint:disable: max-classes-per-file
import VDom from './TestVDom'

test('array', async () => {
  //
  class Test extends VDom {
    public static template: string = '<div><span v-for="testArray">X</span></div>'
    public testArray = [100,300,500]
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
    public static template: string = '<div><span v-for="item in testArray">[<span v-text="item"></span>]</span></div>'
    public testArray = [100,300,500]
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
    public static template: string = '<div><span v-for="(item, index) in testArray">[<span v-text="item"></span>:<span v-text="index"></span>]</span></div>'
    public testArray = [100,300,500]
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div><span>[100:0]</span><span>[300:1]</span><span>[500:2]</span></div>')
    }
  })
  //
})

//
test('template array', async () => {
  //
  class Test extends VDom {
    public static template: string = '<div><template v-for="testArray">X</template></div>'
    public testArray = [100,300,500]
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
    public static template: string = '<div><template v-for="item in testArray">[<span v-text="item"></span>]</template></div>'
    public testArray = [100,300,500]
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
    public static template: string = '<div><template v-for="(item, index) in testArray">[<span v-text="item"></span>:<span v-text="index"></span>]</template></div>'
    public testArray = [100,300,500]
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div>[100:0][300:1][500:2]</div>')
    }
  })
  //
})



//
test('template array w number', async () => {
  //
  class Test extends VDom {
    public static template: string = '<div><template v-for="n in num">[{{n}}]</template></div>'
    public num = 3
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div>[0][1][2]</div>')
    }
  })
  //
})
