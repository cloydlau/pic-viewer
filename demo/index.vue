<template>
  <el-dialog visible :close-on-click-modal="false" :show-close="false" title="pic-viewer">
    <h2>单张</h2>
    <PicViewer :value="value[0]" qrcode/>
    <br/><br/>

    <h2>多张（Swiper）</h2>
    <PicViewer :value="value" qrcode="auto" pattern="swiper" :swiperProps="{
      slidesPerView: 3,
      spaceBetween: 15,
    }">
      <template v-slot="{ src, index }">
        <img :src="src" alt="">
        <div>第{{ index + 1 }}张</div>
      </template>
    </PicViewer>
    <br/><br/>

    <h2>多张（文档流）</h2>
    <PicViewer :value="JSON.stringify(value)" qrcode="auto" :qrcodeProps="{
      width: 48,
      height: 48,
    }"/>
    <br/><br/>

    <h2>多张（瀑布流）</h2>
    <PicViewer :value="value" qrcode="auto" pattern="waterfall"/>
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
          <PicViewer :value="row.img" qrcode="auto"/>
        </template>
      </el-table-column>
    </el-table>

    <PicViewer :value="value" v-show="false" ref="PicViewer"/>
    <PicViewer :value="value[0]" ref="picViewer" @click="onClick" :viewerjs="false"/>

    <el-button-group>
      <el-button @click="()=>{value=['123']}">改变value</el-button>
      <el-button @click="()=>{$refs.PicViewer.preview(0)}">预览</el-button>
    </el-button-group>
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
  methods: {
    onClick ({ index, src }) {
      console.log('onClick', index, src)
      this.$refs.picViewer.preview(index)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  min-width: 600px;
}
</style>
