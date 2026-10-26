<script setup>
import { computed } from 'vue'

const props = defineProps({
  tone: { type: String, default: 'feast' },
  size: { type: String, default: 'sm' },
})

const scenes = {
  fish: `<rect width="80" height="80" rx="22" fill="#F6D9D1"/>
    <ellipse cx="40" cy="60" rx="20" ry="5" fill="#E7B2A6"/>
    <path d="M16 43c7-12 20-16 32-9 5 3 10 8 10 8s-7 5-12 7c-9 4-22 5-30 0-3-2-5-4-5-6z" fill="#C2412D"/>
    <path d="M14 38c4 3 4 8 0 12 5-2 7-5 7-6s-2-4-7-6z" fill="#8E2E22"/>
    <circle cx="48" cy="40" r="1.7" fill="#fff"/>
    <path d="M58 28c4 2 5 6 2 8" fill="none" stroke="#C2412D" stroke-width="2" stroke-linecap="round"/>`,
  frog: `<rect width="80" height="80" rx="22" fill="#F8E7C9"/>
    <ellipse cx="40" cy="50" rx="22" ry="12" fill="#7EAA62"/>
    <ellipse cx="40" cy="46" rx="14" ry="9" fill="#E7B15A"/>
    <circle cx="33" cy="34" r="5" fill="#F4E2B0"/><circle cx="47" cy="34" r="5" fill="#F4E2B0"/>
    <circle cx="33" cy="34" r="2" fill="#5C3B16"/><circle cx="47" cy="34" r="2" fill="#5C3B16"/>
    <path d="M34 48c2 2 8 2 12 0" fill="none" stroke="#8A5A20" stroke-width="1.6" stroke-linecap="round"/>`,
  steam: `<rect width="80" height="80" rx="22" fill="#F3E6D4"/>
    <path d="M16 46h48c-2 12-12 18-24 18S18 58 16 46z" fill="#E7C3A4"/>
    <ellipse cx="40" cy="46" rx="22" ry="6" fill="#C46A4A"/>
    <path d="M30 28c0 4 4 4 4 8M40 24c0 5 4 5 4 10M50 28c0 4 4 4 4 8" fill="none" stroke="#C46A4A" stroke-width="2" stroke-linecap="round"/>`,
  veg: `<rect width="80" height="80" rx="22" fill="#E3F0E4"/>
    <ellipse cx="34" cy="48" rx="16" ry="8" fill="#D7E8C8" transform="rotate(-20 34 48)"/>
    <path d="M22 54c10-16 18-22 28-24-2 14-8 24-20 30-4-2-6-4-8-6z" fill="#3E8F5A"/>
    <path d="M48 30c8 2 14 10 14 18-10-2-16-8-18-16 1 0 3-1 4-2z" fill="#2F6B45"/>
    <path d="M36 58c6-8 8-16 8-24" fill="none" stroke="#245338" stroke-width="1.6" stroke-linecap="round"/>`,
  boil: `<rect width="80" height="80" rx="22" fill="#F8DCD6"/>
    <path d="M18 40h44v6c0 12-10 20-22 20S18 58 18 46z" fill="#E7B2A6"/>
    <ellipse cx="40" cy="42" rx="22" ry="7" fill="#D6452D"/>
    <path d="M28 36c2-6 4-6 4-10M40 34c2-6 4-6 4-11M50 36c2-5 3-5 3-9" fill="none" stroke="#F3C1B6" stroke-width="2" stroke-linecap="round"/>
    <circle cx="33" cy="44" r="2" fill="#F8E7C2"/><circle cx="46" cy="47" r="1.6" fill="#F8E7C2"/>`,
  staple: `<rect width="80" height="80" rx="22" fill="#F6EBD6"/>
    <path d="M18 44h44c-1 12-10 18-22 18S19 56 18 44z" fill="#E7D3AE"/>
    <ellipse cx="40" cy="44" rx="20" ry="7" fill="#F7F1E4"/>
    <ellipse cx="33" cy="42" rx="4" ry="2.4" fill="#E4D2AE"/><ellipse cx="44" cy="40" rx="4" ry="2.4" fill="#E4D2AE"/>
    <ellipse cx="48" cy="46" rx="3.4" ry="2" fill="#E4D2AE"/>`,
  drink: `<rect width="80" height="80" rx="22" fill="#E5F0EA"/>
    <rect x="30" y="16" width="16" height="8" rx="3" fill="#2F6B4F"/>
    <rect x="28" y="24" width="20" height="36" rx="8" fill="#3E8F6A"/>
    <rect x="32" y="36" width="12" height="10" rx="2" fill="#F4E7C8"/>
    <path d="M34 28h8" stroke="#D7EFE3" stroke-width="2" stroke-linecap="round"/>`,
  soup: `<rect width="80" height="80" rx="22" fill="#F7E8DC"/>
    <path d="M16 42h48c-2 14-12 20-24 20S18 56 16 42z" fill="#E7C7AE"/>
    <ellipse cx="40" cy="42" rx="22" ry="7" fill="#D08A5A"/>
    <circle cx="34" cy="44" r="3" fill="#F6E7C8"/><circle cx="46" cy="46" r="2.4" fill="#C46A4A"/>
    <path d="M58 36c6 2 8 8 4 12" fill="none" stroke="#C49578" stroke-width="2" stroke-linecap="round"/>`,
  feast: `<rect width="80" height="80" rx="22" fill="#F8E3D8"/>
    <path d="M14 48h24c-1 8-6 12-12 12s-11-4-12-12z" fill="#E7B8A4"/>
    <ellipse cx="26" cy="48" rx="12" ry="4" fill="#C2412D"/>
    <path d="M42 50h24c-1 8-6 12-12 12s-11-4-12-12z" fill="#E7C7A4"/>
    <ellipse cx="54" cy="50" rx="12" ry="4" fill="#E0B15A"/>
    <path d="M34 24c6 8 6 16 2 24M40 22c6 8 6 16 2 26" fill="none" stroke="#8C5A3C" stroke-width="2" stroke-linecap="round"/>`,
}

const markup = computed(() => {
  const scene = scenes[props.tone] || scenes.feast
  return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">${scene}</svg>`
})
</script>

<template>
  <span class="art" :class="size" aria-hidden="true" v-html="markup"></span>
</template>
