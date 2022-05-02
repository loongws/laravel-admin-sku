laravel-admin extension 商品SKU
======

## 安装
```bash
composer require loongws/laravel-admin-sku

php artisan vendor:publish --tag=sku
```

## 使用

```php
$form->sku('sku_field','商品SKU');

// 设置默认 SKU 数据
$form->sku('sku_field','商品SKU')->skuDefault($skuDefaultData);

// 设置默认规格数据
$form->sku('sku_field','商品SKU')->specDefault($specDefaultData);

// 设置初始 key
$form->sku('sku_field','商品SKU')->setStartKey($startGroupKey,$startKey);

// 设置自定义字段
$form->sku('sku_field','商品SKU')->fixedParam($fixedParam);

// 处理数据
$form->saving(function($form) {
    dd($form->sku_field);
});

// 修改时需要同时设置默认 SKU 数据、默认规格数据、初始 key，如果设置了自定义字段，还需要同时设置自定义字段
$form->sku('sku_field', __('SKU 管理'))->fixedParam($fixedParam)->skuDefault($skuDefaultData)->specDefault($specDefaultData)->setStartKey($startGroupKey,$startKey);
```

本扩展只会将SKU数据写指定的字段中，如需个性化处理数据，请在【表单回调】中处理;


示例中的 `$fixedParam`、`$skuDefaultData`、`$specDefaultData`、`$startGroupKey`、`$startKey` 请参考 `SkuField.php` 文件

原始数据
```json
{
    "sku_field": {
        "spec_list": [{
            "group_name": "颜色",
            "key": "0",
            "value_list": [{
                "group_key": "0",
                "key": "0",
                "spec_value": "红色"
            }, {
                "group_key": "0",
                "key": "1",
                "spec_value": "蓝色"
            }]
        }, {
            "group_name": "尺寸",
            "key": "1",
            "value_list": {
                "2": {
                    "group_key": "1",
                    "key": "2",
                    "spec_value": "L"
                },
                "3": {
                    "group_key": "1",
                    "key": "3",
                    "spec_value": "XL"
                }
            }
        }, {
            "group_name": "内存",
            "key": "2",
            "value_list": {
                "4": {
                    "group_key": "2",
                    "key": "4",
                    "spec_value": "8+32G"
                },
                "5": {
                    "group_key": "2",
                    "key": "5",
                    "spec_value": "16+32G"
                }
            }
        }],
        "sku_list": [{
            "spec_group": [{
                "group_key": "0",
                "key": "0"
            }, {
                "group_key": "1",
                "key": "2"
            }, {
                "group_key": "2",
                "key": "4"
            }],
            "price": "10",
            "stock": "20",
            "stock_min": "30",
            "original_price": "40"
        }, {
            "spec_group": [{
                "group_key": "0",
                "key": "0"
            }, {
                "group_key": "1",
                "key": "2"
            }, {
                "group_key": "2",
                "key": "5"
            }],
            "price": "10",
            "stock": "20",
            "stock_min": "30",
            "original_price": "40"
        }, {
            "spec_group": [{
                "group_key": "0",
                "key": "0"
            }, {
                "group_key": "1",
                "key": "3"
            }, {
                "group_key": "2",
                "key": "4"
            }],
            "price": "10",
            "stock": "20",
            "stock_min": "30",
            "original_price": "40"
        }, {
            "spec_group": [{
                "group_key": "0",
                "key": "0"
            }, {
                "group_key": "1",
                "key": "3"
            }, {
                "group_key": "2",
                "key": "5"
            }],
            "price": "10",
            "stock": "20",
            "stock_min": "30",
            "original_price": "40"
        }, {
            "spec_group": [{
                "group_key": "0",
                "key": "1"
            }, {
                "group_key": "1",
                "key": "2"
            }, {
                "group_key": "2",
                "key": "4"
            }],
            "price": "10",
            "stock": "20",
            "stock_min": "30",
            "original_price": "40"
        }, {
            "spec_group": [{
                "group_key": "0",
                "key": "1"
            }, {
                "group_key": "1",
                "key": "2"
            }, {
                "group_key": "2",
                "key": "5"
            }],
            "price": "10",
            "stock": "20",
            "stock_min": "30",
            "original_price": "40"
        }, {
            "spec_group": [{
                "group_key": "0",
                "key": "1"
            }, {
                "group_key": "1",
                "key": "3"
            }, {
                "group_key": "2",
                "key": "4"
            }],
            "price": "10",
            "stock": "20",
            "stock_min": "30",
            "original_price": "40"
        }, {
            "spec_group": [{
                "group_key": "0",
                "key": "1"
            }, {
                "group_key": "1",
                "key": "3"
            }, {
                "group_key": "2",
                "key": "5"
            }],
            "price": "10",
            "stock": "20",
            "stock_min": "30",
            "original_price": "40"
        }]
    }
}
```
