<script setup lang="ts">
const columns = [{
  label: '协会资源',
  children: [{
    label: '内容孵化平台',
    to: '/content-platform'
  }, {
    label: '活动档案',
    to: '/events'
  }, {
    label: '项目展示',
    to: '/projects'
  }]
}, {
  label: '部门介绍',
  children: [{
    label: '网络安全部',
    to: '/departments/security'
  }, {
    label: '学术部',
    to: '/departments/academic'
  }, {
    label: '开发部',
    to: '/departments/dev'
  }, {
    label: '游戏开发部',
    to: '/departments/game'
  }, {
    label: '混合现实开发部',
    to: '/departments/xr'
  }]
}, {
  label: '关于我们',
  children: [{
    label: '协会简介',
    to: '/about'
  }, {
    label: '加入我们',
    to: '/join'
  }, {
    label: '联系方式',
    to: '/contact'
  }]
}]

const toast = useToast()

const email = ref('')
const loading = ref(false)

function onSubmit() {
  loading.value = true

  toast.add({
    title: '订阅成功！',
    description: '您已成功订阅我们的技术周刊，我们将定期为您发送最新技术动态。'
  })

  setTimeout(() => {
    loading.value = false
    email.value = ''
  }, 1000)
}
</script>

<template>
  <USeparator
    icon="i-lucide-code"
    class="h-px"
  />
  <UFooter :ui="{ top: 'border-b border-[var(--ui-border)]' }">
    <template #top>
      <UContainer>
        <UFooterColumns :columns="columns">
          <template #right>
            <form @submit.prevent="onSubmit">
              <UFormField
                name="email"
                label="加入群聊 了解更多"
                size="lg"
              >
                <NuxtImg
                  src="/qrcode.png"
                  alt="西南大学开源与网络安全协会"
                  class="w-56 h-56"
                />
              </UFormField>
            </form>
          </template>
        </UFooterColumns>
      </UContainer>
    </template>

    <template #left>
      <p class="text-(--ui-text-muted) text-sm">
        Copyright © {{ new Date().getFullYear() }} 西南大学开源与网络安全协会. 保留所有权利.
      </p>
    </template>

    <template #right>
      <UColorModeButton />

      <UButton
        to="https://github.com/swuosa"
        target="_blank"
        icon="i-simple-icons-github"
        aria-label="GitHub"
        color="neutral"
        variant="ghost"
      />
    </template>
  </UFooter>
</template>
