<script setup>
import { nextTick, onMounted, ref, watch } from 'vue'
import DishArt from './DishArt.vue'
import Icon from './Icon.vue'
import QtyControl from './QtyControl.vue'
import { categories, productsIn, shop } from '../catalog.js'
import { money } from '../domain.js'
import { openDish, state } from '../store.js'

const rail = ref(null)
const dishesEl = ref(null)
let lock = false
let timer = 0

function reveal(id) {
  const root = rail.value
  if (!root) return
  const button = root.querySelector(`[data-id="${id}"]`)
  if (!button) return
  const top = button.offsetTop
  const bottom = top + button.offsetHeight
  if (top < root.scrollTop) root.scrollTop = top
  else if (bottom > root.scrollTop + root.clientHeight) root.scrollTop = bottom - root.clientHeight
}

function onScroll() {
  if (lock) {
    window.clearTimeout(timer)
    timer = window.setTimeout(() => { lock = false }, 140)
    return
  }
  const root = dishesEl.value
  if (!root) return
  let current = ''
  const line = root.scrollTop + 16
  for (const section of root.querySelectorAll('section')) {
    if (section.offsetTop <= line) current = section.dataset.id
  }
  if (current && current !== String(state.activeCategory)) state.activeCategory = current
}

function jump(id) {
  const root = dishesEl.value
  const section = root?.querySelector(`#sec-${id}`)
  state.activeCategory = String(id)
  if (!root || !section) return
  lock = true
  root.scrollTo({ top: section.offsetTop, behavior: 'smooth' })
  window.clearTimeout(timer)
  timer = window.setTimeout(() => { lock = false }, 480)
}

watch(() => state.activeCategory, (id) => nextTick(() => reveal(id)))
onMounted(() => reveal(state.activeCategory))

function openSearch() {
  state.searchQuery = ''
  state.searchOpen = true
}
</script>

<template>
  <section class="menu">
    <header class="shop">
      <div class="brand-row">
        <div class="seal" aria-hidden="true">悦</div>
        <div>
          <div class="brand-name">{{ shop.name }}</div>
          <div class="brand-sub">{{ shop.branch }} · {{ shop.slogan }}</div>
        </div>
        <button type="button" class="search-btn" aria-label="搜索菜品" @click="openSearch">
          <Icon name="search" />
        </button>
      </div>
      <div class="shop-status">
        <span class="pill"><i></i>营业中</span>
        <span>{{ shop.hours }}</span>
        <span>约 {{ shop.eta }} 分钟</span>
      </div>
      <p class="shop-addr"><Icon name="pin" />{{ shop.address }}</p>
      <div class="facts">
        <span class="fact">起送 ¥{{ shop.minAmount }}</span>
        <span class="fact">配送 ¥{{ shop.deliveryFee }}</span>
        <span class="fact">满 ¥{{ shop.freeDelivery }} 免配送</span>
      </div>
    </header>
    <div class="menu-body">
      <nav ref="rail" class="rail" aria-label="菜品分类">
        <button
          v-for="cat in categories"
          :key="cat.id"
          type="button"
          class="rail-btn"
          :data-id="cat.id"
          :class="{ active: String(state.activeCategory) === String(cat.id) }"
          @click="jump(cat.id)"
        >
          {{ cat.name }}
        </button>
      </nav>
      <div ref="dishesEl" class="dishes" @scroll="onScroll">
        <section v-for="cat in categories" :id="`sec-${cat.id}`" :key="cat.id" :data-id="cat.id">
          <h2 class="sec-head">{{ cat.name }}</h2>
          <div v-if="cat.id === 'sign'" class="sign-row">
            <article v-for="item in productsIn('sign')" :key="item.id" class="sign-card" @click="openDish(item)">
              <DishArt :tone="item.tone" size="md" />
              <div class="sign-name">{{ item.name }}</div>
              <p>{{ item.description }}</p>
              <div class="sign-buy">
                <span class="price"><small>¥</small>{{ money(item.price) }}</span>
                <QtyControl :product="item" />
              </div>
            </article>
          </div>
          <article v-for="item in cat.id === 'sign' ? [] : productsIn(cat.id)" :key="item.id" class="dish" @click="openDish(item)">
            <DishArt :tone="item.tone" size="sm" />
            <div class="dish-main">
              <div class="dish-name">
                {{ item.name }}
                <em v-if="item.tag" class="tag">{{ item.tag }}</em>
              </div>
              <p class="dish-desc">{{ item.description }}</p>
              <p class="dish-sales">月售 {{ item.sales }}</p>
              <div v-if="item.items" class="meal-bits">
                <span v-for="part in item.items" :key="part.name">{{ part.name }} ×{{ part.copies }}</span>
              </div>
              <div class="dish-buy">
                <span class="price"><small>¥</small>{{ money(item.price) }}</span>
                <QtyControl :product="item" />
              </div>
            </div>
          </article>
        </section>
      </div>
    </div>
  </section>
</template>
