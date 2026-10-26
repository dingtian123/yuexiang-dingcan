<script setup>
import PageHeader from './PageHeader.vue'
import { money } from '../domain.js'
import { currentOrder, payOrder, state } from '../store.js'
</script>

<template>
  <section class="page">
    <PageHeader title="支付订单" />
    <div v-if="currentOrder" class="scroll pay-scroll">
      <div class="pay-hero">
        <p>悦享订餐 · 川味小馆</p>
        <div class="amt"><small>¥</small>{{ money(currentOrder.total) }}</div>
        <p class="muted">订单号 {{ currentOrder.number }}</p>
      </div>
      <div class="pay-method">
        <span class="wx">微</span>
        <div>
          <strong>微信支付</strong>
          <p>推荐使用</p>
        </div>
        <span class="radio on" aria-hidden="true"></span>
      </div>
      <p class="fine center">这是模拟支付，不会产生真实扣款。</p>
    </div>
    <div v-else class="scroll">
      <p class="empty-copy">没有找到待支付订单。</p>
    </div>
    <footer class="paybar">
      <button
        type="button"
        class="go grow"
        :disabled="!currentOrder || currentOrder.status !== 1 || state.paying"
        @click="payOrder"
      >
        {{ state.paying ? '支付中…' : '确认支付' }}
      </button>
    </footer>
  </section>
</template>
