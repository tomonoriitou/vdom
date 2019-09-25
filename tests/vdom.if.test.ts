/**
 * @jest-environment jsdom
 */
// tslint:disable: no-unused-expression
// tslint:disable: max-classes-per-file
import VDom from './TestVDom'

//
test('if true', async () => {
  //
  class Test extends VDom {
    public static template: string = '<div><span v-if="true">TRUE</span><span v-else>FALSE</span></div>'
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div><span>TRUE</span></div>')
    }
  })
  //
})

//
test('if false', async () => {
  //
  class Test extends VDom {
    public static template: string = '<div><span v-if="false">TRUE</span><span v-else>FALSE</span></div>'
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div><span>FALSE</span></div>')
    }
  })
  //
})

//
test('if true', async () => {
  //
  class Test extends VDom {
    public static template: string = '<div><template v-if="true">TRUE</template><template v-else>FALSE</template></div>'
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div>TRUE</div>')
    }
  })
  //
})

//
test('if false', async () => {
  //
  class Test extends VDom {
    public static template: string = '<div><template v-if="false">TRUE</template><template v-else>FALSE</template></div>'
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div>FALSE</div>')
    }
  })
  //
})


/*
test('if else-if true', async () => {
  //
  class Test extends VDom {
    public static template: string = '<div><span v-if="false">TRUE</span><span v-else-if="true">ELSEIF</span><span v-else>FALSE</span></div>'
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div><span>ELSEIF</span></div>')
    }
  })
  //
})

//
test('if else-if true', async () => {
  //
  class Test extends VDom {
    public static template: string = '<div><span v-if="false">TRUE</span><span v-else-if="false">ELSEIF</span><span v-else>FALSE</span></div>'
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div><span>FALSE</span></div>')
    }
  })
  //
})
*/

/*
test('if else-id true', async () => {
  //
  class Test extends VDom {
    public static template: string = '<div><template v-if="false">TRUE</template><template v-else-if="true">ELSEIF</template><template v-else>FALSE</template></div>'
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div>ELSEIF</div>')
    }
  })
  //
})

//
test('if else-id true', async () => {
  //
  class Test extends VDom {
    public static template: string = '<div><template v-if="false">TRUE</template><template v-else-if="false">ELSEIF</template><template v-else>FALSE</template></div>'
  }
  //
  const test = new Test()
  //
  await test.$test({
    init: () => {
      test.$mount(document.createElement('div'))
    },
    mounted: (output: Element) => {
      expect(output.innerHTML).toBe('<div>FALSE</div>')
    }
  })
  //
})
*/
