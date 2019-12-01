<template>
    <div class="textarea"
         v-html="innerText"
         contenteditable="true"
         @focus="isLocked = true"
         @blur="isLocked = false"
         @input="changeText">
    </div>
</template>
<script type="text/ecmascript-6">
    export default{
        name: 'editDiv',
        props: {
            value: {
                type: String,
                default: ''
            }
        },
        data(){
            return {
                innerText: this.value,
                isLocked: false
            }
        },
        watch: {
            'value'(){
                if (!this.isLocked || !this.innerText) {
                    this.innerText = this.value;
                }
            }
        },
        methods: {
            changeText(){
                this.$emit('input', this.$el.innerHTML);
            }
        }
    }
</script>
<style>
	@import 'css/MainPage.css';
</style>
<!-- 
说明：代码来自：https://segmentfault.com/a/1190000008261449，
但是user-modify: read-write-plaintext-only;识别不了， 
我直接在div里固定为contenteditable="true"，然后把不需要的删除，
已经满足我的需求了：div实现可自动调整高度的输入框，同时可绑定数据
-->