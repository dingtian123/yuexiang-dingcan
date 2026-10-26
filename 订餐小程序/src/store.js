import { computed, reactive, watch } from 'vue'
import { dishes, findProduct, shop } from './catalog.js'
import {
  cartKey,
  deliverySlots,
  flavorText,
  matchFilter,
  missingFlavor,
  orderNumber,
  summarize,
  validateAddress,
} from './domain.js'

const KEY = 'yuexiang-dingcan-v1'

export const state = reactive({
  view: 'menu',
  stack: [],
  activeCategory: 'sign',
  cart: [],
  orders: [],
  addresses: [],
  selectedAddressId: null,
  user: null,
  addressIntent: 'manage',
  editingAddressId: null,
  activeOrderId: null,
  orderFilter: 'all',
  dishSheet: null,
  dishError: '',
  cartOpen: false,
  searchOpen: false,
  searchQuery: '',
  confirm: null,
  toast: '',
  paying: false,
  placing: false,
  remark: '',
  tableware: 1,
  slotId: 'asap',
  slots: [],
})

export const summary = computed(() => summarize(state.cart, shop))

export const selectedAddress = computed(() => {
  return (
    state.addresses.find((item) => item.id === state.selectedAddressId) ||
    state.addresses.find((item) => item.isDefault) ||
    state.addresses[0] ||
    null
  )
})

export const currentOrder = computed(() => state.orders.find((item) => item.id === state.activeOrderId) || null)

export const visibleOrders = computed(() => {
  return state.orders
    .filter((order) => matchFilter(order, state.orderFilter))
    .slice()
    .sort((a, b) => b.orderTime - a.orderTime)
})

export const ongoingCount = computed(() => state.orders.filter((order) => [1, 2, 3, 4].includes(order.status)).length)

let toastTimer = 0
export function toast(message) {
  state.toast = message
  window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => {
    if (state.toast === message) state.toast = ''
  }, 2200)
}

function closeTransient() {
  state.cartOpen = false
  state.searchOpen = false
  state.dishSheet = null
  state.dishError = ''
  state.confirm = null
}

export function switchTab(tab) {
  state.view = tab
  state.stack = []
  closeTransient()
}

export function push(view) {
  state.stack.push(state.view)
  state.view = view
  closeTransient()
}

export function back() {
  if (state.view === 'pay') {
    const unpaid = currentOrder.value?.status === 1
    state.stack = ['orders']
    state.view = 'order'
    closeTransient()
    if (unpaid) toast('订单待支付，可在订单里继续付款')
    return
  }
  state.view = state.stack.pop() || 'menu'
  closeTransient()
}

export function countOf(kind, id) {
  return state.cart
    .filter((item) => item.kind === kind && item.id === id)
    .reduce((sum, item) => sum + item.number, 0)
}

export function lineKeyFor(product) {
  return cartKey(product.kind, product.id, {})
}

export function addToCart(product, flavors, number) {
  if (!product || number < 1) return
  const key = cartKey(product.kind, product.id, flavors)
  const found = state.cart.find((item) => item.key === key)
  if (found) {
    found.number = Math.min(99, found.number + number)
    return
  }
  state.cart.push({
    key,
    kind: product.kind,
    id: product.id,
    name: product.name,
    price: product.price,
    tone: product.tone,
    number: Math.min(99, number),
    flavors: JSON.parse(JSON.stringify(flavors || {})),
    flavorText: flavorText(flavors || {}, product.flavors || []),
  })
}

export function changeQty(key, delta) {
  const item = state.cart.find((entry) => entry.key === key)
  if (!item) return
  item.number = Math.min(99, item.number + delta)
  if (item.number <= 0) state.cart = state.cart.filter((entry) => entry.key !== key)
}

export function quickAdd(product) {
  if (product.flavors?.length) openDish(product)
  else addToCart(product, {}, 1)
}

export function openDish(product) {
  const flavors = {}
  for (const group of product.flavors || []) flavors[group.name] = group.multiple ? [] : ''
  state.dishSheet = { kind: product.kind, id: product.id, number: 1, flavors }
  state.dishError = ''
  state.cartOpen = false
}

export function closeDish() {
  state.dishSheet = null
  state.dishError = ''
}

export function setFlavor(name, option, multiple) {
  if (!state.dishSheet) return
  if (multiple) {
    const current = state.dishSheet.flavors[name] || []
    state.dishSheet.flavors[name] = current.includes(option)
      ? current.filter((item) => item !== option)
      : [...current, option]
  } else {
    state.dishSheet.flavors[name] = option
  }
  state.dishError = ''
}

export function sheetQty(delta) {
  if (!state.dishSheet) return
  state.dishSheet.number = Math.max(1, Math.min(99, state.dishSheet.number + delta))
}

export function confirmDish() {
  const sheet = state.dishSheet
  if (!sheet) return
  const product = findProduct(sheet.kind, sheet.id)
  if (!product) return
  const missing = missingFlavor(product.flavors || [], sheet.flavors)
  if (missing) {
    state.dishError = `请选择${missing}`
    return
  }
  addToCart(product, sheet.flavors, sheet.number)
  closeDish()
  toast('已加入购物车')
}

