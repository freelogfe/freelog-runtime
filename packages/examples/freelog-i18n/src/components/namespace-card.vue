<template >
  <el-card class="i-m-nem-edit-item">
      <div slot="header" class="clearfix">
        <span class="i-m-nem-title">{{title}}</span>
      </div>
      <div>
        <el-input 
          v-if="selectedKeyItem.valueType === 'string'" 
          type="textarea" rows="4"
          v-model="value"
          @input="handleNamespaceInput"
          @change="handleNamespaceChange" ></el-input>
        <template v-else>
          <el-input 
            v-for="(val, i) in value" 
            type="textarea" rows="3" 
            style="margin-bottom: 10px;"
            :key="'val-'+i" 
            v-model="value[i]" 
            @change="handleNamespaceChange">
            <template slot="prepend">{{i}}</template>
          </el-input>
        </template>
      </div>
    </el-card>
</template>

<script>
import iMixins from '../mixins.js'
export default {
  name: 'i18n-namespace-card',
  props: {
    language: String,
    languages: Array,
    title: String,
    selectedKeyItem: Object,
  },
  mixins: [ iMixins ],
  data() {
    return {
      value: '',
    }
  },
  watch: {
    selectedKeyItem() {
      this.value = this.selectedKeyItem[this.language]
    },
  },
  methods: {
    handleNamespaceInput(str) {
      this.selectedKeyItem[this.language] = str
    },
    handleNamespaceChange() {
      this.checkLanguageValue(this.selectedKeyItem)
      const data = Object.assign({ operation: 'update' }, this.selectedKeyItem)
      this.$emit('value-update', data)
    },
  },
  mounted() {
    this.value = this.selectedKeyItem[this.language]
  },
}
</script>

<style lang="less" scoped>
  .i-m-nem-edit-item { 
    float: left; width: 48%;
    &:not(:last-child) {
      margin-right: 3%; 
    }

    .i-m-nem-title { font-size: 14px; }
  }
</style>