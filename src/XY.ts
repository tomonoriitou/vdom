import {VDomComponent, Prop} from './index'
import templateHtml from './XY.template.html'
import css from './XY.template.scss'

//
export default class XY extends VDomComponent {

  //
  public static template: string = templateHtml
  public static css: string = css

  @Prop()
  public x: number = 0

  @Prop()
  public y: number = 0

  //
  public test: number = 0

  //////////////////////////////////////////////////////////////////////////////
  //
  public mounted(){
    // console.log('■■■　SUB mounted')
    //
    setInterval(() => {
     // console.log('■■■　SUB INTERVAL', this.innerVar)
     // this.test++
    }, 1*1000)
    //
   //
 }
  //
  public beforeDestroy(){
    // console.log('XY beforeDestroy')
 }
 public destroyed() {
    // console.log('XY destroyed')
 }
 //

}
