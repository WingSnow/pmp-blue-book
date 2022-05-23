<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import OptionComponent from '@/components/OptionComponent.vue'
import { UnorderedListOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import fetchProxy from '@/utils/fetchProxy'
import type { Question } from '@/index'
import { message } from 'ant-design-vue'

const optionSigns = ['A', 'B', 'C', 'D']

const id = ref<number>()
const question = ref<string>()
const options = ref<string[]>([])
const explain = ref<string>()
const correctAnswer = ref<number>(-1)
const collected = ref<boolean>(false)

const questionLocalStorage: Map<number, Question> = new Map()

const listBlankShow = ref(false)

const collectQuestion = async () => {
  await fetchProxy(`/api/questions/${id.value}/collect`, {
    method: collected.value ? 'DELETE' : 'PUT',
  })
}

const onCollect = async () => {
  await collectQuestion()
  message.success(`${collected.value ? '取消' : ''}收藏成功`)
  collected.value = !collected.value
  if (id.value) {
    const local = questionLocalStorage.get(id.value)
    if (local) {
      local.collected = collected.value ? 'Y' : ''
    }
  }
}

const getOptionType = (index: number) => {
  if (index === correctAnswer.value) {
    return 'correct'
  }
  return 'normal'
}

const current = ref(-1)
const collectionsIdList = ref<number[]>([])
const loading = ref(false)

const getQuestion = async (page: number, size = 10) => {
  loading.value = true
  const result = await fetchProxy(
    `/api/collections?page=${page}&size=${size}`,
    {
      method: 'GET',
    }
  )
  const { data, total } = result
  collectionsIdList.value.length = 0
  collectionsIdList.value.push(...total.sort((a: number, b: number) => a - b))
  data.forEach((item: Question) => {
    if (questionLocalStorage.has(item.id)) {
      return
    }
    questionLocalStorage.set(item.id, item)
  })
  loading.value = false
}

const getQuestionById = async (idToGet: number, size = 10) => {
  loading.value = true
  const result = await fetchProxy(`/api/collections/${idToGet}?size=${size}`, {
    method: 'GET',
  })
  result.forEach((item: Question) => {
    questionLocalStorage.set(item.id, item)
  })
  loading.value = false
}

const loadQusetion = async (questionId: number) => {
  if (!questionLocalStorage.has(questionId)) {
    await getQuestionById(questionId)
  }
  const q = questionLocalStorage.get(questionId)
  if (q) {
    id.value = q.id
    question.value = q.question
    options.value.length = 0
    options.value.push(q.option_0)
    options.value.push(q.option_1)
    options.value.push(q.option_2)
    options.value.push(q.option_3)
    correctAnswer.value = q.answer.charCodeAt(0) - 'A'.charCodeAt(0)
    explain.value = q.remark
    collected.value = q.collected === 'Y'
  }
}

const jumpTo = async (questionId: number) => {
  current.value = questionId
  await loadQusetion(current.value)
  listBlankShow.value = false
}

const nextQuestion = async (direction: number) => {
  const currentIndex = collectionsIdList.value.indexOf(current.value)
  if (currentIndex >= collectionsIdList.value.length - 1) {
    return
  }
  current.value = collectionsIdList.value[currentIndex + direction]
  loadQusetion(current.value)
}

const refreshList = async () => {
  await getQuestion(0)
}

onMounted(async () => {
  await getQuestion(0)
  nextQuestion(1)
})

const upEnable = computed(() => {
  const currentIndex = collectionsIdList.value.indexOf(current.value)
  return currentIndex > 0
})

const downEnable = computed(() => {
  const currentIndex = collectionsIdList.value.indexOf(current.value)
  return currentIndex < collectionsIdList.value.length - 1
})
</script>

<template>
  <a-spin :spinning="loading">
    <a-empty v-show="!id" style="margin-top: 64px" />
    <div v-show="id">
      <div class="question">
        <p>
          <span style="color: #1890ff">[{{ id }}]</span>
          {{ question }}
        </p>
        <template v-for="(option, index) in options" :key="index">
          <option-component
            :index="index"
            :text="option"
            :type="getOptionType(index)"
          ></option-component>
        </template>
      </div>
      <div class="answer">
        <a-space size="large">
          <p>
            {{ `正确答案：${optionSigns[correctAnswer]}` }}
          </p>
        </a-space>
      </div>
      <div class="explain">
        <a-divider orientation="left">解析</a-divider>
        <p>
          {{ explain }}
        </p>
      </div>
    </div>
  </a-spin>
  <div class="footer">
    <a-button
      type="normal"
      shape="circle"
      size="32"
      class="setting"
      @click="listBlankShow = !listBlankShow"
    >
      <unordered-list-outlined />
    </a-button>
    <a-space>
      <a-button
        type="normal"
        shape="round"
        @click="onCollect"
        :disabled="!id"
        >{{ collected ? '已收藏' : '收藏' }}</a-button
      >
      <a-button
        type="primary"
        shape="round"
        @click="nextQuestion(-1)"
        :disabled="!upEnable"
        >上一题</a-button
      >
      <a-button
        type="primary"
        shape="round"
        @click="nextQuestion(1)"
        :disabled="!downEnable"
        >下一题</a-button
      >
    </a-space>

    <a-drawer
      v-model:visible="listBlankShow"
      class="list-drawer"
      placement="bottom"
    >
      <template #extra>
        <a-button
          type="text"
          size="32"
          @click="refreshList"
          style="color: rgba(0, 0, 0, 0.5)"
        >
          <reload-outlined />
        </a-button>
      </template>
      <a-spin :spinning="loading">
        <template v-for="item in collectionsIdList" :key="item">
          <a-button
            class="item"
            type="primary"
            :disabled="item === current"
            @click="jumpTo(item)"
            >{{ item }}</a-button
          >
        </template>
      </a-spin>
    </a-drawer>
  </div>
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

.setting {
  float: left;
}

.list-drawer {
  .item {
    margin: 3px;
  }
}
</style>
