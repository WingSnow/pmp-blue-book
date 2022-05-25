<script setup lang="ts">
import { computed, ref } from 'vue'
import { UserOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import QuestionContent from '../components/QuestionContent.vue'
import CollectContent from '../components/CollectContent.vue'

const selectedKeys = ref<string[]>(['0'])

const router = useRouter()

const logout = () => {
  sessionStorage.removeItem('token')
  router.replace({
    name: 'Login',
  })
}

const mode = computed(() => {
  if (selectedKeys.value.includes('0')) {
    return QuestionContent
  }
  if (selectedKeys.value.includes('1')) {
    return CollectContent
  }
  return ''
})
</script>

<template>
  <a-layout style="background: initial">
    <a-layout-header class="header">
      <a-dropdown>
        <a-avatar size="32" class="logo">
          <template #icon><UserOutlined /></template>
        </a-avatar>
        <template #overlay>
          <a-menu>
            <a-menu-item>
              <a @click="logout">退出登录</a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>

      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="horizontal"
        style="justify-content: center"
      >
        <a-menu-item key="0">刷题</a-menu-item>
        <a-menu-item key="1">背题</a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout-content class="content">
      <keep-alive>
        <component :is="mode"></component>
      </keep-alive>
      <!-- <question-content v-show="mode === 'exam'"></question-content>
      <collect-content v-show="mode === 'collect'"></collect-content> -->
    </a-layout-content>
  </a-layout>
</template>

<style scoped lang="scss">
.logo {
  position: absolute;
  right: 32px;
  margin: 16px 0 16px 0;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
}

.header {
  position: fixed;
  z-index: 1;
  width: 100%;
}

.content {
  margin: 64px 0;
}

.footer {
  position: fixed;
  background: #001529;
  color: rgba(255, 255, 255, 0.65);
  bottom: 0;
  z-index: 1;
  width: 100%;
  padding: 16px 50px;
  text-align: right;
}
</style>
