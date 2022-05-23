import { message } from 'ant-design-vue'
import router from '@/router'

const originFetch = fetch

export default async (input: RequestInfo, init?: RequestInit) => {
  const tokenRaw = sessionStorage.getItem('token')
  const res = await originFetch(input, {
    ...init,
    headers: {
      // 这里统一加token
      Authorization: (tokenRaw && `Bearer ${tokenRaw}`) || '',
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })
  if (res.ok) {
    // 当res.statusCode是2xx时res.ok是true，否则为false
    return res.json()
  }
  if (res.status === 401) {
    message.error(`${res.status}: ${res.statusText}`)
    setTimeout(() => {
      router.replace({
        name: 'Login',
        query: { targetUrl: router.currentRoute.value.fullPath },
      })
    }, 1000)
  }
  return Promise.reject(res)
}
