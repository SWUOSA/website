<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { useApiEndpoints, apiRequest, handleApiError } from '~/utils/api'

definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: '注册'
})

const toast = useToast()
const router = useRouter()
const API_ENDPOINTS = useApiEndpoints()

// 注册状态
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
  password: z.string().min(8, '密码长度不能少于8个字符')
})

type Schema = z.output<typeof schema>

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  try {
    isLoading.value = true
    console.log('Submitted', payload)

    // 发送注册请求到API
    const data = await apiRequest<{ token?: string }>(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify({
        studentId: payload.data.studentId,
        password: payload.data.password
      })
    })

    // 注册成功
    toast.add({
      title: '注册成功',
      description: '您已成功注册账号',
      color: 'success'
    })

    // 如果注册成功同时返回token，可以直接登录
    if (data.token) {
      localStorage.setItem('token', data.token)
    }

    // 延迟后跳转到登录页
    setTimeout(() => {
      router.push('/login')
    }, 1000)
  } catch (error) {
    console.error('Registration error:', error)

    // 处理API错误
    const errorMessage = handleApiError(error, '注册失败，请稍后再试')

    toast.add({
      title: '注册失败',
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
    title="创建账号"
    :submit="{ label: '注册', loading: isLoading }"
    @submit="onSubmit"
  >
    <template #description>
      已有账号？ <ULink
        to="/login"
        class="text-(--ui-primary) font-medium"
      >登录</ULink>
    </template>
  </UAuthForm>
</template>
