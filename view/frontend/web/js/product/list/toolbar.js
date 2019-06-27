/**
 * Copyright © 2017 Incipio
 * 2017-03 Isaac Kim
 */
define([
    'jquery',
    'mage/template',
    'jquery/ui',
    'mage/translate',
    'Magento_Catalog/js/product/list/toolbar'

], function($) {
    
    $.widget('mage.productListToolbarForm', $.mage.productListToolbarForm, {

        options: {
            modeControl: '[data-role="mode-switcher"]',
            directionControl: '[data-role="direction-switcher"]',
            orderControl: '[data-role="sorter"]',
            limitControl: '[data-role="limiter"]',
            mode: 'product_list_mode',
            direction: 'product_list_dir',
            order: 'product_list_order',
            limit: 'product_list_limit',
            modeDefault: 'grid',
            directionDefault: 'asc',
            orderDefault: 'position',
            limitDefault: '9',
            url: ''
        },

        _create: function () {
            this._super();
            $('.block.filter .swatch-option-link-layered, .block.filter .item a, .block.filter .filter-clear, .block.filter .action.remove, .pages-items .page, .pages-items .previous, .pages-items .next')
            .off('click').on('click', {}, $.proxy(this.applyFilter, this));
        },

        _bind: function (element, paramName, defaultValue) {
            if (element.is("select")) {
                element.off('change').on('change', {paramName: paramName, default: defaultValue}, $.proxy(this._processSelect, this));
            } else {
                element.off('click').on('click', {paramName: paramName, default: defaultValue}, $.proxy(this._processLink, this));
            }
        },

        changeUrl: function (paramName, paramValue, defaultValue) {
            var decode = window.decodeURIComponent;
            var urlPaths = this.options.url.split('?'),
                baseUrl = urlPaths[0],
                urlParams = urlPaths[1] ? urlPaths[1].split('&') : [],
                paramData = {},
                parameters;
            for (var i = 0; i < urlParams.length; i++) {
                parameters = urlParams[i].split('=');
                paramData[decode(parameters[0])] = parameters[1] !== undefined
                    ? decode(parameters[1].replace(/\+/g, '%20'))
                    : '';
            }
            paramData[paramName] = paramValue;
            if (paramValue == defaultValue) {
                delete paramData[paramName];
            }
            paramData = $.param(paramData);

            this.ajaxSubmit(baseUrl, paramData);
        },

        applyFilter: function(event){
            var url = $(event.currentTarget).attr('href').split('?');
            this.ajaxSubmit(url[0], url[1]);
            event.preventDefault();
        },

        ajaxSubmit: function(url, param){
            if (url){
                if (param && param.length > 0){
                    ajaxParam = param + '&isAjax=true';
                } else {
                    ajaxParam = 'isAjax=true';
                }
                $('[data-role="loader"]').show();
                $.ajax({
                    url: url,
                    data: ajaxParam,
                    method: 'GET',
                    dataType: 'json',
                    contentType: "application/x-www-form-urlencoded;charset=UTF-8",
                    timeout: 15000,
                    cache: true,
                    showLoader: true,
                    context: $('.body'),
                }).done(function(result){
                    if (result.success){
                        // update html
                        if (result.html.product){
                            $('.toolbar-products').remove();
                            $('.products.wrapper').replaceWith(result.html.product);
                        }
                        if (result.html.left){
                            $('.block.filter').replaceWith(result.html.left);
                        }
                        $('body').trigger('contentUpdated');
                        // scroll to top
                        window.scrollTo(0, 0);
                        // update url
                        if (typeof history.replaceState === 'function'){
                            if (url && param && param.length > 0){
                                history.replaceState(null, null, url+'?'+param);
                            } else if (url){
                                history.replaceState(null, null, url);
                            }
                        }
                        $('[data-role="loader"]').hide();
                    }
                }).fail(function(jqXHR, statusText){
                    $('[data-role="loader"]').hide();
                    //console.log(statusText);
                    // redirect to the requested page
                    location.href = url+'?'+param;
                });
            }
        }   

    });

    return $.mage.productListToolbarForm;
});
