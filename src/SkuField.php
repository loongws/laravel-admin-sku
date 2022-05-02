<?php

namespace Encore\LaravelAdminSku;

use Encore\Admin\Admin;
use Encore\Admin\Form\Field;
use Encore\Admin\Form\NestedForm;
use Illuminate\Contracts\Support\Arrayable;

class SkuField extends Field
{
    protected $view = 'sku::sku_field';

    protected static $js = [
        'vendor/laravel-admin-ext/sku/sku.js'
    ];

    protected static $css = [
        'vendor/laravel-admin-ext/sku/sku.css'
    ];

    protected $specDefaultData = [];
    protected $skuDefaultData = [];
    protected $startGroupKey = 0;
    protected $startKey = 0;
    // 自定义字段参数
    protected $fixedParam = [
        [
            "name" => "price",
            "title" => "价格",
            "value" => 0,
        ],
        [
            "name" => "stock",
            "title" => "库存",
            "value" => 0,
        ],
        [
            "name" => "stock_min",
            "title" => "最小库存",
            "value" => 0,
        ],
        [
            "name" => "original_price",
            "title" => "原价",
            "value" => 0,
        ],
    ];

    // 测试 spec 数据结构
    protected $specDefaultDataExample  = [
        [
            "group_name" => "颜色",
            "key" => 0,
            "value_list" => [
                [
                    "group_key" => 0,
                    "key" => 0,
                    "spec_value" => "红色",
                    "group_id" => "45",
                    "group_name" => "颜色",
                    "id" => 71,
                    "name" => "红色"
                ],
                [

                    "group_key" => 0,
                    "key" => 1,
                    "spec_value" => "蓝色",
                    "group_id" => 45,
                    "group_name" => "颜色",
                    "id" => 72,
                    "name" => "蓝色",
                ],
                [

                    "group_key" => 0,
                    "key" => 4,
                    "spec_value" => "黑色",
                    "group_id" => 45,
                    "group_name" => "颜色",
                    "id" => 75,
                    "name" => "黑色"
                ]

            ],
            "group_id" => 45
        ]

    ];

    // 测试 SKU 数据结构
    protected $skuDefaultDataExample  = [
        [
            "id" => "1",
            "product_id" => "1",
            "stock" => "1",
            "price" => "1",
            "stock_min" => "1",
            "original_price" => "1",
            "spec_group" => [
                [
                    "group_id" => 45,
                    "group_key" => 0,
                    "group_name" => "颜色",
                    "id" => 71,
                    "key" => 0,
                    "spec_value" => "红色",
                    "name" => "红色"
                ],
                [
                    "group_id" => 46,
                    "group_key" => 1,
                    "group_name" => "尺寸",
                    "id" => 73,
                    "key" => 2,
                    "spec_value" => "L",
                    "name" => "L"
                ],
            ],
        ]

    ];

    public function fixedParam($fixedParam = []){
        if ($fixedParam instanceof Arrayable) {
            $fixedParam = $fixedParam->toArray();
        }

        if (is_callable($fixedParam)) {
            $this->fixedParam = $fixedParam;
        } else {
            $this->fixedParam = (array) $fixedParam;
        }

        return $this;
    }

    public function skuDefault($skuData){
        $this->skuDefaultData = $skuData;

        return $this;
    }

    public function specDefault($specData){
        $this->specDefaultData = $specData;

        return $this;
    }

    public function setStartKey($startGroupKey,$startKey){
        $this->startGroupKey = $startGroupKey+1;
        $this->startKey = $startKey+1;

        return $this;
    }

