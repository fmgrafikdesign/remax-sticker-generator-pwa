<template @click="enableMoveable">
    <Moveable ref="moveable"
      class="moveable"
      v-bind="moveable"
      @drag="handleDrag"
      @resize="handleResize"
      @scale="handleScale"
      @rotate="handleRotate"
      >
      <img :src="imageData" class="img-fluid" @load="updateRect" v-on:click="enableMoveable">
    </Moveable>
</template>

<script>
import Moveable from 'vue-moveable'

// TODO Resize event updateRect && updateTarget

export default {
  name: 'Sticker',
  components: {
    Moveable
  },
  props: ['imageData', 'id'],
  data: () => ({
    moveable: {
      draggable: true,
      throttleDrag: 0,
      resizable: false,
      throttleResize: 1,
      keepRatio: true,
      scalable: true,
      throttleScale: 0,
      rotatable: true,
      throttleRotate: 0
    }
  }),
  mounted () {
    window.addEventListener('resize', e => {
      this.$refs.moveable.updateRect()
      // this.$refs.moveable.updateTarget()
    })
  },
  methods: {
    enableMoveable () {
      this.$emit('disable-all-other-moveables', this.id)
      this.moveable.draggable = true
      this.moveable.scalable = true
      this.moveable.rotatable = true
      this.$refs.moveable.moveable.innerMoveable.moveable.moveable.controlBox.element.classList.remove('d-none')
    },
    disableMoveable () {
      this.moveable.draggable = false
      this.moveable.scalable = false
      this.moveable.rotatable = false
      this.$refs.moveable.moveable.innerMoveable.moveable.moveable.controlBox.element.classList.add('d-none')
    },
    updateRect () {
      this.$refs.moveable.updateRect()
      this.$refs.moveable.updateTarget()
      // reference to the control box: this.$refs.moveable.moveable.innerMoveable.moveable.moveable.controlBox.element
      // console.log(this.$refs.moveable)
      // this.disableMoveable()
      // console.log('updated moveable ')
    },
    handleDrag ({ target, left, top }) {
      // console.log('onDrag left, top', left, top)
      target.style.left = `${left}px`
      target.style.top = `${top}px`
    },
    handleResize ({
      target, width, height, delta
    }) {
      // console.log('onResize', width, height)
      delta[0] && (target.style.width = `${width}px`)
      delta[1] && (target.style.height = `${height}px`)
    },
    handleScale ({ target, transform, scale }) {
      // console.log('onScale scale', scale)
      target.style.transform = transform
    },
    handleRotate ({ target, dist, transform }) {
      // console.log('onRotate', dist)
      target.style.transform = transform
    }
  }
}
</script>

<style scoped>
  .moveable {
    position: absolute;
    width: 100px
  }

</style>
