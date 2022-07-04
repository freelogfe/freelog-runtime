<template>
  <div class="flex-row w-100x h-100x">
    <div class="w-200 flex-column y-auto b-1 mb-60">
      <div>组件列表</div>
      <template v-for="(item, index) in compList" :key="index">
        <div
          class="text-center brs-4 b-1 p-15 m-10 select-none cur-pointer"
          @click="addComp(item)"
        >{{ item.name }}</div>
      </template>
    </div>
    <div v-if="editMode"></div>
    <freelog-container v-else :configData="containerData" class="flex-1"></freelog-container>
    <!-- <router-view class="flex-1" v-else /> -->
    <div class="w-200 flex-column y-auto b-1 mb-60">
      <div>属性编辑列表</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance } from 'vue'
import Container from './components/container.vue'
export default defineComponent({
  name: 'Home',
  components: {
  },
  data() {
    return {
      loading: true,
      editMode: true,
      compList: [
        {
          name: 'van-button',
          config: {
            normalProps: {
              type: 'primary',
              text: '主要按钮'
            }
          }
        },
        {
          name: 'van-cell',
          config: {
            normalProps: {
              title: '单元格',
              value: '内容'
            }
          }
        },
        {
          name: 'van-icon',
          config: {
            normalProps: {
              name: 'chat-o',
              badge: '9'
            }
          }
        },
        {
          name: 'van-image',
          config: {
            normalProps: {
              width: '10rem',
              height: '10rem',
              fit: 'contain',
              src: 'https://img.yzcdn.cn/vant/cat.jpeg'
            }
          }
        },
        {
          name: 'van-field',
          config: {
            normalProps: {
              label: '文本',
              placeholder: '请输入用户名'
            }
          }
        }
      ],
      containerData: new Array<any>(),
      configData: [
        {
          type: 'container',
          name: 'freelog-container',
          config: {
            css: {
              classNames: [],
              styles: []
            },
            normalProps: {

            },
            events: {
            }
          },
          children: [
            {
              name: 'van-image',
              type: 'component',
              config: {
                normalProps: {
                  width: '10rem',
                  height: '10rem',
                  fit: 'contain',
                  src: 'https://img.yzcdn.cn/vant/cat.jpeg'
                }
              }
            },
            {
              type: 'routerView', // 路由是一个具有宽高设定（或自适应）的容器
              name: ['home', 'about'], // 当添加路由时就是划分一块区域，这块区域的高宽应该传递下去，而不应该让routerview包div
              children: [
                {
                  type: 'component', // 此时container根据用户选的自由名称自动生成的容器
                  name: 'van-search',
                  routePath: 'home',
                  routeName: 'freelog-home',
                  children: [
                    {
                      type: 'component',
                      name: 'van-search'
                    }
                  ]
                },
                {
                  type: 'component',
                  name: 'freelog-about',
                  routePath: 'about',
                  routeName: 'freelog-about'
                }
              ]
            }
          ]
        }
      ]
    }
  },
  methods: {
    init(vue?: any) {
      const data = this.configData
      this.containerData = this.configData[0].children
      // const routes: any = []
      // data.forEach((item: any) => {
      //   routes.push({
      //     path: '/freelog',
      //     name: 'freelog',
      //     component: Container,
      //     meta: {
      //       configData: item
      //     }
      //   })
      // })
      // this.$router.addRoute(routes[0])
      this.loading = false
      this.editMode = false
      // this.$router.push('/freelog')
    },
    addComp(data: any) {
      const cdata = [...this.configData]
      cdata[0].children.push({
        type: 'component', // 此时container根据用户选的自由名称自动生成的容器
        ...data
      })
      this.configData = cdata
      this.init()
    }
  },
  mounted() {
    const vue: any = getCurrentInstance()?.proxy
    this.init(vue)
  }
})
</script>
