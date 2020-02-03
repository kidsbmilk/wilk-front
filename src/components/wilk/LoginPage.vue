<template>
    <div id="mainPage">
        <!-- <input style="background:transparent;border:1px solid #ffffff" >  -->
        <!-- <input value="Type here" NAME="user_pass" TYPE="text" SIZE="29" onmouseover="this.style.borderColor='black';this.style.backgroundColor='plum'" style="width: 106; height: 21" onmouseout="this.style.borderColor='black';this.style.backgroundColor='#ffffff';this.stype.border-width:'1px';this.border-color:'black'" > -->
        <div class="input" display="block">
            <input class="create-user-input" ref='username' placeholder="请输入用户名" maxlength="6">
            <input class="create-user-input" ref='password' type="password" placeholder="请输入密码" maxlength="6">
            <button v-on:click="register">登录</button>
            <br>
            <span> {{message}} </span>
        </div>
    </div>
</template>

<script>
import { hex_md5 } from './js/md5.js' // 这个必须加大括号才行
import { getCookie } from './js/cookie.js'

export default {
    name: 'LoginPage',
    components: {},
    data() {
        return {
            message: ''
        }
    },
    withCredentials: true,
    methods: {
        register() {
            if(this.$refs.username.value == "") {
                this.message = "用户名不能为空";
                return ;
            }
            if(this.$refs.password.value == "") {
                this.message = "密码不能为空";
                return ;
            }
            if(this.$refs.username.value == this.$refs.password.value) {
                this.message = "用户名与密码不能一致！"
                return ;
            }
            var data = new URLSearchParams();
            data.append("username", hex_md5(this.$refs.username.value + this.$refs.password.value));
            data.append("password", hex_md5(this.$refs.password.value + this.$refs.username.value));
            this.$axios.post('/loginUser', data)
            // this.$axios.get('/loginUser')
            .then((res) => {
                if(res.data.result == 'index') {
                    // this.$cookies.set('id', getCookie('id'), 30 * 60);
                    // this.$cookies.set('username', getCookie('username'), 30 * 60);
                    this.$cookies.set('status', getCookie('status'), 30 * 60);
                    this.$router.push('/mainpage');
                }
                this.message = res.data.result
            })
            .catch((res) => {
                console.log(res.data.result)
            })
        }
    },
    mounted() {
        document.title = "登录页";
        if (this.$cookies.get('status') === "logined") {
            document.title = "wilk主页";
            this.$router.push('/mainpage');
        }
    }
}
</script>

<style>
	@import 'css/MainPage.css';
</style>