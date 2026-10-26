<script setup>
import { computed } from 'vue'
import DishArt from './DishArt.vue'
import PageHeader from './PageHeader.vue'
import { shop } from '../catalog.js'
import { ORDER_STATUS, formatTime, maskPhone, money, timeline } from '../domain.js'
import { askCancel, currentOrder, reorder, startPay, toast } from '../store.js'

const steps = computed(() => (currentOrder.value ? timeline(currentOrder.value) : []))

async function copyNumber(number) {
  try {
    await navigator.clipboard.writeText(number)
    toast('订单号已复制')
  } catch {
    toast(number)
  }
}
</script>

<template>
  <section class="page">
    <PageHeader title="订单详情" />
    <div v-if="currentOrder" class="scroll">
      <section class="card status-hero">
        <p class="status" :class="ORDER_STATUS[currentOrder.status].tone">{{ ORDER_STATUS[currentOrder.status].label }}</p>
        <h2>{{ currentOrder.deliveryLabel }}</h2>
        <p>{{ currentOrder.address.city }}{{ currentOrder.address.district }}{{ currentOrder.address.detail }}</p>
        <p>{{ currentOrder.address.consignee }} {{ currentOrder.address.sex }} {{ maskPhone(currentOrder.address.phone) }}</p>
      </section>
      <section class="card">
        <h2>进度</h2>
        <ol class="tl">
          <li v-for="step in steps" :key="step.label">
            <b>{{ step.label }}</b>
            <span>{{ formatTime(step.time) }}</span>
          </li>
        </ol>
      </section>
      <section class="card">
        <h2>餐品</h2>
        <div v-for="item in currentOrder.items" :key="item.key" class="detail-line">
          <DishArt :tone="item.tone" size="xs" />
          <div>
            <strong>{{ item.name }}</strong>
            <p v-if="item.flavorText">{{ item.flavorText }}</p>
          </div>
          <span>×{{ item.number }}</span>
          <b>¥{{ money(item.price * item.number) }}</b>
        </div>
        <div class="fee"><span>打包费</span><span>¥{{ money(currentOrder.packFee) }}</span></div>
        <div class="fee"><span>配送费</span><span>{{ currentOrder.deliveryFee === 0 ? '免配送费' : `¥${money(currentOrder.deliveryFee)}` }}</span></div>
        <div class="fee total"><span>实付</span><span>¥{{ money(currentOrder.total) }}</span></div>
      </section>
      <section class="card meta">
        <p><span>订单号</span><button type="button" @click="copyNumber(currentOrder.number)">{{ currentOrder.number }}</button></p>
        <p><span>下单时间</span><b>{{ formatTime(currentOrder.orderTime) }}</b></p>
        <p><span>支付方式</span><b>微信支付</b></p>
        <p><span>餐具</span><b>{{ currentOrder.tableware === 0 ? '无需餐具' : `${currentOrder.tableware} 份` }}</b></p>
        <p v-if="currentOrder.remark"><span>备注</span><b>{{ currentOrder.remark }}</b></p>
        <p><span>商家电话</span><a :href="shop.phoneHref">{{ shop.phone }}</a></p>
      </section>
    </div>
    <div v-else class="scroll"><p class="empty-copy">订单不存在。</p></div>
    <footer v-if="currentOrder" class="paybar end">
      <button v-if="currentOrder.status === 1 || currentOrder.status === 2" type="button" class="btn ghost-danger" @click="askCancel(currentOrder.id)">取消订单</button>
      <button v-if="currentOrder.status === 1" type="button" class="go" @click="startPay(currentOrder.id)">去支付</button>
      <button v-if="currentOrder.status >= 5" type="button" class="go" @click="reorder(currentOrder)">再来一单</button>
    </footer>
  </section>
</template>
