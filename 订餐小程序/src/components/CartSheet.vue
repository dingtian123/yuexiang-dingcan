<script setup>
import DishArt from './DishArt.vue'
import Icon from './Icon.vue'
import { shop } from '../catalog.js'
import { money } from '../domain.js'
import { askClearCart, changeQty, openCheckout, state, summary } from '../store.js'
</script>

<template>
  <div v-if="state.cartOpen" class="mask" @click="state.cartOpen = false">
    <div class="sheet" role="dialog" aria-modal="true" aria-label="购物车" @click.stop>
      <div class="grab"></div>
      <div class="sheet-title">
        <h2>购物车</h2>
        <button v-if="state.cart.length" type="button" class="text-btn" @click="askClearCart">
          <Icon name="trash" />清空
        </button>
      </div>
      <div class="sheet-body">
      <p v-if="!state.cart.length" class="empty-copy">购物车还是空的，去菜单里挑一道。</p>
      <ul v-else class="cart-list">
        <li v-for="item in state.cart" :key="item.key">
          <DishArt :tone="item.tone" size="xs" />
          <div>
            <strong>{{ item.name }}</strong>
            <p v-if="item.flavorText">{{ item.flavorText }}</p>
            <span class="price"><small>¥</small>{{ money(item.price) }}</span>
          </div>
          <span class="stepper">
            <button type="button" aria-label="减少" @click="changeQty(item.key, -1)"><Icon name="minus" /></button>
            <b>{{ item.number }}</b>
            <button type="button" aria-label="增加" @click="changeQty(item.key, 1)"><Icon name="plus" /></button>
          </span>
        </li>
      </ul>
      <p v-if="state.cart.length" class="fine">打包费按份计算，满 ¥{{ shop.freeDelivery }} 免配送费。</p>
      </div>
      <div class="sheet-bar">
        <div class="cart-sum">
          <strong><small>¥</small>{{ money(summary.goods) }}</strong>
          <p v-if="summary.shortfall > 0 && summary.portions > 0">还差 ¥{{ money(summary.shortfall) }} 起送</p>
          <p v-else-if="summary.portions > 0 && summary.deliveryFee === 0">已免配送费</p>
          <p v-else-if="summary.portions > 0">另需配送费 ¥{{ money(summary.deliveryFee) }}</p>
        </div>
        <button type="button" class="go" :disabled="!summary.canCheckout" @click="openCheckout">
          {{ summary.shortfall > 0 && summary.portions > 0 ? `差 ¥${money(summary.shortfall)} 起送` : '去结算' }}
        </button>
      </div>
    </div>
  </div>
</template>
