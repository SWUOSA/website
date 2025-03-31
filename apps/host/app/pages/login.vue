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
const API_ENDPOINTS = useApiEndpoints()

// 登录状态
const isLoading = ref(false)

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
    const data = await apiRequest<{ token?: string }>(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({
        studentId: payload.data.studentId,
        password: payload.data.password,
      })
    })
    
    // 登录成功
    toast.add({
      title: '登录成功',
      description: '欢迎回来',
      color: 'success'
    })
    
    // 登录成功后保存token（如果有）
    if (data.token) {
      // 在实际应用中应该使用安全的方式存储token
      localStorage.setItem('token', data.token)
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
