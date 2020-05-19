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
            // ˭Ϊ�Ƿ�ֵ˭��ǰ��
            if (strA === undefined || strA === null || strA === '' || strA === ' ' || strA === '��') {
                return -1
            }
            if (strB === undefined || strB === null || strB === '' || strB === ' ' || strB === '��') {
                return 1
            }
            // ���a��b��ȫ�����Ǻ��֣�����ȫ�����Ǻ���
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
                // ���ͨ�������ѭ���ԱȻ��Ȳ����������޽��ˣ�ֱ�ӷ���-1
                return -1
            }
        })
        return list
    }

    function charCompare(charA, charB) {
        // ˭Ϊ�Ƿ�ֵ˭��ǰ��
        if (charA === undefined || charA === null || charA === '' || charA === ' ' || charA === '��') {
            return -1
        }
        if (charB === undefined || charB === null || charB === '' || charB === ' ' || charB === '��') {
            return 1
        }
        // �����ΪӢ�Ļ��߶�Ϊ������ֱ�ӶԱ�
        if ((notChinese(charA) && notChinese(charB)) || (!notChinese(charA) && !notChinese(charB))) {
            return charA.localeCompare(charB)
        } else {
            // �������ΪӢ�Ļ��ߺ��֣��Ϳ϶���һ����Ӣ�ģ����a��Ӣ�ģ�����-1��a��ǰ���������b��Ӣ�ģ�b��ǰ
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
        fileNodes:[],//����ѡ�еĸ���
        searchData:[],//��������������и���
        fileNodes_id:[],//����ѡ�и�����id  ����
        fileNodes_name:[],//����ѡ�и�����name  ����
        dom_id:"",  //��Ӧ��dom �洢 id��Ԫ��
        dom_name:"",//��Ӧ��dom ��ʾname��Ԫ��
        currentTab:"#Personal", //��ǰ��tabҳ
        dataList:[], //��ǰ����
        personalList:null, //�����ļ�
        publicList:null,//�����ļ�
        networkList:null,//����Ӳ��
        urlInfo:{
            MULTI_SELECT:'',
            DIV_ID:'',
            DIR_FIELD:'',
            NAME_FIELD:'',
            TYPE_FIELD:'',
            DIR_ID:''
        },
        //Ѱ�Ҳ��������
        compareArr:[],
        is_first:1,
        data:[],
        selectedList:null,
        changeId:'', //��һɾ��id
        delIds:[],//ȫ��ɾ��id����
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
        //��ȡ��ַ������
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
        //id����
        filterArr:function(arr){
            var newArr = [];

            var i = arr.length-1; //��ʼʱ,���λ�ñ��ֲ��䡡��
        ����while ( i> 0) {
        ��������var pos= 0; //ÿ�˿�ʼʱ,�޼�¼����
        ��������for (var j= 0; j< i; j++){
        ������������if (arr[j].id> arr[j+1].id) {
        ����������������pos= j; //��¼������λ��
        ����������������var tmp = arr[j]; arr[j]=arr[j+1];arr[j+1]=tmp;
        ������������}
        ��������}
        ��������i= pos; //Ϊ��һ��������׼��
        ����}
        ����

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
        //��ȡ�ļ�����
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
                            // ��¥��߶����ԣ���������
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
                            // ��¥��߶����ԣ���������
                            return b.is_folder - a.is_folder;
                        });
                        _this.publicList = _this.publicList.sort(function (a, b) {
                            // ��¥��߶����ԣ���������
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
        //������һ��������
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
            _this.renderSelectedFile();//��ʼ����Ⱦһ�±�ѡ�и���

            $.mCustomScrollbar.defaults.scrollButtons.enable=true; //enable scrolling buttons by default
            $.mCustomScrollbar.defaults.axis="y"; //enable 2 axis scrollbars by default
            $(".tabs-content").mCustomScrollbar({theme:"dark-3"});
            $(".content-tag").mCustomScrollbar({theme:"dark-3"});
            $(".search-content").mCustomScrollbar({theme:"dark-3"});
        },
        bindEvents: function () {

            //���tabҳ��
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
            $(".deleteAll").on("click",function(){//ɾ������ѡ�и���
                _this.deleteSelectedAll();
            })
            $(".okBtn").on("click",function(){//ȷ����ť ��������
                _this.callbackSetData();
            })
            $("#searchInput").on("keypress", function (event) {
                if (event.keyCode == 13) {
                    var keyword = $.trim($(this)[0].value);
                    _this.loadSearchData(keyword);
                }
            })
            $("#searchInput").on("input propertychange focus", function (event) {
                event.stopPropagation();//��ֹð��
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
                //��ʼ��������
                $.mCustomScrollbar.defaults.scrollButtons.enable=true; //enable scrolling buttons by default
                $.mCustomScrollbar.defaults.axis="y"; //enable 2 axis scrollbars by default
                $(".tabs-content").mCustomScrollbar({theme:"dark-3"});
            });
        },
        onSearchChange:function(event){
        },
        setSelectedAllFile:function(ids,is_first){//����ѡ�еĸ���
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
        selectSearchFile:function(id){// ������������ ����ѡ�еĸ���
            id = decodeURI(decodeURI(id));
            // event.stopPropagation();//��ֹð��
            event = event||window.event;
            if (event.stopPropagation) {
                // ��� Mozilla �� Opera
                event.stopPropagation(); //��ֹð��
            } else if (window.event) {
                // ��� IE
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
        //�������
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
        getSelectedAllFile:function(){//��ȡѡ�еĸ���
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
        renderSelectedFile:function(){//��Ⱦ�Ѿ�ѡ�еĸ���
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

                    $(".content-tag").empty(); //��պ��ټ�������
                    // $("#selected-file-tmpl").tmpl(_this.fileNodes).appendTo('.content-allTags');
                    $("#selected-file-tmpl").tmpl(_this.fileNodes).appendTo('.content-tag');
                    //�������ڵ�ı䶯��Ҫ������Ⱦһ�������������������
                    $("#search-ui-content").empty(); //��պ��ټ�������
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
        renderSearchFile:function(){//��Ⱦ�����򸽼�
            if(_this.searchData.length){
                $('.overlay').removeClass('show')
                $("#search-ui-content").empty(); //��պ��ټ�������
                $(".search-content").addClass("active");
                $(".search-wrap").addClass("active");
                $("#search-file-tmpl").tmpl(_this.searchData).appendTo('#search-ui-content');
            }else{
                _this.showOverlay()
            }

        },
        deleteSelectedFile:function(id){//����idɾ��ѡ�и���
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
        deleteSelectedAll:function(){//�������ѡ�и���
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
        callbackSetData:function(){//ȷ����ť ��������
            var args = [] //Ӧ�����Ĵ洢����
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