export function askClearCart() {
  if (!state.cart.length) return
  state.confirm = {
    title: '清空购物车？',
    body: '已选的菜品会从购物车移除。',
    ok: '清空',
    danger: true,
    run() {
      state.cart = []
      state.cartOpen = false
    },
  }
}

export function openCheckout() {
  if (!summary.value.canCheckout) {
    toast(summary.value.portions === 0 ? '请先选择菜品' : `还差 ¥${summary.value.shortfall.toFixed(2)} 起送`)
    return
  }
  state.slots = deliverySlots(new Date(), shop.eta)
  state.slotId = 'asap'
  state.cartOpen = false
  push('checkout')
}

export function setTableware(value) {
  state.tableware = Math.max(0, Math.min(8, value))
}

export function appendRemark(text) {
  if (state.remark.includes(text)) return
  const next = state.remark ? `${state.remark}，${text}` : text
  state.remark = next.slice(0, 50)
}

export function placeOrder() {
  if (state.placing) return
  if (!state.user) {
    toast('请先登录再提交订单')
    return
  }
  const address = selectedAddress.value
  if (!address) {
    toast('请选择收货地址')
    return
  }
  if (!summary.value.canCheckout) {
    toast('未达到起送金额')
    return
  }
  const slot = state.slots.find((item) => item.id === state.slotId) || state.slots[0]
  const sums = summary.value
  const now = Date.now()
  const order = {
    id: `ord-${now}`,
    number: orderNumber(new Date(now)),
    status: 1,
    payStatus: 0,
    payMethod: 1,
    orderTime: now,
    checkoutTime: null,
    cancelTime: null,
    acceptTime: null,
    deliverTime: null,
    finishTime: null,
    remark: state.remark.trim(),
    tableware: state.tableware,
    deliveryLabel: slot?.hint ? `${slot.label}（${slot.hint}）` : slot?.label || '尽快送达',
    address: {
      consignee: address.consignee,
      sex: address.sex,
      phone: address.phone,
      city: address.city,
      district: address.district,
      detail: address.detail,
      label: address.label,
    },
    items: JSON.parse(JSON.stringify(state.cart)),
    goods: sums.goods,
    packFee: sums.packFee,
    deliveryFee: sums.deliveryFee,
    total: sums.total,
  }
  state.placing = true
  state.orders.unshift(order)
  state.cart = []
  state.remark = ''
  state.tableware = 1
  state.slotId = 'asap'
  state.activeOrderId = order.id
  state.placing = false
  push('pay')
}

export function payOrder() {
  const order = currentOrder.value
  if (!order || order.status !== 1 || state.paying) return
  state.paying = true
  window.setTimeout(() => {
    order.status = 2
    order.payStatus = 1
    order.checkoutTime = Date.now()
    state.paying = false
    state.stack = ['orders']
    state.view = 'order'
    closeTransient()
    toast('支付成功，等待商家接单')
  }, 700)
}

export function openOrder(id) {
  state.activeOrderId = id
  push('order')
}

export function startPay(id) {
  state.activeOrderId = id
  push('pay')
}

export function askCancel(id) {
  const order = state.orders.find((item) => item.id === id)
  if (!order || ![1, 2].includes(order.status)) return
  const paid = order.status === 2
  state.confirm = {
    title: paid ? '取消并退款？' : '取消订单？',
    body: paid ? '款项会原路退回。' : '取消后可以用再来一单重新购买。',
    ok: '确认取消',
    danger: true,
    run() {
      if (order.status === 2) order.payStatus = 2
      order.status = 6
      order.cancelTime = Date.now()
      toast(paid ? '订单已取消，款项将退回' : '订单已取消')
    },
  }
}

export function reorder(order) {
  for (const item of order.items) {
    const product = findProduct(item.kind, item.id)
    if (!product) continue
    addToCart(product, item.flavors || {}, item.number)
  }
  switchTab('menu')
  toast('已加入购物车')
}

export function openAddressBook(intent) {
  state.addressIntent = intent
  push('address')
}

export function startAddress(id = null) {
  state.editingAddressId = id
  push('addressForm')
}

export function chooseAddress(id) {
  state.selectedAddressId = id
  if (state.addressIntent === 'pick') back()
}

