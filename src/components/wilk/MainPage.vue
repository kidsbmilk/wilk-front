<template>
    <div id="mainPage">
		<div>
			<div class='terminal-div'>
        		<div id='terminal'></div>
			</div>
			<div class='tree-div'>
				<tree-page :mytree="mytree" :showAdd="showAdd" :showAddCmdFunc="showAddCmdFunc" :delCmdFunc="delCmdFunc" :freshTree="freshTree" v-bind:ztreeDataSourceList="ztreeDataSourceList"></tree-page>
				<el-button v-if="isShowAddButton" @click="handleAddServerButton" size="small" type="primary">添加服务器</el-button>
				<div v-if="showAddfolder" class = "add-server-div">
					<input class="create-server-input" ref='serverName' placeholder="请输入服务器名，作为文件夹，不能重复" maxlength="255">
					<input class="create-server-input" ref='serverValue' placeholder="请输入服务器值，作为第一条命令" maxlength="255">
					<button v-on:click="addServer">确定</button>
					<button v-on:click="cancel">取消</button>
					<span> {{message}} </span>
				</div>
				<div v-if="showAddCmd" class = "add-cmd-div">
					<input class="create-server-input" ref='name' placeholder="请输入命令名" maxlength="255">
					<input class="create-server-input" ref='value' placeholder="请输入命令内容" maxlength="255">
					<input class="create-server-input" ref='describtion' placeholder="请输入命令描述" maxlength="255">
					<div class='create-user-select'>
						<span>命令类型: </span>
						<select ref='cmdType'>
							<option value = '0'>普通命令</option>
							<option value = '1'>服务器地址</option>
						</select>
					</div>
					<button v-on:click="addCmd">增加命令</button>
					<button v-on:click="cancelCmd">取消</button>
					<br>
					<span> {{message}} </span>
				</div>
			</div>
			<div class = "file-div" v-show="showFile">
				<el-form :model="form">
					<div  v-show="showFileDownload">
						<div v-show="showFileDownloadInput">
							<el-form-item label="请输入文件名" required>
								<el-input v-model="form.fileName" auto-complete="off" class="el-col-width" required></el-input>
							</el-form-item>
						</div>
						<el-form-item>
							<el-button size="small" type="primary" @click="handleDownLoad">下载</el-button>
						</el-form-item>
					</div>
					<div  v-show="showFileUpload">
						<el-form-item>
							<!-- 目前一次仅让上传一个文件 TODO. -->
							<el-upload class="upload-demo" :action="uploadUrl" :before-upload="handleBeforeUpload"
							:on-error="handleUploadError" :before-remove="beforeRemove" multiple :limit="1" 
							:on-exceed="handleExceed" :file-list="fileList" :on-success="handleUploadSuccess" >
								<el-button ref="uploadButton" size="small" type="primary" @click="submitUpload">点击上传</el-button>
								<!-- <div slot="tip" class="el-upload__tip">一次文件不超过50MB</div> -->
							</el-upload>
						</el-form-item>
					</div>
				</el-form>
    		</div>
		</div>
	</div>
</template>

<script>
import { Terminal } from 'xterm'
import * as fit from 'xterm/lib/addons/fit/fit'
import * as attach from 'xterm/lib/addons/attach/attach'
import 'xterm/dist/xterm.css'
import treePage from './TreePage.vue'
import ElementUI from 'element-ui' //element-ui的全部组件
import 'element-ui/lib/theme-chalk/index.css'//element-ui的css
import Vue from 'vue'

Vue.use(ElementUI) //使用elementUI

Terminal.applyAddon(fit)
Terminal.applyAddon(attach)
var term = null;
var ws = null;
var nodeModelTp = null;
var wsGlobal = null;
var INNER_CMD_PREFIX = "WILK_IN_";
var lastCmdHistory = null;

// https://www.cnblogs.com/freefei/p/8976802.html

