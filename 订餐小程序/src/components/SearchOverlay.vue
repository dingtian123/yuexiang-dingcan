<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import Icon from './Icon.vue'
import QtyControl from './QtyControl.vue'
import DishArt from './DishArt.vue'
import { searchProducts } from '../catalog.js'
import { money } from '../domain.js'
import { openDish, state } from '../store.js'

const input = ref(null)
const results = computed(() => searchProducts(state.searchQuery))
const searching = computed(() => state.searchQuery.trim().length > 0)

watch(() => state.searchOpen, async (open) => {
  if (!open) return
  await nextTick()
  input.value?.focus()
})
</script>

<template>
  <div v-if="state.searchOpen" class="search">
    <div class="search-top">
      <button type="button" class="icon-btn" aria-label="返回" @click="state.searchOpen = false"><Icon name="back" /></button>
      <input ref="input" v-model="state.searchQuery" type="search" placeholder="搜索菜品、套餐" aria-label="搜索菜品" />
      <button v-if="state.searchQuery" type="button" class="text-btn" @click="state.searchQuery = ''">清除</button>
    </div>
    <p class="search-hint">{{ searching ? `找到 ${results.length} 个结果` : '招牌推荐' }}</p>
    <div class="search-list">
      <p v-if="searching && !results.length" class="empty-copy">没有找到相关菜品，试试「酸菜鱼」或「牛蛙」。</p>
      <article v-for="item in results" :key="`${item.kind}-${item.id}`" class="dish" @click="openDish(item)">
        <DishArt :tone="item.tone" size="sm" />
        <div class="dish-main">
          <div class="dish-name">{{ item.name }}</div>
          <p class="dish-desc">{{ item.description }}</p>
          <div class="dish-buy">
            <span class="price"><small>¥</small>{{ money(item.price) }}</span>
            <QtyControl :product="item" />
          </div>
        </div>
      </article>
    </div>
  </div>
</template>
