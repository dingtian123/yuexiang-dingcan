import test from 'node:test'
import assert from 'node:assert/strict'
import {
  cartKey,
  deliverySlots,
  flavorKey,
  flavorText,
  formatTime,
  matchFilter,
  missingFlavor,
  money,
  orderBrief,
  summarize,
  timeline,
  validateAddress,
} from './domain.js'
import { dishes, setmeals } from './catalog.js'

const rules = { minAmount: 20, deliveryFee: 6, freeDelivery: 48, packEach: 1 }

test('money keeps two decimals', () => {
  assert.equal(money(6), '6.00')
  assert.equal(money(12.5), '12.50')
})

test('flavor signature ignores empty choices and sorts values', () => {
  const key = flavorKey({ 辣度: '微辣', 忌口: ['不要蒜', '不要葱'] })
  assert.equal(key, '忌口=不要葱,不要蒜&辣度=微辣')
  assert.equal(flavorKey({ 辣度: '', 忌口: [] }), '')
  assert.equal(flavorText({ 辣度: '微辣', 忌口: ['不要蒜'] }, [{ name: '辣度' }, { name: '忌口' }]), '微辣 / 不要蒜')
})

test('cart lines split by flavor', () => {
  assert.equal(cartKey('dish', 65, { 辣度: '微辣' }), 'dish:65:辣度=微辣')
  assert.notEqual(cartKey('dish', 65, { 辣度: '微辣' }), cartKey('dish', 65, { 辣度: '重辣' }))
  assert.equal(cartKey('dish', 49, {}), 'dish:49')
})

test('required flavor blocks add', () => {
  const groups = [{ name: '辣度', required: true }, { name: '忌口', required: false }]
  assert.equal(missingFlavor(groups, { 辣度: '', 忌口: [] }), '辣度')
  assert.equal(missingFlavor(groups, { 辣度: '中辣', 忌口: [] }), '')
})

test('fees follow minimum and free-delivery threshold', () => {
  const below = summarize([{ price: 19, number: 1 }], rules)
  assert.equal(below.canCheckout, false)
  assert.equal(below.shortfall, 1)
  assert.equal(below.deliveryFee, 6)
  assert.equal(below.packFee, 1)
  assert.equal(below.total, 26)

  const paidDelivery = summarize([{ price: 30, number: 1 }, { price: 17, number: 1 }], rules)
  assert.equal(paidDelivery.goods, 47)
  assert.equal(paidDelivery.deliveryFee, 6)
  assert.equal(paidDelivery.packFee, 2)
  assert.equal(paidDelivery.canCheckout, true)

  const free = summarize([{ price: 48, number: 1 }], rules)
  assert.equal(free.deliveryFee, 0)
  assert.equal(free.total, 49)

  const empty = summarize([], rules)
  assert.equal(empty.canCheckout, false)
  assert.equal(empty.deliveryFee, 0)
  assert.equal(empty.total, 0)
})

test('address validation', () => {
  assert.equal(validateAddress({ consignee: ' ', phone: '13817626621', district: '徐汇区', detail: '衡山路 18 号' }), '请填写收货人')
  assert.equal(validateAddress({ consignee: '林晓', phone: '138', district: '徐汇区', detail: '衡山路 18 号' }), '请填写 11 位手机号')
  assert.equal(validateAddress({ consignee: '林晓', phone: '13817626621', district: '', detail: '衡山路 18 号' }), '请选择区域')
  assert.equal(validateAddress({ consignee: '林晓', phone: '13817626621', district: '徐汇区', detail: '1' }), '请填写详细地址')
  assert.equal(validateAddress({ consignee: '林晓', phone: '13817626621', district: '徐汇区', detail: '衡山路 18 号' }), '')
})

test('delivery slots stay inside business hours', () => {
  const late = deliverySlots(new Date('2026-10-26T14:10:00.000Z'))
  assert.equal(late[0].id, 'asap')
  assert.equal(late[1].label.startsWith('明天'), true)
  assert.equal(late.some((slot) => slot.label.includes('22:')), false)

  const noon = deliverySlots(new Date('2026-10-26T03:10:00.000Z'))
  assert.equal(noon[1].label, '今天 12:30–13:00')

  const early = deliverySlots(new Date('2026-10-26T00:30:00.000Z'))
  assert.equal(early[1].label, '今天 10:00–10:30')
})

test('order copy and timeline', () => {
  const order = {
    status: 6,
    payStatus: 2,
    orderTime: Date.parse('2026-10-25T11:30:00.000Z'),
    checkoutTime: Date.parse('2026-10-25T11:31:00.000Z'),
    cancelTime: Date.parse('2026-10-25T11:40:00.000Z'),
    items: [
      { name: '江团 2 斤', flavorText: '微辣', number: 1 },
      { name: '米饭', flavorText: '', number: 2 },
    ],
  }
  assert.equal(formatTime(order.orderTime), '10月25日 19:30')
  assert.equal(orderBrief(order), '江团 2 斤（微辣） 等 3 份')
  assert.deepEqual(timeline(order).map((step) => step.label), ['订单已提交', '支付成功', '已取消并退款'])
  assert.equal(matchFilter(order, 'all'), true)
  assert.equal(matchFilter({ status: 2 }, 'active'), true)
  assert.equal(matchFilter({ status: 1 }, 'unpaid'), true)
  assert.equal(matchFilter({ status: 5 }, 'done'), true)
})

test('catalog stays internally consistent', () => {
  const ids = new Set()
  for (const item of [...dishes, ...setmeals]) {
    assert.equal(ids.has(item.id), false)
    ids.add(item.id)
    assert.ok(item.price > 0)
    assert.ok(item.name)
  }
  assert.equal(dishes.length, 24)
  const fish = dishes.find((item) => item.id === 65).price
  const veg = dishes.find((item) => item.id === 55).price
  const rice = dishes.find((item) => item.id === 49).price
  const soda = dishes.find((item) => item.id === 47).price
  const meal = setmeals.find((item) => item.id === 101)
  assert.ok(meal.price < fish + veg + rice * 2 + soda * 2)
})
