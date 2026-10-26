export const ORDER_STATUS = {
  1: { label: '待付款', tone: 'hot' },
  2: { label: '待接单', tone: 'warm' },
  3: { label: '已接单', tone: 'warm' },
  4: { label: '派送中', tone: 'go' },
  5: { label: '已完成', tone: 'mute' },
  6: { label: '已取消', tone: 'mute' },
  7: { label: '已退款', tone: 'mute' },
}

export function round2(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100
}

export function money(value) {
  return round2(value).toFixed(2)
}

export function shanghaiParts(date) {
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  })
  const parts = {}
  for (const part of fmt.formatToParts(date)) {
    if (part.type !== 'literal') parts[part.type] = part.value
  }
  if (parts.hour === '24') parts.hour = '00'
  return parts
}

export function formatTime(ts) {
  if (!ts) return ''
  const parts = shanghaiParts(new Date(ts))
  return `${Number(parts.month)}月${Number(parts.day)}日 ${parts.hour}:${parts.minute}`
}

export function orderNumber(date = new Date()) {
  const parts = shanghaiParts(date)
  const rand = String(Math.floor(1000 + Math.random() * 9000))
  return `YX${parts.year}${parts.month}${parts.day}${rand}`
}

export function maskPhone(phone = '') {
  return String(phone).replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

export function flavorKey(flavors = {}) {
  return Object.keys(flavors)
    .sort()
    .map((name) => {
      const value = flavors[name]
      if (Array.isArray(value)) {
        return value.length ? `${name}=${[...value].sort().join(',')}` : ''
      }
      return value ? `${name}=${value}` : ''
    })
    .filter(Boolean)
    .join('&')
}

export function flavorText(flavors = {}, groups = []) {
  const names = groups.length ? groups.map((group) => group.name) : Object.keys(flavors)
  const parts = []
  for (const name of names) {
    const value = flavors[name]
    if (Array.isArray(value) && value.length) parts.push(value.join('、'))
    else if (typeof value === 'string' && value) parts.push(value)
  }
  return parts.join(' / ')
}

export function cartKey(kind, id, flavors = {}) {
  const flavor = flavorKey(flavors)
  return flavor ? `${kind}:${id}:${flavor}` : `${kind}:${id}`
}

export function missingFlavor(groups = [], flavors = {}) {
  for (const group of groups) {
    if (!group.required) continue
    const value = flavors[group.name]
    const empty = Array.isArray(value) ? value.length === 0 : !value
    if (empty) return group.name
  }
  return ''
}

export function summarize(items, rules) {
  const goods = round2(items.reduce((sum, item) => sum + item.price * item.number, 0))
  const portions = items.reduce((sum, item) => sum + item.number, 0)
  const packFee = portions > 0 ? round2(portions * rules.packEach) : 0
  const deliveryFee = goods > 0 && goods < rules.freeDelivery ? rules.deliveryFee : 0
  const total = round2(goods + packFee + deliveryFee)
  const shortfall = portions > 0 ? round2(Math.max(0, rules.minAmount - goods)) : round2(rules.minAmount)
  return {
    goods,
    portions,
    packFee,
    deliveryFee,
    total,
    shortfall,
    canCheckout: portions > 0 && goods >= rules.minAmount,
  }
}

export function validateAddress(form) {
  if (!form.consignee || !form.consignee.trim()) return '请填写收货人'
  if (!/^1\d{10}$/.test((form.phone || '').trim())) return '请填写 11 位手机号'
  if (!form.district) return '请选择区域'
  if (!form.detail || form.detail.trim().length < 2) return '请填写详细地址'
  return ''
}

function hhmm(mins) {
  const hour = Math.floor(mins / 60)
  const minute = mins % 60
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

function stamp(date) {
  const parts = shanghaiParts(date)
  return {
    y: Number(parts.year),
    m: Number(parts.month),
    d: Number(parts.day),
    mins: Number(parts.hour) * 60 + Number(parts.minute),
  }
}

export function deliverySlots(now = new Date(), eta = 32) {
  const open = 10 * 60
  const lastStart = 21 * 60 + 30
  const slots = [{ id: 'asap', label: '尽快送达', hint: `约 ${eta} 分钟` }]
  let cursor = new Date(now.getTime() + 60 * 60000)
  const base = stamp(cursor)
  const rounded = Math.ceil(base.mins / 30) * 30
  cursor = new Date(cursor.getTime() + (rounded - base.mins) * 60000)
  const today = stamp(now)
  let safety = 0
  while (slots.length < 6 && safety < 48) {
    safety += 1
    const at = stamp(cursor)
    const offset = Math.round(
      (Date.UTC(at.y, at.m - 1, at.d) - Date.UTC(today.y, today.m - 1, today.d)) / 86400000,
    )
    if (offset > 1) break
    if (offset >= 0 && at.mins >= open && at.mins <= lastStart) {
      const prefix = offset === 0 ? '今天' : '明天'
      slots.push({
        id: `${at.y}${at.m}${at.d}-${at.mins}`,
        label: `${prefix} ${hhmm(at.mins)}–${hhmm(at.mins + 30)}`,
      })
    }
    cursor = new Date(cursor.getTime() + 30 * 60000)
  }
  return slots
}

export function orderBrief(order) {
  const first = order.items[0]
  if (!first) return '无菜品'
  const flavor = first.flavorText ? `（${first.flavorText}）` : ''
  const portions = order.items.reduce((sum, item) => sum + item.number, 0)
  if (order.items.length === 1) return `${first.name}${flavor} ×${portions}`
  return `${first.name}${flavor} 等 ${portions} 份`
}

export function timeline(order) {
  const steps = [{ label: '订单已提交', time: order.orderTime }]
  if (order.checkoutTime) steps.push({ label: '支付成功', time: order.checkoutTime })
  if (order.acceptTime) steps.push({ label: '商家已接单', time: order.acceptTime })
  if (order.deliverTime) steps.push({ label: '骑手配送中', time: order.deliverTime })
  if (order.finishTime) steps.push({ label: '已送达', time: order.finishTime })
  if (order.status === 6) {
    steps.push({
      label: order.payStatus === 2 ? '已取消并退款' : '订单已取消',
      time: order.cancelTime,
    })
  }
  return steps
}

export function matchFilter(order, filter) {
  if (filter === 'unpaid') return order.status === 1
  if (filter === 'active') return [2, 3, 4].includes(order.status)
  if (filter === 'done') return order.status === 5
  return true
}
