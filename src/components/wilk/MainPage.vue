<template>
    <div id="mainPage">
		<div>
			<div class='terminal-div'>
        		<div id='terminal'></div>
			</div>
			<div class='tree-div'>
				<tree-page :mytree="mytree" :showAdd="showAdd" :showAddCmdFunc="showAddCmdFunc" :freshTree="freshTree" v-bind:ztreeDataSourceList="ztreeDataSourceList"></tree-page>
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
						<select ref='cmdTypeId'>
							<option value = '1'>普通命令</option>
							<option value = '2'>服务器地址</option>
						</select>
					</div>
					<button v-on:click="addCmd">增加命令</button>
					<button v-on:click="cancelCmd">取消</button>
					<br>
					<span> {{message}} </span>
				</div>
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

Terminal.applyAddon(fit)
Terminal.applyAddon(attach)
var term = new Terminal({cols: 100,
                  rows: 42,
                  cursorBlink: 5,
                  scrollback: 1000,
				  tabStopWidth: 4,
				  fontSize: 12
			  });
var ws = null;
var nodeModelTp = null;

// https://www.cnblogs.com/freefei/p/8976802.html

export default {
	name: 'MainPage',
	components: { treePage },
	data() {
		return {
			showAddfolder: false,
			showAddCmd: false,
			message: '',
			msg: 'Hello Vue-Ztree-2.0!',
			ztreeDataSourceList:[{
				// 这部分传成json就可以了。
				id:880,
				name:"测试环境1",
				iconClass:"iconClassRoot",
				open:true,
				parentId:0,
				children:[{
					id:881,
					name:"c3-miui-ad-traffic00.bj",
					parentId:880,
					iconClass:"iconClassNode",
				},{
					id:882,
					name:"mysql -h 10.118.22.101 -umiui_ad_sched_wr -pg0R6bg3hpL1bg7I371jYyyoL5014Baeb --default-character-set=utf8 -D miui_ad_schedule",
					parentId:880,
					iconClass:"iconClassNode",
				}]
			},{
				id:990,
				name:"测试环境2",
				iconClass:"iconClassRoot",
				open:true,
				parentId:0,
				children:[{
					id:991,
					name:"c3-miui-ad-traffic00",
					parentId:990,
					iconClass:"iconClassNode",
				},{
					id:992,
					name:"cd /home/rd/wangming1/miui-ad-schedule-web",
					parentId:990,
					iconClass:"iconClassNode",
				}]
			},
			{
				id:993,
				name:"测试环境3",
				iconClass:"iconClassRoot",
				open:true,
				parentId:0,
				children:[{
					id:996,
					name:"c4-miui-ad-sup17.bj",
					parentId:993,
					iconClass:"iconClassNode",
				},{
					id:997,
					name:"cd /home/work/log/miui-ad-schedule-web",
					parentId:993,
					iconClass:"iconClassNode",
				}]
			}]
		}
	},
	methods: {
		mytree(str) {
			console.log("mytree");
			ws.send(str);
		},
		showAdd(isShow) {
			this.showAddfolder = isShow;
		},
		showAddCmdFunc(isShow, nodeModel) {
			console.log("test3");
			this.showAddCmd = isShow;
			nodeModelTp = nodeModel;
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
                '/server/add',
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
			data.append("cmdTypeId", parseInt(this.$refs.cmdTypeId.value));
			data.append("serverId", nodeModelTp.id);
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
				this.showAddCmd = false;
				this.freshTree();
            })
            .catch((res) => {
                console.log(res.data.result)
            })
        },
		cancel() {
			this.showAddfolder = false;
		},
		cancelCmd() {
			this.showAddCmd = false;
		},
		freshTree() {
			console.log("freshTree");
			this.$axios.get("/server/getserverandcmd")
			.then((res) => {
				this.ztreeDataSourceList = JSON.parse(res.data.result);
			})
			.catch((res) => {
				console.log(res.data.result)
			})
		}
	},
	mounted() {
		// 从服务器获取数据，如果文件夹数量为0时，显示新增文件夹的窗口。
		// freshTree()
		this.$axios.get("/server/getserverandcmd")
		.then((res) => {
			this.ztreeDataSourceList = JSON.parse(res.data.result);
		})
		.catch((res) => {
			console.log(res.data.result)
		})
		// 
		term.open(document.getElementById('terminal'));
		ws = new WebSocket("ws://localhost/wilk/websocket");
		var tempMsg = "";
		ws.onerror = function() {
			console.log('connect error.');
		}
		ws.onmessage = function(event) {
			console.log('on message:', event.data);
			term.write(event.data);
		}
		ws.onopen = function() {
			console.log("ws onopen");
		}
		term.on('data',function(data){
			console.log('data =>', data)
			ws.send(data.toString());
		})
        term.on('resize', size => {
            ws.send('resize', [size.cols, size.rows]);
            console.log('resize', [size.cols, size.rows]);
		})  
	}
}
</script>

<style>
	@import 'css/MainPage.css';
</style>


