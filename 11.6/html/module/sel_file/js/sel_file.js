$(document).ready(function () {
    function trigger_callback(type, args){
        //var parent_window = jQuery.browser.msie ? parent.dialogArguments : parent.opener;
        var parent_window = parent.opener;
        if(typeof parent_window.Attch_select_callbacks == 'object' && (typeof parent_window.Attch_select_callbacks[type] == 'function' || typeof parent_window.Attch_select_callbacks[type] == 'object')){
            try
            {
               parent_window.Attch_select_callbacks[type](args);
            }
            catch(e)
            {

            }
        }
    }
    var ParentWindow=parent.opener.window;

    function arraySortByName(list) {
        if (list === undefined || list === null) return []
        list.sort(function(a, b){
            var strA = a.name;
            var strB = b.name;
            // 谁为非法值谁在前面
            if (strA === undefined || strA === null || strA === '' || strA === ' ' || strA === '　') {
                return -1
            }
            if (strB === undefined || strB === null || strB === '' || strB === ' ' || strB === '　') {
                return 1
            }
            // 如果a和b中全部都是汉字，或者全部都非汉字
            if ((strA.split('').every(function(element){notChinese(element)}) && strB.split('').every(function(element){notChinese(element)})) ||
                (strA.split('').every(function(element){!notChinese(element)}) && strB.split('').every(function(element){!notChinese(element)}))) {
                return strA.localeCompare(strB)
            } else {
                var charAry = strA.split('')
                for (var i in charAry) {
                    if ((charCompare(strA[i], strB[i]) !== 0)) {
                        return charCompare(strA[i], strB[i])
                    }
                }
                // 如果通过上面的循环对比还比不出来，就无解了，直接返回-1
                return -1
            }
        })
        return list
    }

    function charCompare(charA, charB) {
        // 谁为非法值谁在前面
        if (charA === undefined || charA === null || charA === '' || charA === ' ' || charA === '　') {
            return -1
        }
        if (charB === undefined || charB === null || charB === '' || charB === ' ' || charB === '　') {
            return 1
        }
        // 如果都为英文或者都为汉字则直接对比
        if ((notChinese(charA) && notChinese(charB)) || (!notChinese(charA) && !notChinese(charB))) {
            return charA.localeCompare(charB)
        } else {
            // 如果不都为英文或者汉字，就肯定有一个是英文，如果a是英文，返回-1，a在前，否则就是b是英文，b在前
            if (notChinese(charA)) {
                return -1
            }else {
                return 1
            }
        }
    }

    function notChinese(currentValue) {
        var charCode = currentValue.charCodeAt(0)
        return charCode >= 0 && charCode <= 128
    }



    var selectFile = {
        param: {

        },
        tree:null,
        otherTree:null,
        secondTree:null,
        fileNodes:[],//所有选中的附件
        searchData:[],//搜索框里面的所有附件
        fileNodes_id:[],//所有选中附件的id  数据
        fileNodes_name:[],//所有选中附件的name  数据
        dom_id:"",  //对应的dom 存储 id的元素
        dom_name:"",//对应的dom 显示name的元素
        currentTab:"#Personal", //当前的tab页
        dataList:[], //当前数据
        personalList:null, //个人文件
        publicList:null,//公共文件
        networkList:null,//网络硬盘
        urlInfo:{
            MULTI_SELECT:'',
            DIV_ID:'',
            DIR_FIELD:'',
            NAME_FIELD:'',
            TYPE_FIELD:'',
            DIR_ID:''
        },
        //寻找差异的数组
        compareArr:[],
        is_first:1,
        data:[],
        selectedList:null,
        changeId:'', //单一删除id
        delIds:[],//全部删除id数组
        init: function () {

            for(var key in _this.urlInfo){
                _this.urlInfo[key] = _this.getQueryString(key);
            }
            var dirList = ParentWindow.document.all(_this.urlInfo.DIR_ID).value.split("*");
            _this.selectedList = ParentWindow.document.all(_this.urlInfo.DIR_FIELD).value.split("*");
            _this.selectedList.splice(_this.selectedList.length-1, 1);
            dirList.splice(dirList.length-1, 1);
            var newList = [];
            for(var i=0;i<dirList.length;i++){
                if(dirList[i]!=""){
                    newList.push(dirList[i])
                }
            }
            for(var i=0;i<_this.selectedList.length;i++){
                if(_this.selectedList[i]!=""){
                    newList.push(_this.selectedList[i])
                }
            }

            _this.selectedList = newList;
            // return;
            this.bindEvents();

            this.getInfoList();
            // this.getHardInfoList();
        },
        //获取地址栏数据
        getQueryString : function(name){
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if(r!=null){
                return unescape(r[2]);
            }else{
                return null;
            }
        },
        changeDataList:function(type){
            // _this.dataList = type =='personal'?_this.personalList:_this.publicList;
            switch(type){
                case 'personal':
                    _this.dataList = _this.personalList;
                break;
                case 'public':
                    _this.dataList = _this.publicList;
                break;
                case 'network':
                    _this.dataList = _this.networkList;
                break;
            }
        },
        //id过滤
        filterArr:function(arr){
            var newArr = [];

            var i = arr.length-1; //初始时,最后位置保持不变　　
        　　while ( i> 0) {
        　　　　var pos= 0; //每趟开始时,无记录交换
        　　　　for (var j= 0; j< i; j++){
        　　　　　　if (arr[j].id> arr[j+1].id) {
        　　　　　　　　pos= j; //记录交换的位置
        　　　　　　　　var tmp = arr[j]; arr[j]=arr[j+1];arr[j+1]=tmp;
        　　　　　　}
        　　　　}
        　　　　i= pos; //为下一趟排序作准备
        　　}
        　　

            for(var i=0;i<arr.length;i++){
                if(newArr.indexOf(arr[i])==-1){
                    newArr.push(arr[i]);
                    for(var j=0;j<arr.length;j++){
                        if(arr[j].pid==arr[i].id){
                            newArr.push(arr[j]);
                        }else{
                            continue;
                        }
                    }
                }else{
                    continue;
                }
            }
            return newArr;
        },
        //获取文件数据
        getInfoList:function(){

            $.ajax({
                url:'/inc/file_folder.php',
                type:'POST',
                success:function(res){
                    res = JSON.parse(res);
                    _this.personalList = res.personal?res.personal:[];
                    _this.publicList = res.public?res.public:[];
                    var newPersonalData = $.extend([],_this.personalList);
                    var newPublicData = $.extend([],_this.publicList);
                    if(_this.personalList.length>0){
                        for(var i=0;i<_this.personalList.length;i++){
                            _this.personalList[i].is_folder==1?_this.personalList[i].iconSkin = "iconfont icon-wenjianjia ":null;
                            _this.personalList[i].is_folder==1?_this.personalList[i].open = false:null;
                            // _this.personalList[i].is_folder==0?_this.personalList[i].id = parseInt(_this.personalList[i].id+'000'):null;
                            _this.personalList[i].is_folder==0?_this.personalList[i].id = newPersonalData[i].attach_id:null;
                            _this.personalList[i].title = _this.personalList[i].name;
                            for(var j=0;j<_this.selectedList.length;j++){
                                if(_this.selectedList[j]==_this.personalList[i].attach_id){
                                    _this.fileNodes_id.push(_this.personalList[i].id);

                                }
                            }
                        }
                        // _this.personalList = _this.filterArr(_this.personalList);
                        // _this.personalList = arraySortByName(_this.personalList);
                        _this.personalList = _this.personalList.sort(function (a, b) {
                            return b.is_folder - a.is_folder;
                        });
                        _this.personalList = _this.personalList.sort(function (a, b) {
                            // 按楼层高度属性，进行排序
                            var param1 = a.sort_no;
                            var param2 = b.sort_no;
                            return param1 - param2;
                        });
						_this.dataList = _this.personalList;


                    }
                    if(_this.publicList.length>0){
                        for(var i=0;i<_this.publicList.length;i++){
                            _this.publicList[i].is_folder==1?_this.publicList[i].iconSkin = "iconfont icon-wenjianjia ":null;
                            _this.publicList[i].is_folder==1?_this.publicList[i].open = false:null;
                            // _this.publicList[i].is_folder==0?_this.publicList[i].id = parseInt(_this.publicList[i].id+'000'):null;
                            _this.publicList[i].is_folder==0?_this.publicList[i].id = newPublicData[i].attach_id:null;
                            _this.publicList[i].title = _this.publicList[i].name;
                            for(var j=0;j<_this.selectedList.length;j++){
                                if(_this.selectedList[j]==_this.publicList[i].attach_id){
                                    // _this.fileNodes.push(_this.publicList[i]);
                                    _this.fileNodes_id.push(_this.publicList[i].id);
                                }
                            }
                        }
                        // _this.publicList = _this.filterArr(_this.publicList);
                        // _this.publicList = arraySortByName(_this.publicList);
                        _this.publicList = _this.publicList.sort(function (a, b) {
                            // 按楼层高度属性，进行排序
                            return b.is_folder - a.is_folder;
                        });
                        _this.publicList = _this.publicList.sort(function (a, b) {
                            // 按楼层高度属性，进行排序
                            var param1 = a.sort_no;
                            var param2 = b.sort_no;
                            return param1 - param2;
                        });

                    }


                    $.ajax({
                        url:'/inc/netdisk_new.php',
                        type:'POST',
                        success:function(res){
                            res = JSON.parse(res);

                            _this.networkList = res?res:[];
                            var newData = $.extend([],_this.networkList);
                            if(_this.networkList.length>0){
                                for(var i=0;i<_this.networkList.length;i++){
                                    _this.networkList[i].id = _this.networkList[i].dir;
                                    _this.networkList[i].is_folder==1?_this.networkList[i].iconSkin = "iconfont icon-wenjianjia ":null;
                                    _this.networkList[i].is_folder==1?_this.networkList[i].open = false:null;
                                    _this.networkList[i].is_folder==0?_this.networkList[i].id = _this.networkList[i].id+'000':null;
                                    _this.networkList[i].title = _this.networkList[i].name;
                                    for(var j=0;j<_this.selectedList.length;j++){
                                        if(_this.selectedList[j]==newData[i].dir){
                                            _this.fileNodes_id.push(_this.networkList[i].id);
                                        }
                                    }
                                }
                                // _this.networkList = _this.filterArr(_this.networkList);



                                _this.data = _this.networkList;
                                _this.secondTree = _this.createOtherTreeInfo($(".tab-container"),setting,_this.networkList);
                                _this.is_first = false;
                                _this.tree = _this.secondTree;
                                if(_this.data.length>0){
                                        for(var j=0;j<_this.data.length;j++){
                                            for(var i=0;i<_this.fileNodes_id.length;i++){
                                                if(_this.fileNodes_id[i]==_this.data[j].id){
                                                    _this.data[j].check = true;
                                                    var treeNode = _this.secondTree.getNodeByParam("id", _this.data[j].id, null);

                                                    treeNode?_this.secondTree.checkNode(treeNode, true, true):null;
                                                    _this.fileNodes.push(treeNode);
                                                    if(treeNode.getParentNode()){
                                                        _this.renderSelectedParentNode(treeNode.getParentNode());
                                                    }
                                                }
                                            }
                                        }
                                }
                                _this.tree = null;
                                _this.is_first = 1;
                                // _this.secondTree = null;


                            }
                            _this.loadTree(_this.personalList,'personal');
                        },
                        error:function(err){
                        }
                    })


                },
                error:function(err){
                }
            })
        },
        getHardInfoList:function(){

            $.ajax({
                url:'/inc/netdisk_new.php',
                type:'POST',
                success:function(res){
                    res = JSON.parse(res);

                    _this.networkList = res?res:[];
                    var newData = $.extend([],_this.networkList);
                    if(_this.networkList.length>0){
                        for(var i=0;i<_this.networkList.length;i++){
                            _this.networkList[i].id = _this.networkList[i].name;
                            _this.networkList[i].is_folder==1?_this.networkList[i].iconSkin = "iconfont icon-wenjianjia ":null;
                            _this.networkList[i].is_folder==1?_this.networkList[i].open = false:null;
                            _this.networkList[i].is_folder==0?_this.networkList[i].id = _this.networkList[i].id+'000':null;
                            _this.networkList[i].title = _this.networkList[i].name;
                            for(var j=0;j<_this.selectedList.length;j++){
                                if(_this.selectedList[j]==newData[i].name){
                                    _this.fileNodes_id.push(_this.networkList[i].id);

                                }
                            }
                        }

                        // _this.networkList = _this.filterArr(_this.networkList);
                    }
                    return;
                },
                error:function(err){
                }
            })
        },

        loadData:function(type){

            switch(type){
                case 'personal':
                    _this.loadTree(_this.personalList,'personal')
                break;
                case 'public':
                    _this.loadTree(_this.publicList,'public')
                break;
                case 'network':
                    _this.loadTree(_this.networkList,'network')
                break;
            }

        },
        showOverlay:function(){
            $(".content-tag").empty();
            $("#search-ui-content").empty()
            $('.overlay').addClass('show')
        },
        loadSearchData:function(keyword){
            if(keyword.length==0){
                this.showOverlay()
                return;
            }
            var newData=[];
            // var newDataList = Object.assign(_this.dataList);
            var newDataList = $.extend([],_this.dataList);

            for(var i=0;i<_this.dataList.length;i++){
                if(newDataList[i].name.indexOf(keyword)!=-1){
                    newDataList[i].checked = false;
                    newDataList[i].html= newDataList[i].title.replace(keyword,'<font color="#0e84ff">'+keyword+'</font>');
                    if(_this.fileNodes_id.length>0){
                        for(var x=0;x<_this.fileNodes_id.length;x++){
                            if(_this.fileNodes_id[x]==newDataList[i].id){
                                newDataList[i].checked=true
                            }
                        }
                    }
                    if(newDataList[i].is_folder!=1){
                        newData.push(newDataList[i]);
                    }

                }
            }

            _this.searchData=newData;
            _this.renderSearchFile();

        },
        //生成另一个树数据
        createOtherTreeInfo:function(t,setting,zNodes){
            return $.fn.zTree.init(t, setting, zNodes);
        },
        loadTree:function(zNodes,type){

            var setting = {
                treeId:"tree",
                view: {
                  dblClickExpand: false,
                  showLine: false,//true,
                  showTitle: false,
                  selectedMulti: false,
                  nameIsHTML:true
                //   showIcon:function(treeId, treeNode){
                //       if(treeNode.isParent&&_this.currentTab!="#online"){
                //             return true
                //       }else{
                //             return false
                //       }
                //   }
                },
                check: {
                    enable: true
                },
                data: {
                  simpleData: {
                    enable: true,
                    idKey: "id",
                    pIdKey: "pId",
                    rootPId: ""
                  }
                },
                callback: {
                    onCheck:function(event, treeId, treeNode){
                        if(treeNode.children&&treeNode.isParent){
                            _this.renderSelectedParentNode(treeNode);
                        }else{
                            if(treeNode.getParentNode()){
                                parentNode=treeNode.getParentNode();
                                _this.renderSelectedParentNode(parentNode);
                            }
                        }
                        _this.renderSelectedFile();
                    },
                    onClick:function(event, treeId, treeNode){
                        if (treeNode.children) {
                            _this.tree.expandNode(treeNode);
                        } else {
                            var bool=treeNode.checked===undefined ||treeNode.checked===false? true:false
                            _this.tree.checkNode(treeNode, bool, true);
                            if(treeNode.getParentNode()){
                                _this.renderSelectedParentNode(treeNode.getParentNode());
                            }
                        }
                        _this.renderSelectedFile()
                    }


                }
            };


            var t = $(".tab-container");

            _this.is_first?_this.otherTree = _this.createOtherTreeInfo(t,setting,_this.publicList):null;

            _this.otherTree = _this.createOtherTreeInfo(t,setting,_this.publicList);


            _this.is_first?_this.setSelectedAllFile(_this.fileNodes_id,_this.is_first):null;
            switch(type){
                case 'personal':
                    _this.data = _this.personalList;
                break;
                case 'public':
                    _this.data = _this.publicList;
                break;
                case 'network':
                    _this.data = _this.networkList;
                break;
            }
            _this.is_first = false;

            _this.tree = $.fn.zTree.init(t, setting, zNodes);
            _this.setSelectedAllFile(_this.fileNodes_id);
            _this.renderSelectedFile();//初始化渲染一下被选中附件

            $.mCustomScrollbar.defaults.scrollButtons.enable=true; //enable scrolling buttons by default
            $.mCustomScrollbar.defaults.axis="y"; //enable 2 axis scrollbars by default
            $(".tabs-content").mCustomScrollbar({theme:"dark-3"});
            $(".content-tag").mCustomScrollbar({theme:"dark-3"});
            $(".search-content").mCustomScrollbar({theme:"dark-3"});
        },
        bindEvents: function () {

            //点击tab页面
            $("#tabs").on("click", "li", function (event) {
                event.preventDefault();
                $(this).addClass("active").siblings("li").removeClass("active");
                var id = $(this).children("a")[0].hash;
                _this.currentTab=id;
                switch (id){
                case  "#Personal":
                    _this.loadData('personal');
                    _this.changeDataList('personal');
                    break;
                case  "#Public":
                    _this.loadData('public');
                    _this.changeDataList('public');
                    break;
                case  "#HardDisk":
                    _this.loadData('network');
                    _this.changeDataList('network');
                    break;
                default :
                    break;
                }


            });
            $(".deleteAll").on("click",function(){//删除所有选中附件
                _this.deleteSelectedAll();
            })
            $(".okBtn").on("click",function(){//确定按钮 回填数据
                _this.callbackSetData();
            })
            $("#searchInput").on("keypress", function (event) {
                if (event.keyCode == 13) {
                    var keyword = $.trim($(this)[0].value);
                    _this.loadSearchData(keyword);
                }
            })
            $("#searchInput").on("input propertychange focus", function (event) {
                event.stopPropagation();//阻止冒泡
                var keyword = $.trim($(this)[0].value);
                if(keyword.length>0){
                    $(".search-content").addClass("active");
                    $(".search-wrap").addClass("active");
                    setTimeout(function(){
                        _this.loadSearchData(keyword);
                    },300)
                }else{
                    this.searchData=[];
                    $(".search-content").removeClass("active");
                    $(".search-wrap").removeClass("active");
                    _this.showOverlay()
                }
            })

            $("body").click(function(event){
                if(event.target.id=="searchInput"){
                    return;
                }
                $(".search-content").removeClass("active");
                $(".search-wrap").removeClass("active");
                _this.renderSelectedFile();
            })

            $(window).resize(function() {
                //初始化滚动条
                $.mCustomScrollbar.defaults.scrollButtons.enable=true; //enable scrolling buttons by default
                $.mCustomScrollbar.defaults.axis="y"; //enable 2 axis scrollbars by default
                $(".tabs-content").mCustomScrollbar({theme:"dark-3"});
            });
        },
        onSearchChange:function(event){
        },
        setSelectedAllFile:function(ids,is_first){//设置选中的附件
            if(ids.length>0){
                _this.data = _this.is_first?_this.publicList:_this.data;
                // if(is_first==3){
                //     _this.data = _this.networkList;
                // }
                if(_this.data.length>0){
                        for(var j=0;j<_this.data.length;j++){
                            for(var i=0;i<ids.length;i++){
                                if(ids[i]==_this.data[j].id){
                                    _this.data[j].check = true;
                                    var treeNode = is_first?_this.otherTree.getNodeByParam("id", _this.data[j].id, null):_this.tree.getNodeByParam("id", _this.data[j].id, null);

                                    treeNode&&is_first?_this.otherTree.checkNode(treeNode, true, true):_this.tree.checkNode(treeNode, true, true);
                                    _this.fileNodes.push(treeNode);
                                    if(treeNode.getParentNode()){
                                        _this.renderSelectedParentNode(treeNode.getParentNode());
                                    }
                                }
                            }
                        }
                }

            }

        },
        selectSearchFile:function(id){// 在搜索栏里面 设置选中的附件
            id = decodeURI(decodeURI(id));
            // event.stopPropagation();//阻止冒泡
            event = event||window.event;
            if (event.stopPropagation) {
                // 针对 Mozilla 和 Opera
                event.stopPropagation(); //阻止冒泡
            } else if (window.event) {
                // 针对 IE
                window.event.cancelBubble = true;
            }

            for(var i=0;i<_this.searchData.length;i++){
                if(_this.searchData[i].id==id&&_this.searchData[i].is_folder==0){
                    if(_this.searchData[i].checked==true){
                        _this.searchData[i].checked = false;
                        $(event.target).removeClass("active");
                        _this.deleteSelectedFile(encodeURI(encodeURI(id)));
                        break;
                    }else{
                        _this.searchData[i].checked=true;
                        $(event.target).addClass("active");
                        _this.fileNodes_id.indexOf(id)==-1?_this.fileNodes_id.push(id):null;
                        // return;
                    }
                }
            }
            _this.renderSearchFile();
            _this.setSelectedAllFile(_this.fileNodes_id);
        },
        //数组过滤
        filterObj:function(arr1,arr2){
            var outputArr = [];
            outputArr = arr1.concat(arr2);
            for(var i=0;i<outputArr.length-1;i++){
                for(var j = i+1; j < outputArr.length; j++){
                    if(outputArr[i].id==outputArr[j].id){
                        outputArr.splice(j,1);
                        j--;
                    }
                }
            }
            return outputArr;
        },
        getSelectedAllFile:function(){//获取选中的附件
            var _this=this,newArray=_this.fileNodes,newArray_ids=_this.fileNodes_id;

            if(_this.fileNodes.length==0&&_this.delIds.length!=0){
                for(var i=0;i<_this.delIds.length;i++){
                    var node = _this.tree.getNodeByParam('id',_this.delIds[i].id,null);
                    if(node){
                        node.checked = false;
                        _this.tree.updateNode(node);
                        _this.tree.checkNode(_this.delIds[i], false, true);
                    }
                }
                _this.delIds.length = [];
            }
            var changeNode = _this.tree.getNodeByParam('id',_this.changeId,null);
            if(_this.changeId!='' && changeNode){

                changeNode.checked = false;
                _this.tree.updateNode(changeNode);
                _this.changeId = '';
            }
            var nodes=_this.tree.getNodes();
            function  loopGetUser(treeNode,newArray){
                if(treeNode.isParent&&treeNode.children){

                    for(var i=0;i<treeNode.children.length;i++){
                        loopGetUser(treeNode.children[i],newArray);
                    }
                }else{
                    if(treeNode.checked){
                        if(treeNode.is_folder!=1){

                            newArray.push(treeNode);
                            newArray_ids.push(treeNode.id);
                        }
                    }else{
                        if(treeNode.is_folder!=1){
                            for(var i=0;i<newArray.length;i++){
                                if(treeNode.id == newArray[i].id){
                                    for(var j=0;j<newArray_ids.length;j++){
                                        if(newArray_ids[j]==newArray[i].id){
                                            newArray_ids.splice(j,1);
                                            j--;
                                        }
                                    }
                                    newArray.splice(i,1);
                                    i--;

                                }
                            }
                        }
                    }
                }
            }

            for(var i=0;i<nodes.length;i++){
                loopGetUser(nodes[i],newArray);
            }

            _this.compareArr = newArray;

            var newFileNodes_id = [];

            _this.fileNodes = _this.filterObj(_this.fileNodes,newArray);


            _this.fileNodes_id =_this.fileNodes_id.concat(newArray_ids);
            for(var i=0;i<_this.fileNodes_id.length;i++){
                if(newFileNodes_id.indexOf(_this.fileNodes_id[i])===-1){
                    newFileNodes_id.push(_this.fileNodes_id[i]);
                }
            }
            _this.fileNodes_id = newFileNodes_id;

        },
        renderSelectedFile:function(){//渲染已经选中的附件
            for(var i=0;i<_this.searchData.length;i++){
                _this.searchData[i].checked=false;
                if(_this.fileNodes_id.length>0){
                    for(var x=0;x<_this.fileNodes_id.length;x++){
                        if(_this.fileNodes_id[x]==_this.searchData[i].id){
                            _this.searchData[i].checked=true;
                        }
                    }
                }
            }
            _this.getSelectedAllFile();
            if(_this.searchData.length>0||_this.fileNodes.length>0){
                if(_this.fileNodes.length){

                    $(".content-tag").empty(); //清空后再加载数据
                    // $("#selected-file-tmpl").tmpl(_this.fileNodes).appendTo('.content-allTags');
                    $("#selected-file-tmpl").tmpl(_this.fileNodes).appendTo('.content-tag');
                    //由于树节点的变动需要重新渲染一次下来窗口下面的数据
                    $("#search-ui-content").empty(); //清空后再加载数据
                    $("#search-file-tmpl").tmpl(this.searchData).appendTo('#search-ui-content');
                    $('.overlay').removeClass('show')
                }else{
                  this.showOverlay()
                }
            }else{
               this.showOverlay()
            }


        },
        renderSelectedParentNode:function(treeNode){
            if(treeNode.check_Child_State===2){
                treeNode.iconSkin+=" allSelected ";
            }else{
                if(treeNode.iconSkin.indexOf('allSelected')>-1){
                    treeNode.iconSkin=$.trim(treeNode.iconSkin.replace(/allSelected/g,"")) +" ";
                }
            }

            _this.is_first?_this.otherTree.updateNode(treeNode):_this.tree.updateNode(treeNode);
        },
        renderSearchFile:function(){//渲染搜索框附件
            if(_this.searchData.length){
                $('.overlay').removeClass('show')
                $("#search-ui-content").empty(); //清空后再加载数据
                $(".search-content").addClass("active");
                $(".search-wrap").addClass("active");
                $("#search-file-tmpl").tmpl(_this.searchData).appendTo('#search-ui-content');
            }else{
                _this.showOverlay()
            }

        },
        deleteSelectedFile:function(id){//按照id删除选中附件
            id = decodeURI(decodeURI(id));
            var _this=this,delNodeFile=null,delIndex=-1;
            _this.changeId = id;
            for(var i=0;i<_this.fileNodes.length;i++){
                if(_this.fileNodes[i].id==id){
                    delNodeFile=_this.fileNodes[i];
                    delIndex=i;
                }
            }
            if(delNodeFile){
                _this.fileNodes.splice(delIndex,1);
                _this.fileNodes_id.splice(_this.fileNodes_id.indexOf(id),1);
                var ids = [];
                for(var i=0;i<_this.dataList.length;i++){
                    ids.push(_this.dataList[i].id);
                }
                if(ids.indexOf(delNodeFile.id)!=-1){
                    _this.tree.checkNode(delNodeFile, false, true);
                }

                if(delNodeFile.getParentNode()){
                    _this.renderSelectedParentNode(delNodeFile.getParentNode());
                }
            }
            for(var i=0;i<_this.searchData.length;i++){
                if(_this.searchData[i].id==id){
                    _this.searchData[i].checked = false;
                }
            }

            _this.renderSelectedFile();
            _this.renderSearchFile();
        },
        deleteSelectedAll:function(){//清除所有选中附件
            if(_this.fileNodes.length==0){
                return;
            }
            _this.delIds = _this.fileNodes;
            for(var i=0;i<_this.fileNodes.length;i++){
                if(_this.tree.getNodeByParam('id',_this.fileNodes[i].id,null)){
                    _this.tree.checkNode(_this.fileNodes[i], false, true);
                    _this.fileNodes[i].getParentNode()&&_this.renderSelectedParentNode(_this.fileNodes[i].getParentNode());
                }
            }
            _this.fileNodes=[];
            _this.fileNodes_id = [];
            for(var j=0;j<_this.searchData.length;j++){
                _this.searchData[j].checked=false;
            }
            _this.renderSelectedFile();
            _this.renderSearchFile();
        },
        callbackSetData:function(){//确定按钮 回填数据
            var args = [] //应用中心存储变量
            this.getSelectedAllFile();
            var url = window.parent.document.referrer;

            if(!ParentWindow.document.all(_this.urlInfo.DIR_FIELD) || !ParentWindow.document.all(_this.urlInfo.NAME_FIELD) || !ParentWindow.document.all(_this.urlInfo.TYPE_FIELD) || !ParentWindow.document.getElementById(_this.urlInfo.DIV_ID)){
                return;
            }


            // return;


            ParentWindow.document.all(_this.urlInfo.DIR_FIELD).value="";
            ParentWindow.document.all(_this.urlInfo.NAME_FIELD).value="";
            ParentWindow.document.all(_this.urlInfo.TYPE_FIELD).value="";
            ParentWindow.document.all(_this.urlInfo.DIR_ID).value="";
            ParentWindow.document.getElementById(_this.urlInfo.DIV_ID).innerHTML="";
            for(var i=0;i<_this.fileNodes.length;i++){
                if(_this.urlInfo.MULTI_SELECT){
                    if(_this.fileNodes[i].dir){
                        ParentWindow.document.all(_this.urlInfo.DIR_FIELD).value+=_this.fileNodes[i].path+"*";
                        ParentWindow.document.all(_this.urlInfo.DIR_ID).value+=_this.fileNodes[i].dir+"*";
                        ParentWindow.document.all(_this.urlInfo.TYPE_FIELD).value+=_this.fileNodes[i].disk_id+"*";
                    }else{
                        ParentWindow.document.all(_this.urlInfo.DIR_FIELD).value+=_this.fileNodes[i].attach_id+"*";
                        ParentWindow.document.all(_this.urlInfo.TYPE_FIELD).value+=''+"*";
                    }
                    ParentWindow.document.all(_this.urlInfo.NAME_FIELD).value+=_this.fileNodes[i].name+"*";

                    // if(url.indexOf('approve_center')>-1){
                        // ParentWindow.document.getElementById(_this.urlInfo.DIV_ID).innerHTML+="<img src='/static/images/attach.png' align='absMiddle'>"+_this.fileNodes[i].name+";"
                        ParentWindow.document.getElementById(_this.urlInfo.DIV_ID).innerHTML+="<div class='self_info_box'><i class='ui-icon-tongyongunkuown'></i><span>"+_this.fileNodes[i].name+"</span>;</div>"
                    // }else{
                    //     ParentWindow.document.getElementById(_this.urlInfo.DIV_ID).innerHTML+= "<div style='width:100%;float:left;padding-bottom:4px;'><div class='attachment_show_box' style='white-space: inherit;'><div class='attachment_info_box'><i class='ui-icon-tongyongunkuown'></i><a class=\"attach_name attachment_name\"  target=\"_blank\">"+_this.fileNodes[i].name+"</a></div></div></div>"
                    // }
                    // if(_this){

                    // }
                    if(_this.fileNodes[i].dir){
                        args.push(
                            {
                                 attach_id:'',
                                attach_name: _this.fileNodes[i].name,
                                attach_url:_this.fileNodes[i].dir,
                                path:_this.fileNodes[i].path,
                                is_disk:1,
                                disk_id:_this.fileNodes[i].disk_id,
                                is_public:1
                            }
                        )
                    }else{
                        args.push(
                            {
                                attach_id: _this.fileNodes[i].attach_id,
                                attach_name: _this.fileNodes[i].name,
                                attach_url:{},
                                is_public:1
                            }
                        )
                    }

                }else{
                    if(_this.fileNodes[i].dir){
                        ParentWindow.document.all(_this.urlInfo.DIR_FIELD).value+=_this.fileNodes[i].path;
                        ParentWindow.document.all(_this.urlInfo.DIR_ID).value+=_this.fileNodes[i].dir;
                        ParentWindow.document.all(_this.urlInfo.TYPE_FIELD).value+=_this.fileNodes[i].disk_id;
                    }else{
                        ParentWindow.document.all(_this.urlInfo.DIR_FIELD).value+=_this.fileNodes[i].attach_id;
                        ParentWindow.document.all(_this.urlInfo.TYPE_FIELD).value='';
                    }
                    ParentWindow.document.all(_this.urlInfo.NAME_FIELD).value+=_this.fileNodes[i].name;

                    // if(url.indexOf('approve_center')>-1){
                        // ParentWindow.document.getElementById(_this.urlInfo.DIV_ID).innerHTML+="<img src='/static/images/attach.png' align='absMiddle'>"+_this.fileNodes[i].name+";"
                        ParentWindow.document.getElementById(_this.urlInfo.DIV_ID).innerHTML+="<div class='self_info_box'><i class='ui-icon-tongyongunkuown'></i><span>"+_this.fileNodes[i].name+"</span>;</div>"
                    // }else{
                    //     ParentWindow.document.getElementById(_this.urlInfo.DIV_ID).innerHTML+= "<div style='width:100%;float:left;padding-bottom:4px;'><div class='attachment_show_box' style='white-space: inherit;'><div class='attachment_info_box'><i class='ui-icon-tongyongunkuown'></i><a class=\"attach_name attachment_name\"  target=\"_blank\">"+_this.fileNodes[i].name+"</a></div></div></div>";
                    // }
                    if(_this.fileNodes[i].dir){
                        args.push(
                            {
                                attach_id:'',
                                attach_name: _this.fileNodes[i].name,
                                attach_url:_this.fileNodes[i].dir,
                                path:_this.fileNodes[i].path,
                                is_disk:1,
                                disk_id:_this.fileNodes[i].disk_id,
                                is_public:1
                            }
                        )
                    }else{
                        args.push(
                            {
                                attach_id: _this.fileNodes[i].attach_id,
                                attach_name: _this.fileNodes[i].name,
                                attach_url:{},
                                is_public:1
                            }
                        )
                    }
                }
            }

            args = JSON.stringify(args)
            trigger_callback('update',args);

            // return;
            window.close();
        }
    }

    var _this = selectFile;
    var setting = {
        treeId:"tree",
        view: {
          dblClickExpand: false,
          showLine: false,//true,
          showTitle: false,
          selectedMulti: false,
          nameIsHTML:true
        //   showIcon:function(treeId, treeNode){
        //       if(treeNode.isParent&&_this.currentTab!="#online"){
        //             return true
        //       }else{
        //             return false
        //       }
        //   }
        },
        check: {
            enable: true
        },
        data: {
          simpleData: {
            enable: true,
            idKey: "id",
            pIdKey: "pId",
            rootPId: ""
          }
        },
        callback: {
            onCheck:function(event, treeId, treeNode){
                if(treeNode.children&&treeNode.isParent){
                    _this.renderSelectedParentNode(treeNode);
                }else{
                    if(treeNode.getParentNode()){
                        parentNode=treeNode.getParentNode();
                        _this.renderSelectedParentNode(parentNode);
                    }
                }
                _this.renderSelectedFile();
            },
            onClick:function(event, treeId, treeNode){
                if (treeNode.children) {
                    _this.tree.expandNode(treeNode);
                } else {
                    var bool=treeNode.checked===undefined ||treeNode.checked===false? true:false
                    _this.tree.checkNode(treeNode, bool, true);
                    if(treeNode.getParentNode()){
                        _this.renderSelectedParentNode(treeNode.getParentNode());
                    }
                }
                _this.renderSelectedFile()
            }


        }
    };
    window.selectFile=selectFile;
    selectFile.init();
})
