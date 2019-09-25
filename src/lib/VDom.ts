import {consoleError, consoleDebug, consoleTrace, consoleTime, consoleTimeEnd, consoleWarn, consoleLog} from './console'
import vid from './vid'
import ReactiveVars from './ReactiveVars'
//
import {readTemplate, insertAfter, removeElement} from './template'
import {VDomItem} from './VDomItem'
import {toJSON, toCSS, toHEAD} from './cssJson'
import {propDefaut, watchesVars, deepVars, debugOption} from './decorator'
import EmitOn from './emitOn'
import {addListener, removeListener, /*isEqualListener, */ListenEventInfo} from './eventListener'
import {equal, dcopy} from './deep'

//
export interface WATCH {[key:string]: {handler: (n:any, o?:any) => void, deep?: boolean}}
export interface COMPONENTS {[key:string]: any}

//
export default class VDom extends EmitOn{

  // component id list
  private static $componentIds: {[key: string]: string} = {}

  //////////////////////////////////////////////////////////////////////////////

  public readonly el?: Node | string

  //////////////////////////////////////////////////////////////////////////////

  // mounted element
  public $el?: Node
  // nextTick
  public readonly $nextTick = (process as any).nextTick
  // browser instance
  public readonly $document: Document = document
  // browser instance
  public readonly $window: Window = window
  // refs
  public $refs: {[key: string]: any} = {}
  // refs
  public $vrefs: {[key: string]: VDomItem} = {}

  // root VDom
  public $root: VDom = this
  // parent VDom
  public $parent?: VDom
  // root VDomItem
  public $rootVDom?: VDomItem

  // created
  public $created: boolean = false
  // read dom mounted
  public $mounted: boolean = false
  // request lazy render
  public $reqLazyRender: boolean = false
  // read dom umounted
  public $umounted: boolean = false

  // max cache vdom item / vdomitem
  public $maxCache: number = 256
  // max cache vdomcomponent
  public $maxComponentCache: number = 10
  // max function cache
  public $maxFunctionCache: number = 20
  // props
  public $props: {[key: string]: any} = {}

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // componentId
  public $instanceId!: string

  // is component VDom
  public readonly $isComponent: boolean = false
  // componentId
  public $componentId?: string

  // event param (dummy)
  public $event: any

  // reactive vars
  public $reactiveVars : ReactiveVars = new ReactiveVars()
  // slot template data
  public $slotVDomItems: VDomItem[] = []

  //////////////////////////////////////////////////////////////////////////////

  // directives
  public $customDirectives: {[key:string]: (el: Element, binding: {name: string, value: any, expression: string}, vnode: VDomItem) => void} = {}

  //////////////////////////////////////////////////////////////////////////////

  // mount before position
  private $mountBeforePos?: Node

  //////////////////////////////////////////////////////////////////////////////

  // finished render
  private $inRender: boolean = false

  //////////////////////////////////////////////////////////////////////////////

  // for loaded dom
  private readonly $DOMContentLoadedEventInfo?: ListenEventInfo
  // for loaded dom
  private readonly $loadEventInfo?: ListenEventInfo
  // for unload
  private readonly $beforeunloadEventInfo?: ListenEventInfo

  //////////////////////////////////////////////////////////////////////////////

  //
  constructor(init?: {el?: string, isComponent?: boolean, $document?: Document, $window?: Window}){
    //
    super()
    //
    this.$instanceId = vid()
    //
    if(init){
      //
      if(init.el !== undefined){
        this.el = init.el
      }
      if(init.isComponent !== undefined){
        this.$isComponent = init.isComponent
      }
      if(init.$document !== undefined){
        this.$document = init.$document
      }
      if(init.$window !== undefined){
        this.$window = init.$window
      }
      //
    }

    //
    this.$reactiveVars.initVDom(this)

    // custom directives
    const customDirectives = (this.constructor as any).directives
    if(customDirectives){
      for(const vName in customDirectives){  // tslint:disable-line forin
        this.$customDirectives[`v-${vName}`] = customDirectives[vName]
      }
    }
    consoleTrace('■■ @CUSTOM DIRECTIVES', this.constructor.name, this.$customDirectives)

    // load props
    const props = propDefaut[this.constructor.name]
    for(const prop in props){  // tslint:disable-line forin
      if(props[prop] === true){
        if((this as any)[prop] === undefined){
          (this as any)[prop] = '' // null
        }
      }else{
        (this as any)[prop] = (props[prop] as any).default
      }
      this.$props[prop] = (this as any)[prop]
    }
    consoleTrace('■■ @PROP', this.constructor.name, this.$props)

    // root component
    if(!this.$isComponent){
      //
      this.$beforeunloadEventInfo = addListener(this.$document, 'beforeunload', this.$beforeunload, this.$beforeunload.bind(this))
      //
      if (document.readyState !== 'loading') {
        this.$nextTick(() => {
          this.$DOMContentLoaded()
        })
      } else {
        /* istanbul ignore next */
        this.$DOMContentLoadedEventInfo = addListener(this.$document, 'DOMContentLoaded', this.$DOMContentLoaded, this.$DOMContentLoaded.bind(this))
        /* istanbul ignore next */
        this.$loadEventInfo = addListener(this.$document, 'load', this.$DOMContentLoaded, this.$DOMContentLoaded.bind(this))
      }
      //
    }
    //
  }

