# pic-viewer / 图片预览

### 预览前 / before preview
![预览前](./preview/outside.png)
### 预览时 / previewing
![预览时](./preview/previewing.png)

### Feature

- √ viewerjs的vue版本 增加了预览前的外部展示 使其开箱即用
- √ 支持自适应瀑布流展示、嵌套在表格内展示
- √ 灵活的数据类型：支持字符串/字符串数组/对象数组
- √ 友好的hover交互
- √ 支持全局安装/单独引入

### Installation
![NPM](https://nodei.co/npm/pic-viewer.png)
``` bash
$ yarn add pic-viewer
```

**依赖项**：vue

**全局引入**
```js
import PicViewer from 'pic-viewer'
Vue.use(PicViewer)
```

**局部引入**
```js
import { PicViewer } from 'pic-viewer'
components: { PicViewer }
```

### Quick Start

**用在表格中**
```html
<el-table>
  <el-table-column label="图片">
    <template slot-scope="{ row }">
      <PicViewer tableCell :value="row.img"/>
    </template>
  </el-table-column>
</el-table>
```

**用在其他地方（自适应瀑布流布局）**
```html
<PicViewer :value=""/>
```

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| value | 图片链接 | String / Array[String] / Array[Object] | | |
| objectKey | 如果数组元素为对象 需要指定图片对应的key | String | | |
| tableCell | 是否用于表格中 | Boolean | | false |
