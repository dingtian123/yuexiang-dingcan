<script setup>
import { computed, onMounted, onUnmounted, watch } from 'vue'
import AddressPage from './components/AddressPage.vue'
import CartSheet from './components/CartSheet.vue'
import CheckoutPage from './components/CheckoutPage.vue'
import DishSheet from './components/DishSheet.vue'
import Icon from './components/Icon.vue'
import MenuPage from './components/MenuPage.vue'
import OrderDetailPage from './components/OrderDetailPage.vue'
import OrdersPage from './components/OrdersPage.vue'
import PayPage from './components/PayPage.vue'
import ProfilePage from './components/ProfilePage.vue'
import SearchOverlay from './components/SearchOverlay.vue'
import { money } from './domain.js'
import { shop } from './catalog.js'
import {
  dismissConfirm,
  ongoingCount,
  openCheckout,
  runConfirm,
  state,
  summary,
  switchTab,
} from './store.js'

const tabs = [
  { id: 'menu', label: '点餐', icon: 'bowl' },
  { id: 'orders', label: '订单', icon: 'receipt' },
  { id: 'profile', label: '我的', icon: 'user' },
]

const showTabs = computed(() => ['menu', 'orders', 'profile'].includes(state.view))
const showCart = computed(() => state.view === 'menu')

const titles = {
  menu: '点餐',
  orders: '订单',
  profile: '我的',
  checkout: '提交订单',
  pay: '支付订单',
  order: '订单详情',
  address: '地址管理',
  addressForm: '编辑地址',
}

watch(() => state.view, (view) => {
  document.title = `悦享订餐 · ${titles[view] || shop.name}`
}, { immediate: true })

function onKey(event) {
  if (event.key !== 'Escape') return
  if (state.confirm) { dismissConfirm(); return }
  if (state.dishSheet) { state.dishSheet = null; return }
  if (state.cartOpen) { state.cartOpen = false; return }
  if (state.searchOpen) { state.searchOpen = false }
}

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))

function openCart() {
  state.cartOpen = true
}
</script>

<template>
  <div class="shell" :class="{ 'with-tabs': showTabs, 'with-cart': showCart }">
    <main class="stage">
      <MenuPage v-show="state.view === 'menu'" />
      <OrdersPage v-if="state.view === 'orders'" />
      <ProfilePage v-if="state.view === 'profile'" />
      <CheckoutPage v-if="state.view === 'checkout'" />
      <PayPage v-if="state.view === 'pay'" />
      <OrderDetailPage v-if="state.view === 'order'" />
      <AddressPage v-if="state.view === 'address' || state.view === 'addressForm'" />
    </main>
    <footer v-if="showCart" class="cartbar">
      <button type="button" class="cart-ico" :class="{ empty: summary.portions === 0 }" aria-label="打开购物车" @click="openCart">
        <Icon name="cart" />
        <em v-if="summary.portions" class="count">{{ summary.portions }}</em>
      </button>
      <button type="button" class="cart-sum" @click="openCart">
        <strong><small>¥</small>{{ money(summary.goods) }}</strong>
        <p v-if="summary.portions === 0">未选购菜品</p>
        <p v-else-if="summary.shortfall > 0">还差 ¥{{ money(summary.shortfall) }} 起送</p>
        <p v-else-if="summary.deliveryFee === 0">已满 ¥{{ shop.freeDelivery }}，免配送费</p>
        <p v-else>配送费 ¥{{ money(shop.deliveryFee) }}，满 ¥{{ shop.freeDelivery }} 免配送</p>
      </button>
      <button type="button" class="go" :disabled="!summary.canCheckout" @click="openCheckout">
        {{ summary.shortfall > 0 && summary.portions > 0 ? `差 ¥${money(summary.shortfall)} 起送` : '去结算' }}
      </button>
    </footer>
    <nav v-if="showTabs" class="tabbar" aria-label="主导航">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        class="tab"
        :class="{ active: state.view === tab.id }"
        @click="switchTab(tab.id)"
      >
        <Icon :name="tab.icon" />
        <span>{{ tab.label }}</span>
        <em v-if="tab.id === 'orders' && ongoingCount" class="dot">{{ ongoingCount > 9 ? '9+' : ongoingCount }}</em>
      </button>
    </nav>
    <SearchOverlay />
    <DishSheet />
    <CartSheet />
    <div v-if="state.confirm" class="dialog-mask" @click="dismissConfirm">
      <div class="dialog" role="alertdialog" aria-modal="true" @click.stop>
        <h3>{{ state.confirm.title }}</h3>
        <p>{{ state.confirm.body }}</p>
        <div class="dialog-actions">
          <button type="button" class="btn" @click="dismissConfirm">再想想</button>
          <button type="button" class="btn primary" @click="runConfirm">{{ state.confirm.ok }}</button>
        </div>
      </div>
    </div>
    <p v-if="state.toast" class="toast" role="status">{{ state.toast }}</p>
  </div>
</template>
