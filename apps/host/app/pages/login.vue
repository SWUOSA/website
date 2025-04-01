<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { useApiEndpoints, apiRequest, handleApiError } from '~/utils/api'

definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: '登录'
})

const toast = useToast()
const router = useRouter()
const route = useRoute()
const API_ENDPOINTS = useApiEndpoints()

// 登录状态
const isLoading = ref(false)

// 用户信息类型定义
interface User {
  fullName: string
  className: string
  college: string
  eduSystemId: string
  grade: string
  id: number
}

// 全局用户状态
const user = useState<User | null>('user')

// 处理 GitHub OAuth 登录
async function handleGithubLogin(code: string) {
  try {
    isLoading.value = true

    // 发送 GitHub 登录请求到API
    const data = await apiRequest<{ access_token?: string, user: User }>(API_ENDPOINTS.GITHUB_LOGIN, {
      method: 'POST',
      body: JSON.stringify({ code })
    })

    // 登录成功
    toast.add({
      title: '登录成功',
      description: '欢迎回来',
      color: 'success'
    })

    // 保存用户信息和token
    if (data.access_token) {
      localStorage.setItem('token', data.access_token)
    }
    if (data.user) {
      user.value = data.user
    }

    // 延迟后跳转到首页
    setTimeout(() => {
      router.push('/')
    }, 1000)
  } catch (error) {
    console.error('GitHub login error:', error)

    // 处理API错误
    const errorMessage = handleApiError(error, 'GitHub 登录失败，请重试')

    toast.add({
      title: '登录失败',
      description: errorMessage,
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

// 检查 URL 中是否包含 GitHub OAuth code
onMounted(() => {
  const code = route.query.code as string
  if (code) {
    handleGithubLogin(code)
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
  placeholder: '请输入您的密码'
}, {
  name: 'remember',
  label: '记住我',
  type: 'checkbox' as const
}]

const providers = [{
  label: 'GitHub',
  icon: 'i-simple-icons-github',
  onClick: () => {
    window.location.href = API_ENDPOINTS.GITHUB_OAUTH
  }
}]

const schema = z.object({
  studentId: z.string()
    .length(15, '学号必须为15位')
    .regex(/^\d+$/, '学号只能包含数字'),
  password: z.string().min(8, '密码长度不能少于8个字符'),
  remember: z.boolean().optional()
})

type Schema = z.output<typeof schema>

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  try {
    isLoading.value = true
    console.log('Submitted', payload)

    // 发送登录请求到API
    const data = await apiRequest<{ access_token?: string, user: User }>(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({
        studentId: payload.data.studentId,
        password: payload.data.password
      })
    })

    // 登录成功
    toast.add({
      title: '登录成功',
      description: '欢迎回来',
      color: 'success'
    })

    // 保存用户信息和token
    if (data.access_token) {
      localStorage.setItem('token', data.access_token)
    }
    if (data.user) {
      user.value = data.user
    }

    // 延迟后跳转到首页
    setTimeout(() => {
      router.push('/')
    }, 1000)
  } catch (error) {
    console.error('Login error:', error)

    // 处理API错误
    const errorMessage = handleApiError(error, '登录失败，请检查学号和密码')

    toast.add({
      title: '登录失败',
      description: errorMessage,
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <UAuthForm
    :fields="fields"
    :schema="schema"
    :providers="providers"
    title="欢迎回来"
    icon="i-lucide-lock"
    :submit="{ label: '登录', loading: isLoading }"
    @submit="onSubmit"
  >
    <template #description>
      还没有账号？ <ULink
        to="/signup"
        class="text-(--ui-primary) font-medium"
      >注册</ULink>
    </template>

    <template #password-hint>
      <ULink
        to="/forgot-password"
        class="text-(--ui-primary) font-medium"
        tabindex="-1"
      >忘记密码？</ULink>
    </template>
  </UAuthForm>
</template>
