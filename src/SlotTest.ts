import {VDomComponent} from './index'
import templateHtml from './SlotTest.template.html'

//
export default class SlotTest extends VDomComponent {

  //
  public static template: string = templateHtml

  public x: number = 0
  public y: number = 0

  public user: string = 'test-user'

  //////////////////////////////////////////////////////////////////////////////
  //
  public mounted(){
   //
  }

}