    /**
     * Setup default template script.
     *
     *
     * @return void
     */
    protected function setupScriptForDefaultView()
    {
        $removeClass = NestedForm::REMOVE_FLAG_CLASS;
        $defaultKey = NestedForm::DEFAULT_KEY_NAME;
        $defaultValueKey = '__LA_VAL_KEY__';
        $fixedParam = json_encode($this->fixedParam);
        $initParam = json_encode($this->specDefaultData);
        /**
         * When add a new sub form, replace all element key in new sub form.
         *
         * @example comments[new___key__][title]  => comments[new_{index}][title]
         *
         * {count} is increment number of current sub form count.
         */
        $script = <<<EOT
var {$this->column}_fixedParam = {$fixedParam}
var {$this->column}_initParam = {$initParam}
var {$this->column}_index = {$this->startGroupKey};
$('#sku-{$this->column}').off('click', '.add').on('click', '.add', function () {

    var tpl = $('template.{$this->column}-specification-group-tpl');
    var template = tpl.html().replace(/{$defaultKey}/g, {$this->column}_index);
    $('.sku-{$this->column}-forms').append(template);

    {$this->column}_index++;
    return false;
});

var {$this->column}_val_index = {$this->startKey};
$('#sku-{$this->column}').off('click', '.specification-val-add').on('click', '.specification-val-add', function () {

    var tpl = $('template.{$this->column}-specification-group-val-tpl');

    let group_key = $(this).closest('.sku-specification-group-item').attr("data-group-key");

    var template = tpl.html().replace(/{$defaultKey}/g, group_key);
    template = template.replace(/{$defaultValueKey}/g, {$this->column}_val_index);
    $(this).parent().siblings('.sku-specification-val-box').append(template);

    {$this->column}_val_index++;
    return false;
});



$('#sku-{$this->column}').off('click', '.group-remove').on('click', '.group-remove', function () {
    let group_key = $(this).closest('.sku-specification-group-item').attr("data-group-key");
    $(this).closest('.sku-specification-group-item').remove();
    window.{$this->column}_SKU.removeGroupArr(group_key)
    window.{$this->column}_SKU.generateSkuGroup();
    return false;
});

$('#sku-{$this->column}').off('click', '.group-value-remove').on('click', '.group-value-remove', function () {
    let group_key = $(this).closest(".sku-specification-group-item").attr("data-group-key");
    let group_value_key = $(this).siblings(".sku-specification-val-input").attr("data-group-val-key");
    let other_item_obj = $(this).closest(".sku-specification-val-item").siblings();
    console.log("other_item_obj",other_item_obj.length)
    if(other_item_obj.length == 1){
        other_item_obj.find(".group-value-remove").addClass("disabled group-value-remove-disabled").removeClass("group-value-remove")
    }
    $(this).closest('.sku-specification-val-item').remove();
    window.{$this->column}_SKU.removeGroupValueArr(group_key,group_value_key)
    window.{$this->column}_SKU.generateSkuGroup();

    return false;
});


$('#sku-{$this->column}').off('change', '.group_name').on('change', '.group_name', function () {
    let group_key = $(this).closest(".sku-specification-group-item").attr("data-group-key");
    let group_name = $(this).val();
    window.{$this->column}_SKU.updateGroupArr(group_key,group_name)
    return false;
});

$('#sku-{$this->column}').off('change', '.group_value').on('change', '.group_value', function () {
    let group_key = $(this).closest(".sku-specification-group-item").attr("data-group-key");
    let group_value_key = $(this).closest(".sku-specification-val-input").attr("data-group-val-key");
    let group_value_val = $(this).val();


    let other_item_obj = $(this).closest(".sku-specification-val-item").siblings();
    console.log("other_item_obj",other_item_obj.length)
    if(other_item_obj.length >= 1){
        other_item_obj.find(".group-value-remove-disabled").addClass("group-value-remove").removeClass("disabled group-value-remove-disabled")
    }

    window.{$this->column}_SKU.updateGroupValueArr(group_key,group_value_key,group_value_val)
    window.{$this->column}_SKU.generateSkuGroup();
    return false;
});

$('#sku-{$this->column}').off('change', '.batch-input').on('change', '.batch-input', function () {
    let param_name = $(this).attr("data-name");
    let param_value = $(this).val();
    window.{$this->column}_SKU.batchUpdateSkuListFieldValue(param_name,param_value);
    window.{$this->column}_SKU.generateSkuGroup();
    return false;
});

$('#sku-{$this->column}').off('change', '.field-input').on('change', '.field-input', function () {
    let param_name = $(this).attr("data-name");
    let param_value = $(this).val();
    let param_key_str = $(this).closest('tr').attr("data-key");
    window.{$this->column}_SKU.updateSkuListFieldValue(param_name,param_value,param_key_str);
    return false;
});
EOT;

        Admin::script($script);
    }

    public function render()
    {
        $fixedParam = json_encode($this->fixedParam);
        if(!empty($this->skuDefaultData)){
            $specDefaultDataJson = json_encode($this->specDefaultData);
            $skuDefaultDataJson = json_encode($this->skuDefaultData);

            $this->script = <<< EOF
delete window.{$this->column}_SKU;
window.{$this->column}_SKU = new SKU('{$this->getElementClassSelector()}',"{$this->column}")
window.{$this->column}_SKU.specGroup = {$specDefaultDataJson}
window.{$this->column}_SKU.skuListData = {$skuDefaultDataJson}
window.{$this->column}_SKU.fixedParam = {$fixedParam}
window.{$this->column}_SKU.initSkuGroup({$this->column}_initParam,{$this->column}_fixedParam);
EOF;
        }else{
            $this->script = <<< EOF
delete window.{$this->column}_SKU;
window.{$this->column}_SKU = new SKU('{$this->getElementClassSelector()}',"{$this->column}")
window.{$this->column}_SKU.fixedParam = {$fixedParam}
EOF;
        }
        $this->setupScriptForDefaultView();
        $this->addVariables([
            'specDefaultData'     => $this->specDefaultData,
        ]);
        return parent::render();
    }

}
