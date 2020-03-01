<template>
    <div id="mainPage">
        <!-- <input style="background:transparent;border:1px solid #ffffff" >  -->
        <!-- <input value="Type here" NAME="user_pass" TYPE="text" SIZE="29" onmouseover="this.style.borderColor='black';this.style.backgroundColor='plum'" style="width: 106; height: 21" onmouseout="this.style.borderColor='black';this.style.backgroundColor='#ffffff';this.stype.border-width:'1px';this.border-color:'black'" > -->
        <div class="input" display="block">
            <input class="create-user-input" ref='username' placeholder="请输入用户名" maxlength="6">
            <input class="create-user-input" ref='password' type="password" placeholder="请输入密码" maxlength="6">
            <input class="create-user-input" ref='password2' type="password" placeholder="请再次输入密码" maxlength="6">
            <input class="create-user-input" ref='email' placeholder="请输入邮箱">
            <button v-on:click="register">注册用户</button>
            <br>
            <span> {{message}} </span>
        </div>
    </div>
</template>

<script>
import { hex_md5 } from './js/md5.js' // 这个必须加大括号才行
import { getCookie } from './js/cookie.js'

export default {
    name: 'RegisterPage',
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
            if(this.$refs.password.value != this.$refs.password2.value) {
                this.message = "密码不一致！"
                return ;
            }
            this.$axios.post('/user/register', {
                username: this.$refs.username.value,
                usernameMd5: hex_md5(this.$refs.username.value + this.$refs.password.value),
                password: hex_md5(this.$refs.password.value + this.$refs.username.value),
                email: this.$refs.email.value
            })
            .then((res) => {
                this.message = res.data.result
                if (res != null && res.data.code == 0) {
                    this.$router.replace('/loginpage');
                } else {
                    console.log(res);
                }
            })
            .catch((res) => {
                console.log(res);
            })
        }
    },
    mounted() {
        document.title = "注册页";
    }
}
</script>

<style>
	@import 'css/MainPage.css';
</style>