<template>
  <div>
    <!-- 讀取效果模板:vue-loading-overlay -->
    <loading :active.sync="isLoading"></loading>
    
    <div class="text-right mt-4">
      <button class="btn btn-primary" @click="openModal(true)">建立新的優惠券</button>
    </div>

    <!-- 列表 -->
    <table class="table mt-4">
      <thead>
        <tr>
          <th>優惠碼</th>
          <th>名稱</th>
          <th>折扣百分比</th>
          <th>到期日</th>
          <th>是否啟用</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in coupons" :key="index">
          <td>{{ item.code }}</td>
          <td>{{ item.title }}</td>
          <td>{{ item.percent }}%</td>
          <td>{{ item.due_date }}</td>
          <td>
            <span v-if="item.is_enabled === 1" class="text-success">啟用</span>
            <span v-else class="text-muted">未啟用</span>
          </td>
          <td>
            <button class="btn btn-outline-primary btn-sm" @click="openModal(false, item)">編輯</button>
            <button class="btn btn-danger btn-sm" @click="openDelModal(false, item)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 頁碼元件 -->
    <Pagination :prop-pagination="pagination" @page="getCoupons"></Pagination>
    
    <!-- Modal -->
    <div
      class="modal fade"
      id="couponModal"
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
          <div class="modal-body">
            <div class="form-group">
              <label for="title">標題</label>
              <input
                type="text"
                class="form-control"
                id="title"
                v-model="tempCoupon.title"
                placeholder="請輸入標題"
              />
            </div>
            <div class="form-group">
              <label for="coupon_code">優惠碼</label>
              <input
                type="text"
                class="form-control"
                id="coupon_code"
                v-model="tempCoupon.code"
                placeholder="請輸入優惠碼"
              />
            </div>
            <div class="form-group">
              <label for="due_date">到期日</label>
              <input type="date" class="form-control" id="due_date" v-model="tempCoupon.due_date" />
            </div>
            <div class="form-group">
              <label for="price">折扣百分比</label>
              <input
                type="number"
                class="form-control"
                id="price"
                v-model="tempCoupon.percent"
                placeholder="請輸入折扣百分比"
              />
            </div>
            <div class="form-group">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :true-value="1"
                  :false-value="0"
                  v-model="tempCoupon.is_enabled"
                  id="is_enabled"
                />
                <label class="form-check-label" for="is_enabled">是否啟用</label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">關閉</button>
            <button type="button" class="btn btn-primary" v-if="isNew" @click="updateCoupon">創建優惠券</button>
            <button type="button" class="btn btn-primary" v-else @click="updateCoupon">更新優惠券</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal 刪除用  -->
    <div
      class="modal fade"
      id="delCouponModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除優惠券</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            是否刪除
            <strong class="text-danger">{{ tempCoupon.title }}</strong> 優惠券(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger" @click="deleteCoupon">確認刪除</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import $ from 'jquery';
import Pagination from '../Pagination';

export default {
    data(){
        return {
            coupons: [],
            tempCoupon: {},
            isNew: false,
            isLoading: false,
            pagination: {},
        };
    },
    methods:{
        getCoupons(page = 1){
            const vm = this;
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupons?page=${page}`;
            vm.isLoading = true;
            this.$http.get(api).then(response => {
                console.log(response.data);
                vm.coupons = response.data.coupons;
                vm.pagination = response.data.pagination;
                vm.isLoading = false;
            }); 
        },
        createCoupon(){
            const vm = this;
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon`;
            vm.isLoading = true;
            this.$http.post(api, {data: vm.tempCoupon}).then(response => {
                console.log(response.data);
                // 注意：因為非同步event，getCoupons API要放在then裡面，執行緒才會在前一支API回傳之後
                vm.getCoupons();
                vm.isLoading = false;
            });
            
        },
        updateCoupon(){
            const vm = this;
            const id = vm.tempCoupon.id;
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${id}`;
            vm.isLoading = true;

            if(vm.isNew){
                vm.createCoupon();
            }
            if(!vm.isNew){
                this.$http.put(api, {data: vm.tempCoupon}).then(response => {
                    console.log(response.data);
                    // 注意：因為非同步event，getCoupons API要放在then裡面，執行緒才會在前一支API回傳之後
                    vm.getCoupons();
                    vm.isLoading = false;
                });
            }
            $('#couponModal').modal('hide');
        },
        deleteCoupon(){
            const vm = this;
            const id = vm.tempCoupon.id;
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${id}`;
            vm.isLoading = true;
            this.$http.delete(api).then(response => {
                console.log(response.data);
                // 注意：因為非同步event，getCoupons API要放在then裡面，執行緒才會在前一支API回傳之後
                vm.getCoupons();
                vm.isLoading = false;
            });
            $('#delCouponModal').modal('hide');
        },
        openModal(isNew, item){
            if(isNew){
                this.tempCoupon = {};
                this.isNew = true;
            }else{
                this.tempCoupon = item;
                this.isNew = false;
            }            
            $('#couponModal').modal('show');
        },
        openDelModal(isNew, item){
            this.isNew = false;
            this.tempCoupon = {...item};
            $('#delCouponModal').modal('show');
        },
    },
    components: {
        Pagination,
    },
    created(){
        this.getCoupons();
    }
}
</script>