  /* istanbul ignore next */
  public Public(key: string){
    const target = (this as any)[key]
    if(target === undefined){
      consoleDebug(`VDom '${key}' member/method is not implemented`)
    }
    if(typeof target === 'function'){
      return target.bind(this)
    }
    return target
  }
  //

  // for override
  public beforeCreate(){/**/}
  public created(){/**/}
  public beforeMount(){/**/}
  public mounted(el: Node | undefined | null){/**/}
  public beforeUpdate(){/**/}
  public updated(el: Node | undefined | null){/**/}
  public beforeDestroy(){/**/}
  public destroyed(){/**/}

  //
  public $set(object: object | any[], key: string | number, value: any){
    //
    const oldVal = dcopy(object as any)
    //
    ;(object as any)[key] = value
    this.$reactiveVars.setUpdateFlag(object, oldVal)
  }

  //
  public $delete(object: object | any[], key: string | number){
    //
    const oldVal = dcopy(object as any)
    //
    delete (object as any)[key]
    this.$reactiveVars.setUpdateFlag(object, oldVal)
  }

  //
  public $forceUpdate(){
    this.$reactiveVars.forceUpdate()
    this.$render(true)
  }

  //
  public $render(forceUpdate: boolean = false, renderd?: (vDom: VDom, element:Node) => void, vPrevDomItem?: VDomItem): Node | undefined{

    //
    if(this.$isComponent){
      // consoleTime(`□□ RENDER-${this.constructor.name}`)
    }else{
      consoleTime(`■■ RENDER-${this.constructor.name}`)
    }

    //
    if(this.$mounted){
      this.beforeUpdate()
    }else{
      this.beforeMount()
    }
    //
    if(this.$rootVDom && this.$mountBeforePos){
      //
      const els = this.$rootVDom.render(this.$mountBeforePos, vPrevDomItem || null, forceUpdate)
      if(els.length !== 1){
        /* istanbul ignore next */
        consoleDebug('INVALID render result', els.length)
      }else{
        this.$el = els[0]
      }
    }
    //
    if(this.$el){
      this.$emitOnInit(this.$el as Element)
    }
    //
    if(this.$el && renderd){
      renderd(this, this.$el)
    }
    this.$inRender = false
    //
    if(this.$mounted){
      this.updated(this.$el ? this.$el.parentNode: undefined)
    }else{
      this.mounted(this.$el ? this.$el.parentNode: undefined)
    }

    //
    if(this.$isComponent){
      // consoleTimeEnd(`□□ RENDER-${this.constructor.name}`)
    }else{
      consoleTimeEnd(`■■ RENDER-${this.constructor.name}`)
    }
    //
    return this.$el
    //
  }

  //
  public $mount(el: Node | string, renderd?: (vDom: VDom, element:Node) => void): void{
    //
    /* istanbul ignore next */
    if((this.constructor as any).template === undefined){
      consoleError('VDom invalid template', this.constructor.name)
      return
    }
    /* istanbul ignore next */
    if(this.$mounted){
      return
    }
    //
    // const startEle = this.$document.createComment('VDOM-START-POS')
    const startEle = this.$document.createTextNode('')
    //
    if(typeof el === 'string'){
      const tgtEle = this.$document.querySelector(el)
      /* istanbul ignore next */
      if(!tgtEle){
        consoleError('VDom invalid selector', el)
        return
      }
      tgtEle.appendChild(startEle)
    }else{
      el.appendChild(startEle)
    }
    this.$mountAfter(startEle, renderd)
    //
  }

