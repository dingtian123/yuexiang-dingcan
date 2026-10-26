<script setup>
import { computed } from 'vue'
import DishArt from './DishArt.vue'
import Icon from './Icon.vue'
import { findProduct } from '../catalog.js'
import { money } from '../domain.js'
import { closeDish, confirmDish, setFlavor, sheetQty, state } from '../store.js'

const product = computed(() => {
  if (!state.dishSheet) return null
  return findProduct(state.dishSheet.kind, state.dishSheet.id)
})

const amount = computed(() => (product.value ? product.value.price * state.dishSheet.number : 0))

function chosen(group, option) {
  const value = state.dishSheet?.flavors[group.name]
  return Array.isArray(value) ? value.includes(option) : value === option
}
</script>

<template>
  <div v-if="product" class="mask" @click="closeDish">
    <div class="sheet dish-sheet" role="dialog" aria-modal="true" :aria-label="product.name" @click.stop>
      <div class="grab"></div>
      <button type="button" class="sheet-close" aria-label="关闭" @click="closeDish"><Icon name="close" /></button>
      <div class="sheet-body">
        <DishArt :tone="product.tone" size="lg" />
        <h2>{{ product.name }}</h2>
        <p class="sheet-desc">{{ product.description }} · 月售 {{ product.sales }}</p>
        <ul v-if="product.items" class="meal-list">
          <li v-for="part in product.items" :key="part.name">
            <span>{{ part.name }}</span><b>×{{ part.copies }}</b>
          </li>
        </ul>
        <section v-for="group in product.flavors" :key="group.name" class="flavor">
          <h3>
            {{ group.name }}
            <small>{{ group.required ? '必选' : '可选' }}{{ group.multiple ? ' · 可多选' : '' }}</small>
          </h3>
          <div class="chips">
            <button
              v-for="option in group.options"
              :key="option"
              type="button"
              :class="{ on: chosen(group, option) }"
              @click="setFlavor(group.name, option, group.multiple)"
            >
              {{ option }}
            </button>
          </div>
        </section>
        <p v-if="state.dishError" class="form-error">{{ state.dishError }}</p>
      </div>
      <div class="sheet-bar">
        <span class="stepper lg">
          <button type="button" aria-label="减少" @click="sheetQty(-1)"><Icon name="minus" /></button>
          <b>{{ state.dishSheet.number }}</b>
          <button type="button" aria-label="增加" @click="sheetQty(1)"><Icon name="plus" /></button>
        </span>
        <button type="button" class="go grow" @click="confirmDish">加入购物车 ¥{{ money(amount) }}</button>
      </div>
    </div>
  </div>
</template>
