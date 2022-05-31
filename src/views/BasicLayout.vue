<script setup lang="ts">
import { computed, ref } from 'vue'
import { UserOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import QuestionContent from '../components/QuestionContent.vue'
import CollectContent from '../components/CollectContent.vue'
import ScoreBoard from '../components/ScoreBoard.vue'

const selectedKeys = ref<string[]>(['0'])

const router = useRouter()

const logout = () => {
  sessionStorage.removeItem('token')
  router.replace({
    name: 'Login',
  })
}

const scoreBoardVisible = ref(false)
const showScoreBoard = () => {
  scoreBoardVisible.value = true
}
const scoreBoardRef = ref(ScoreBoard)

const onScoreBoardVisibleChange = (visible: boolean) => {
  if (visible) {
    scoreBoardRef.value.loadDate()
  }
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
    <a-layout-header class="header bar mw-vh">
      <a-dropdown>
        <a-avatar size="32" class="logo">
          <template #icon><UserOutlined /></template>
        </a-avatar>
        <template #overlay>
          <a-menu>
            <a-menu-item>
              <a @click="showScoreBoard">计分板</a>
            </a-menu-item>
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

  <a-drawer
    title="计分板"
    placement="top"
    v-model:visible="scoreBoardVisible"
    @after-visible-change="onScoreBoardVisibleChange"
    get-container="#app"
    :style="{ left: 'initial' }"
    class="mw-vh"
  >
    <score-board ref="scoreBoardRef" />
  </a-drawer>
</template>

<style scoped lang="scss">
.logo {
  position: absolute;
  right: 32px;
  margin: 16px 0 16px 0;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
}

.bar {
  position: fixed;
  width: 100%;
  z-index: 1;
}

.header {
  top: 0;
}

.content {
  margin: 64px 0;
}
</style>
