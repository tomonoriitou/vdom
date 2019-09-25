import VDom from '../../src/index'
import {VDomComponent, Component, Prop, Emit} from '../../src/index'
import templateHtml from './Sub.template.html'
import css from './Sub.template.scss'

//
@Component({
   components: {
   },
   template: templateHtml,
   css,
})
export default class Sub extends VDomComponent {

  @Prop({default: 'XXX'})
  public readonly param!: string

  //
  public innerVar: number = 0

  //
  public ttt: string = 'EEEEEEEEEEE'

  // handler sample
  public clickHandler(){
   this.innerVar++
 }


  //////////////////////////////////////////////////////////////////////////////
  //
  public beforeCreate(){
   // console.log('■■■　SUB beforeCreate')
  }
  //
  public created(){
   // console.log('■■■　SUB created')
  }
  //
  public beforeMount(){
   // console.log('■■■　SUB beforeMount')
  }

  @Emit('test')
  public testEmitter(){
     // console.log("DEDDDDD")
     return this.innerVar
  }

  //
  public mounted(){
     // console.log('■■■　SUB mounted')
     setInterval(() => {
       this.innerVar++
       // this.$emit('test', this.innerVar)
       this.testEmitter()
     }, 3*1000)
    //
  }

  public beforeUpdate(){
     // console.log('■■■　SUB beforeUpdate')
  }
  public updated(){
     // console.log('■■■　SUB updated')
  }

  //
  public beforeDestroy(){
     // console.log('■■■　SUB beforeDestroy')
  }
  public destroyed() {
     // console.log('■■■　SUB destroyed')
  }
  //
}