  //
  public $mountAfter(startEle: Node, renderd?: (vDom: VDom, element:Node) => void): Node | undefined{
    //
    /* istanbul ignore next */
    if((this.constructor as any).template === undefined){
      consoleError('VDom no template')
      return
    }
    /* istanbul ignore next */
    if(this.$mounted){
      return
    }
    //
    this.beforeCreate()

    // initialize reactive
    deepVars[this.constructor.name] = deepVars[this.constructor.name] || {}
    this.$reactiveVars.initReactive(deepVars[this.constructor.name])

    // set watch
    const watchies = watchesVars[this.constructor.name]
    for(const key in watchies){ // tslint:disable-line forin
      consoleTrace('■■ ADD WATCH', this.constructor.name, key, watchies[key].option)
      this.$reactiveVars.watch(key, watchies[key].callback.bind(this), watchies[key].option)
    }

    //
    this.$mountBeforePos = startEle
    //
    const existComponentId = VDom.$componentIds[this.constructor.name]

    // create component id
    if(!this.$componentId){
      //
      this.$componentId = VDom.$componentIds[this.constructor.name] = VDom.$componentIds[this.constructor.name] || vid()

      // mount css
      if(!existComponentId && (this.constructor as any).css){
        //
        const addComponenId = (cssItem: {attributes: any, children: any}) => {
          for(const key in cssItem.children){ // tslint:disable-line forin
            //
            addComponenId(cssItem.children[key])
            //
            const newSelectors = []
            if(key.substr(0,1) !== '@'){
              const selectorImtes = key.trim().split(',')
              for(const selecors of selectorImtes){
                //
                const seletor = selecors.trim().split(' ')
                //
                const deep = seletor.indexOf('/deep/')
                if(deep > 0){
                  seletor[deep - 1] = `${seletor[deep - 1]}[${this.$componentId}]`
                }else{
                  seletor[seletor.length - 1] = `${seletor[seletor.length - 1]}[${this.$componentId}]`
                }
                //
                if(deep >= 0){
                  seletor.splice(deep, 1)
                }
                //
                const newSelector = seletor.join(' ')
                //
                newSelectors.push(newSelector)
                //
              }
            }else{
              newSelectors.push(`${key} `)
            }
            cssItem.children[newSelectors.join(',')] = cssItem.children[key]
            delete cssItem.children[key]
          }
          //
        }
        //
        const cssJson = toJSON((this.constructor as any).css)
        addComponenId(cssJson)
        // console.log("MOUNT CSS ===============>", this.constructor.name, toCSS(cssJson))
        toHEAD(cssJson)
        //
      }

    }

    // read template
    if(!this.$rootVDom){
      //
      this.$rootVDom = readTemplate(this, (this.constructor as any).template, this.$document, (this.constructor as any).components)
      if(this.$rootVDom){
        this.$rootVDom.attributes = this.$rootVDom.attributes || {}
        if((this.constructor as any).css){
          this.$rootVDom.attributes[this.$componentId] = ''
        }
      }
    }
    // created
    this.$created = true
    this.created()
    const resultElement = this.$render(true, renderd)
    this.$mounted = true
    consoleTrace('■■ MOUNTED', this.constructor.name)
    //
    return resultElement
    //
  }
  //
  public $umount(){
    if(this.$umounted){
      return
    }
    this.$umounted = true
    this.beforeDestroy()
    if(this.$el){
      removeElement(this.$el)
    }
    this.destroyed()
  }
  //
  public $remount(){
    if(!this.$umounted){
      return
    }
    this.$umounted = false
    this.beforeMount()
    if(this.$el && this.$mountBeforePos){
      insertAfter(this.$el, this.$mountBeforePos)
    }
    this.mounted(this.$el)
  }

  //
  public $destroy(){
    //
    // consoleTrace('■■ BEFORE DESTROY', this.constructor.name)
    if(!this.$umounted){
      this.beforeDestroy()
    }
    //
    /* istanbul ignore next */
    if(this.$DOMContentLoadedEventInfo !== undefined){
      removeListener(this.$DOMContentLoadedEventInfo)
    }
    /* istanbul ignore next */
    if(this.$loadEventInfo !== undefined){
      removeListener(this.$loadEventInfo)
    }
    if(this.$beforeunloadEventInfo !== undefined){
      removeListener(this.$beforeunloadEventInfo)
    }
    //
    this.$umountEmitOn()

    //
    this.$slotVDomItems = []
    this.$vrefs = {}
    this.$refs = {}

    //
    if(this.$rootVDom){
      this.$rootVDom.destroy()
    }

    //
    if(this.$el){
      removeElement(this.$el)
    }

    //
    this.$rootVDom = undefined
    this.$parent = undefined
    //
    if(!this.$umounted){
      this.destroyed()
      consoleTrace('■■ DESTROYD', this.constructor.name)
    }
    //
  }

  //
  private $requestRender(){
    //
    /* istanbul ignore next */
    if(!this.$mounted){
      // not mounted wait ...
      setTimeout(() => {
        this.$requestRender.bind(this)()
      }, 10)
      return
    }
    //
    if(!this.$inRender){
      this.$inRender = true
      this.$nextTick(() => {
        this.$render.bind(this)()
      })
    }
  }

  //
  private $DOMContentLoaded(){
    if(this.el){
      this.$mount(this.el)
    }
  }

  //
  private $beforeunload(){
    this.$destroy()
  }

}
