<script lang="ts" setup>
import { useAuthStore } from '../store/auth';
import { useForm } from 'vee-validate';
import * as Yup from 'yup';


export interface LoginForm {
    username: string;
    password: string;
}

const schema = Yup.object().shape({
          username: Yup.string()
              .required('username is required'),
          password: Yup.string()
              .min(4, 'Password must be at least 4 characters')
              .required('Password is required'),
            })

const { login } = useAuthStore();
const { handleSubmit, useFieldModel, errors } = useForm<LoginForm>({ initialValues: { username: "", password: "" },validationSchema:schema });
const [username, password] = useFieldModel(['username', 'password']);
const onSubmit = handleSubmit(login);
</script>

<template>
    <div class="area">

        <div class="h-screen min-h-screen max-h-screen bg-gradient-to-r from-cyan-500 to-blue-500 flex justify-center items-center p-4 ">
            <div class="bg-white w-full p-4 rounded-3xl shadow-2xl text-gray-700 sm:w-96 z-[999]">
                <div class="flex justify-end">

                </div>
                <div class="flex flex-row justify-between items-center">
                    <div>
                        <p class="text-left pb-2 text-base fontMain font-medium">เข้าสู่ระบบ</p>
                        <p class="text-right text-xl fontMain onlyCom7 font-semibold">Check List@Com7</p>
                    </div>
                    <lord-icon
                        src="https://cdn.lordicon.com/fihkmkwt.json"
                        trigger="loop"
                        delay="2000"
                        colors="primary:#002482,secondary:#3b82f6"
                        state="hover-jump-spin"
                        style="width:104px;height:104px">
                    </lord-icon>
                </div>

                <form @submit.prevent="onSubmit" class="my-6 sm:my-8">
                    <div class="pb-5">
                        <input v-model="username" type="text"
                            class="block w-full p-2 rounded-md border border-gray-300 shadow bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none hover:ring-2 hover:ring-blue-500 duration-300 fontMain inputlogin"
                            placeholder="ไอดีผู้ใช้งาน">
                        <span v-if="username != ''" class="text-sm text-rose-600">{{ errors.username }}</span>

                    </div>

                    <div class="pb-5">
                        <input v-model="password" type="password"
                            class="block w-full p-2 rounded-md border border-gray-300 shadow bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none hover:ring-2 hover:ring-blue-500 duration-300 fontMain inputlogin"
                            placeholder="รหัสผ่าน">
                        <span v-if="password != ''" class="text-sm text-rose-600">{{ errors.password }}</span>
                    </div>

                    <button :disabled='!username || !password' type="submit"
                        class="bg-blue-500 flex justify-center mt-2 p-2 text-white rounded btn-hover disabled:bg-gray-300 disabled:cursor-not-allowed">
                        <span class="z-[20]">เข้าสู่ระบบ</span>
                    </button>


                </form>
            </div>
        </div>
        <ul class="circles">
            <li class="rounded-full"></li>
            <li class="rounded-full"></li>
            <li class="rounded-full"></li>
            <li class="rounded-full"></li>
            <li class="rounded-full"></li>
            <li class="rounded-full"></li>
            <li class="rounded-full"></li>
            <li class="rounded-full"></li>
            <li class="rounded-full"></li>
            <li class="rounded-full"></li>
        </ul>
        
    
    </div>

</template>

<style>
@-webkit-keyframes criss-cross-left {
    0% {
        left: -20px;
    }

    50% {
        left: 50%;
        width: 20px;
        height: 20px;
    }

    100% {
        left: 50%;
        width: 375px;
        height: 375px;
    }
}

@keyframes criss-cross-left {
    0% {
        left: -20px;
    }

    50% {
        left: 50%;
        width: 20px;
        height: 20px;
    }

    100% {
        left: 50%;
        width: 375px;
        height: 375px;
    }
}

@-webkit-keyframes criss-cross-right {
    0% {
        right: -20px;
    }

    50% {
        right: 50%;
        width: 20px;
        height: 20px;
    }

    100% {
        right: 50%;
        width: 375px;
        height: 375px;
    }
}

@keyframes criss-cross-right {
    0% {
        right: -20px;
    }

    50% {
        right: 50%;
        width: 20px;
        height: 20px;
    }

    100% {
        right: 50%;
        width: 375px;
        height: 375px;
    }
}

.btn-hover {
    position: relative;
    width: 100%;
    color: #fff;
    border: 1px solid currentColor;
    overflow: hidden;
}

.btn-hover:before,
.btn-hover:after {
    position: absolute;
    top: 50%;
    content: "";
    width: 20px;
    height: 20px;
    background-color: #1d4ed8;
    opacity: 0.8;
    border-radius: 50%;
    visibility: hidden;

}

.btn-hover:before {
    left: -20px;
    transform: translate(-50%, -50%);
}

.btn-hover:after {
    right: -20px;
    transform: translate(50%, -50%);
}

.btn-hover:hover {
    color: #e4efcc;
}

.btn-hover:hover:before {
    visibility: initial;
    -webkit-animation: criss-cross-left 0.8s both;
    animation: criss-cross-left 0.8s both;
    -webkit-animation-direction: alternate;
    animation-direction: alternate;
}

