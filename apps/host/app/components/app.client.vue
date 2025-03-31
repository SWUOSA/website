<!-- components/MicroApp.client.vue -->
<script setup lang="ts">
import { onMounted } from 'vue'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  name: string
  url: string
  baseroute?: string
  shadowDOM?: boolean
  disableScopecss?: boolean
  iframe?: boolean
  class?: string
  style?: string
  [key: string]: any
}>()

onMounted(() => {
  import('@micro-zoe/micro-app').then((mod) => {
    mod.default.start()
  })
})
</script>

<template>
  <micro-app v-bind="props" />
</template>
