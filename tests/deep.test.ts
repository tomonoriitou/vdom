/**
 * @jest-environment jsdom
 */
// tslint:disable: no-unused-expression
// tslint:disable: max-classes-per-file
import {dcopy, equal} from '../src/lib/deep'

//
test('qeual number', async () => {

  //
  const a = 1
  const b = 1
  const c = 2
  const x = '1'
  //
  expect(equal(a, b)).toBe(true)
  expect(equal(a, c)).toBe(false)
  expect(equal(a, x)).toBe(false)
  //
  const y = dcopy(a)
  expect(equal(a, y)).toBe(true)
  //
})

//
test('qeual string', async () => {

  //
  const a = 'a'
  const b = 'a'
  const c = 'b'
  //
  expect(equal(a, b)).toBe(true)
  expect(equal(a, c)).toBe(false)
  //
  const y = dcopy(a)
  expect(equal(a, y)).toBe(true)
  //
})

//
test('qeual boolean', async () => {

  //
  const a = true
  const b = true
  const c = false
  //
  expect(equal(a, b)).toBe(true)
  expect(equal(a, c)).toBe(false)
  //
  const y = dcopy(a)
  expect(equal(a, y)).toBe(true)
  //
})

//
test('qeual mix', async () => {
  //
  const a = 1
  const b = '1'
  const c = true
  //
  expect(equal(a, b)).toBe(false)
  expect(equal(b, c)).toBe(false)
  expect(equal(a, c)).toBe(false)
  //
  const y = dcopy(a)
  expect(equal(a, y)).toBe(true)
  //
})

//
test('qeual Date', async () => {

  //
  const a = new Date('1968/12/21')
  const b = new Date('1968/12/21')
  const c = new Date()
  const x = a
  //
  expect(equal(a, b)).toBe(true)
  expect(equal(a, c)).toBe(false)
  expect(equal(a, x)).toBe(true)
  //
  const y = dcopy(a)
  expect(equal(a, y)).toBe(true)
  //
})

//
test('qeual Array', async () => {

  //
  const a = [1,2,3]
  const b = [1,2,3]
  const c = [1,2,4]
  const d = [1,2,3,4]
  const x = a
  //
  expect(equal(a, b)).toBe(true)
  expect(equal(a, c)).toBe(false)
  expect(equal(b, d)).toBe(false)
  expect(equal(a, x)).toBe(true)
  //
  const y = dcopy(a)
  expect(equal(a, y)).toBe(true)
  //
})

//
test('qeual Object', async () => {

  //
  const a = {a:1, b:2}
  const b = {a:1, b:2}
  const c = {a:1, b:3}
  const d = {a:1, b:2, c: 4}
  const x = a
  //
  expect(equal(a, b)).toBe(true)
  expect(equal(a, c)).toBe(false)
  expect(equal(b, d)).toBe(false)
  expect(equal(a, x)).toBe(true)
  //
  const y = dcopy(a)
  expect(equal(a, y)).toBe(true)
  //
})

//
test('qeual Object', async () => {

  //
  const a = {
    a:1,
    b:2,
    c: {
      x: 1,
      y: 2,
      z: [1,2,3,4,5]
    }
  }
  const b = dcopy(a)
  //
  expect(equal(a, b)).toBe(true)
  //
})

//
test('qeual Object', async () => {

  class TestC1 {
    public x: number = 5
    public y: number = 10
  }

  //
  const a: any = {
    a:1,
    b:2,
    C1: new TestC1(),
    c: {
      x: 1,
      y: 2,
      z: [1,2,3,4,5]
    }
  }
  //
  ;(a.c as any).AAAA = a
  //
  const b = dcopy(a)
  console.log("B", b)
  //
  expect(equal(a, b)).toBe(true)
  //
})