.btn-hover:hover:after {
    visibility: initial;

    -webkit-animation: criss-cross-right 0.8s both;
    animation: criss-cross-right 0.8s both;
    -webkit-animation-direction: alternate;
    animation-direction: alternate;
}

.onlyCom7 {
    color: #3B82F6;
    font-style: normal;
}

.inputlogin {

    border-color: #D1D5DB;

}

.context {
    width: 100%;
    position: absolute;
    top: 50vh;

}

.context h1 {
    text-align: center;
    color: #fff;
    font-size: 50px;
}


.area {
    background: #166534;
    background: -webkit-linear-gradient(to left, #9afb8f, #48ed48);
    width: 100%;
    height: 100vh;


}

.circles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.circles li {
    position: absolute;
    display: block;
    list-style: none;
    width: 20px;
    height: 20px;
    background: rgba(255, 255, 255, 0.2);
    animation: animate 25s linear infinite;
    bottom: -150px;

}

.circles li:nth-child(1) {
    left: 25%;
    width: 80px;
    height: 80px;
    animation-delay: 0s;

}


.circles li:nth-child(2) {
    left: 10%;
    width: 20px;
    height: 20px;
    animation-delay: 2s;
    animation-duration: 12s;


}

.circles li:nth-child(3) {
    left: 70%;
    width: 20px;
    height: 20px;
    animation-delay: 4s;


}

.circles li:nth-child(4) {
    left: 40%;
    width: 60px;
    height: 60px;
    animation-delay: 0s;
    animation-duration: 18s;


}

.circles li:nth-child(5) {
    left: 65%;
    width: 20px;
    height: 20px;
    animation-delay: 0s;


}

.circles li:nth-child(6) {
    left: 75%;
    width: 110px;
    height: 110px;
    animation-delay: 3s;


}

.circles li:nth-child(7) {
    left: 35%;
    width: 150px;
    height: 150px;
    animation-delay: 7s;


}

.circles li:nth-child(8) {
    left: 50%;
    width: 25px;
    height: 25px;
    animation-delay: 15s;
    animation-duration: 45s;


}

.circles li:nth-child(9) {
    left: 20%;
    width: 15px;
    height: 15px;
    animation-delay: 2s;
    animation-duration: 35s;


}

.circles li:nth-child(10) {
    left: 85%;
    width: 150px;
    height: 150px;
    animation-delay: 0s;
    animation-duration: 11s;

}



@keyframes animate {

    0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
        -webkit-box-shadow: 0 20px 30px rgba(0, 0, 0, 0.2),
            inset 0px 10px 30px 5px #3B82F6;
        -moz-box-shadow: 0 20px 30px #1e3a8a,
            inset 0px 10px 30px 5px #3B82F6;
        box-shadow: 0 20px 30px #1e3a8a,
            inset 0px 10px 30px 5px #3B82F6;

        background: radian-gradient(center,
                ellipse cover,
                rgba(255, 255, 255, 0.5) 0%,
                rgba(255, 255, 255, 0) 70%);
    }

    100% {
        transform: translateY(-1000px) rotate(720deg);
        opacity: 0;
        background: -moz-radian-gradient(center,
                ellipse cover,
                rgba(255, 255, 255, 0.1)0%,
                rgba(255, 255, 255, 0) 70%);
        /* FF3.6+ */
        background: -webkit-gradient(radial,
                center center,
                0px,
                center center,
                100%,
                color-stop(0%, rgba(255, 255, 255, 0.1)),
                color-stop(70%, rgba(255, 255, 255, 0)));
        /* Chrome,Safari4+ */
        background: -webkit-radian-gradient(center,
                ellipse cover,
                rgba(255, 255, 255, 0.1) 0%,
                rgba(255, 255, 255, 0) 70%);
        /* Chrome10+,Safari5.1+ */
        background: -o-radian-gradient(center,
                ellipse cover,
                rgba(255, 255, 255, 0.1) 0%,
                rgba(255, 255, 255, 0) 70%);
        /* Opera 12+ */
        background: -ms-radian-gradient(center,
                ellipse cover,
                rgba(255, 255, 255, 0.1) 0%,
                rgba(255, 255, 255, 0) 70%);
        /* IE10+ */
        background: radian-gradient(ellipse at center,
                rgba(255, 255, 255, 0.1) 0%,
                rgba(255, 255, 255, 0) 70%);
        /* W3C */
        filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#3B82F6', endColorstr='#1d4ed8', GradientType=1);
        /* IE6-9 fallback on horizontal gradient */
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;


        -webkit-box-shadow: 0 20px 30px rgba(0, 0, 0, 0.2),
            inset 0px 10px 30px 5px rgba(255, 255, 255, 1);
        -moz-box-shadow: 0 20px 30px rgba(0, 0, 0, 0.2),
            inset 0px 10px 30px 5px rgba(255, 255, 255, 1);
        box-shadow: 0 20px 30px rgba(0, 0, 0, 0.2),
            inset 0px 10px 30px 5px rgba(255, 255, 255, 1);
    }

}
</style>