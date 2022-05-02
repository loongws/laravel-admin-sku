<div id="sku-{{$column}}" class="{{$viewClass['form-group']}} sku-{{$column}} {!! !$errors->has($errorKey) ? '' : 'has-error' !!}">
    <label for="{{$id}}" class="{{$viewClass['label']}} control-label">{{$label}}</label>

    <div class="{{$viewClass['field']}}">
        @include('admin::form.error')
        <div class="sku-box {{$class}}">
            <input type="hidden" class="" name="{{$name}}" value="{{old($column, $value)}}">
            <div>
                @if(!empty($specDefaultData))
                    <span class="btn btn-success disabled" data-type="many">新增</span>
                @else
                    <span class="add btn btn-success" data-type="many">新增</span>
                @endif
            </div>
            <div class="sku-specification-box" style="display: block">
                <table class="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th style="width: 200px">规格名</th>
                            <th>规格值</th>
                            <th style="width: 100px">操作</th>
                        </tr>
                    </thead>
                    <tbody class="sku-{{$column}}-forms">

                    </tbody>
                </table>
            </div>

            <!-- 操作SKU -->
            <div class="sku-list-box" style="display: block">
                <table  class="table table-bordered table-striped">
                    <thead>

                    </thead>
                    <tbody>

                    </tbody>
                </table>

            </div>
        </div>

    </div>


    <template class="{{$column}}-specification-group-tpl">
        <tr class="sku-specification-group-item" data-group-key="__LA_KEY__">
            <td>
                <input type="text" class="form-control group_name" name="{{$column}}[spec_list][__LA_KEY__][group_name]">
                <input type="hidden" name="{{$column}}[spec_list][__LA_KEY__][key]" value="__LA_KEY__">
            </td>
            <td>
                <div class="sku-specification-val-box">

                </div>
                <div class="sku-specification-val-item" style="padding-left: 10px">
                    <span class="specification-val-add btn btn-success"><i class="glyphicon glyphicon-plus"></i></span>
                </div>
            </td>
            <td>
                <span class="btn btn-danger group-remove">删除</span>
            </td>
        </tr>
    </template>

    <template class="{{$column}}-specification-group-val-tpl">
        <div class="sku-specification-val-item">
            <div class="sku-specification-val-input" data-group-val-key="__LA_VAL_KEY__">
                <input type="hidden"  name="{{$column}}[spec_list][__LA_KEY__][value_list][__LA_VAL_KEY__][group_key]" value="__LA_KEY__">
                <input type="hidden"  name="{{$column}}[spec_list][__LA_KEY__][value_list][__LA_VAL_KEY__][key]" value="__LA_VAL_KEY__">
                <input type="text" class="form-control group_value" name="{{$column}}[spec_list][__LA_KEY__][value_list][__LA_VAL_KEY__][spec_value]">
            </div>
            <span class="btn btn-danger group-value-remove"><i class="glyphicon glyphicon-remove"></i></span>
        </div>
    </template>
</div>
