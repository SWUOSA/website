<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { useApiEndpoints, apiRequest, handleApiError } from '~/utils/api'

definePageMeta({
  layout: 'auth',
  middleware: ['auth-redirect']  // 假设有一个中间件来处理未登录的情况
})

useSeoMeta({
  title: '绑定学号'
})

const toast = useToast()
const router = useRouter()
const route = useRoute()
const API_ENDPOINTS = useApiEndpoints()

// GitHub用户信息，初始化为空
const githubUser = ref({
  id: '',
  login: '',
  name: '',
  avatar_url: ''
})

// 处理OAuth回调
onMounted(async () => {
  // 检查URL中是否有code参数
  const code = route.query.code
  
  if (code) {
    try {
      // 在实际应用中，这里应该调用后端API来处理GitHub OAuth
      // 这里模拟从服务器获取用户信息
      // const { data } = await useFetch('/api/auth/github', {
      //   method: 'POST',
      //   body: { code }
      // })
      
      // 模拟获取的用户信息
      githubUser.value = {
        id: '12345678',
        login: 'github_username',
        name: 'GitHub User',
        avatar_url: 'https://avatars.githubusercontent.com/u/12345678'
      }
      
      // 成功获取用户信息
      toast.add({
        title: 'GitHub 登录成功',
        description: '请绑定您的学号以完成账号关联',
        color: 'green'
      })
    } catch (error) {
      console.error('GitHub OAuth error:', error)
      toast.add({
        title: 'GitHub 登录失败',
        description: '请稍后重试或使用其他方式登录',
        color: 'red'
      })
      
      // 登录失败，返回登录页
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    }
  } else {
    // 如果没有code参数，可能是直接访问了绑定页面
    // 在真实应用中，应该检查用户是否已经通过其他方式登录
    // 这里简单处理，如果没有code，就跳转到登录页
    if (!route.query.test) { // 添加test参数便于开发测试
      router.push('/login')
    }
  }
})

const fields = [{
  name: 'studentId',
  type: 'text' as const,
  label: '学号',
  placeholder: '请输入15位学号',
  required: true
}, {
  name: 'password',
  label: '密码',
  type: 'password' as const,
  placeholder: '请设置账号密码',
  required: true
}]

const schema = z.object({
  studentId: z.string()
    .length(15, '学号必须为15位')
    .regex(/^\d+$/, '学号只能包含数字'),
  password: z.string().min(8, '密码长度不能少于8个字符')
})

type Schema = z.output<typeof schema>

function onSubmit(payload: FormSubmitEvent<Schema>) {
  console.log('Submitted', payload)
  
  // 在实际应用中，这里应该调用API绑定学号和GitHub账号
  // const { data } = await useFetch('/api/auth/bind', {
  //   method: 'POST',
  //   body: {
  //     githubId: githubUser.value.id,
  //     studentId: payload.data.studentId,
  //     password: payload.data.password
  //   }
  // })
  
  // 模拟绑定成功
  toast.add({ 
    title: '绑定成功', 
    description: '您的GitHub账号已成功绑定学号',
    color: 'green'
  })
  
  // 延迟后跳转到首页
  setTimeout(() => {
    router.push('/')
  }, 1500)
}
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="w-full max-w-md p-4 sm:p-6 lg:p-8">
      <div class="flex flex-col items-center mb-6">
        <UAvatar 
          :src="githubUser.avatar_url || '/favicon.svg'" 
          alt="GitHub用户头像"
          size="xl"
          class="mb-4"
        />
        <h2 class="text-xl font-bold">{{ githubUser.name || '正在加载...' }}</h2>
        <p v-if="githubUser.login" class="text-gray-500 dark:text-gray-400">@{{ githubUser.login }}</p>
      </div>
      
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium">绑定您的学号</h3>
            <UBadge color="blue" variant="subtle">GitHub 账号</UBadge>
          </div>
        </template>
        
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          您已使用 GitHub 账号登录，请绑定您的学号以完成账号关联。绑定后可使用学号或 GitHub 账号登录。
        </p>
        
        <UForm 
          :schema="schema"
          :fields="fields"
          :state="{ studentId: '', password: '' }"
          @submit="onSubmit"
        >
          <template #submit>
            <div class="flex justify-center mt-4">
              <UButton 
                type="submit" 
                color="primary" 
                block
                :ui="{ rounded: 'rounded-full' }"
              >
                完成绑定
              </UButton>
            </div>
          </template>
        </UForm>
      </UCard>
      
      <div class="mt-4 text-center">
        <UButton
          variant="link"
          color="gray"
          to="/"
          size="sm"
        >
          稍后再说，先去浏览
        </UButton>
      </div>
    </div>
  </div>
</template> 