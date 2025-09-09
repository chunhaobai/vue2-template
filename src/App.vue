<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
*{
  margin: 0;
  padding: 0;
  // box-sizing: border-box;
}
/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 10px; /* 垂直滚动条宽度 */
  height: 10px; /* 水平滚动条高度 */
  background: transparent;
}

/* 修改样式 */
::-webkit-scrollbar-corner {
  background-color: #010c24
}
::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg,#468aff, #005ce6 100%);
  border-radius: 20px;
  box-shadow: 0px 4px 4px 0px rgba(0,118,231,0.25);
  transition: background-color 0.3s;

  &:hover {
    background: linear-gradient(180deg,#468aff, #005ce6 100%);
  }
}

::-webkit-scrollbar-track {
  background: #2D3647;
  border-radius: 14px;
}
</style>
