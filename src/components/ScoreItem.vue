<script setup lang="ts">
interface ScoreItem {
  title: string
  score: number | string
}

const props = defineProps<ScoreItem>()
</script>

<template>
  <div class="score-item">
    <div class="score">{{ score }}</div>
    <div class="title">{{ title }}</div>
  </div>
</template>

<style lang="scss">
.score-item {
  text-align: center;
  padding: 1em;
  font-size: 1.2em;
  color: rgba(0, 0, 0, 0.3);

  .score {
    font-size: 2em;
    color: rgba(0, 0, 0);
  }
}
</style>
