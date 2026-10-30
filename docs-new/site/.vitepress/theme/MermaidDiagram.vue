<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useData } from 'vitepress'

const props = defineProps<{ code: string }>()
const { isDark } = useData()
const svg = ref('')
const error = ref('')
let revision = 0

async function render() {
  const current = ++revision
  try {
    const { default: mermaid } = await import('mermaid')
    mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: isDark.value ? 'dark' : 'default' })
    const id = `freelog-diagram-${crypto.randomUUID()}`
    const result = await mermaid.render(id, props.code)
    if (current === revision) { svg.value = result.svg; error.value = '' }
  } catch {
    if (current === revision) { svg.value = ''; error.value = '流程图未能渲染，请阅读下方文本源码。' }
  }
}
onMounted(render)
watch([() => props.code, isDark], render)
</script>

<template>
  <figure class="mermaid-block">
    <div v-if="svg" class="mermaid-canvas" role="img" aria-label="流程图；文字说明与源码位于本节" v-html="svg" />
    <p v-if="error" role="status">{{ error }}</p>
    <details :open="!svg"><summary>流程图文字源码</summary><pre>{{ code }}</pre></details>
  </figure>
</template>
