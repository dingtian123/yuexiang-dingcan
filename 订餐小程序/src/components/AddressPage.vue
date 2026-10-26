<script setup>
import { reactive, watch } from 'vue'
import Icon from './Icon.vue'
import PageHeader from './PageHeader.vue'
import { shop } from '../catalog.js'
import { maskPhone } from '../domain.js'
import {
  askRemoveAddress,
  back,
  chooseAddress,
  saveAddress,
  startAddress,
  state,
} from '../store.js'

const form = reactive(blank())

function blank() {
  return {
    consignee: '',
    sex: '女士',
    phone: state.user?.phone || '',
    district: shop.districts[0],
    detail: '',
    label: '家',
    isDefault: state.addresses.length === 0,
  }
}

watch(
  () => [state.view, state.editingAddressId],
  () => {
    if (state.view !== 'addressForm') return
    const existing = state.addresses.find((item) => item.id === state.editingAddressId)
    Object.assign(form, existing ? { ...existing } : blank())
  },
  { immediate: true },
)

const title = () => (state.view === 'addressForm' ? (state.editingAddressId ? '编辑地址' : '新增地址') : '地址管理')
</script>

<template>
  <section class="page">
    <PageHeader :title="title()" />
    <form v-if="state.view === 'addressForm'" class="form-page" @submit.prevent="saveAddress(form)">
      <div class="scroll">
        <section class="card">
          <div class="field">
            <label for="consignee">收货人</label>
            <input id="consignee" v-model="form.consignee" maxlength="20" placeholder="姓名" />
          </div>
          <div class="field">
            <label>称谓</label>
            <span class="seg">
              <button type="button" :class="{ on: form.sex === '先生' }" @click="form.sex = '先生'">先生</button>
              <button type="button" :class="{ on: form.sex === '女士' }" @click="form.sex = '女士'">女士</button>
            </span>
          </div>
          <div class="field">
            <label for="phone">手机号</label>
            <input id="phone" v-model="form.phone" inputmode="numeric" maxlength="11" placeholder="11 位手机号" />
          </div>
          <div class="field">
            <label for="district">区域</label>
            <select id="district" v-model="form.district">
              <option v-for="item in shop.districts" :key="item" :value="item">{{ shop.city }}{{ item }}</option>
            </select>
          </div>
          <div class="field area">
            <label for="detail">详细地址</label>
            <textarea id="detail" v-model="form.detail" maxlength="60" rows="2" placeholder="街道、门牌号、楼层"></textarea>
          </div>
          <div class="field">
            <label>标签</label>
            <span class="seg">
              <button v-for="item in ['家', '公司', '学校']" :key="item" type="button" :class="{ on: form.label === item }" @click="form.label = form.label === item ? '' : item">{{ item }}</button>
            </span>
          </div>
          <div class="field">
            <label for="default-address">默认地址</label>
            <span class="grow"></span>
            <button id="default-address" type="button" class="switch" :class="{ on: form.isDefault }" role="switch" :aria-checked="form.isDefault" @click="form.isDefault = !form.isDefault">
              <i></i>
            </button>
          </div>
        </section>
        <p class="fine">配送范围：{{ shop.city }}中心城区。当前门店在衡山路。</p>
      </div>
      <footer class="paybar">
        <button type="submit" class="go grow">保存地址</button>
      </footer>
    </form>
    <div v-else class="scroll">
      <p v-if="!state.addresses.length" class="empty-copy">还没有收货地址。</p>
      <article
        v-for="item in state.addresses"
        :key="item.id"
        class="addr-card"
        :class="{ picked: state.selectedAddressId === item.id }"
        @click="state.addressIntent === 'pick' ? chooseAddress(item.id) : startAddress(item.id)"
      >
        <div>
          <div class="addr-line">
            <span v-if="item.label" class="tag">{{ item.label }}</span>
            <span v-if="item.isDefault" class="tag quiet">默认</span>
            <strong>{{ item.consignee }} {{ item.sex }}</strong>
            <span class="muted">{{ maskPhone(item.phone) }}</span>
          </div>
          <p>{{ item.city }}{{ item.district }}{{ item.detail }}</p>
        </div>
        <div class="addr-tools" @click.stop>
          <button type="button" aria-label="编辑地址" @click="startAddress(item.id)"><Icon name="note" /></button>
          <button type="button" aria-label="删除地址" @click="askRemoveAddress(item.id)"><Icon name="trash" /></button>
        </div>
      </article>
      <button type="button" class="addr-empty" @click="startAddress(null)">新增收货地址</button>
      <button type="button" class="text-btn block" @click="back">返回</button>
    </div>
  </section>
</template>
