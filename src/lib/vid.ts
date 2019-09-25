//
let staticCount = 0

//
export default function vid() {
  /* istanbul ignore next */
  if (staticCount > 10000) {
    staticCount = 0
  }
  return `v-${new Date().getTime().toString(36)}${('00' + (staticCount++).toString(36)).slice(-2)}`
}
