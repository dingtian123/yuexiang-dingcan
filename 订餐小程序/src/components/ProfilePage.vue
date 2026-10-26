<script setup>
import Icon from './Icon.vue'
import { shop } from '../catalog.js'
import { maskPhone } from '../domain.js'
import { askLogout, login, openAddressBook, state, switchTab } from '../store.js'

const ongoing = () => state.orders.filter((order) => [2, 3, 4].includes(order.status)).length
</script>

<template>
  <section class="page">
    <header class="nav plain">
      <h1>我的</h1>
    </header>
    <div class="scroll">
      <div class="who">
        <div class="avatar">{{ state.user ? state.user.name.slice(0, 1) : '悦' }}</div>
        <div class="who-copy">
          <strong>{{ state.user ? state.user.name : '未登录' }}</strong>
          <p>{{ state.user ? maskPhone(state.user.phone) : '登录后即可下单' }}</p>
        </div>
        <button v-if="!state.user" type="button" class="btn primary" @click="login">微信快捷登录</button>
      </div>
      <div class="stats">
        <button type="button" @click="switchTab('orders')">
          <b>{{ state.orders.length }}</b><span>全部订单</span>
        </button>
        <button type="button" @click="switchTab('orders')">
          <b>{{ ongoing() }}</b><span>进行中</span>
        </button>
        <button type="button" @click="openAddressBook('manage')">
          <b>{{ state.addresses.length }}</b><span>收货地址</span>
        </button>
      </div>
      <div class="list-card">
        <button type="button" class="list-btn" @click="switchTab('orders')">
          <Icon name="receipt" /><span class="grow">我的订单</span><Icon name="chevron" />
        </button>
        <button type="button" class="list-btn" @click="openAddressBook('manage')">
          <Icon name="pin" /><span class="grow">地址管理</span><Icon name="chevron" />
        </button>
        <a class="list-btn" :href="shop.phoneHref">
          <Icon name="phone" /><span class="grow">联系商家 {{ shop.phone }}</span><Icon name="chevron" />
        </a>
        <div class="list-btn static">
          <Icon name="clock" /><span class="grow">营业时间 {{ shop.hours }}</span>
        </div>
      </div>
      <button v-if="state.user" type="button" class="logout" @click="askLogout">退出登录</button>
      <p class="foot-note">{{ shop.name }} · {{ shop.branch }}<br />{{ shop.address }}</p>
    </div>
  </section>
</template>
