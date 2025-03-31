<script setup lang="ts">
const route = useRoute()

const items = computed(() => [{
  label: '内容孵化平台',
  to: '/content-platform',
  active: route.path.startsWith('/content-platform')
}, {
  label: '加入我们',
  to: '/join'
}, {
  label: 'GitHub',
  to: 'https://github.com/swuosa',
  target: '_blank'
}])
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/">
        <div class="flex items-center gap-2">
          <NuxtImg src="/favicon.svg" class="w-auto h-12 shrink-0" />
          <span class="text-xl font-bold">开源与网络安全协会</span>
        </div>
      </NuxtLink>
    </template>

    <UNavigationMenu
      :items="items"
      variant="link"
    />

    <template #right>
      <UColorModeButton />

      <UButton
        icon="i-lucide-log-in"
        color="neutral"
        variant="ghost"
        to="/login"
        class="lg:hidden"
      />

      <UButton
        label="登录"
        color="neutral"
        variant="ghost"
        to="/login"
        class="hidden lg:inline-flex"
      />

      <UButton
        label="注册"
        color="neutral"
        trailing-icon="i-lucide-arrow-right"
        class="hidden lg:inline-flex"
        to="/signup"
      />
    </template>

    <template #body>
      <UNavigationMenu
        :items="items"
        orientation="vertical"
        class="-mx-2.5"
      />

      <USeparator class="my-6" />

      <UButton
        label="登录"
        color="neutral"
        variant="subtle"
        to="/login"
        block
        class="mb-3"
      />
      <UButton
        label="注册"
        color="neutral"
        to="/signup"
        block
      />
    </template>
  </UHeader>
</template>
