import Vue from 'vue';
import ElementUI from 'element-ui';

// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor';

import 'element-ui/lib/theme-chalk/index.css';
import treeTbable from 'vue-table-with-tree-grid';
import App from './App.vue';
import router from './router';
import './assets/css/globol.less';
import myaxios from './utils/myaxios';
import './filters/timeFilters';

// 富文本编辑器
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.prototype.$http = myaxios;
Vue.component('tree-table', treeTbable);
Vue.use(VueQuillEditor);

new Vue({
    router,
    render: (h) => h(App),
}).$mount('#app');