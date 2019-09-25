// tslint:disable forin

//
export const dcopy = (src: any) => {

  //
  if (/number|string|boolean/.test(typeof src)) {
    return src
  }
  //
  if (src instanceof Date) {
    return new Date(src.getTime())
  }

  //
  const parents: any[] = []

  //
  const walk = (target: any, copy: any) => {
    //
    const copyIsArray = copy instanceof Array
    //
    parents.push(target)
      //
    for (const key in target) {

      //
      const obj = target[key]

      //
      if (obj instanceof Function) {
        continue
      }

      //
      if(parents.indexOf(obj) >= 0){
        copyIsArray?copy.push(obj): copy[key] = obj
        continue
      }

      //
      if (obj instanceof Date) {
        //
        const value = new Date(obj.getTime())
        copyIsArray?copy.push(value): copy[key] = value
        //
      } else if (obj instanceof Array) {
        //
        const value: any = []
        copyIsArray?copy.push(value): copy[key] = value
        walk(obj, value)
        //
      } else if (obj instanceof Object) {
        //
        const value = {}
        copyIsArray?copy.push(value): copy[key] = value
        walk(obj, value)
        //
      } else {
        //
        copyIsArray?copy.push(obj): copy[key] = obj
        //
      }
      //
    }
    //
    parents.pop()
    //
  }

  //
  const dst = (src instanceof Array) ? [] : {}
  walk(src, dst)
  //
  return dst

}
//

export const equal = (object1: any, object2: any): boolean => {
  //
  const parents: any[] = []
  const inParents = (o: any) => {
    for(const key in parents){
      if(parents[key] === o){
        return true
      }
    }
    return false
  }
  //
  const equalMain = (o1: any, o2: any): boolean => {

    // strict match
    // -> function Symbol ...
    if(o1 === o2){
      return true
    }
    // recircive object
    if(inParents(o1)){
      return false
    }

    // number string boolean
    const t1 = typeof o1
    const t2 = typeof o2
    if (/number|string|boolean/.test(t1)) {
      return false
    }

    // Date
    const isDt1 = o1 instanceof Date
    const isDt2 = o2 instanceof Date
    if (isDt1 === true) {
      if(isDt1 !== isDt2){
        return false
      }
      if(o1.getTime() === o2.getTime()){
        return true
      }
      return false
    }

    // Array
    const isAr1 = Array.isArray(o1)
    const isAr2 = Array.isArray(o2)
    //
    if(isAr1 === true){
      if (isAr2 !== true) {
        return false
      }
      //
      if (o1.length !== o2.length) {
        return false
      }
      //
      let result = true
      parents.push(o1)
      for(const key in o1){
        // recircive check
        if(!equalMain(o1[key], o2[key])){
          result = false
          break
        }
      }
      parents.pop()
      return result
      //
    }

    // Array
    const isObj1 = t1
    const isObj2 = t2
    //
    if (/object/.test(t1)) {
      if (isObj1 !== isObj2) {
        return false
      }
      //
      const keysO1 = Object.keys(o1)
      const keysO2 = Object.keys(o2)
      if (keysO1.length !== keysO2.length) {
        return false
      }
      //
      let result = true
      parents.push(o1)
      for(const keyO1 of keysO1){
        // recircive check
        if(!equalMain(o1[keyO1], o2[keyO1])){
          result = false
          break
        }
        //
      }
      parents.pop()
      return result
      //
    }
    //
    return false
    //
  }

  //
  return equalMain(object1, object2)
  //
}
