// tslint:disable: no-unused-expression
// tslint:disable: max-classes-per-file

import LRU from '../src/lib/lru'

//
test('lru', () => {

  //
  const lru = new LRU<string>({
    max: 3,
  })

  //
  lru.set('0', '00000')
  //
  expect(lru.keys().length).toBe(1)
  expect(lru.length()).toBe(1)
  expect(lru.itemCount()).toBe(1)
  expect(lru.keys().indexOf('0') >= 0).toBe(true)
  expect(lru.get('0')).toBe('00000')
  //
  expect(lru.keys().indexOf('X') >= 0).toBe(false)
  expect(lru.get('X')).toBe(undefined)

  //
  lru.set('1', '11111')
  //
  expect(lru.keys().length).toBe(2)
  expect(lru.length()).toBe(2)
  expect(lru.itemCount()).toBe(2)
  expect(lru.keys().indexOf('1') >= 0).toBe(true)
  expect(lru.get('1')).toBe('11111')

  //
  lru.set('2', '22222')
  //
  expect(lru.keys().length).toBe(3)
  expect(lru.length()).toBe(3)
  expect(lru.itemCount()).toBe(3)
  expect(lru.keys().indexOf('2') >= 0).toBe(true)
  expect(lru.get('2')).toBe('22222')

  //
  expect(lru.keys()[0]).toBe('2')
  expect(lru.keys()[1]).toBe('1')
  expect(lru.keys()[2]).toBe('0')

  //
  lru.set('3', '33333')
  //
  expect(lru.keys().length).toBe(3)
  expect(lru.length()).toBe(3)
  expect(lru.itemCount()).toBe(3)
  expect(lru.keys().indexOf('3') >= 0).toBe(true)
  expect(lru.get('3')).toBe('33333')
  //
  expect(lru.keys().indexOf('0') >= 0).toBe(false)
  expect(lru.get('0')).toBe(undefined)

  //
  expect(lru.keys()[0]).toBe('3')
  expect(lru.keys()[1]).toBe('2')
  expect(lru.keys()[2]).toBe('1')

  //
  expect(lru.get('2')).toBe('22222')
  //
  expect(lru.keys()[0]).toBe('2')
  expect(lru.keys()[1]).toBe('3')
  expect(lru.keys()[2]).toBe('1')

  //
  expect(lru.peek('1')).toBe('11111')
  //
  expect(lru.keys()[0]).toBe('2')
  expect(lru.keys()[1]).toBe('3')
  expect(lru.keys()[2]).toBe('1')

  //
  lru.set('1', 'XXXXX')
  expect(lru.keys().length).toBe(3)
  expect(lru.length()).toBe(3)
  expect(lru.itemCount()).toBe(3)
  expect(lru.keys().indexOf('1') >= 0).toBe(true)
  expect(lru.get('1')).toBe('XXXXX')

  //
  expect(lru.keys()[0]).toBe('1')
  expect(lru.keys()[1]).toBe('2')
  expect(lru.keys()[2]).toBe('3')

  //
  lru.reset()
  expect(lru.keys().length).toBe(0)
  expect(lru.length()).toBe(0)
  expect(lru.itemCount()).toBe(0)
  expect(lru.peek('0')).toBe(undefined)
  expect(lru.peek('1')).toBe(undefined)
  expect(lru.peek('2')).toBe(undefined)
  expect(lru.peek('3')).toBe(undefined)
  expect(lru.get('0')).toBe(undefined)
  expect(lru.get('1')).toBe(undefined)
  expect(lru.get('2')).toBe(undefined)
  expect(lru.get('3')).toBe(undefined)

  expect(lru.remove('0')).toBe(false)
  expect(lru.remove('1')).toBe(false)
  expect(lru.remove('2')).toBe(false)
  expect(lru.remove('3')).toBe(false)


})


//
test('lru', () => {

  //
  const lru = new LRU<string>({
    max: 6,
    length: () => 2
  })

  //
  lru.set('0', '00000')
  //
  expect(lru.keys().length).toBe(1)
  expect(lru.length()).toBe(2)
  expect(lru.itemCount()).toBe(1)
  expect(lru.keys().indexOf('0') >= 0).toBe(true)
  expect(lru.get('0')).toBe('00000')
  //
  expect(lru.keys().indexOf('X') >= 0).toBe(false)
  expect(lru.get('X')).toBe(undefined)

  //
  lru.set('1', '11111')
  //
  expect(lru.keys().length).toBe(2)
  expect(lru.length()).toBe(4)
  expect(lru.itemCount()).toBe(2)
  expect(lru.keys().indexOf('1') >= 0).toBe(true)
  expect(lru.get('1')).toBe('11111')

  //
  lru.set('2', '22222')
  //
  expect(lru.keys().length).toBe(3)
  expect(lru.length()).toBe(6)
  expect(lru.itemCount()).toBe(3)
  expect(lru.keys().indexOf('2') >= 0).toBe(true)
  expect(lru.get('2')).toBe('22222')

  //
  expect(lru.keys()[0]).toBe('2')
  expect(lru.keys()[1]).toBe('1')
  expect(lru.keys()[2]).toBe('0')

  //
  lru.set('3', '33333')
  //
  expect(lru.keys().length).toBe(3)
  expect(lru.length()).toBe(6)
  expect(lru.itemCount()).toBe(3)
  expect(lru.keys().indexOf('3') >= 0).toBe(true)
  expect(lru.get('3')).toBe('33333')
  //
  expect(lru.keys().indexOf('0') >= 0).toBe(false)
  expect(lru.get('0')).toBe(undefined)

  //
  expect(lru.keys()[0]).toBe('3')
  expect(lru.keys()[1]).toBe('2')
  expect(lru.keys()[2]).toBe('1')

  //
  expect(lru.get('2')).toBe('22222')
  //
  expect(lru.keys()[0]).toBe('2')
  expect(lru.keys()[1]).toBe('3')
  expect(lru.keys()[2]).toBe('1')

  //
  expect(lru.peek('1')).toBe('11111')
  //
  expect(lru.keys()[0]).toBe('2')
  expect(lru.keys()[1]).toBe('3')
  expect(lru.keys()[2]).toBe('1')

  //
  lru.set('1', 'XXXXX')
  expect(lru.keys().length).toBe(3)
  expect(lru.length()).toBe(6)
  expect(lru.itemCount()).toBe(3)
  expect(lru.keys().indexOf('1') >= 0).toBe(true)
  expect(lru.get('1')).toBe('XXXXX')

  //
  expect(lru.keys()[0]).toBe('1')
  expect(lru.keys()[1]).toBe('2')
  expect(lru.keys()[2]).toBe('3')

  //
  lru.reset()
  expect(lru.keys().length).toBe(0)
  expect(lru.length()).toBe(0)
  expect(lru.itemCount()).toBe(0)
  expect(lru.peek('0')).toBe(undefined)
  expect(lru.peek('1')).toBe(undefined)
  expect(lru.peek('2')).toBe(undefined)
  expect(lru.peek('3')).toBe(undefined)
  expect(lru.get('0')).toBe(undefined)
  expect(lru.get('1')).toBe(undefined)
  expect(lru.get('2')).toBe(undefined)
  expect(lru.get('3')).toBe(undefined)

  expect(lru.remove('0')).toBe(false)
  expect(lru.remove('1')).toBe(false)
  expect(lru.remove('2')).toBe(false)
  expect(lru.remove('3')).toBe(false)


})
