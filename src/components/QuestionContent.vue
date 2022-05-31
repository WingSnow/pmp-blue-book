<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import OptionComponent from '@/components/OptionComponent.vue'
import { SettingOutlined } from '@ant-design/icons-vue'
import fetchProxy from '@/utils/fetchProxy'
import type { Question } from '@/index'
import { message } from 'ant-design-vue'
import setting from '@/store/setting'
import sliceChineseStr from '@/utils/sliceChineseStr'

const optionSigns = (index: number) => {
  return String.fromCharCode(('A'.codePointAt(0) as number) + index)
}

const id = ref<number>()
const question = ref<string>()
const options = ref<string[]>([])
const explain = ref<string>()
const yourAnswers = ref<number[]>([])
const correctAnswers = ref<number[]>([])
const collected = ref<boolean>(false)

const operable = ref(true)
const settingBlankShow = ref(false)

const wrongAnswers = computed(() => {
  return yourAnswers.value.filter((value) => {
    return !correctAnswers.value.includes(value)
  })
})

const correctAnswersStr = computed(() => {
  return correctAnswers.value.map((value) => optionSigns(value)).join(',')
})

const yourAnswersStr = computed(() => {
  return yourAnswers.value.map((value) => optionSigns(value)).join(',')
})

const collectQuestion = async () => {
  await fetchProxy(`/api/questions/${id.value}/collect`, {
    method: collected.value ? 'DELETE' : 'PUT',
  })
}

const onCollect = async () => {
  await collectQuestion()
  message.success(`${collected.value ? '取消' : ''}收藏成功`)
  collected.value = !collected.value
}

const getOptionType = (index: number) => {
  if (operable.value) {
    if (yourAnswers.value.includes(index)) {
      return 'selected'
    }
    return 'normal'
  }
  if (correctAnswers.value.includes(index)) {
    return 'correct'
  }
  if (wrongAnswers.value.includes(index)) {
    return 'wrong'
  }
  return 'normal'
}

const onSelect = async (index: number) => {
  if (!operable.value) {
    return
  }
  if (!yourAnswers.value.includes(index)) {
    yourAnswers.value.push(index)
  }
  if (yourAnswers.value.length >= correctAnswers.value.length) {
    fetchProxy(`/api/questions/${id.value}/answer`, {
      method: 'PUT',
      body: JSON.stringify({
        answer: yourAnswers.value.map((value) => optionSigns(value)).join(','),
      }),
    })

    if (setting.data.autoCollect && wrongAnswers.value.length > 0) {
      collectQuestion()
      collected.value = !collected.value
    }
    operable.value = false
  }
}

const questionLocalStorage: Question[] = []

const getQuestion = async (limit: number) => {
  const result = await fetchProxy(`/api/exam?limit=${limit}&onlyNew=1`, {
    method: 'GET',
  })
  questionLocalStorage.push(...result)
}

const nextQuestion = async () => {
  window.scrollTo(0, 0)
  correctAnswers.value.length = 0
  yourAnswers.value.length = 0
  operable.value = true
  if (questionLocalStorage.length < 5) {
    await getQuestion(10)
  }
  const q = questionLocalStorage.pop()
  if (q) {
    id.value = q.id
    question.value = q.question
    options.value.length = 0
    options.value.push(q.option_0)
    options.value.push(q.option_1)
    options.value.push(q.option_2)
    options.value.push(q.option_3)
    q.answer.split(',').forEach((value) => {
      correctAnswers.value.push(value.charCodeAt(0) - 'A'.charCodeAt(0))
    })
    explain.value = q.remark
    collected.value = q.collected === 'Y'
  }
}

onMounted(() => {
  nextQuestion()
})

const todoInfo = () => {
  message.info('敬请期待')
}

const textI18nFilter = (text: string | undefined) => {
  if (setting.data.twoToneLanguage || text === undefined) {
    return text || ''
  }
  return sliceChineseStr(text)
}
</script>

<template>
  <div class="question" :spinning="true">
    <p>
      <span style="color: #1890ff">[{{ id }}]</span>
      {{ textI18nFilter(question) }}
    </p>
    <template v-for="(option, index) in options" :key="index">
      <option-component
        :index="index"
        :text="textI18nFilter(option)"
        :type="getOptionType(index)"
        @click="onSelect"
      ></option-component>
    </template>
  </div>
  <transition name="fade">
    <div
      class="answer"
      :class="{ wrong: wrongAnswers.length > 0 }"
      v-show="!operable"
    >
      <a-space size="large">
        <p>
          {{ `正确答案：${correctAnswersStr}` }}
        </p>
        <p>
          {{ `您的答案：${yourAnswersStr}` }}
        </p>
      </a-space>
    </div>
  </transition>
  <transition name="fade">
    <div class="explain" v-show="!operable">
      <a-divider orientation="left">解析</a-divider>
      <p>
        {{ explain }}
      </p>
    </div>
  </transition>
  <div class="footer mw-vh">
    <!--设置按钮-->
    <a-button
      type="normal"
      shape="circle"
      size="32"
      class="float-left"
      @click="settingBlankShow = !settingBlankShow"
    >
      <setting-outlined />
    </a-button>
    <a-space>
      <a-button type="normal" shape="round" @click="onCollect">{{
        collected ? '已收藏' : '收藏'
      }}</a-button>
      <a-button type="primary" shape="round" @click="nextQuestion"
        >下一题</a-button
      >
    </a-space>
  </div>

  <a-drawer
    title="设置"
    v-model:visible="settingBlankShow"
    placement="bottom"
    get-container="#app"
    :style="{ left: 'initial' }"
    class="mw-vh"
  >
    <div class="setting-item" @click="setting.setAutoCollect()">
      <label>自动收藏错题</label>
      <a-switch :checked="setting.data.autoCollect"></a-switch>
    </div>
    <div class="setting-item" @click="setting.setTwoToneLanguage()">
      <label>中英对照</label>
      <a-switch :checked="setting.data.twoToneLanguage"></a-switch>
    </div>
    <!-- <div class="setting-item" @click="todoInfo">
      <label style="opacity: 0.5">只做已收藏题目</label>
      <a-switch :checked="false" disabled></a-switch>
    </div>
    <div class="setting-item" @click="todoInfo">
      <label style="opacity: 0.5">不做已收藏题目</label>
      <a-switch :checked="false" disabled></a-switch>
    </div> -->
  </a-drawer>
</template>

<style scoped lang="scss">
.question {
  font-size: 1.2em;
  text-align: left;
  padding: 1rem 2rem;
}

.answer {
  background: #b7eb8f;
  font-size: 1.2em;
  text-align: left;
  padding: 0 2rem;

  &.wrong {
    background: #ffa39e;
  }

  p {
    margin: 0.5em 0;
  }
}

.explain {
  background: #f0f2f5;
  font-size: 1.1em;
  text-align: left;
  padding: 1rem 2rem;
}

.footer {
  background-color: #001529;
  position: fixed;
  bottom: 0;
  z-index: 1;
  width: 100%;
  padding: 16px 25px;
  text-align: right;
}

.float-left {
  float: left;
}

.setting-item {
  font-size: 16px;
  width: 100%;
  padding: 8px 8px;
  background-color: #fff;
  border-bottom: solid 1px #bfbfbf;
  text-align: right;

  label {
    float: left;
  }
}

.fade-enter-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from {
  opacity: 0;
}
</style>
