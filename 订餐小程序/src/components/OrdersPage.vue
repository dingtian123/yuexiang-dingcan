<script setup>
import { ORDER_STATUS, money, orderBrief } from '../domain.js'
import { askCancel, openOrder, reorder, startPay, state, visibleOrders } from '../store.js'

const filters = [
  { id: 'all', label: '全部' },
  { id: 'unpaid', label: '待付款' },
  { id: 'active', label: '进行中' },
  { id: 'done', label: '已完成' },
]

const emptyText = {
  all: '还没有订单，去点一份川菜。',
  unpaid: '没有待付款的订单。',
  active: '没有进行中的订单。',
  done: '还没有已完成的订单。',
}
</script>

<template>
  <section class="page">
    <header class="nav plain">
      <h1>订单</h1>
    </header>
    <div class="filters">
      <button
        v-for="item in filters"
        :key="item.id"
        type="button"
        :class="{ on: state.orderFilter === item.id }"
        @click="state.orderFilter = item.id"
      >
        {{ item.label }}
      </button>
    </div>
    <div class="scroll">
      <p v-if="!visibleOrders.length" class="empty-copy">{{ emptyText[state.orderFilter] }}</p>
      <article v-for="order in visibleOrders" :key="order.id" class="order" @click="openOrder(order.id)">
        <div class="order-top">
          <strong>川味小馆</strong>
          <span class="status" :class="ORDER_STATUS[order.status].tone">{{ ORDER_STATUS[order.status].label }}</span>
        </div>
        <p class="order-brief">{{ orderBrief(order) }}</p>
        <div class="order-foot">
          <span>¥{{ money(order.total) }}</span>
        </div>
        <div class="order-actions" @click.stop>
          <button v-if="order.status === 1 || order.status === 2" type="button" class="btn ghost-danger" @click="askCancel(order.id)">取消订单</button>
          <button v-if="order.status === 1" type="button" class="btn primary" @click="startPay(order.id)">去支付</button>
          <button v-if="order.status >= 5" type="button" class="btn" @click="reorder(order)">再来一单</button>
        </div>
      </article>
    </div>
  </section>
</template>
