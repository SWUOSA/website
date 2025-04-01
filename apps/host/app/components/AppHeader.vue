<script setup lang="ts">
const route = useRoute()

interface User {
  fullName: string
  className: string
  college: string
  eduSystemId: string
  grade: string
  id: number
}

const user = useState<User | null>('user')

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

const userMenuItems = computed(() => [{
  label: '个人中心',
  icon: 'i-lucide-user',
  to: '/profile'
}, {
  label: '退出登录',
  icon: 'i-lucide-log-out',
  click: () => {
    user.value = null
    navigateTo('/login')
  }
}])
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/">
        <div class="flex items-center gap-2">
          <NuxtImg
            src="/favicon.svg"
            class="w-auto h-12 shrink-0"
          />
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

      <template v-if="user">
        <UDropdownMenu :items="userMenuItems">
          <UUser
            :name="user.fullName"
            :description="user.className"
            :avatar="{
              text: user.fullName.slice(0, 1)
            }"
          />
        </UDropdownMenu>
      </template>

      <template v-else>
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
    </template>

    <template #body>
      <UNavigationMenu
        :items="items"
        orientation="vertical"
        class="-mx-2.5"
      />

      <USeparator class="my-6" />

      <template v-if="!user">
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

      <template v-else>
        <UUser
          :name="user.fullName"
          :description="user.className"
          :avatar="{
            text: user.fullName.slice(0, 1)
          }"
          class="mb-3"
        />
        <UButton
          label="退出登录"
          color="neutral"
          variant="subtle"
          block
          @click="user = null; navigateTo('/login')"
        />
      </template>
    </template>
  </UHeader>
</template>
