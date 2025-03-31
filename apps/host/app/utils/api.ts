// API配置

/**
 * 获取完整的API URL
 * @param path API路径
 * @returns 完整的API URL
 */
export const getApiUrl = (path: string): string => {
  const config = useRuntimeConfig()
  return `${config.public.apiBaseUrl}${path}`
}

/**
 * API端点对象
 * @returns API端点
 */
export const useApiEndpoints = () => {
  const config = useRuntimeConfig()
  
  return {
    LOGIN: config.public.apiLoginUrl,
    REGISTER: config.public.apiRegisterUrl,
    GITHUB_OAUTH: `${config.public.apiGithubOauthUrl}?client_id=${config.public.apiGithubClientId}`
  }
}

/**
 * 发送API请求
 * @param url API端点
 * @param options 请求选项
 * @returns 响应数据
 */
export const apiRequest = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  try {
    const response = await fetch(getApiUrl(url), {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })

    // 检查响应状态
    if (!response.ok) {
      throw {
        status: response.status,
        statusText: response.statusText,
        data: await response.json().catch(() => ({}))
      }
    }

    // 解析响应
    return await response.json()
  } catch (error) {
    console.error('API request error:', error)
    throw error
  }
}

/**
 * 处理API错误
 * @param error 错误对象
 * @param defaultMessage 默认错误消息
 * @returns 用户友好的错误消息
 */
export const handleApiError = (error: any, defaultMessage = '操作失败，请稍后再试'): string => {
  // 处理网络错误
  if (!error.status) {
    return '网络错误，请检查您的网络连接'
  }

  // 常见HTTP状态码的错误消息
  const statusMessages: Record<number, string> = {
    400: '请求参数有误',
    401: '未授权，请登录',
    403: '无权限进行此操作',
    404: '请求的资源不存在',
    409: '资源冲突，可能已存在',
    429: '请求过于频繁，请稍后再试',
    500: '服务器内部错误',
    502: '网关错误',
    503: '服务不可用',
    504: '网关超时'
  }

  // 返回状态码对应的消息或自定义消息或默认消息
  return error.data?.message || statusMessages[error.status] || defaultMessage
} 