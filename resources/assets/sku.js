(function () {
    let SKU_IS_EDIT = false;
    function SKU(obj,sku_attr_name) {
        this.warp = $(obj);
        this.sku_attr_name = sku_attr_name;
        this.attrs = [];
        this.specGroup = [];
        this.skuListData = [];
        this.fixedParam = [];
    }

    SKU.prototype.updateGroupArr = function (group_key,group_name){
        let current_group_obj = {key:group_key,group_name:group_name,value_list:[]}
        if(this.specGroup.length === 0){
            this.specGroup.push(current_group_obj);
        }else{
            let arr = this.specGroup;
            let isset = false;
            arr.forEach((item,index,arr) =>{
                if(item.group_key == group_key){
                    isset = true;
                    item.group_name = group_name;
                }
            });
            if(!isset){
                this.specGroup.push(current_group_obj);
            }
        }
    }

    SKU.prototype.removeGroupArr = function (group_key){
        if(this.specGroup.length === 0){

        }else{
            let arr = this.specGroup;
            arr.forEach((item,index,arr) =>{
                if(item.key == group_key){
                    arr.splice(index,1);
                }
            });
        }
    }

    SKU.prototype.updateGroupValueArr = function(group_key,group_value_key,group_value_val){

        let arr = this.specGroup;
        arr.forEach((item,index,arr) =>{
            if(item.key == group_key){
                let value_list = item.value_list;
                if(value_list.length === 0){
                    let current_group_obj = {key:group_value_key,group_key:group_key,name:group_value_val,spec_value:group_value_val}
                    item.value_list.push(current_group_obj);
                }else{
                    let isset = false;
                    value_list.forEach((valueItem,valueIndex,value_list) =>{
                        if( (valueItem.key == group_value_key) && (valueItem.group_key == group_key) ){
                            isset = true;
                            valueItem.name = group_value_val;
                            valueItem.spec_value = group_value_val;
                        }
                    });
                    if(!isset){
                        let current_group_obj = {key:group_value_key,group_key:group_key,name:group_value_val,spec_value:group_value_val}
                        item.value_list.push(current_group_obj);
                    }
                }

            }
        });

    }

    SKU.prototype.removeGroupValueArr = function(group_key,group_value_key){

        let arr = this.specGroup;
        arr.forEach((item,index,arr) =>{
            if(item.key == group_key){
                let value_list = item.value_list;
                if(value_list.length === 0){

                }else{
                    value_list.forEach((valueItem,valueIndex,value_list) =>{
                        if( (valueItem.key == group_value_key) && (valueItem.group_key == group_key) ){
                            value_list.splice(valueIndex,1);
                        }
                    });
                }

            }
        });

    }

    function array_shift($array){
        return $array.shift();
    }

    function count($array){
        return $array.length;
    }

    function array_merge($left,$right){
        return $left.concat($right);
    }

    function cartesian($arr,$currentArr){
        //去除第一个元素
        let $firstData = array_shift($arr);
        let $first = $firstData["value_list"];
        if((!$currentArr) || ($currentArr.length == 0)){
            $currentArr = [];
            $first.forEach(($value,$key,$first) =>{
                $currentArr.push({
                    spec_group:[$value]
                });
            });
        }else{
            let $currentDataArr = [];
            // 如果是追加规格，遍历当前已处理好的规格
            $currentArr.forEach(($value,$key,$currentArr) =>{
                // 将当前规格追加到已处理好的规格之后
                $first.forEach(($currentValue,$currentkey,$first) =>{
                    let $item = array_merge($value["spec_group"],[$currentValue]);
                    $currentDataArr.push({
                        spec_group:$item
                    });
                });
            });
            $currentArr = $currentDataArr;
        }
        // 如果还有剩余的规格，再次调用
        if(count($arr) > 0){
            let $surplusFirstArr = $arr[0];
            if(($surplusFirstArr["value_list"]) && (count($surplusFirstArr["value_list"]) > 0) ){
                $currentArr = cartesian($arr,$currentArr);
            }
        }
        return $currentArr;
    }

    SKU.prototype.generateSkuGroup = function(){
        let specGroupArr = this.specGroup;
        let fixedParam = this.fixedParam;
        let $skuListData = this.skuListData;

        console.log("specGroupArr",this.specGroup);
        console.log("fixedParam",this.fixedParam);
        console.log("$skuListData",this.skuListData);

        let arr = JSON.parse(JSON.stringify(specGroupArr))

        if(specGroupArr.length > 0){
            let cartesianResult = cartesian(arr);

            let sku_attr_name = this.sku_attr_name;
            // 生成表格头部
            let $theadHtml = generateSkuListThead(specGroupArr,fixedParam);
            $(".sku-list-box").find("thead").html($theadHtml);

            // 生成sku对比数据
            let $skuListCompare = generateSkuListCompare(cartesianResult,fixedParam,sku_attr_name);
            let $skuList = generateSkuList($skuListCompare,$skuListData);
            this.skuListData = $skuList;
            // 生成SKU表格数据
            let $tbodyHtml = generateSkuListTbody($skuList,fixedParam,sku_attr_name);
            $(".sku-list-box").find("tbody").html($tbodyHtml);
        }else{
            $(".sku-list-box").find("thead").empty();
            $(".sku-list-box").find("tbody").empty();
        }

    }

    function generateSkuThead(groupData,fixedParam){
        let $theadHtml = "<tr>";
        groupData.forEach((item,index,groupData) =>{
            $theadHtml += '<th>'+item.name+'</th>';
        });
        fixedParam.forEach((item,index,fixedParam) =>{
            $theadHtml += '<th>'+item.title+'<input value="'+item.value+'" type="text" class="form-control input-sm batch-input" style="width: 100px" data-name="'+item.name+'"></th>';
        });
        $theadHtml += "</tr>";
        return $theadHtml;
    }

    function generateSkuTbody(cartesianResult,fixedParam,sku_attr_name){
        let $tbodyHtml = "";
        cartesianResult.forEach((cartesianItem,cartesianIndex,cartesianResult) =>{
            $tbodyHtml += "<tr>";
            let cartesianData = cartesianItem.value_list;
            cartesianData.forEach((skuItem,skuIndex,cartesianData) =>{
                $tbodyHtml += '<td>'+skuItem.name;
                $tbodyHtml += '<input type="hidden"  name="'+sku_attr_name+'[sku_list]['+cartesianIndex+'][sku_keys]['+skuIndex+'][group_key]" value="'+skuItem.group_key+'">';
                $tbodyHtml += '<input type="hidden"  name="'+sku_attr_name+'[sku_list]['+cartesianIndex+'][sku_keys]['+skuIndex+'][key]" value="'+skuItem.key+'">';
                $tbodyHtml += '<input type="hidden"  name="'+sku_attr_name+'[sku_list]['+cartesianIndex+'][sku_keys]['+skuIndex+'][name]" value="'+skuItem.name+'"></td>';
            });
            fixedParam.forEach((item,index,fixedParam) =>{
                $tbodyHtml += '<td><input value="'+item.value+'" type="text" class="form-control input-sm" style="width: 100px" name="'+sku_attr_name+'[sku_list]['+cartesianIndex+']['+item.name+']"></td>';
            });
            $tbodyHtml += "</tr>";
        });
        return $tbodyHtml;
    }


    SKU.prototype.initSkuGroup = function(specGroupArr,fixedParam){
        let skuList = this.skuListData;
        this.specGroup = specGroupArr;
        if(specGroupArr.length > 0){
            SKU_IS_EDIT = true;
            let sku_attr_name = this.sku_attr_name;
            // 生成规格组
            let $specGroupTbodyHtml = generateSpecGroupTbody(specGroupArr,sku_attr_name);
            $(".sku-"+sku_attr_name+"-forms").append($specGroupTbodyHtml);
            // 生成表格头部
            let $theadHtml = generateSkuListThead(specGroupArr,fixedParam);
            $(".sku-list-box").find("thead").html($theadHtml);
            // 生成SKU表格数据
            let $tbodyHtml = generateSkuListTbody(skuList,fixedParam,sku_attr_name);
            $(".sku-list-box").find("tbody").html($tbodyHtml);
        }else{
            $(".sku-list-box").find("thead").empty();
            $(".sku-list-box").find("tbody").empty();
        }

    }

    function generateSpecGroupTbody(specGroupArr,sku_attr_name){
        let $tbodyHtml = "";
        specGroupArr.forEach((item,index,specGroupArr) =>{
            let $specValueList = item.value_list;
            $tbodyHtml += '<tr class="sku-specification-group-item" data-group-key="'+item.key+'">';
            $tbodyHtml += '<td>';
            $tbodyHtml += '<input type="text" class="form-control group_name" name="'+sku_attr_name+'[spec_list]['+index+'][group_name]" value="'+item.group_name+'">';
            $tbodyHtml += '<input type="hidden" name="'+sku_attr_name+'[spec_list]['+index+'][key]" value="'+item.key+'">';
            $tbodyHtml += '</td>';
            $tbodyHtml += '<td>';
            $tbodyHtml += '<div class="sku-specification-val-box">';
            $specValueList.forEach(($specValueItem,$specValueIndex,$specValueList) =>{
                $tbodyHtml += '<div class="sku-specification-val-item">';
                $tbodyHtml += '<div class="sku-specification-val-input" data-group-val-key="'+$specValueItem.key+'">';
                $tbodyHtml += '<input type="hidden"  name="'+sku_attr_name+'[spec_list]['+index+'][value_list]['+$specValueIndex+'][group_key]" value="'+item.key+'">';
                $tbodyHtml += '<input type="hidden"  name="'+sku_attr_name+'[spec_list]['+index+'][value_list]['+$specValueIndex+'][key]" value="'+$specValueItem.key+'">';
                $tbodyHtml += ' <input type="text" class="form-control group_value" name="'+sku_attr_name+'[spec_list]['+index+'][value_list]['+$specValueIndex+'][spec_value]" value="'+$specValueItem.name+'">';
                $tbodyHtml += '</div>';
                $tbodyHtml += '<span class="btn btn-danger group-value-remove"><i class="glyphicon glyphicon-remove"></i></span>';
                $tbodyHtml += '</div>';
            });
            $tbodyHtml += '</div>';
            $tbodyHtml += '<div class="sku-specification-val-item" style="padding-left: 10px">';
            $tbodyHtml += '<span class="specification-val-add btn btn-success"><i class="glyphicon glyphicon-plus"></i></span>';
            $tbodyHtml += '</div>';
            $tbodyHtml += '</td>';
            if(SKU_IS_EDIT){
                $tbodyHtml += '<td><span class="btn btn-danger disabled">删除</span></td>';
            }else{
                $tbodyHtml += '<td><span class="btn btn-danger group-remove">删除</span></td>';
            }



            $tbodyHtml += "</tr>";
        });

        return $tbodyHtml;
    }

    function generateSkuListThead(specGroupArr,fixedParam){
        let $theadHtml = "<tr>";
        specGroupArr.forEach((item,index,specGroupArr) =>{
            $theadHtml += '<th>'+item.group_name+'</th>';
        });
        fixedParam.forEach((item,index,fixedParam) =>{
            $theadHtml += '<th>'+item.title+'<input value="'+item.value+'" type="text" class="form-control input-sm batch-input" style="width: 100px" data-name="'+item.name+'"></th>';
        });
        $theadHtml += "</tr>";
        return $theadHtml;
    }

    function generateSkuListCompare(cartesianResult,fixedParam,sku_attr_name){

        cartesianResult.forEach((cartesianItem,cartesianIndex,cartesianResult) =>{
            fixedParam.forEach((item,index,fixedParam) =>{
                cartesianItem[item.name] = item.value;
            });
            let $specKeyArr = [];
            let $specKeyStr = "";
            let skuSpecData = cartesianItem.spec_group;
            skuSpecData.forEach((skuSpecItem,skuSpecIndex,skuSpecData) =>{
                $specKeyArr.push(skuSpecItem.key);
            });
            $specKeyStr = $specKeyArr.join("_");
            cartesianItem.key_str = $specKeyStr;
        });
        return cartesianResult;
    }

    function generateSkuList($skuListCompare,$skuListData){

        let $responseSkuList = [];
        $skuListCompare.forEach((compareItem,compareIndex,skuListCompare) =>{

            $skuListData.forEach((dataItem,dataIndex,$skuListData) =>{
                let $specKeyArr = [];
                let $specKeyStr = "";
                let skuSpecData = dataItem.spec_group;
                skuSpecData.forEach((skuSpecItem,skuSpecIndex,skuSpecData) =>{
                    $specKeyArr.push(skuSpecItem.key);
                });
                $specKeyStr = $specKeyArr.join("_");
                if($specKeyStr == compareItem.key_str){
                    dataItem.key_str = $specKeyStr;
                    dataItem.spec_group = compareItem.spec_group;
                    compareItem = dataItem;
                }
            });
            $responseSkuList.push(compareItem);
        });

        return $responseSkuList;
    }

    function generateSkuListTbody(skuList,fixedParam,sku_attr_name){
        let $tbodyHtml = "";
        skuList.forEach((skuItem,skuIndex,skuList) =>{
            let skuSpecData = skuItem.spec_group;
            let $specKeyArr = [];
            let $specKeyStr = "";
            skuSpecData.forEach((skuSpecItem,skuSpecIndex,skuSpecData) =>{
                $specKeyArr.push(skuSpecItem.key);
            });
            $specKeyStr = $specKeyArr.join("_");
            $tbodyHtml += '<tr data-key="'+$specKeyStr+'">';
            skuSpecData.forEach((skuSpecItem,skuSpecIndex,skuSpecData) =>{
                $tbodyHtml += '<td>'+skuSpecItem.name;
                if(skuItem.id){
                    $tbodyHtml += '<input type="hidden"  name="'+sku_attr_name+'[sku_list]['+skuIndex+'][id]" value="'+skuItem.id+'">';
                }
                $tbodyHtml += '<input type="hidden"  name="'+sku_attr_name+'[sku_list]['+skuIndex+'][spec_group]['+skuSpecIndex+'][group_key]" value="'+skuSpecItem.group_key+'">';
                $tbodyHtml += '<input type="hidden"  name="'+sku_attr_name+'[sku_list]['+skuIndex+'][spec_group]['+skuSpecIndex+'][key]" value="'+skuSpecItem.key+'">';
            });
            fixedParam.forEach((item,index,fixedParam) =>{
                $tbodyHtml += '<td><input type="text" class="form-control input-sm field-input" style="width: 100px" data-name="'+item.name+'" name="'+sku_attr_name+'[sku_list]['+skuIndex+']['+item.name+']" value="'+skuItem[item.name]+'"  ></td>';
            });

            $tbodyHtml += "</tr>";
        });
        return $tbodyHtml;
    }



    SKU.prototype.batchUpdateSkuListFieldValue = function(fieldName,fieldValue){
        let $skuListData = this.skuListData;
        let $fixedParam = this.fixedParam;
        $skuListData.forEach((skuItem,skuIndex,skuList) =>{
            skuItem[fieldName] = fieldValue
        });
        $fixedParam.forEach((paramItem,paramIndex,$fixedParam) =>{
            if(paramItem.name == fieldName){
                paramItem.value = fieldValue
            }
        });
    }

    SKU.prototype.updateSkuListFieldValue = function(fieldName,fieldValue,keyStr){
        let $skuListData = this.skuListData;
        $skuListData.forEach((skuItem,skuIndex,skuList) =>{
            let $specKeyArr = [];
            let $specKeyStr = "";
            let skuSpecData = skuItem.spec_group;
            skuSpecData.forEach((skuSpecItem,skuSpecIndex,skuSpecData) =>{
                $specKeyArr.push(skuSpecItem.key);
            });
            $specKeyStr = $specKeyArr.join("_");
            if($specKeyStr == keyStr){
                skuItem[fieldName] = fieldValue
            }
        });

    }

    window.SKU = SKU;
})();
