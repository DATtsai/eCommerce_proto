<template id="pagination">
    <div>
        <!-- 頁碼換頁模版 -->
        <nav aria-label="Page navigation example">
            <ul class="pagination">
                <li class="page-item" :class="{'disabled': !propPagination.has_pre }">
                <a class="page-link" href="#" aria-label="Previous" @click.prevent="emitPage(propPagination.current_page - 1)">
                    <span aria-hidden="true">&laquo;</span>
                </a>
                </li>
                <li class="page-item" v-for="page in propPagination.total_pages" :key="page" :class="{'active': propPagination.current_page === page}">
                <a class="page-link" href="#" @click.prevent="emitPage(page)">{{ page }}</a>
                </li>
                <li class="page-item" :class="{'disabled': !propPagination.has_next }">
                <a class="page-link" href="#" aria-label="Next" @click.prevent="emitPage(propPagination.current_page + 1)">
                    <span aria-hidden="true">&raquo;</span>
                </a>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script>
export default {
    // export default可將元件資訊輸出為物件，供後續實際註冊時使用
    
    // name非為必要屬性，盡量命名與元件名稱相同，可協助用 Vue 開發者工具中，元件名稱能正確與元件對應，方便除錯時辨識每個元件名稱
    // name: 'Pagination',
    props: ['propPagination'],

    // props可用更嚴格的型別檢查
    // props: {
    //     propPagination: {
    //         type: Object,
    //         required: true,
    //     }
    // },
    // vue cli編譯，可把單個vue檔案的template自動放入template屬性後輸出
    // template: '#pagination',
    methods:{
        // 向父元件傳遞資料：觸發事件'page'+傳遞資料page
        emitPage(page = 1){
            this.$emit('page', page);
        },
    },
}
</script>