export default {
	name: 'MainPage',
	components: { treePage },
	data() {
		// return {
		// 	form: {
		// 		fileName: '',
		// 	},
		// 	uploadUrl: '/wilk/file/upload',
		// 	fileList: [],
		// 	showAddfolder: false,
		// 	showAddCmd: false,
		// 	showFile: true,
		// 	showFileDownloadInput: false,
		// 	showFileDownload: false,
		// 	showFileUpload: false,
		// 	isShowAddButton: false,
		// 	message: '',
		// 	msg: 'Hello Vue-Ztree-2.0!',
		// 	ztreeDataSourceList:[{
		// 		// 这部分传成json就可以了。
		// 		id:880,
		// 		name:"测试环境1",
		// 		iconClass:"iconClassRoot",
		// 		open:true,
		// 		parentId:0,
		// 		children:[{
		// 			id:881,
		// 			name:"c3-miui-ad-traffic00.bj",
		// 			parentId:880,
		// 			iconClass:"iconClassNode",
		// 		},{
		// 			id:882,
		// 			name:"mysql -h 10.118.22.101 -umiui_ad_sched_wr -pg0R6bg3hpL1bg7I371jYyyoL5014Baeb --default-character-set=utf8 -D miui_ad_schedule",
		// 			parentId:880,
		// 			iconClass:"iconClassNode",
		// 		}]
		// 	},{
		// 		id:990,
		// 		name:"测试环境2",
		// 		iconClass:"iconClassRoot",
		// 		open:true,
		// 		parentId:0,
		// 		children:[{
		// 			id:991,
		// 			name:"c3-miui-ad-traffic00",
		// 			parentId:990,
		// 			iconClass:"iconClassNode",
		// 		},{
		// 			id:992,
		// 			name:"cd /home/rd/wangming1/miui-ad-schedule-web",
		// 			parentId:990,
		// 			iconClass:"iconClassNode",
		// 		}]
		// 	},
		// 	{
		// 		id:993,
		// 		name:"测试环境3",
		// 		iconClass:"iconClassRoot",
		// 		open:true,
		// 		parentId:0,
		// 		children:[{
		// 			id:996,
		// 			name:"c4-miui-ad-sup17.bj",
		// 			parentId:993,
		// 			iconClass:"iconClassNode",
		// 		},{
		// 			id:997,
		// 			name:"cd /home/work/log/miui-ad-schedule-web",
		// 			parentId:993,
		// 			iconClass:"iconClassNode",
		// 		}]
		// 	}]
		// }
		return {
			form: {
				fileName: '',
			},
			uploadUrl: '/wilk/file/upload',
			fileList: [],
			showAddfolder: false,
			showAddCmd: false,
			showFile: true,
			showFileDownloadInput: false,
			showFileDownload: false,
			showFileUpload: false,
			isShowAddButton: false,
			message: '',
			msg: 'Hello Vue-Ztree-2.0!',
			ztreeDataSourceList:[]
		}
	},
	// watch: {
    //   showFile(val, oldVal) {
	// 	  if (!oldVal && val) {
	// 		  this.uploadFunc(); // 这个调用在mounted的ws下也不行
	// 	  }
    //   }
    // },
	methods: {
		solveLoginRedirection(res) {
			console.log("solve redict: " + res.data);
			if (res != null && res.data.code != 0 && res.data.desc == 'login') {
				this.$cookies.set('status', null);
				term = null;
				this.$router.push('/loginpage');
            }
		},
		handleDownLoad() {
			// window.location.href = '/wilk/file/download?fileName=' + this.form.fileName;
			// 判断文件名是否为空，弹窗提示 TODO.
			this.$axios({
				method: 'get',
				url: '/file/download?fileName=' + this.form.fileName,
				responseType: 'blob'
			})
			.then((res) => {
				this.solveLoginRedirection(res);
				var blob = new Blob([res.data])
				var downloadElement = document.createElement('a');
				var href = window.URL.createObjectURL(blob); //创建下载的链接
				downloadElement.href = href;
				downloadElement.download = this.form.fileName; //下载后文件名
				document.body.appendChild(downloadElement);
				downloadElement.click(); //点击下载
				document.body.removeChild(downloadElement); //下载完成移除元素
				window.URL.revokeObjectURL(href); //释放掉blob对象 
				wsGlobal.send(INNER_CMD_PREFIX + "wilkget done " + this.form.fileName);
				this.form.fileName = '';
				this.showFileDownload = false;
			})
			.catch((res) => {
				this.showFileDownload = false;
				console.log(res.data);
			});
		},
		handleExceed(files, fileList) {
			this.$message.warning(`当前限制选择1个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
		},
		beforeRemove(file, fileList) {
			return this.$confirm(`确定移除 ${ file.name }？`);
		},
		handleUploadError(error, file) {
			this.$notify.error({
						title: 'error',
						message: '上传出错:' +  error,
						type: 'error',
						position: 'bottom-right'
			})
		},
		handleBeforeUpload(file) {
			this.uploadUrl ='/wilk/file/upload';
		},
		submitUpload() {
			this.showFileUpload = false;
		},
		handleUploadSuccess(response, file, fileList) { // 目前一次仅让上传一个文件 TODO.
		 	// 缓存接口调用所需的文件路径
			console.log('文件上传成功');
			wsGlobal.send(INNER_CMD_PREFIX + "wilkput " + file.name);
			this.showFileUpload = false;
			this.form.fileName = '';
			this.fileList = [];
	 	},
		mytree(str) {
			console.log("mytree");
			ws.send(str);
		},
		handleAddServerButton() {
			this.isShowAddButton = false;
			this.showAdd(true);
		},
		showAdd(isShow) {
			this.showAddfolder = isShow;
		},
		showAddCmdFunc(isShow, nodeModel) {
			console.log("showAddCmdFunc");
			this.showAddCmd = isShow;
			nodeModelTp = nodeModel;
		},
		delCmdFunc(isChildren, nodeId, parentId) {
			console.log("delCmdFunc: nodeId: " + nodeId + "parentId: " + parentId);
			var data = new URLSearchParams();
			var url = "";
			if (isChildren) {
				url = "/wilk/cmd/delete";
				data.append("cmdId", nodeId);
				data.append("serverId", parentId);
			} else {
				url = "/wilk/server/delete";
				data.append("serverId", nodeId);
			}
            this.$axios.post(
                url,
                data
            )
            .then((res) => {
				this.solveLoginRedirection(res);
				this.message = res.data.result;
				this.freshTree();
            })
            .catch((res) => {
                console.log(res.data.result)
            })
		},
		addServer() {
			console.log("add server");
            if(this.$refs.serverName.value == "") {
                this.message = "命令名不能为空";
                return ;
            }
            if(this.$refs.serverValue.value == "") {
                this.message = "命令内容不能为空";
                return ;
            }
            var data = new URLSearchParams();
            data.append("serverName", this.$refs.serverName.value);
            data.append("serverValue", this.$refs.serverValue.value);
            this.$axios.post(
                '/wilk/server/add',
                data
            )
            .then((res) => {
				this.solveLoginRedirection(res);
				this.message = res.data.result;
				this.showAddfolder = false;
				this.freshTree();
            })
            .catch((res) => {
                console.log(res.data.result)
            })
		},
		addCmd() {
			if(nodeModelTp != null) {
				console.log(nodeModelTp.id);
			}
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
			data.append("cmdType", parseInt(this.$refs.cmdType.value));
			data.append("serverId", nodeModelTp.id);
            this.$axios.post(
                '/wilk/cmd/add',
                data
            )
            .then((res) => {
				this.solveLoginRedirection(res);
				this.message = res.data.result;
				this.showAddCmd = false;
				this.freshTree();
            })
            .catch((res) => {
                console.log(res.data.result)
            })
        },
		cancel() {
			this.showAddfolder = false;
			this.isShowAddButton = true;
		},
		cancelCmd() {
			this.showAddCmd = false;
		},
		freshTree() {
			// 所有请求都在调用前先判断登录标记是否已invalid，我这个项目的前端请求封装不好 TODO.
			// this.uploadFunc(); // 这个倒是可以，只是放mounted里的ws下就调用不了了。
			console.log("freshTree");
			this.$axios.get("/wilk/server/getserverandcmd")
			.then((res) => {
				console.log(res);
				this.solveLoginRedirection(res);
				if (res.data.result.length == 0) {
					this.isShowAddButton = true;
				} else {
					this.ztreeDataSourceList = res.data.result;
				}
				if (term === null) {
					this.initTerminal();
				}
			})
			.catch((res) => {
				console.log(res.data);
			});
		},
		uploadFunc() {
			console.log("click upload");
			// this.$refs.uploadButton.$emit('click'); // 这个应该是针对一般控件的
			this.$refs.uploadButton.$el.click(); // 这个是针对element-ui控件的
		},
		initTerminal() {
			// 用户打开某服务器后，websocket会有定期保活的功能。
			// 如果用户登录了，但是一直没打开服务器，则过段时间，websocket可能会断开，
			// 要做下防护措施。可以在ws的关闭方法中，再次打开websocket。
			// 也可以在用户发信息前先判断服务器有没有断开，如果断开了，则重连。TODO.
			let that = this;
			term = new Terminal({cols: 100,
						rows: 42,
						cursorBlink: 5,
						scrollback: 1000,
						tabStopWidth: 4,
						// fontSize: 12
					});
			ws = new WebSocket("ws://localhost/wilk/websocket");
			wsGlobal = ws;
			ws.onopen = function(event) {
				term.open(document.getElementById('terminal'));
				term.fit();
				// 如果是组装命令，可以用JSON.stringify来分隔命令跟参数，后端容易做判断。TODO.
				ws.onerror = function() {
					console.log('connect error.');
				}
				ws.onmessage = function(event) {
					// console.log("click upload");
					// // this.$refs.uploadButton.$emit('click'); // 这个应该是针对一般控件的
					// this.$refs.uploadButton.$el.click(); // 这个是针对element-ui控件的
					// console.log('on message:', event.data);
					if (event.data == 'wilk-login-success') {
						ws.send(INNER_CMD_PREFIX + 'stty cols ' + term.cols + '; stty rows ' + term.rows + '\r');
					} else if (event.data.split(" ").length == 2 && event.data.split(" ")[0] == 'BTOF' && event.data.split(" ")[1] == 'wilkput') {
						// that.uploadFunc(); // 这种方式不行 TODO.
						// 目前不能直接在ws里调用弹出上传文件的窗口，只能是显示上传按钮，用户再自己点击一下了。
						that.showFileUpload = true;
						// document.getElementById("btid").click();
					} else if (event.data.split(" ").length == 3 && event.data.split(" ")[0] == 'BTOF' && event.data.split(" ")[1] == 'wilkget') {
						that.form.fileName = event.data.split(" ")[2];
						that.showFileDownload = true;
					} else {
						term.write(event.data);
						lastCmdHistory = event.data;
					}
				}
				term.textarea.onkeydown = function(e) {
					// https://www.cnblogs.com/gygg/p/11359598.html
					// https://zhidao.baidu.com/question/6865495.html
					// http://www.51hei.com/bbs/dpj-139731-1.html
					if(e.keyCode == 13) { // Enter，这个也是上下键选择的下载，之前用history方式记录了，得优化一下 TODO.
						if (lastCmdHistory == 'wilkput') {
							ws.send(INNER_CMD_PREFIX + 'history_wilkput');
						} else if (lastCmdHistory.split(" ").length == 2 && lastCmdHistory.split(" ")[0] == 'wilkget') {
							ws.send(INNER_CMD_PREFIX + 'history_wilkget_' + lastCmdHistory);
						}
					}
				}
				term.on('data',function(data){
					console.log('data =>', data);
					ws.send(data.toString());
				});
				// 不用看最开始设置的cols为100，这里实际值可能不是100。
				term.on('resize', size => {
					ws.send(INNER_CMD_PREFIX + 'stty cols ' + size.cols + '; stty rows ' + size.rows + '\r');
					console.log('resize', [size.cols, size.rows]);
				});
			}
		}
	},
	mounted() {
		document.title = "wilk主页";
		// 因为没有退出并清cookies的操作，所以下面的判断目前没用
		if (!this.$cookies.isKey('status') || this.$cookies.get('status') !== 'logined') {
			this.$router.replace('/loginpage');
		} else {
			this.freshTree(); // 这个请求会对返回进行处理，如果没登录就跳到登录页
		}
	}
}
</script>

<style>
	@import 'css/MainPage.css';
</style>


