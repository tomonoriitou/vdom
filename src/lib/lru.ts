//
export default class LRU<D> {

  private max: number = 0

  //
  private lengthAll: number = 0
  private datas: {[key: string]: {length: number, data: any}} = {}
  private lists: string[] = []

  //
  constructor(option: {
    max: number,
    length?: (key: string, data: any) => number,
    dispose?: (key: string, data: any) => void,
    maxAge?: number,
  }){
    if(option.max > 0){
      this.max = option.max
    }
    if(option.length !== undefined){
      this.lengthCb = option.length
    }
    if(option.dispose !== undefined){
      this.dispose = option.dispose
    }
  }

  //
  public set(key: string, data: D){
    //
    const exists = this.has(key)
    if(exists){
      // remove old
      this.lists.splice(exists.index, 1)
      this.lengthAll -= exists.object.length
    }

    // add
    this.datas[key] = {length: this.lengthCb(key, data), data}
    this.lengthAll += this.datas[key].length
    this.lists.unshift(key)

    // gc
    while(this.lengthAll > this.max && this.lists.length > 0){
      const removeTgt = this.lists[this.lists.length - 1]
      this.remove(removeTgt)
    }
    //
    return undefined
  }

  //
  public has(key: string): {index: number, object: {length: number, data: any}} | undefined{
    if(this.datas[key]){
      const index = this.lists.indexOf(key)
      return {index, object: this.datas[key]}
    }
    return undefined
  }

  //
  public remove(key: string): boolean{
    const exists = this.has(key)
    if(exists){
      this.dispose(key, exists.object.data)
      this.lists.splice(exists.index, 1)
      this.lengthAll -= exists.object.length
      delete this.datas[key]
      return true
    }
    return false
  }

  //
  public get(key: string): D | undefined{
    const exists = this.has(key)
    if(exists){
      this.lists.splice(exists.index, 1)
      this.lists.unshift(key)
      return exists.object.data
    }
    return undefined
  }

  //
  public peek(key: string): D | undefined{
    if(this.datas[key] === undefined){
      return undefined
    }
    return this.datas[key].data
  }

  //
  public reset(){
    this.lengthAll = 0
    this.datas = {}
    this.lists = []
  }

  //
  public length(){
    return this.lengthAll
  }

  //
  public itemCount(){
    return this.lists.length
  }

  /*
  public dump(){
    return {
      length: this.lengthAll,
      datas: this.datas,
      lists: this.lists,
    }
  }
  // load(cacheEntriesArray)
  */

  public keys(){
    return this.lists
  }

  private lengthCb: (key: string, data: any) => number = () => 1
  private dispose: (key: string, data: any) => void = () => {/*noop*/}

}
