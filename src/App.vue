<template>
  <div id="app">
    <!-- <img src="./assets/logo.png">
    <HelloWorld/>
    <button type="button" class="btn btn-primary">Primary</button>
    <button type="button" class="btn btn-secondary">Secondary</button>
    <button type="button" class="btn btn-success">Success</button>
    <button type="button" class="btn btn-danger">Danger</button>
    <button type="button" class="btn btn-warning">Warning</button>
    <button type="button" class="btn btn-info">Info</button>
    <button type="button" class="btn btn-light">Light</button>
    <button type="button" class="btn btn-dark">Dark</button>
    <a href="">12345</a> -->
    <router-view></router-view>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld'

export default {
  name: 'App',
  components: {
    HelloWorld,
  },
  created(){
    // 需檢查api伺服器路徑、申請到的api path
    // const api = 'https://vue-course-api.hexschool.io/api/dat/products';
    
    // 由於路徑位置會隨開發環境、佈署環境等變動，故抽出到環境中管理後，再用變數引入
    // console.log(process.env.APIPATH, process.env.CUSTOMPATH);
    // const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products`;
    // this.$http.get(api)
    //   .then((response)=>{
    //     console.log(response.data);
    //   });
  },
}
</script>

<style lang="scss">
  // 第一種載入外部樣式，直接路徑資源
  // @import "~bootstrap/scss/bootstrap.scss";

  //第二種載入外部樣式，仍保有客製化彈性
  @import "./assets/all.scss";

/* #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
</style>
