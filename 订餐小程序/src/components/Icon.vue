<script setup>
defineProps({
  name: { type: String, required: true },
})
</script>

<template>
  <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
    <path v-if="name === 'back'" d="M14.5 5.5 8 12l6.5 6.5" />
    <g v-else-if="name === 'search'">
      <circle cx="11" cy="11" r="6" />
      <path d="m16 16 3.5 3.5" />
    </g>
    <path v-else-if="name === 'plus'" d="M12 6.5v11M6.5 12h11" />
    <path v-else-if="name === 'minus'" d="M6.5 12h11" />
    <path v-else-if="name === 'close'" d="m7 7 10 10M17 7 7 17" />
    <g v-else-if="name === 'cart'">
      <path d="M6.5 8.5h12l-1 9h-10z" />
      <path d="M9 8.5V7a3 3 0 0 1 6 0v1.5" />
    </g>
    <g v-else-if="name === 'bowl'">
      <path d="M5 10h14c-.6 4.2-3.2 6.5-7 6.5S5.6 14.2 5 10z" />
      <path d="M8 16.8c1 .8 2.3 1.2 4 1.2s3-.4 4-1.2M12 6.2v2" />
    </g>
    <g v-else-if="name === 'receipt'">
      <path d="M7 4.5h10v15l-2-1.2-2 1.2-2-1.2-2 1.2-2-1.2z" />
      <path d="M9.5 8.5h5M9.5 12h5" />
    </g>
    <g v-else-if="name === 'user'">
      <circle cx="12" cy="9" r="3" />
      <path d="M6.5 18.5c1.2-2.4 3-3.5 5.5-3.5s4.3 1.1 5.5 3.5" />
    </g>
    <g v-else-if="name === 'pin'">
      <path d="M12 20s5.5-4.6 5.5-9A5.5 5.5 0 0 0 6.5 11c0 4.4 5.5 9 5.5 9z" />
      <circle cx="12" cy="11" r="1.6" />
    </g>
    <path v-else-if="name === 'phone'" d="M8 5.5h2.2l1.2 3-1.6 1a11 11 0 0 0 4.7 4.7l1-1.6 3 1.2V18a1.5 1.5 0 0 1-1.6 1.5A13.5 13.5 0 0 1 6.5 7.1 1.5 1.5 0 0 1 8 5.5z" />
    <g v-else-if="name === 'clock'">
      <circle cx="12" cy="12" r="7" />
      <path d="M12 8.5V12l2.5 2" />
    </g>
    <path v-else-if="name === 'chevron'" d="m9 6 6 6-6 6" />
    <g v-else-if="name === 'trash'">
      <path d="M5.5 8h13M9 8V6.5h6V8M8 8l.7 10h6.6L16 8" />
    </g>
    <path v-else-if="name === 'check'" d="m6.5 12.5 3.2 3.2 7.8-8" />
    <g v-else-if="name === 'note'">
      <path d="M7 5.5h7l3 3V18.5H7z" />
      <path d="M14 5.5V9h3.2M9.5 13h5M9.5 16h3.5" />
    </g>
  </svg>
</template>
