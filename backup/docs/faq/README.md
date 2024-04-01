# 优先使用搜索查找

# 此处不会重复指南当中已经明确的

## ios 访问白屏

**Invalid regular expression: invalid group specifier name**

参考： https://blog.csdn.net/RELY_ON_YOURSELF/article/details/102826159

## react 热更白屏

```html
<!--
   把html中根节点的同级iframe隐藏
-->
<style>
      #root~iframe{
        display: none !important;
      }
   
</style>
```

## NET::ERR_CERT_COMMON_NAME_INVALID 错误

如图

![certerr](/certerr.png)
 https证书安全问题，不允许ip访问，需要打开console找到报错的url地址例如'https://192.168.2.198:7101/'， 在新的浏览器页面中访问
 
![certerr](/solve.png)

点开高级后可以看到'继续'，点击继续即可

![certerr](/solved.png)