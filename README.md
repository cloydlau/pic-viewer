# pic-viewer / 图片预览

![before preview](./outside.png)

<br>

![previewing](./previewing.png)

## Features

- √ `viewerjs` 的 vue 版本 增加了预览前的外部展示 使其开箱即用
- √ 灵活的展示形式：支持文档流、轮播图、自适应瀑布流、嵌套在表格内
- √ 灵活的数据类型：支持字符串、字符串数组、对象数组
- √ 支持二维码
- √ 全局或局部引入 参数支持全局或局部配置

<br>

## Installation

![NPM](https://nodei.co/npm/pic-viewer.png)

Dependencies：vue

```ts
// 全局引入

import 'pic-viewer/dist/style.css'
import PicViewer from 'pic-viewer'

Vue.use(PicViewer, {
  // 全局配置
})
```

```vue
<!-- 局部引入 -->

<template>
  <PicViewer v-bind="config"/>
</template>

<script>
import 'pic-viewer/dist/style.css'
import PicViewer from 'pic-viewer'

export default {
  components: { PicViewer },
  data () {
    return {
      config: {
        // 局部配置
      }
    }
  }
}
</script>
```

<br>

## Props

| Attribute | Description | Type | Options | Default |
| --- | --- | --- | --- | --- |
| value | img link(s) | string / array[string] / array[object] | | |
| pattern |  display pattern | string | 'waterfall', 'swiper', 'table-cell' | undefined, means **normal flow** |
| objectKey | if type of value is array[object], you need to specify the img key of object | string | | |
| swiperProps* |  props of [swiper](https://swiperjs.com/swiper-api) | object | | |
| qrcode* | turning value into qrcode | boolean, string | true, false, 'auto' | false |
| qrcodeProps* | props of [qrcode](https://github.com/soldair/node-qrcode) dependency | object | | |

### qrcode

::: tip  
如果将 qrcode 设为 'auto'，pic-viewer 会自动判断是否需要转换（value 为 base64 或 url 时不会转换）
:::

### qrcodeProps

```
// 默认值

{
  margin: 0,
  scale: 400,
  errorCorrectionLevel: 'L',
  width: 148,
  height: 148,
}
```

### swiperProps

```
// 默认值

{
  observer: true,
}
```

<br>

## Methods

| Method | Description | Parameters |
| --- | --- | --- |
| preview | preview manually | index of value array (default: 0) |

<br>

## Use Cases

### Preview manually, no external display

```html

<PicViewer :value="" v-show="false" ref="PicViewer"/>
<button @click="()=>{$refs.PicViewer.preview(6)}">preview</button>
```
