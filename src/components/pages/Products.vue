<template>
  <div>
    <!-- 讀取效果模板:vue-loading-overlay -->
    <loading :active.sync="isLoading"></loading>

    <!-- 列表頁模版 -->
    <div class="text-right mt-4">
      <!-- <button class="btn btn-primary" data-toggle="modal" data-target="#productModal">建立新的產品</button> -->
      <button class="btn btn-primary" @click="openModal(true)">建立新的產品</button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">分類</th>
          <th>產品名稱</th>
          <th width="120" class="text-right">原價</th>
          <th width="120" class="text-right">售價</th>
          <th width="100">是否啟用</th>
          <th width="120">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item) in products" :key="item.id">
          <td>{{item.category}}</td>
          <td>{{item.title}}</td>
          <td class="text-right">{{item.origin_price | currency}}</td>
          <td class="text-right">{{item.price | currency }}</td>
          <td>
            <span v-if="item.is_enable | item.is_enabled" class="text-success">啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td>
            <button class="btn btn-outline-primary btn-sm" @click="openModal(false, item)">編輯</button>
            <button class="btn btn-danger btn-sm" @click="openDelModal(false, item)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 頁碼換頁模版 -->
    <!-- <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item" :class="{'disabled': !pagination.has_pre }">
          <a class="page-link" href="#" aria-label="Previous" @click.prevent="getProducts(pagination.current_page - 1)">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li class="page-item" v-for="page in pagination.total_pages" :key="page" :class="{'active': pagination.current_page === page}">
          <a class="page-link" href="#" @click.prevent="getProducts(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{'disabled': !pagination.has_next }">
          <a class="page-link" href="#" aria-label="Next" @click.prevent="getProducts(pagination.current_page + 1)">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav> -->

    <!-- 拆成頁碼元件 -->
    <!-- 父元件定義props變數為prop-pagination，外層監聽事件為page觸發getProdcuts方法 -->
    <Pagination :prop-pagination="pagination" @page="getProducts"></Pagination>

    <!-- Modal hexschool -->
    <div
      class="modal fade"
      id="productModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>新增產品</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-4">
                <div class="form-group">
                  <label for="image">輸入圖片網址</label>
                  <input type="text" class="form-control" id="image" v-model="tempProduct.imageUrl" placeholder="請輸入圖片連結"/>
                </div>
                <div class="form-group">
                  <label for="customFile">
                    或 上傳圖片
                    <!-- 讀取效果模版:font-awesome -->
                    <i class="fas fa-spinner fa-spin" v-if="status.fileUploading"></i>
                  </label>
                  <input type="file" id="customFile" class="form-control" ref="files" @change="uploadFile"/>
                </div>
                <img
                  :src="tempProduct.imageUrl"
                  class="img-fluid"
                  alt
                />
              </div>
              <div class="col-sm-8">
                <div class="form-group">
                  <label for="title">標題</label>
                  <input type="text" class="form-control" id="title" v-model="tempProduct.title" placeholder="請輸入標題" />
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="category">分類</label>
                    <input type="text" class="form-control" id="category" v-model="tempProduct.category" placeholder="請輸入分類" />
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">單位</label>
                    <input type="unit" class="form-control" id="unit" v-model="tempProduct.unit" placeholder="請輸入單位" />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="origin_price">原價</label>
                    <input type="number" class="form-control" id="origin_price" v-model="tempProduct.origin_price" placeholder="請輸入原價" />
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">售價</label>
                    <input type="number" class="form-control" id="price" v-model="tempProduct.price" placeholder="請輸入售價" />
                  </div>
                </div>
                <hr />

                <div class="form-group">
                  <label for="description">產品描述</label>
                  <textarea type="text" class="form-control" id="description" v-model="tempProduct.description" placeholder="請輸入產品描述"></textarea>
                </div>
                <div class="form-group">
                  <label for="content">說明內容</label>
                  <textarea type="text" class="form-control" id="content" v-model="tempProduct.content" placeholder="請輸入產品說明內容"></textarea>
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="is_enabled" v-model="tempProduct.is_enable" :true-value="1" :false-value="0" />
                    <label class="form-check-label" for="is_enabled">是否啟用</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="updateProduct">確認</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal 刪除用  -->
    <div
      class="modal fade"
      id="delProductModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除產品</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            是否刪除
            <strong class="text-danger">{{ tempProduct.title }}</strong> 商品(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger" @click="deletProduct">確認刪除</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal bootstrap -->
    <!-- <div
      class="modal fade"
      id="productModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">...</div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>-->
  </div>
</template>

<script>
import $ from 'jquery';
import Pagination from '../Pagination';

export default {
  // 定義列表所需資料結構
  data() {
    return {
      products: [],
      pagination: {},
      tempProduct: {},
      isNew: false,
      isLoading: false,
      status: {
        fileUploading: false,
      },
    };
  },
  // 採用元件局部註冊，從模組import元件註冊屬性資料後放入。此處使用了es6的縮寫解開後為{ Pagination: {Pagination content}, }，故父元件tag名稱於此處定義完成
  components:{
    Pagination,
  },
  methods: {
    // 由於未來會多次使用到取得產品資源列表，故註冊為方法
    getProducts(page = 1) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/products?page=${page}`;
      const vm = this;
      // ajax發動前更換
      vm.isLoading = true;
      this.$http.get(api).then(response => {
        console.log(response.data);        
        vm.products = response.data.products;
        vm.pagination = response.data.pagination;

        // 要放在.then內
        vm.isLoading = false;
      });
    },
    // 參數提供是否為新資源的判斷與該資源資訊的物件
    openModal(isNew, item) {
      if(isNew){
        this.tempProduct = {};
        this.isNew = true;
      }else{
        this.tempProduct = Object.assign({}, item); // 注意物件assign時是傳參考，需使用複製等方法執行，如用展開運算元的淺複製 {...item} 或 這邊提供之方法
        this.isNew = false;
      };
      $("#productModal").modal("show");
    },
    openDelModal(isNew, item){
      this.isNew = false;
      this.tempProduct = {...item};
      $('#delProductModal').modal('show');
    },
    updateProduct(){
      let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product`; // 新增用api
      let httpMethod = 'post';
      const vm = this;
      if(!vm.isNew){
        api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product/${vm.tempProduct.id}`; //修改用api
        httpMethod = 'put';
      };
      
      this.$http[httpMethod](api, {data: vm.tempProduct})
        .then((response)=>{
          console.log(response.data);
          if(response.data.success){
            $('#productModal').modal('hide');
            vm.getProducts();
          }else{
            $('#productModal').modal('hide');
            vm.getProducts();
            console.log('新增失敗');
          };
        });
    },
    deletProduct(){
      const vm = this;
      let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product/${vm.tempProduct.id}`;
      let httpMethod = 'delete';

      this.$http[httpMethod](api)
        .then((response)=>{
          console.log(response.data);
          if(response.data.success){
            vm.getProducts();
            console.log('刪除成功', vm.tempProduct.id);
          }else{
            vm.getProducts();
            console.log('刪除失敗', vm.tempProcut.id);
          }
        });

      $('#delProductModal').modal('hide');
    },
    uploadFile(){
      // console.log(this); // 查看夾帶檔案內容 VueComponent > $refs > files > files[]
      const vm = this;
      // 取出在本機端的檔案物件
      const uploadedFile = vm.$refs.files.files[0];
      const formData = new FormData();
      formData.append('file-to-upload', uploadedFile);
      // 上傳採取formdata方式傳送，要修改header內容
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/upload`;
      const httpMethod = 'post';
      
      vm.status.fileUploading = true;
      this.$http[httpMethod](api, formData, {
        headers:{
          'Content-Type': 'multipart/form-data',
        },
      })
        .then((response)=>{
          console.log(response.data);
          if(response.data.success){
            // 由於imageUrl並非原始定義的屬性，故vue未加上雙向綁定的getter()和setter()，就不會使畫面更新
            // vm.tempProduct.imageUrl = response.data.imageUrl;
            
            // 使用vue.$set()強制寫入雙向綁定
            vm.$set(vm.tempProduct, 'imageUrl', response.data.imageUrl);
          } else{
            vm.$bus.$emit('message:push', response.data.message, 'danger');
          }
          vm.status.fileUploading = false;
        });
    },
  },
  created() {
    // 於頁面元件生產時，自動觸發取得產品資源列表
    this.getProducts();

    // 內層向外層觸發事件，並跨越層層元件，直接傳遞引數到外層
    // this.$bus.$emit('message:push', '測試訊息', 'success');
  }
};
</script>