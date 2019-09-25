import VDom, {VDomItem, WATCH, COMPONENTS, Component, Prop, Watch} from '../../src/index.ie11'

//
import templateHtml from './main.template.html'
import css from './main.template.scss'
import Sub from './Sub'
import XY from './XY'
import SlotTest from './SlotTest'
import { Deep } from '../../src/lib/decorator'

//
@Component({
  components: {
    Sub,
    XY,
    SlotTest,
  },
  template: templateHtml,
  css,
  comments: false,
  directives: {
    display: (el: Element, binding: { name: string, value: any, expression: string }, vnode: VDomItem) => {
      if (typeof binding.value === 'string') {
        (el as HTMLElement).style.display = binding.value
      } else {
        (el as HTMLElement).style.display = binding.value ? null : 'none'
      }
    }
  }
  // delimiters: ['{[', ']}']
})
class MyVDom extends VDom {


  //
  @Deep()
  public testDeep: any = {x:100}
  //
  public clickHandlerDeep1(){
    this.testDeep.a = 5
    console.log(this.testDeep)
  }
  //
  public clickHandlerDeep2(){
    this.testDeep.b = 10
    console.log(this.testDeep)
  }



  //
  public show: boolean = true

  //
  public HOGEHOGE?: number

  //
  public numInput: number = 100
  public message: string = 'hi!'
  public mlMessage: string = 'hi!'
  public checked: boolean  = true
  public checkedNames: string[] = ['John']
  public picked: string = 'one'
  public selected: string = '2'
  public multiSelect: string[] = ['one', 'three']

  //
  public compName: string = 'Sub'


  //
  public TT: number = 100
  public test: string = 'test-attribute'

  //
  public sampleNumber: number = 1

  //
  public sampleNumber2: number = 500
  //
  public sampleArray: any = [
    10,
    20,
    50,
  ]
  //
  public sampleObject: any = {
    a:5,
    b:3,
    c:2,
  }

  //
  public style = {
    color: '#f00',
    'font-size': '25px',
  }

  //
  public selector = '_SELECTOR_'
  public important = true
  //
  public styles: any = {
    color: '#f00',
    test1: {
      font: 'AAAAA',
    },
    test2: {
      text: 'test22',
      sammple: 'test33',
    },
  }

  //
  public sampleArray2: any = [
    1,
    2,
    3,
    4,
    5,
  ]

  //
  public xArray=[
    0,1,2
  ]
  //
  public yArray=[
    10,11,12
  ]

  //
  public sampleString: string = 'string'
  //
  public sampleString2: string = 'string2'


  //
  @Watch('sampleNumber')
  public onSampleNumberChanged(nV: number, oV: number){
    // console.log('■update■ sampleNumber @Watch', nV, oV)
  }

    /*
    //
    this.$watch('sampleObject', (nV: number, oV: number) => {
      console.log('■update■ sampleObject', nV, oV)
    }, {deep: true})
    //
    this.$watch('sampleArray', (nV: number, oV: number) => {
      console.log('■update■ sampleArray', nV, oV)
    }, {deep: true})
    */





  // computed sample
  public get html(){
    return `<a href="hogehoge">${this.sampleString}:${this.sampleNumber}</a><br/><a href="://www.google.com">GOOGLE</a>`
  }
  // computed sample
  public get htmlX(){
    return `<a href="hogehoge">${this.sampleString2}:${this.sampleNumber2}</a><br/><a href="://www.google.com">GOOGLE</a>`
  }
  // computed sample
  public html2(){
    return `<a href="hogehoge">${this.sampleString2}:${this.sampleNumber2}</a><br/><a href="://www.google.com">GOOGLE</a>`
  }
  // object return sample
  public getStyle(){
    return {
      color: '#f00'
    }
  }


  //
  public trBeforeEnter(){
    // console.log('■■■ trBeforeEnter', this.$event)
  }
  //
  public trEnter(){
    // console.log('■■■ trEnter', this.$event)
  }
  //
  public trAfterEnter(){
    // console.log('■■■ trAfterEnter', this.$event)
  }
  //
  public trEnterCancelled(){
    // console.log('■■■ trEnterCancelled', this.$event)
  }

  //
  public trBeforeLeave(){
    // console.log('■■■ trBeforeLeave', this.$event)
  }
  //
  public trLeave(){
    // console.log('■■■ trLeave', this.$event)
  }
  //
  public trAfterLeave(){
    // console.log('■■■ trAfterLeave', this.$event)
  }
  //
  public trLeaveCancelled(){
    // console.log('■■■ trLeaveCancelled', this.$event)
  }
  //





  //
  public clickHandlerReload(){
    this.$forceUpdate()
  }

  public clickHandlerSet(){
    // console.log("SET")
    this.$set(this.sampleObject, 'b', 100)
  }

  // handler sample 1
  public clickHandler(ev: MouseEvent){
    console.log("clickHandler MouseEvent", ev)
    console.log("clickHandler MouseEvent", this.$event)

    //
    this.$emit('test', this.sampleNumber)

    //
    if(this.HOGEHOGE === undefined){
      this.HOGEHOGE = 100
    }else{
      ++this.HOGEHOGE
    }

    //
    this.test += 'X'

    //
    this.sampleNumber++
    //

   this.sampleArray.push(this.sampleNumber)
    this.xArray.push(this.sampleNumber + 99)
    // this.sampleArray2.push(this.sampleArray2.length+ 1)
  }


  public testShow(){
    console.log("**************testShow*****************")
    this.show = !this.show
  }

  // handler sample 2
  public clickHandler2(){

    //
    console.log("**************clickHandler2*****************")
    //

    this.sampleNumber2--
    this.sampleArray.shift()
    // this.sampleArray2.pop()
    this.xArray.pop()
  }

  // handler sample 3
  public clickHandler3(){
    this.sampleNumber--
    this.sampleNumber2++
    //
    ++this.TT
    /*
    setInterval(() => {
      ++this.TT
    }, 1000)
    */
  }

  // function sample
  public computedFunc(){
    return this.sampleNumber + 100
  }

  public testEvent(e: any){
    ///////////////// console.log(e)
  }

  //////////////////////////////////////////////////////////////////////////////

  public beforeCreate(){
    // console.log('★★★　beforeCreate')
  }
  //
  public created(){
    // console.log('★★★　created')
  }
  public beforeMount(){
    // console.log('★★★　beforeMount')
  }
  //
  public mounted(){

    //
    console.log('★★★　mounted')
    setInterval(() => {
      /*
      if(++this.sampleNumber >= 10){
        //this.sampleNumber = 3
      }
      */
    },
    10 * 1000)
    //
    setInterval(() => {
      /*
      if(++this.sampleNumber > 3){
        this.sampleNumber = 0
      }
      */
     /*
      this.show = !this.show
      //
      if(this.compName === 'XY'){
        this.compName = 'Sub'
      }else{
        this.compName = 'XY'
      }
      */
    },
    3*1000)
    //
  }
  //
  public beforeUpdate(){
    // console.log('★★★★★★★★★★★★　beforeUpdate')
  }
  public updated(){
    // console.log('★★★　updated')
  }
  //
  public beforeDestroy(){
    console.log('★★★　beforeDestroy')
  }
  public destroyed() {
    console.log('★★★　destroyed')
  }
}

//
const myDom = new MyVDom({
  el: '#test'
})


