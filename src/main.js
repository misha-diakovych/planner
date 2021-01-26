import Vue from 'vue'
import VueValidate from 'vuelidate'
import App from './App.vue'
import router from './router'
import store from './store/index'
import './registerServiceWorker'
import 'materialize-css/dist/js/materialize.min'
import tooltipDirective from './directives/tooltip.directive'
import dateFilter from './filters/date.filter'
import currencyFilter from './filters/currency.filter'
import localizeFilter from './filters/localize.filter'
import messagePlugin from '@/utils/message.plugin'
import titlePlugin from '@/utils/title.plugin'
import Loader from './components/app/Loader'
import VuePaginate from 'vuejs-paginate'
import VueMeta from 'vue-meta'

import firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/database';

Vue.config.productionTip = false;

Vue.use(VueMeta, {
    refreshOnceOnNavigation: true
})
Vue.use(VueValidate);
Vue.use(messagePlugin);
Vue.use(titlePlugin);
Vue.filter('date', dateFilter);
Vue.filter('currency', currencyFilter);
Vue.filter('localize', localizeFilter);
Vue.component('Loader', Loader);
Vue.component('paginate', VuePaginate);
Vue.directive('tooltip', tooltipDirective);


firebase.initializeApp( {
    databaseURL: "https://vue-planer-403ce-default-rtdb.firebaseio.com/",
    apiKey: "AIzaSyDZBwZ8hk8zm_1BhkyU_sJP2F9_HPybBdA",
    authDomain: "vue-planer-403ce.firebaseapp.com",
    projectId: "vue-planer-403ce",
    storageBucket: "vue-planer-403ce.appspot.com",
    messagingSenderId: "1085776268288",
    appId: "1:1085776268288:web:145f178ae90430bfcd9ce5"
});
let app;

firebase.auth().onAuthStateChanged(() => {
    if (!app) {
        app = new Vue({
            router,
            store,
            render: h => h(App)
        }).$mount('#app');
    }
});




