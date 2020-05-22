<template>
  <div class="pic-viewer">
    <ul ref="viewer" :class="{
        'table-cell': tableCell,
        'waterfall': !tableCell
      }">
      <li v-for="(v,i) of files" :key="i">
        <img :src="v" alt="">
      </li>
    </ul>
  </div>
</template>

<script>
import 'viewerjs/dist/viewer.css'
import Viewer from 'viewerjs'

export default {
  name: 'PicViewer',
  props: {
    value: {
      validator: value => ['String', 'Array', 'Null'].includes(({}).toString.call(value).slice(8, -1)),
    },
    objectKey: String,
    tableCell: Boolean,
  },
  watch: {
    value: {
      immediate: true,
      handler (newVal, oldVal) {
        if (newVal) {
          if (newVal instanceof Array) {
            this.files = this.objectKey ? newVal.filter(v => {
              if (v[this.objectKey]) {
                return v[this.objectKey]
              }
            }) : newVal
          } else {
            this.files = [newVal]
          }
          this.$nextTick(() => {
            if (this.viewer) {
              this.viewer.update()
            } else {
              this.viewer = new Viewer(this.$refs.viewer, {
                zIndex: 5000
              })
            }
          })
        } else {
          this.files = []
        }
      }
    }
  },
  data () {
    return {
      files: [],
      viewer: null
    }
  },
}
</script>

<style lang="scss" scoped>
@keyframes bob {
  0% {
    transform: translateY(-8px);
  }
  50% {
    transform: translateY(-4px);
  }
  100% {
    transform: translateY(-8px);
  }
}

@keyframes bob-float {
  100% {
    transform: translateY(-8px);
  }
}

@keyframes jello {
  from,
  11.1%,
  to {
    transform: translate3d(0, 0, 0);
  }

  22.2% {
    transform: skewX(-12.5deg) skewY(-12.5deg);
  }

  33.3% {
    transform: skewX(6.25deg) skewY(6.25deg);
  }

  44.4% {
    transform: skewX(-3.125deg) skewY(-3.125deg);
  }

  55.5% {
    transform: skewX(1.5625deg) skewY(1.5625deg);
  }

  66.6% {
    transform: skewX(-0.78125deg) skewY(-0.78125deg);
  }

  77.7% {
    transform: skewX(0.390625deg) skewY(0.390625deg);
  }

  88.8% {
    transform: skewX(-0.1953125deg) skewY(-0.1953125deg);
  }
}

.pic-viewer {
  & > ul.waterfall {
    padding: 15px;
    margin: 0 auto;
    position: relative;
    column-width: 200px;
    column-gap: 20px;

    & > li {
      width: 100%;
      list-style: none;
      break-inside: avoid;
      margin-bottom: 15px;
      cursor: pointer;

      & > img {
        width: 100%;
        height: 100%;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      }

      &:hover {
        animation-name: bob-float, bob;
        animation-duration: .3s, 1.5s;
        animation-delay: 0s, .3s;
        animation-timing-function: ease-out, ease-in-out;
        animation-iteration-count: 1, infinite;
        animation-fill-mode: forwards;
        animation-direction: normal, alternate;
      }
    }
  }

  & > ul.table-cell {
    padding: 0;
    height: 23px;
    margin: 0;

    & > li {
      list-style: none;
      display: inline-block;
      cursor: pointer;

      & > img {
        height: 23px;
        margin-right: 10px;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      }

      &:hover {
        animation-name: jello;
        transform-origin: center;
        animation-duration: 1s;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
      }
    }
  }
}
</style>

<!--<style lang="scss">
.viewer-button {
  background-color: rgba(0, 0, 0, 1);
  height: 100px;
  right: -50px;
  top: -50px;
  width: 100px;
}
</style>-->
