<template>
    <div id="mainPage">
        <!-- <input style="background:transparent;border:1px solid #ffffff" >  -->
        <!-- <input value="Type here" NAME="user_pass" TYPE="text" SIZE="29" onmouseover="this.style.borderColor='black';this.style.backgroundColor='plum'" style="width: 106; height: 21" onmouseout="this.style.borderColor='black';this.style.backgroundColor='#ffffff';this.stype.border-width:'1px';this.border-color:'black'" > -->
        <div class="input" display="block">
            <input class="create-user-input" ref='name' placeholder="请输入命令名" maxlength="255">
            <input class="create-user-input" ref='value' placeholder="请输入命令内容" maxlength="255">
            <input class="create-user-input" ref='describtion' placeholder="请输入命令描述" maxlength="255">
            <div class='create-user-select'>
                <span>命令类型: </span>
                <select ref='cmdTypeId'>
                    <option value = '1'>服务器</option>
                    <option vlaue = '2'>目录</option>
                </select>
            </div>
            <button v-on:click="register">增加命令</button>
            <br>
            <span> {{message}} </span>
        </div>
    </div>
</template>

<script>
import { getCookie } from './js/cookie.js'

export default {
    name: 'AddCmdPage',
    components: {},
    data() {
        return {
            message: ''
        }
    },
    withCredentials: true,
    methods: {
        register() {
            this.message = getCookie("status");
            if(this.$refs.name.value == "") {
                this.message = "命令名不能为空";
                return ;
            }
            if(this.$refs.value.value == "") {
                this.message = "命令内容不能为空";
                return ;
            }
            var data = new URLSearchParams();
            data.append("name", this.$refs.name.value);
            data.append("value", this.$refs.value.value);
            data.append("describtion", this.$refs.describtion.value);
            data.append("cmdTypeId", parseInt(this.$refs.cmdTypeId.value));
            this.$axios.post(
                '/cmd/add',
                data
                // {
                //     name: this.$refs.name.value,
                //     value: this.$refs.value.value,
                //     describtion: this.$refs.describtion.value,
                //     cmdTypeId: parseInt(this.$refs.cmdTypeId.value)
                // }
            )
            .then((res) => {
                this.message = res.data.result;
            })
            .catch((res) => {
                console.log(res.data.result)
            })
        }
    }
}
</script>

<style>
	@import 'css/MainPage.css';
</style>