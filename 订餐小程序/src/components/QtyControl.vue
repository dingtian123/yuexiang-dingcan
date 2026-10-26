<script setup>
import { computed } from 'vue'
import Icon from './Icon.vue'
import { changeQty, countOf, lineKeyFor, quickAdd } from '../store.js'

const props = defineProps({
  product: { type: Object, required: true },
})

const count = computed(() => countOf(props.product.kind, props.product.id))
const plainKey = computed(() => lineKeyFor(props.product))
const flavored = computed(() => (props.product.flavors || []).length > 0)
</script>

<template>
  <button v-if="flavored" type="button" class="spec-btn" @click.stop="quickAdd(product)">
    选规格
    <em v-if="count">{{ count }}</em>
  </button>
  <span v-else-if="count" class="stepper" @click.stop>
    <button type="button" aria-label="减少" @click="changeQty(plainKey, -1)"><Icon name="minus" /></button>
    <b>{{ count }}</b>
    <button type="button" aria-label="增加" @click="changeQty(plainKey, 1)"><Icon name="plus" /></button>
  </span>
  <button v-else type="button" class="add" aria-label="加入购物车" @click.stop="quickAdd(product)">
    <Icon name="plus" />
  </button>
</template>
