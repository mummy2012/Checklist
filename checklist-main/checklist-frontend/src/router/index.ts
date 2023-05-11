import { useAuthStore } from '../store/auth';
import { createRouter, createWebHistory, RouteRecordRaw} from 'vue-router';

const routes: Array<RouteRecordRaw> = [

    {
        path: '',
        name:  'home',
        component: ()=>import("../views/Home.vue")
    },
    {
        path: '/login',
        name: 'login',
        component: ()=>import("../views/Login.vue")
    },
    {
        path: '/BSM',
        name: 'bsm',
        component: ()=>import("../views/BSMcheck.vue")
    },
    {
        path: '/ASM',
        name: 'asm',
        component:()=>import("../views/ASMcheck.vue")
    },
    {
        path: '/RSM',
        name: 'rsm',
        component:()=>import("../views/RSMcheck.vue")
    },
    {
        path: '/Training',
        name: 'training',
        component:()=>import("../views/Trainingcheck.vue")
    },
    {
        path: '/history/:role/:id/:name',
        name: 'historybyid',
        component:()=>import("../views/ListHistory.vue")
    },
    {
        path: '/createform/:id',
        name: '/createformbyid',
        component:()=>import("../views/createform.vue")
    },
    {
        path: '/manageform',
        name: 'manageform',
        component:()=>import("../views/manageform.vue")
    },
    {
        path: '/manage/:id',
        name: 'managebyid',
        component:()=>import("../views/manage.vue")
    },
    {
        path: '/information/:role/:id/:docid',
        name: 'informationbyid',
        component:()=>import("../views/information.vue")
    },
    {
        path: '/editform/:id',
        name: 'editfrombyid',
        component:()=>import("../views/editform.vue")
    },

];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL as string), routes
});


// router.beforeEach(async(to,form,next)=>{
    // const userStore = useAuthStore();
    // const publicPage = ['/login'];
    // const authRequired = !publicPage.includes(to.path);
   
    // if(authRequired && !userStore.userData){
    //     userStore.returnUrl = to.fullPath;
    //     window.scrollTo({ top:0, behavior: 'smooth'})
    //     next({name:'login'});
    //     return
    // }
  

    // window.scroll({ top: 0, behavior: 'smooth'})
    // next();

// })

export default router;

