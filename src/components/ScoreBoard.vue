<script setup lang="ts">
import { ref, computed } from 'vue'
import fetchProxy from '../utils/fetchProxy'
import ScoreItem from './ScoreItem.vue'

const finished = ref<number>(0)
const correct = ref<number>(0)
const total = ref<number>(0)

const correctRate = computed(() => {
  if (!finished.value) {
    return '0%'
  }
  return `${((correct.value / finished.value) * 100).toFixed(0)}%`
})

const finishedRate = computed(() => {
  if (!total.value) {
    return '0%'
  }
  return `${((finished.value / total.value) * 100).toFixed(0)}%`
})

const loading = ref(false)

const loadDate = async () => {
  loading.value = true
  const result = await fetchProxy(`/api/record`, {
    method: 'GET',
  })
  if (!result) return
  finished.value = result.finished
  correct.value = result.correct
  total.value = result.total
  loading.value = false
}

defineExpose({
  loadDate,
})
</script>

<template>
  <a-spin :spinning="loading">
    <a-row>
      <a-col :span="8"><score-item title="已做" :score="finished" /></a-col>
      <a-col :span="8"><score-item title="正确" :score="correct" /></a-col>
      <a-col :span="8">
        <score-item title="正确率" :score="correctRate" />
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="12"><score-item title="总数" :score="total" /></a-col>
      <a-col :span="12">
        <score-item title="完成率" :score="finishedRate" />
      </a-col>
    </a-row>
  </a-spin>
</template>
