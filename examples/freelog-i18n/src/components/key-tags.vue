<template>
  <div class="i-nem-edit-key-tags">
      <el-tag :size="size" :key="tag" v-for="tag in tags" closable :disable-transitions="false" @click="selectTag(tag)" @close="handleClose(tag)">
        {{tag}}
      </el-tag>
      <template v-if="addBtnVisible">
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          :size="size"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"></el-input>
        <el-button v-else class="button-new-tag" :size="size" @click="showInput">+ 新增标签</el-button>
      </template>
      
  </div>
</template>

<script>

export default {
  name: 'key-tags',
  components: {  },
  props: {
    size: {
      type: String,
      default: 'small'
    },
    repositoryName: String,
    selectedTag: String,
    selectedKeyItem: Object,
    keyInfo: Object,
    languages: Array,
    addBtnVisible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      tags: [],
      inputValue: '',
      inputVisible: false
    }
  },
  computed: {
    moduleName() {
      return this.selectedKeyItem != null ? this.selectedKeyItem.moduleName : ''
    },
    keyName() {
      return this.selectedKeyItem != null ? this.selectedKeyItem.key : ''
    },
    values() {
      return this.languages.map(lang => {
        const value = this.selectedKeyItem[lang]
        return { lang, value }
      })
    }
  },
  watch: {
    keyInfo() {
      this.resolveKeyInfo()
    },
  },
  methods: {
    async handleClose(tag) {
      const index = this.tags.indexOf(tag)
      const tags = this.tags.slice()
      tags.splice(index, 1)

      const result = await this.updateKeyInfo(tags)
      if (result.errcode === 0) {
        this.tags.splice(index, 1)
        this.$message.success(`删除tag（${tag}）成功！`)
      } else {
        this.$message.error(`删除tag（${tag}）失败: ${result.msg}`)
      }
      
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    async handleInputConfirm() {
      let tag = this.inputValue
      if (tag) {
        if (this.tags.indexOf(tag) !== -1) {
          this.$message.error(`tag（${tag}）已存在！`)
          return
        }
        const tags = this.tags.slice()
        tags.push(tag)
        const result = await this.updateKeyInfo(tags)
        if (result.errcode === 0) {
          this.tags.push(tag)
          this.$message.success(`新增tag（${tag}）成功！`)
        } else {
          this.$message.error(`新增tag（${tag}）失败: ${result.msg}`)
        }
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    async updateKeyInfo(tags) {
      const postData = {
        name: this.keyName,
        moduleName: this.moduleName,
        repositoryName: this.repositoryName,
        description: '',
        tags, 
        values: this.values
      }
     
      const result = await window.fetch('//i18n-ts.testfreelog.com/v1/i18nKeyInfos', {
        method: this.keyInfo != null ? 'PUT' : 'POST',
        body: postData
      }).then(res => res.json()).catch(e => e)
      if (result instanceof Error) {
        return null
      } else {
        return result
      }
    },
    selectTag(tag) {
      this.$emit('update:selectedTag', tag)
    },
    resolveKeyInfo() {
      let tags = []
      if (this.keyInfo != null) {
        tags = this.keyInfo.tags
      } 
      this.tags = tags
    }
  },
  async mounted() {
    this.resolveKeyInfo()
  },
}
</script>

<style lang="less">
.i-nem-edit-key-tags {
  margin: 20px 0; 
  .el-tag + .el-tag { margin-left: 10px; }
  .button-new-tag {
    height: 24px; margin-left: 10px; padding-top: 0; padding-bottom: 0;
    line-height: 22px;
  }
  .input-new-tag {
    width: 90px; margin-left: 10px;
    vertical-align: bottom;
    .el-input__inner {
      height: 24px; line-height: 24px;
    }
  }
  
}
</style>

<style lang="less">

</style>
