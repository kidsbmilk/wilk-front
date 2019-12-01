<style>
body {
    font-family: Helvetica, sans-serif;
}
.iconClassRoot {
    width: 15px;
    height: 15px;
    display: inline-block;
    background: url("images/root.png") no-repeat center/100% auto;
}
.iconClassNode {
    width: 15px;
    height: 15px;
    display: inline-block;
    background: url("images/node.png") no-repeat center/100% auto;
}
.operate {
    display: flex;
}
.operate ul > li {
    float: left;
    margin: 10px 10px;
    list-style-type: none;
}
</style>
<template>
    <div v-if='ztreeDataSourceList.length>0' @contextmenu="showMenu">
        <vue-context-menu :contextMenuData="contextMenuData"
						@newServer="newServer" @freshTreeHere="freshTreeHere">
					</vue-context-menu>
        <vue-ztree :list.sync='ztreeDataSourceList' :contextmenu='contextmenuClick' :addNode2="addNode2" :func='nodeClick' :is-open='true'
            :is-check='false' ></vue-ztree>
    </div>
</template>

<script>
import vueZtree from './vue-ztree.vue'
export default {
    name: 'TreePage',
  data () {
    return {
      msg: 'Hello Vue-Ztree-2.0!',
      ztreeDataSource:[],
      dataList:[],
      treeDeepCopy:[],
      parentNodeModel:[],//当前点击节点父亲对象
      nodeModel:null, // 当前点击节点对象
    //   ztreeDataSourceList:[{
    //       // 这部分传成json就可以了。
    //       id:880,
    //       name:"测试环境1",
    //       iconClass:"iconClassRoot",
    //       open:true,
    //       parentId:0,
    //       children:[{
    //         id:881,
    //         name:"c3-miui-ad-traffic00.bj",
    //         parentId:880,
    //         iconClass:"iconClassNode",
    //       },{
    //         id:882,
    //         name:"mysql -h 10.118.22.101 -umiui_ad_sched_wr -pg0R6bg3hpL1bg7I371jYyyoL5014Baeb --default-character-set=utf8 -D miui_ad_schedule",
    //         parentId:880,
    //         iconClass:"iconClassNode",
    //       }]
    //   },{
    //       id:990,
    //       name:"测试环境2",
    //       iconClass:"iconClassRoot",
    //       open:true,
    //       parentId:0,
    //       children:[{
    //           id:991,
    //           name:"c3-miui-ad-traffic00",
    //           parentId:990,
    //           iconClass:"iconClassNode",
    //       },{
    //           id:992,
    //           name:"cd /home/rd/wangming1/miui-ad-schedule-web",
    //           parentId:990,
    //           iconClass:"iconClassNode",
    //       }]
    //   },
    //   {
    //       id:993,
    //       name:"测试环境3",
    //       iconClass:"iconClassRoot",
    //       open:true,
    //       parentId:0,
    //       children:[{
    //           id:996,
    //           name:"c4-miui-ad-sup17.bj",
    //           parentId:993,
    //           iconClass:"iconClassNode",
    //       },{
    //           id:997,
    //           name:"cd /home/work/log/miui-ad-schedule-web",
    //           parentId:993,
    //           iconClass:"iconClassNode",
    //       }]
    //   }],
      contextMenuData: {
        // the contextmenu name(@1.4.1 updated)
          menuName: 'demo',
        // The coordinates of the display(菜单显示的位置)
          axis: {
            x: null,
            y: null
          },
        // Menu options (菜单选项)
          menulists: [
            {
              fnHandler: 'newServer', // Binding events(绑定事件)
              icoName: 'fa fa-home fa-fw', // icon (icon图标 )
              btnName: '新建环境' // The name of the menu option (菜单名称)
            },
            {
              fnHandler: 'freshTreeHere', // Binding events(绑定事件)
              icoName: 'fa fa-home fa-fw', // icon (icon图标 )
              btnName: '刷新' // The name of the menu option (菜单名称)
            },
          ]
        }
    }
  },
  props: {
      mytree: {
          type: Function,
          default: null
      },
      showAdd: {
          type: Function,
          default: null
      },
      showAddCmdFunc: {
          type: Function,
          default: null
      },
      ztreeDataSourceList: {
          type: Array,
          required: true
      },
      freshTree: {
          type: Function,
          default: null
      }
  },
  methods: {
    navigateClick:function(index,item){
        // 递归
        var recurFunc = (data,list) => {
            data.forEach((i)=>{
                if(i.id==item.id){
                  i.clickNode = true;
                  this.nodeModel = i;
                  this.parentNodeModel = data;
                }else {
                  i.clickNode = false;
                }

                if(i.children){
                   recurFunc(i.children,i);
                }
            });
        }
        recurFunc(this.treeDeepCopy, this.treeDeepCopy);
        
        
        // 导航
        var self = this;
        for(var i=0;i<self.dataList.length;i++){
            if(index == i){
                self.dataList[i].clickNode = true
            }else{
                self.dataList[i].clickNode = false
            }
        }
        self.dataList.splice(index+1,self.dataList.length - (index+1))

       this.ztreeDataSource = this.treeDeepCopy
    },
    findById:function(data,parentId) {
        var vm =this;

        for(var i = 0;i<data.length;i++){
            if (parentId == data[i].id){
                vm.dataList.push(data[i]);
                vm.findById(vm.ztreeDataSource, data[i].parentId)
                return data[i]
            }

            if (data[i].hasOwnProperty('children')){
                vm.findById(data[i].children,parentId)
            }
        }
    },
    // 点击节点
    nodeClick:function(m, parent, trees){
        this.showAdd(false);
        this.showAddCmdFunc(false, null);
        if(parent.name == undefined) {
            console.log('父节点')
            return ;
        }
    //    console.log(parent.name);
       console.log(m.name);
       console.log(m.id);
       this.mytree("ZTREE_CMD_" + m.id) // 这个一定要加this。
    },
    // 右击事件
    contextmenuClick:function(m){
       console.log("右击");
    //    console.log(event.target);
    //    console.log("触发了自定义的contextmenuClick事件");
    //    alert("触发了自定义");
        this.showAdd(false);
        this.showAddCmdFunc(false, null);
    },
    showMenu () {
        event.preventDefault()
        var x = event.clientX
        var y = event.clientY
        // Get the current location
        this.contextMenuData.axis = {
          x, y
        }
    },
    newServer () {
      	this.showAdd(true);
    },
    addNode2(nodeModel) {
        console.log("test2");
        this.showAddCmdFunc(true, nodeModel);
    },
    freshTreeHere () {
        console.log("freshTreeHere");
        this.freshTree();
    }
  },
  components:{
    vueZtree
  }
}
</script>