export function saveAddress(form) {
  const error = validateAddress(form)
  if (error) {
    toast(error)
    return
  }
  const data = {
    consignee: form.consignee.trim(),
    sex: form.sex || '女士',
    phone: form.phone.trim(),
    city: shop.city,
    district: form.district,
    detail: form.detail.trim(),
    label: form.label || '',
    isDefault: !!form.isDefault,
  }
  if (data.isDefault) state.addresses.forEach((item) => { item.isDefault = false })
  let id = state.editingAddressId
  if (id) {
    const index = state.addresses.findIndex((item) => item.id === id)
    if (index >= 0) state.addresses[index] = { ...state.addresses[index], ...data, id }
  } else {
    id = `addr-${Date.now()}`
    state.addresses.unshift({ ...data, id })
  }
  if (!state.addresses.some((item) => item.isDefault) && state.addresses[0]) {
    const saved = state.addresses.find((item) => item.id === id) || state.addresses[0]
    saved.isDefault = true
  }
  if (data.isDefault || state.addressIntent === 'pick' || !state.selectedAddressId) {
    state.selectedAddressId = id
  }
  back()
  toast('地址已保存')
}

export function askRemoveAddress(id) {
  state.confirm = {
    title: '删除这个地址？',
    body: '已提交订单里的地址不会改变。',
    ok: '删除',
    danger: true,
    run() {
      state.addresses = state.addresses.filter((item) => item.id !== id)
      if (!state.addresses.some((item) => item.isDefault) && state.addresses[0]) {
        state.addresses[0].isDefault = true
      }
      if (state.selectedAddressId === id) {
        state.selectedAddressId = state.addresses.find((item) => item.isDefault)?.id || state.addresses[0]?.id || null
      }
      toast('地址已删除')
    },
  }
}

export function login() {
  state.user = { name: '林晓', phone: '13817626621' }
  toast('已登录')
}

export function askLogout() {
  state.confirm = {
    title: '退出登录？',
    body: '购物车和订单仍保留在这台设备上。',
    ok: '退出',
    danger: true,
    run() {
      state.user = null
      toast('已退出')
    },
  }
}

export function runConfirm() {
  const run = state.confirm?.run
  state.confirm = null
  run?.()
}

export function dismissConfirm() {
  state.confirm = null
}

function seed() {
  const fish = dishes.find((item) => item.id === 66)
  const rice = dishes.find((item) => item.id === 49)
  const soup = dishes.find((item) => item.id === 68)
  const items = [
    {
      key: cartKey('dish', fish.id, { 辣度: '微辣' }),
      kind: 'dish',
      id: fish.id,
      name: fish.name,
      price: fish.price,
      tone: fish.tone,
      number: 1,
      flavors: { 辣度: '微辣' },
      flavorText: '微辣',
    },
    {
      key: cartKey('dish', rice.id, {}),
      kind: 'dish',
      id: rice.id,
      name: rice.name,
      price: rice.price,
      tone: rice.tone,
      number: 2,
      flavors: {},
      flavorText: '',
    },
    {
      key: cartKey('dish', soup.id, {}),
      kind: 'dish',
      id: soup.id,
      name: soup.name,
      price: soup.price,
      tone: soup.tone,
      number: 1,
      flavors: {},
      flavorText: '',
    },
  ]
  const sums = summarize(items, shop)
  const orderTime = Date.now() - 26 * 3600 * 1000
  state.user = { name: '林晓', phone: '13817626621' }
  state.addresses = [
    {
      id: 'addr-home',
      consignee: '林晓',
      sex: '女士',
      phone: '13817626621',
      city: '上海市',
      district: '徐汇区',
      detail: '衡山路 18 号 2 层',
      label: '家',
      isDefault: true,
    },
  ]
  state.selectedAddressId = 'addr-home'
  state.orders = [
    {
      id: 'ord-seed',
      number: 'YX2026102519304821',
      status: 5,
      payStatus: 1,
      payMethod: 1,
      orderTime,
      checkoutTime: orderTime + 60 * 1000,
      acceptTime: orderTime + 3 * 60 * 1000,
      deliverTime: orderTime + 8 * 60 * 1000,
      finishTime: orderTime + 40 * 60 * 1000,
      cancelTime: null,
      remark: '少放辣',
      tableware: 2,
      deliveryLabel: '尽快送达（约 32 分钟）',
      address: {
        consignee: '林晓',
        sex: '女士',
        phone: '13817626621',
        city: '上海市',
        district: '徐汇区',
        detail: '衡山路 18 号 2 层',
        label: '家',
      },
      items,
      goods: sums.goods,
      packFee: sums.packFee,
      deliveryFee: sums.deliveryFee,
      total: sums.total,
    },
  ]
}

function hydrate() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return seed()
    const saved = JSON.parse(raw)
    if (!saved || !Array.isArray(saved.cart) || !Array.isArray(saved.orders) || !Array.isArray(saved.addresses)) {
      return seed()
    }
    state.cart = saved.cart
    state.orders = saved.orders
    state.addresses = saved.addresses
    state.selectedAddressId = saved.selectedAddressId || null
    state.user = saved.user || null
  } catch {
    seed()
  }
}

function snapshot() {
  return {
    cart: state.cart,
    orders: state.orders,
    addresses: state.addresses,
    selectedAddressId: state.selectedAddressId,
    user: state.user,
  }
}

function persist() {
  localStorage.setItem(KEY, JSON.stringify(snapshot()))
}

hydrate()
persist()

watch(snapshot, persist, { deep: true })
