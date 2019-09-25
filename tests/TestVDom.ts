/**
 * @jest-environment jsdom
 */
// tslint:disable: no-unused-expression
// tslint:disable: max-classes-per-file

import VDom from '../src/index'

export default class TestVDom extends VDom {
  // tslint:disable member-ordering

  //
  public $mountedCallback: any = (ele: Element) => {
    if(this.$resolve){
      this.$resolve()
    }
  }
  public $executeCallback: any = () => {
    if(this.$resolve){
      this.$resolve()
    }
  }
  public $updatedCallback: any = (ele: Element) => {
    if(this.$resolve){
      this.$resolve()
    }
  }

  public $resolve?: any

  //
  constructor(){
    super({isComponent: true, $window: window as any, $document: document as any})
  }

  //
  public async $test(test: {
    init?: () => void,
    mounted?: (ele:Element) => void,
    execute?: () => void,
    updated?: (ele:Element) => void,
  }){
    //
    if(test.mounted){
      this.$mountedCallback = test.mounted.bind(this)
    }
    if(test.execute){
      this.$executeCallback = test.execute.bind(this)
    }
    if(test.updated){
      this.$updatedCallback = test.updated.bind(this)
    }
    //
    return new Promise(async (resolve) => {
      this.$resolve = resolve
      //
      if(test.init){
        await test.init.bind(this)()
      }else{
        if(test.execute){
          await test.execute.bind(this)()
        }
      }
      //
    })
  }

  //
  public _mounted(ele: Element){/* */}
  //
  public _updated(ele: Element){/* */}

  //
  public async mounted(ele: Element){
    //
    if(this.$mountedCallback){
      await this.$mountedCallback(ele)
    }
    //
    if(this.$executeCallback){
      await this.$executeCallback()
    }
    //
    this._mounted(ele)
    //
  }

  //
  public async updated(ele: Element){
    //
    if(this.$updatedCallback){
      await this.$updatedCallback(ele)
    }
    //
    if(this.$resolve){
      this.$resolve()
    }
    //
    this._updated(ele)
    //
  }
}


test('TestVDom dummy', () => {
  expect(true).toBe(true)
})


export const sleep = async (msec: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, msec)
  })
}

