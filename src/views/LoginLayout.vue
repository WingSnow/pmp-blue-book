<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  UserOutlined,
  LockOutlined,
  GithubOutlined,
} from '@ant-design/icons-vue'

interface FormState {
  username: string
  password: string
}

const loading = ref(false)
const loginSuccess = ref(false)
const alertMessage = ref('')

const router = useRouter()
const route = useRoute()

const formState = reactive<FormState>({
  username: '',
  password: '',
})

const onAuthSuccess = () => {
  // 判断用户是直接访问登录页还是被重定向登录页
  const { targetUrl } = route.query
  if (targetUrl) {
    router.push({ path: targetUrl as string })
  } else {
    router.push({ path: '/' })
  }
}

const onFinish = async ({ username, password }: FormState) => {
  loading.value = true
  await fetch('/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      password,
    }),
  })
    .then((res) => {
      if (res.ok) {
        return res.json()
      }
      return Promise.reject(res)
    })
    .then((res) => {
      loginSuccess.value = true
      alertMessage.value = '登录成功'
      const { token } = res
      sessionStorage.setItem('token', token)
      setTimeout(() => {
        // 延迟0.5秒后跳转
        onAuthSuccess()
      }, 500)
    })
    .catch(async (err) => {
      loginSuccess.value = false
      loading.value = false
      alertMessage.value = '登录失败'
    })
}

const LoginButtonDisabled = computed(() => {
  return !(formState.username && formState.password)
})
</script>

<template>
  <div class="header bar mw-vh">
    <span class="logo"> PMP BLUE BOOK </span>
    <div class="extra">
      <a href="https://github.com/WingSnow/pmp-blue-book" target="_blank">
        <a-button type="link" size="large">
          <github-outlined />
        </a-button>
      </a>
    </div>
  </div>

  <div class="main">
    <img src="../assets/logo.png" class="logo" />
    <a-form
      :model="formState"
      name="basic"
      :wrapper-col="{ span: 24 }"
      autocomplete="off"
      @finish="onFinish"
    >
      <a-alert
        :message="alertMessage"
        v-if="alertMessage"
        show-icon
        closable
        class="alert"
        :type="loginSuccess ? 'success' : 'error'"
      />
      <a-form-item
        name="username"
        :rules="[{ required: true, message: '请输入用户名' }]"
      >
        <a-input
          v-model:value="formState.username"
          placeholder="用户名: admin"
          autocomplete="off"
        >
          <template #prefix>
            <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item
        name="password"
        :rules="[{ required: true, message: '请输入密码' }]"
      >
        <a-input-password
          v-model:value="formState.password"
          placeholder="密码: admin"
          autocomplete="off"
        >
          <template #prefix>
            <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
          </template>
        </a-input-password>
      </a-form-item>

      <a-form-item>
        <a-button
          class="login-button"
          type="primary"
          html-type="submit"
          :disabled="LoginButtonDisabled"
          :loading="loading"
        >
          登录
        </a-button>
      </a-form-item>
    </a-form>
  </div>
  <div class="footer bar mw-vh">
    ©2022 by <a href="https://github.com/WingSnow">@WingSnow</a>
  </div>
</template>

<style scoped lang="scss">
.main {
  min-width: 260px;
  max-width: 80%;
  margin: auto;
  padding-top: 50px;
  .login-button {
    padding: 0 15px;
    font-size: 14px;
    height: 36px;
    width: 100%;
    margin-bottom: 64px;
  }
  .alert {
    margin-bottom: 24px;
  }
  .logo {
    max-width: 80vw;
    max-height: 40vh;
    margin-bottom: 32px;
    margin: 16px;
  }
}

.bar {
  background-color: rgba(252, 252, 252);
  padding: 0 2vw;
  color: rgba(0, 0, 0, 0.65);
  height: 40px;
  width: 100%;
  line-height: 40px;
}

.header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;

  .logo {
    padding: 0 15px;
    font-weight: 600;
  }

  .extra {
    position: absolute;
    right: 0;
    top: 0;

    button {
      color: rgba(0, 0, 0, 0.65);

      :hover {
        color: #1890ff;
      }
    }
  }
}

.footer {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  position: fixed;
  bottom: 0;
}
</style>
