<script setup>
import Icon from './Icon.vue'
import { back } from '../store.js'

defineProps({
  title: { type: String, required: true },
})
</script>

<template>
  <header class="nav">
    <button type="button" class="icon-btn" aria-label="返回" @click="back"><Icon name="back" /></button>
    <h1>{{ title }}</h1>
    <span></span>
  </header>
</template>
