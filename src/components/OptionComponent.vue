<script setup lang="ts">
import { CheckOutlined, CloseOutlined } from '@ant-design/icons-vue'
import { computed } from 'vue'

const optionSigns = ['A', 'B', 'C', 'D']

interface Props {
  type?: 'correct' | 'wrong' | 'selected' | 'normal'
  index: number
  text: string
}
const props = withDefaults(defineProps<Props>(), {
  type: 'normal',
})

const emit = defineEmits<{
  (e: 'click', index: number): void
}>()

const onClick = () => {
  // console.log(`option ${optionSigns[props.index]} clicked`)
  emit('click', props.index)
}

const optionClass = computed(() => {
  return props.type
})
</script>

<template>
  <div class="option" @click="onClick" :class="optionClass">
    <a-button
      type="normal"
      shape="circle"
      size="32"
      class="button"
      v-show="type === 'normal'"
    >
      {{ optionSigns[index] }}
    </a-button>

    <a-button
      type="primary"
      shape="circle"
      size="32"
      class="button selected"
      v-show="type === 'selected'"
    >
      {{ optionSigns[index] }}
    </a-button>

    <a-button
      type="normal"
      shape="circle"
      size="32"
      class="button correct"
      v-show="type === 'correct'"
    >
      <check-outlined />
    </a-button>

    <a-button
      type="danger"
      shape="circle"
      size="32"
      class="button wrong"
      v-show="type === 'wrong'"
    >
      <close-outlined />
    </a-button>

    <p class="text">{{ text }}</p>
  </div>
</template>

<style scoped lang="scss">
.option {
  cursor: pointer;

  .text {
    margin-left: 3rem;
    padding-top: 0.75rem;
  }

  &.correct {
    .text {
      color: #52c41a;
    }
  }

  &.wrong {
    .text {
      color: #ff4d4f;
    }
  }

  &.selected {
    .text {
      color: #40a9ff;
    }
  }

  .button {
    float: left;
    margin: 0.5rem;
    &.correct {
      background: #52c41a;
      border-color: #52c41a;
      color: #fff;
    }
  }
}
</style>
