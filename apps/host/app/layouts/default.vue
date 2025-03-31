<template>
  <div>
    <AppHeader
      :class="[
        'transition-transform duration-300 fixed top-0 left-0 right-0 z-50',
        isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
      ]"
    />

    <UMain :class="'pt-[76px]'">
      <slot />
    </UMain>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const isHeaderVisible = ref(true)
const lastScrollY = ref(0)
const ticking = ref(false)

const handleScroll = () => {
  if (!ticking.value) {
    window.requestAnimationFrame(() => {
      // 获取当前滚动位置
      const currentScrollY = window.scrollY

      // 判断滚动方向
      if (currentScrollY < lastScrollY.value || currentScrollY <= 0) {
        // 向上滚动或在顶部时显示 header
        isHeaderVisible.value = true
      } else if (currentScrollY > lastScrollY.value && currentScrollY > 50) {
        // 向下滚动且不在顶部附近时隐藏 header
        isHeaderVisible.value = false
      }

      // 更新上次滚动位置
      lastScrollY.value = currentScrollY
      ticking.value = false
    })

    ticking.value = true
  }
}

// 仅在客户端添加滚动事件监听
onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('scroll', handleScroll, { passive: true })
  }
})

// 在组件销毁前移除事件监听
onBeforeUnmount(() => {
  if (import.meta.client) {
    window.removeEventListener('scroll', handleScroll)
  }
})
</script>
