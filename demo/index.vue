<template>
  <el-dialog visible :close-on-click-modal="false" :show-close="false" title="pic-viewer">
    <h2>单张</h2>
    <PicViewer :value="value[0]" qrcode="auto"/>
    <br/><br/>

    <h2>多张（瀑布流）</h2>
    <PicViewer :value="value" :qrcode="false"/>
    <br/><br/>

    <h2>表格内</h2>
    <el-table
      :data="[
        {img:this.value,name:'多个（数组）'},
        {img:this.value&&this.value[0],name:'单个（字符串/数组）'}
      ]"
      border
      fit
      stripe
      highlight-current-row
    >
      <el-table-column label="数量" prop="name"/>
      <el-table-column label="图片">
        <template slot-scope="{row}">
          <PicViewer :waterfall="false" :value="row.img"/>
        </template>
      </el-table-column>
    </el-table>

    <PicViewer :value="value" v-show="false" ref="PicViewer"/>
    <el-button @click="()=>{$refs.PicViewer.preview(0)}">预览</el-button>
  </el-dialog>
</template>

<script>
/**
 * 引入：import { PicViewer } from 'pic-viewer'
 * @param {value} Array - 支持单个字符串/数组/数组嵌套对象
 * @param {objectKey} String - 如果数组元素为对象 需要传入对应图片地址的属性
 * @param {tableCell} Boolean - 是否用于表格中 默认false
 */

//import PicViewer from '../src/index'

export default {
  //components: { PicViewer },
  data () {
    return {
      value: [
        'https://placem.at/people?random=1&txt=0&w=500&h=500',
        'https://placem.at/people?random=1&txt=0&w=1000&h=500',
        'https://placem.at/people?random=1&txt=0&w=500&h=1000',
        'https://placem.at/things?random=1&txt=0&w=1600&h=900',
        'https://placem.at/things?random=1&txt=0&w=800&h=600',
        'https://placem.at/places?random=1&txt=0&w=1600&h=1000',
        'https://placem.at/places?random=1&txt=0&w=1260&h=540',
        '123'
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  min-width: 600px;
}
</style>
