/**
 * @jest-environment jsdom
 */
// tslint:disable: no-unused-expression
// tslint:disable: max-classes-per-file
import VDom from '../src'
import { VDomComponent, Component, Prop } from '../src'

//
test('mountTest base test', async (done) => {
  //
  document.body.innerHTML = '<div id="app"></div>'
  //
  let status: number = 0
  //
  @Component({
    template: `<div>{{message}}-{{f}}</div>`
  })
  class Test extends VDom {

    //
    public message: string = 'MOUNTED'
    //
    get f(){
      return this.message.toLowerCase()
    }

    // for override
    public beforeCreate(){
      // console.log("beforeCreate")
      expect(status).toBe(0)
      status = 1
    }
    public created(){
      // console.log("created")
      expect(status).toBe(1)
      status = 2
    }
    public beforeMount(){
      // console.log("beforeMount")
      expect(status).toBe(2)
      status = 3
    }
    public mounted(el: Node | undefined | null){
      // console.log("mounted")
      expect(status).toBe(3)
      status = 4
      if(el){
        expect((el as HTMLElement).innerHTML).toBe('<div>MOUNTED-mounted</div>')
      }
      //
      this.$nextTick(() => {
        this.message = 'UPDATED'
      })
      //
    }
    public beforeUpdate(){
      expect(status).toBe(4)
      status = 5
    }
    public updated(el: Node | undefined | null){
      expect(status).toBe(5)
      status = 6
      if(el){
        expect((el as HTMLElement).innerHTML).toBe('<div>UPDATED-updated</div>')
      }
      //
      this.Public('$beforeunload')()
      //
    }

    //
    public beforeDestroy(){
      //
      expect(status).toBe(6)
      status = 7
      /*
      console.log("==>>", this.$reactiveVars.updatedElements)
      console.log("==>>", this.$reactiveVars.updatedFunctions)
      console.log("==>>", this.$reactiveVars.reactiveVars)
      console.log("==>>", this.$reactiveVars.reactiveVarsForFunc)
      */
    }
    public destroyed(){
      expect(status).toBe(7)
      status = 8
      /*
      console.log("==>>", this.$reactiveVars.updatedElements)
      console.log("==>>", this.$reactiveVars.updatedFunctions)
      console.log("==>>", this.$reactiveVars.reactiveVars)
      console.log("==>>", this.$reactiveVars.reactiveVarsForFunc)
      */
      done()
    }
    //
  }
  //
  const test = new Test({el: '#app'})
  //
})
