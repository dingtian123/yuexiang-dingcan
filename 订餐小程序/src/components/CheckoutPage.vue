<script setup>
import DishArt from './DishArt.vue'
import Icon from './Icon.vue'
import PageHeader from './PageHeader.vue'
import { REMARKS, shop } from '../catalog.js'
import { money, maskPhone } from '../domain.js'
import {
  appendRemark,
  changeQty,
  login,
  openAddressBook,
  placeOrder,
  selectedAddress,
  setTableware,
  state,
  summary,
} from '../store.js'
</script>

<template>
  <section class="page">
    <PageHeader title="提交订单" />
    <div class="scroll">
      <button v-if="selectedAddress" type="button" class="card addr" @click="openAddressBook('pick')">
        <div>
          <span v-if="selectedAddress.label" class="tag">{{ selectedAddress.label }}</span>
          <strong>{{ selectedAddress.city }}{{ selectedAddress.district }}{{ selectedAddress.detail }}</strong>
          <p>{{ selectedAddress.consignee }} {{ selectedAddress.sex }} {{ maskPhone(selectedAddress.phone) }}</p>
        </div>
        <Icon name="chevron" />
      </button>
      <button v-else type="button" class="addr-empty" @click="openAddressBook('pick')">新增收货地址</button>

      <button v-if="!state.user" type="button" class="login-banner" @click="login">
        <span>登录后提交订单</span>
        <b>微信快捷登录</b>
      </button>

      <section class="card">
        <h2>送达时间</h2>
        <button
          v-for="slot in state.slots"
          :key="slot.id"
          type="button"
          class="choice"
          :class="{ on: state.slotId === slot.id }"
          @click="state.slotId = slot.id"
        >
          <span>{{ slot.label }}<small v-if="slot.hint">{{ slot.hint }}</small></span>
          <Icon v-if="state.slotId === slot.id" name="check" />
        </button>
      </section>

      <section class="card">
        <h2>餐品</h2>
        <div v-for="item in state.cart" :key="item.key" class="check-line">
          <DishArt :tone="item.tone" size="xs" />
          <div>
            <strong>{{ item.name }}</strong>
            <p v-if="item.flavorText">{{ item.flavorText }}</p>
          </div>
          <span class="stepper">
            <button type="button" aria-label="减少" @click="changeQty(item.key, -1)"><Icon name="minus" /></button>
            <b>{{ item.number }}</b>
            <button type="button" aria-label="增加" @click="changeQty(item.key, 1)"><Icon name="plus" /></button>
          </span>
        </div>
        <p v-if="!state.cart.length" class="empty-copy">购物车已空，返回菜单再选。</p>
      </section>

      <section class="card">
        <h2>备注</h2>
        <textarea v-model="state.remark" maxlength="50" rows="2" placeholder="口味、餐具、送达位置"></textarea>
        <div class="counter">{{ state.remark.length }}/50</div>
        <div class="presets">
          <button v-for="item in REMARKS" :key="item" type="button" @click="appendRemark(item)">{{ item }}</button>
        </div>
      </section>

      <section class="card">
        <div class="field">
          <label>餐具</label>
          <span class="grow">{{ state.tableware === 0 ? '无需餐具' : `${state.tableware} 份` }}</span>
          <span class="stepper">
            <button type="button" aria-label="减少餐具" @click="setTableware(state.tableware - 1)"><Icon name="minus" /></button>
            <b>{{ state.tableware }}</b>
            <button type="button" aria-label="增加餐具" @click="setTableware(state.tableware + 1)"><Icon name="plus" /></button>
          </span>
        </div>
      </section>

      <section class="card">
        <div class="fee"><span>菜品</span><span>¥{{ money(summary.goods) }}</span></div>
        <div class="fee"><span>打包费</span><span>¥{{ money(summary.packFee) }}</span></div>
        <div class="fee">
          <span>配送费</span>
          <span>{{ summary.goods > 0 && summary.deliveryFee === 0 ? '免配送费' : `¥${money(summary.deliveryFee)}` }}</span>
        </div>
        <div class="fee total"><span>合计</span><span>¥{{ money(summary.total) }}</span></div>
        <p class="fine">满 ¥{{ shop.freeDelivery }} 免配送费，起送 ¥{{ shop.minAmount }}。</p>
      </section>
    </div>
    <footer class="paybar">
      <div class="cart-sum">
        <strong><small>¥</small>{{ money(summary.total) }}</strong>
        <p>含打包与配送</p>
      </div>
      <button type="button" class="go" :disabled="!summary.canCheckout || state.placing" @click="placeOrder">提交订单</button>
    </footer>
  </section>
</template>
