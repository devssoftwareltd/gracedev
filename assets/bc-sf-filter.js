// Override Settings
var bcSfFilterSettings = {
    general: {
        limit: bcSfFilterConfig.custom.products_per_page,
        // Optional
        loadProductFirst: true
    }
};

// Declare Templates
var bcSfFilterTemplate = {
    'saleLabelHtml': '<div class="sale_banner">' + bcSfFilterConfig.label.sale + '</div>',
    'newLabelHtml': '<div class="new_banner">' + bcSfFilterConfig.label.new + '</div>',
    'comingsoonLabelHtml': '<div class="new_banner">' + bcSfFilterConfig.label.coming_soon + '</div>',
    'preorderLabelHtml': '<div class="new_banner">' + bcSfFilterConfig.label.pre_order + '</div>',
    'reviewHtml': '<span class="shopify-product-reviews-badge" data-id="{{itemId}}"></span>',
    'vendorHtml': '<div class="vendor"><span itemprop="brand">{{itemVendorLabel}}</span></div>',
    'quickViewBtnHtml': '<div data-fancybox-href="#product-{{itemId}}" class="quick_shop action_button" data-gallery="product-{{itemId}}-gallery">' + bcSfFilterConfig.label.quick_shop + '</div>',
    // 'quickViewBtnHtml': '<span data-fancybox-href="#product-{{itemId}}" class="quick_shop ss-icon" data-gallery="product-{{itemId}}-gallery"><span class="icon-plus"></span></span>',
    'newRowHtml': '<br class="clear product_clear" />',

    // Grid Template
  'productGridItemHtml': '<div data-product-id="{{itemId}}" class="{{itemColumnNumberClass}} {{itemCollectionGroupThumbClass}} thumbnail {{itemCollectionGroupMobileClass}}" itemprop="itemListElement" itemscope itemtype="http://schema.org/Product">' +
                                '<a href="{{itemUrl}}" itemprop="url" class="sc-pb-element">' +
                                    '<div class="relative product_image image__container">' +
                                        '<img src="{{itemThumbUrl}}" alt="{{itemTitle}}" class="lazyload transition-in primary" />' +
                                        '{{itemFlipImage}}' +
                                    '</div>' +
                                    '<div class="info">' +
                                        '<span class="title" itemprop="name">{{itemTitle}}</span>' +
                                        '{{itemVendor}}' +
                                        '{{itemPrice}}' +
                                    '</div>' +
                                    '{{itemSaleLabel}}' +
                                    '{{itemNewLabel}}' +
                                    '{{itemComingsoonLabel}}' +
                                    '{{itemPreorderLabel}}' +
                                '</a>' +
  								//'{{colorSwatches}}' +
                                '{{itemQuickViewBtn}}' +
  								'<div class="boost-custom-html"></div>' +
                            '</div>' +
                            '{{itemNewRow}}',

    // Pagination Template
    'previousHtml': '<span class="prev"><a href="{{itemUrl}}">« ' + bcSfFilterConfig.label.paginate_prev + '</a></span>',
    'nextHtml': '<span class="next"><a href="{{itemUrl}}">' + bcSfFilterConfig.label.paginate_next + ' »</a></span>',
    'pageItemHtml': '<span class="page"><a href="{{itemUrl}}">{{itemTitle}}</a></span>',
    'pageItemSelectedHtml': '<span class="page current">{{itemTitle}}</span>',
    'pageItemRemainHtml': '<span class="deco">{{itemTitle}}</span>',
    'paginateHtml': '{{previous}}{{pageItems}}{{next}}',

    // Sorting Template
    'sortingHtml': '<label class="inline">' + bcSfFilterConfig.label.sorting + '</label> <select class="sort_by">{{sortingItems}}</select>',
};






function buildSwatches(data){
  var swatchesHtml;

  data.options.forEach((option , index) =>{

  	if(option.toLowerCase().indexOf("color") > -1 || option.toLowerCase().indexOf("colour") > -1 ){
       let values = [];
       var option_index = index;
       swatchesHtml = '<div class="collection_swatches">';

       data.variants.forEach(variant =>{
       	    var value = variant.options[index];
            if(values.indexOf(value) < 0){
      			values.push(value);
      			swatchesHtml += '<a href="{{itemUrl}}?variant='+variant.id+'" class="swatch">';
              	var value = value.toLowerCase().replace(/\s/g , "-");
      			var swatchHandle = bcSfFilterConfig.general.asset_url.replace('bc-sf-filter.js', bcsffilter.slugify(value) + '_50x.png');

      			swatchesHtml += '<span data-image="'+variant.image+'" style="background-image: url('+swatchHandle+'); background-color: '+value+'"></span></a>';



            }
       	 })
       }
      swatchesHtml += '</div>';
  })
  console.log(swatchesHtml);
	return swatchesHtml;
}

// Build Product Grid Item
BCSfFilter.prototype.buildProductGridItem = function(data, index) {
    /*** Prepare data ***/
    var images = data.images_info;
     // Displaying price base on the policy of Shopify, have to multiple by 100
    var soldOut = !data.available; // Check a product is out of stock
    var onSale = data.compare_at_price_min > data.price_min; // Check a product is on sale
    var priceVaries = data.price_min != data.price_max; // Check a product has many prices
    // Get First Variant (selected_or_first_available_variant)
    var firstVariant = data['variants'][0];
    if (getParam('variant') !== null && getParam('variant') != '') {
        var paramVariant = data.variants.filter(function(e) { return e.id == getParam('variant'); });
        if (typeof paramVariant[0] !== 'undefined') firstVariant = paramVariant[0];
    } else {
        for (var i = 0; i < data['variants'].length; i++) {
            if (data['variants'][i].available) {
                firstVariant = data['variants'][i];
                break;
            }
        }
    }
    /*** End Prepare data ***/


    // Get Template
    var itemHtml = bcSfFilterTemplate.productGridItemHtml;

    var saleClass = onSale ? 'sale' : '';
    var soldOutClass = soldOut ? 'out_of_stock' : 'in_stock';

    var itemColumnNumberClass = '';
    var itemCollectionGroupThumbClass = buildItemCollectionGroupThumbClass(index, bcSfFilterConfig.custom.products_per_row);
    var itemCollectionGroupMobileClass = (index - 1) % 2 == 0 ? 'even' : 'odd';
    switch (bcSfFilterConfig.custom.products_per_row) {
        case 2: itemColumnNumberClass = bcSfFilterConfig.custom.show_sidebar ? 'six columns' : 'six columns'; break;
        case 3: itemColumnNumberClass = bcSfFilterConfig.custom.show_sidebar ? 'four columns' : 'one-third column'; break;
        default: itemColumnNumberClass = bcSfFilterConfig.custom.show_sidebar ? 'three columns' : 'four columns'; break;
    }
    itemHtml = itemHtml.replace(/{{itemColumnNumberClass}}/g, itemColumnNumberClass);
    itemHtml = itemHtml.replace(/{{itemCollectionGroupThumbClass}}/g, itemCollectionGroupThumbClass);
    itemHtml = itemHtml.replace(/{{itemCollectionGroupMobileClass}}/g, itemCollectionGroupMobileClass);

    // Add onSale label
    var itemSaleLabel = onSale ? bcSfFilterTemplate.saleLabelHtml : '';
    itemHtml = itemHtml.replace(/{{itemSaleLabel}}/g, '');

    // Add Label (New, Coming soon, Pre order)
    var itemNewLabelHtml = '', itemComingsoonLabelHtml = '', itemPreorderLabelHtml = '';
    if (data.collections) {
        var newLabel = data.collections.filter(function(e) { return e.handle == 'new'; });
        itemNewLabelHtml = typeof newLabel[0] != 'undefined' ? '<div class="new_banner">' + bcSfFilterConfig.label.new + '</div>' : '';

        var comingsoonLabel = data.collections.filter(function(e) { return e.handle == 'coming-soon'; });
        itemComingsoonLabelHtml = typeof comingsoonLabel[0] != 'undefined' ? '<div class="new_banner">' + bcSfFilterConfig.label.coming_soon + '</div>' : '';

        var preorderLabel = data.collections.filter(function(e) { return e.handle == 'pre-order'; });
        itemPreorderLabelHtml = typeof preorderLabel[0] != 'undefined' ? '<div class="new_banner">' + bcSfFilterConfig.label.pre_order + '</div>' : '';
    }
    itemHtml = itemHtml.replace(/{{itemNewLabel}}/g, itemNewLabelHtml);
    itemHtml = itemHtml.replace(/{{itemComingsoonLabel}}/g, itemComingsoonLabelHtml);
    itemHtml = itemHtml.replace(/{{itemPreorderLabel}}/g, itemPreorderLabelHtml);

    // Add Quick view button
    var itemQuickViewBtnHtml = bcSfFilterConfig.custom.quick_shop_enabled ? bcSfFilterTemplate.quickViewBtnHtml : '';
    itemHtml = itemHtml.replace(/{{itemQuickViewBtn}}/g, itemQuickViewBtnHtml);

    // Add Thumbnail
    var itemThumbUrl = bcSfFilterConfig.general.no_image_url;
    if (images.length > 0) {
        switch (bcSfFilterConfig.custom.products_per_row) {
            case 2: itemThumbUrl = this.optimizeImage(images[0]['src'], '580x@2x'); break;
            case 3: itemThumbUrl = this.optimizeImage(images[0]['src'], '380x@2x'); break;
            default: itemThumbUrl = this.optimizeImage(images[0]['src'], '280x@2x'); break;
        }
    }
    itemHtml = itemHtml.replace(/{{itemThumbUrl}}/g, itemThumbUrl);

    // Add Flip Image
    var itemFlipImageHtml = '';
    if (bcSfFilterConfig.custom.collection_secondary_image) {
        var itemFlipImageUrl = images.length > 1 ? this.optimizeImage(images[1]['src'], '580x') : itemThumbUrl;
        itemFlipImageHtml += '<img src="' + itemFlipImageUrl + '" class="secondary" alt="{{itemTitle}}" />';
    }
    itemHtml = itemHtml.replace(/{{itemFlipImage}}/g, itemFlipImageHtml);

    // Add Vendor
    var itemVendorHtml = bcSfFilterConfig.custom.display_vendor_collection ? bcSfFilterTemplate.vendorHtml : '';
    itemHtml = itemHtml.replace(/{{itemVendor}}/g, itemVendorHtml);

    // Add Price
    var itemPriceHtml = '';
    itemPriceHtml += '<span class="price ' + saleClass + '" itemprop="offers" itemscope itemtype="http://schema.org/Offer">';
    itemPriceHtml += '<meta itemprop="price" content="' + this.formatMoney(data.price_min, this.moneyFormat) + '" />';
    itemPriceHtml += '<meta itemprop="priceCurrency" content="' + bcSfFilterConfig.shop.currency + '" />';
    itemPriceHtml += '<meta itemprop="seller" content="' + bcSfFilterConfig.shop.name + '" />';
    itemPriceHtml += '<meta itemprop="availability" content="' + soldOutClass + '" />';
    itemPriceHtml += '<meta itemprop="itemCondition" content="New" />';



// Sale on Sale
    if (!soldOut) {
        if (priceVaries && data.price_min > 0) {
            itemPriceHtml += '<small><em>' + bcSfFilterConfig.label.from_price + '</em></small> ';
        }
        var saleCheck = false;
        $.each(data.tags, function(index, value) {
            if(value.toLowerCase() == 'additional_discount'){
                saleCheck=true;
            }

        });
      //console.log(percentage_discount);
        if(typeof percentage_discount === 'undefined') {
            percentage_discount = 1;


        }
        if (data.price_min > 0) {
          if(saleCheck){
            itemPriceHtml += '<span class="money ccs">' + this.formatMoney(data.price_min*percentage_discount, this.moneyFormat) + '</span>';
          }else{
            itemPriceHtml += '<span class="money cdf">' + this.formatMoney(data.price_min, this.moneyFormat) + '</span>';
          }

        } else {
            itemPriceHtml += bcSfFilterConfig.label.free_price;
        }
    } else {

        itemPriceHtml += '<span class="sold_out">' + bcSfFilterConfig.label.sold_out +'</span>';
    }
    is_sale=false;

    data.tags.forEach((tag , index) =>{
        if(tag.toLowerCase() == 'additional_discount'){
            is_sale=true;
        }
    });
    if (onSale) {

        if(typeof discount_enabled != 'undefined' && discount_enabled==='true' && is_sale===true && script_running===true){
          itemPriceHtml += ' <span class="sale money" >' + this.formatMoney(data.price_min, this.moneyFormat) + '</span>';
        }
        itemPriceHtml += ' <span class="was_price">' + this.formatMoney(data.compare_at_price_max, this.moneyFormat) + '</span>';
    }
    itemPriceHtml += '</span>';
    itemHtml = itemHtml.replace(/{{itemPrice}}/g, itemPriceHtml);

    // Add new row
    var itemNewRowHtml = index % bcSfFilterConfig.custom.products_per_row == 0 ? bcSfFilterTemplate.newRowHtml : '';
    itemHtml = itemHtml.replace(/{{itemNewRow}}/g, itemNewRowHtml);


  	itemHtml = itemHtml.replace(/{{colorSwatches}}/g, buildSwatches(data));
    // Add main attribute
    itemHtml = itemHtml.replace(/{{itemId}}/g, data.id);
    itemHtml = itemHtml.replace(/{{itemTitle}}/g, data.title);
    itemHtml = itemHtml.replace(/{{itemVendorLabel}}/g, data.vendor);
    itemHtml = itemHtml.replace(/{{itemUrl}}/g, this.buildProductItemUrl(data));

    return itemHtml;
  //End Sale on Sale
};

// Build advanced class
function buildItemCollectionGroupThumbClass(index, productsPerRow) {
    var temp = index < productsPerRow ? index : index % productsPerRow;
    if (temp == 0) { return 'omega'; }
    else if (temp == 1) { return 'alpha'; }
    return '';
}

// Build Pagination
BCSfFilter.prototype.buildPagination = function(totalProduct) {
    // Get page info
    var currentPage = parseInt(this.queryParams.page);
    var totalPage = Math.ceil(totalProduct / this.queryParams.limit);

    // If it has only one page, clear Pagination
    if (totalPage == 1) {
        jQ(this.selector.pagination).html('');
        return false;
    }

    if (this.getSettingValue('general.paginationType') == 'default') {
        var paginationHtml = bcSfFilterTemplate.paginateHtml;

        // Build Previous
        var previousHtml = (currentPage > 1) ? bcSfFilterTemplate.previousHtml : '';
        previousHtml = previousHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, currentPage -1));
        paginationHtml = paginationHtml.replace(/{{previous}}/g, previousHtml);

        // Build Next
        var nextHtml = (currentPage < totalPage) ? bcSfFilterTemplate.nextHtml : '';
        nextHtml = nextHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, currentPage + 1));
        paginationHtml = paginationHtml.replace(/{{next}}/g, nextHtml);

        // Create page items array
        var beforeCurrentPageArr = [];
        for (var iBefore = currentPage - 1; iBefore > currentPage - 3 && iBefore > 0; iBefore--) {
            beforeCurrentPageArr.unshift(iBefore);
        }
        if (currentPage - 4 > 0) {
            beforeCurrentPageArr.unshift('...');
        }
        if (currentPage - 4 >= 0) {
            beforeCurrentPageArr.unshift(1);
        }
        beforeCurrentPageArr.push(currentPage);

        var afterCurrentPageArr = [];
        for (var iAfter = currentPage + 1; iAfter < currentPage + 3 && iAfter <= totalPage; iAfter++) {
            afterCurrentPageArr.push(iAfter);
        }
        if (currentPage + 3 < totalPage) {
            afterCurrentPageArr.push('...');
        }
        if (currentPage + 3 <= totalPage) {
            afterCurrentPageArr.push(totalPage);
        }

        // Build page items
        var pageItemsHtml = '';
        var pageArr = beforeCurrentPageArr.concat(afterCurrentPageArr);
        for (var iPage = 0; iPage < pageArr.length; iPage++) {
            if (pageArr[iPage] == '...') {
                pageItemsHtml += bcSfFilterTemplate.pageItemRemainHtml;
            } else {
                pageItemsHtml += (pageArr[iPage] == currentPage) ? bcSfFilterTemplate.pageItemSelectedHtml : bcSfFilterTemplate.pageItemHtml;
            }
            pageItemsHtml = pageItemsHtml.replace(/{{itemTitle}}/g, pageArr[iPage]);
            pageItemsHtml = pageItemsHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, pageArr[iPage]));
        }
        paginationHtml = paginationHtml.replace(/{{pageItems}}/g, pageItemsHtml);

        jQ(this.selector.pagination).html(paginationHtml);
    }
};

// Build Sorting
BCSfFilter.prototype.buildFilterSorting = function() {
    if (bcSfFilterTemplate.hasOwnProperty('sortingHtml')) {
        jQ(this.selector.topSorting).html('');

        var sortingArr = this.getSortingList();
        if (sortingArr) {
            // Build content
            var sortingItemsHtml = '';
            for (var k in sortingArr) {
                sortingItemsHtml += '<option value="' + k +'">' + sortingArr[k] + '</option>';
            }
            var html = bcSfFilterTemplate.sortingHtml.replace(/{{sortingItems}}/g, sortingItemsHtml);
            jQ(this.selector.topSorting).html(html);

            // Set current value
            jQ(this.selector.topSorting + ' select').val(this.queryParams.sort);
        }
    }
};

// Build Breadcrumb
BCSfFilter.prototype.buildBreadcrumb = function(colData, apiData) {
    if (typeof colData !== 'undefined' && colData.hasOwnProperty('collection')) {
        var colInfo = colData.collection;
        var breadcrumbHtml = '<span itemscope itemtype="http://data-vocabulary.org/Breadcrumb"><a href="/" title="' + bcSfFilterConfig.shop.name + '"><span itemprop="title">' + bcSfFilterConfig.label.breadcrumb_home + '</span></a></span>';
        breadcrumbHtml += ' <span class="icon-right-arrow"></span>';
        breadcrumbHtml += ' <span itemscope itemtype="http://data-vocabulary.org/Breadcrumb"><a href="/collections' + colInfo.handle + '" title="' + colInfo.title + '" itemprop="url"><span itemprop="title">' + colInfo.title + '</span></a></span>';
        breadcrumbHtml += ' <span id="bc-sf-filter-top-pagination"></span>';
        jQ('.breadcrumb').html(breadcrumbHtml);
    }
};

// Add additional feature for product list, used commonly in customizing product list
BCSfFilter.prototype.buildExtrasProductList = function(data) {
    // Call theme functions
    lazyload();
    collection.init();

    this.buildExtrasProductListByAjax(data, 'boost-integration', function(results){
      results.forEach(function(result){
        // Append the custom html to product item
        jQ('[data-product-id="'+ result.id+ '"] .boost-custom-html').empty().html(result.custom_html);
      })
      if(typeof collection !== "undefined" && collection.hasOwnProperty('init')){
        collection.init()
      }
    })

    // Build content for Quick view
    if (!this.isMobile() && bcSfFilterConfig.custom.quick_shop_enabled) {
        jQ('.thumbnail').each(function (e) {
            var _this = this;
            var url = jQ(this).find(" > a").eq(0).attr("href");
            jQ.ajax({
                type: "GET",
                url: url + '?view=quickview',
                success: function(data){
                    jQ(data).insertAfter(jQ(_this));
                }
            });
        });
    }
  scLoadScript("//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js", function() {
		scjQueryPB = jQuery.noConflict(true);
		scjQueryPB("#sc_pb_css").attr("href", "/apps/product-desc-tabs/scripts/css/pb.css");
    if(sc_pb_app_process)sc_pb_app_process(scjQueryPB);
  });
};

// Build additional elements
BCSfFilter.prototype.buildAdditionalElements = function(data) {
    // Add Wrapper for Product list
    if (jQ('#bc-sf-filter-products').children().hasClass('product-list') || jQ('#bc-sf-filter-products').children().hasClass('products')) {
        jQ('#bc-sf-filter-products').children().children().unwrap();
    }

    // Build Top Pagination
    var totalPage = Math.ceil(data.total_product / this.queryParams.limit);
    var topPaginationHtml = ' <span class="icon-right-arrow"></span> ' + (bcSfFilterConfig.label.breadcrumb_page).replace(/{{ current_page }}/g, this.queryParams.page).replace(/{{ pages }}/g, totalPage);
    jQ('#bc-sf-filter-top-pagination').html(topPaginationHtml);
};

// Build Default layout
function buildDefaultLink(a,b){var c=window.location.href.split("?")[0];return c+="?"+a+"="+b}BCSfFilter.prototype.buildDefaultElements=function(a){if(bcSfFilterConfig.general.hasOwnProperty("collection_count")&&jQ("#bc-sf-filter-bottom-pagination").length>0){var b=bcSfFilterConfig.general.collection_count,c=parseInt(this.queryParams.page),d=Math.ceil(b/this.queryParams.limit);if(1==d)return jQ(this.selector.pagination).html(""),!1;if("default"==this.getSettingValue("general.paginationType")){var e=bcSfFilterTemplate.paginateHtml,f="";f=c>1?bcSfFilterTemplate.hasOwnProperty("previousActiveHtml")?bcSfFilterTemplate.previousActiveHtml:bcSfFilterTemplate.previousHtml:bcSfFilterTemplate.hasOwnProperty("previousDisabledHtml")?bcSfFilterTemplate.previousDisabledHtml:"",f=f.replace(/{{itemUrl}}/g,buildDefaultLink("page",c-1)),e=e.replace(/{{previous}}/g,f);var g="";g=c<d?bcSfFilterTemplate.hasOwnProperty("nextActiveHtml")?bcSfFilterTemplate.nextActiveHtml:bcSfFilterTemplate.nextHtml:bcSfFilterTemplate.hasOwnProperty("nextDisabledHtml")?bcSfFilterTemplate.nextDisabledHtml:"",g=g.replace(/{{itemUrl}}/g,buildDefaultLink("page",c+1)),e=e.replace(/{{next}}/g,g);for(var h=[],i=c-1;i>c-3&&i>0;i--)h.unshift(i);c-4>0&&h.unshift("..."),c-4>=0&&h.unshift(1),h.push(c);for(var j=[],k=c+1;k<c+3&&k<=d;k++)j.push(k);c+3<d&&j.push("..."),c+3<=d&&j.push(d);for(var l="",m=h.concat(j),n=0;n<m.length;n++)"..."==m[n]?l+=bcSfFilterTemplate.pageItemRemainHtml:l+=m[n]==c?bcSfFilterTemplate.pageItemSelectedHtml:bcSfFilterTemplate.pageItemHtml,l=l.replace(/{{itemTitle}}/g,m[n]),l=l.replace(/{{itemUrl}}/g,buildDefaultLink("page",m[n]));e=e.replace(/{{pageItems}}/g,l),jQ(this.selector.pagination).html(e)}}if(bcSfFilterTemplate.hasOwnProperty("sortingHtml")&&jQ(this.selector.topSorting).length>0){jQ(this.selector.topSorting).html("");var o=this.getSortingList();if(o){var p="";for(var q in o)p+='<option value="'+q+'">'+o[q]+"</option>";var r=bcSfFilterTemplate.sortingHtml.replace(/{{sortingItems}}/g,p);jQ(this.selector.topSorting).html(r);var s=void 0!==this.queryParams.sort_by?this.queryParams.sort_by:this.defaultSorting;jQ(this.selector.topSorting+" select").val(s),jQ(this.selector.topSorting+" select").change(function(a){window.location.href=buildDefaultLink("sort_by",jQ(this).val())})}}};

BCSfFilter.prototype.prepareProductData = function(data) { var countData = data.length; for (var k = 0; k < countData; k++) { data[k]['images'] = data[k]['images_info']; if (data[k]['images'].length > 0) { data[k]['featured_image'] = data[k]['images'][0] } else { data[k]['featured_image'] = { src: bcSfFilterConfig.general.no_image_url, width: '', height: '', aspect_ratio: 0 } } data[k]['url'] = '/products/' + data[k].handle; var optionsArr = []; var countOptionsWithValues = data[k]['options_with_values'].length; for (var i = 0; i < countOptionsWithValues; i++) { optionsArr.push(data[k]['options_with_values'][i]['name']) } data[k]['options'] = optionsArr; if (typeof bcSfFilterConfig.general.currencies != 'undefined' && bcSfFilterConfig.general.currencies.length > 1) { var currentCurrency = bcSfFilterConfig.general.current_currency.toLowerCase().trim(); function updateMultiCurrencyPrice(oldPrice, newPrice) { if (typeof newPrice != 'undefined') { return newPrice; } return oldPrice; } data[k].price_min = updateMultiCurrencyPrice(data[k].price_min, data[k]['price_min_' + currentCurrency]); data[k].price_max = updateMultiCurrencyPrice(data[k].price_max, data[k]['price_max_' + currentCurrency]); data[k].compare_at_price_min = updateMultiCurrencyPrice(data[k].compare_at_price_min, data[k]['compare_at_price_min_' + currentCurrency]); data[k].compare_at_price_max = updateMultiCurrencyPrice(data[k].compare_at_price_max, data[k]['compare_at_price_max_' + currentCurrency]); } data[k]['price_min'] *= 100, data[k]['price_max'] *= 100, data[k]['compare_at_price_min'] *= 100, data[k]['compare_at_price_max'] *= 100; data[k]['price'] = data[k]['price_min']; data[k]['compare_at_price'] = data[k]['compare_at_price_min']; data[k]['price_varies'] = data[k]['price_min'] != data[k]['price_max']; var firstVariant = data[k]['variants'][0]; if (getParam('variant') !== null && getParam('variant') != '') { var paramVariant = data.variants.filter(function(e) { return e.id == getParam('variant') }); if (typeof paramVariant[0] !== 'undefined') firstVariant = paramVariant[0] } else { var countVariants = data[k]['variants'].length; for (var i = 0; i < countVariants; i++) { if (data[k]['variants'][i].available) { firstVariant = data[k]['variants'][i]; break } } } data[k]['selected_or_first_available_variant'] = firstVariant; var countVariants = data[k]['variants'].length; for (var i = 0; i < countVariants; i++) { var variantOptionArr = []; var count = 1; var variant = data[k]['variants'][i]; var variantOptions = variant['merged_options']; if (Array.isArray(variantOptions)) { var countVariantOptions = variantOptions.length; for (var j = 0; j < countVariantOptions; j++) { var temp = variantOptions[j].split(':'); data[k]['variants'][i]['option' + (parseInt(j) + 1)] = temp[1]; data[k]['variants'][i]['option_' + temp[0]] = temp[1]; variantOptionArr.push(temp[1]) } data[k]['variants'][i]['options'] = variantOptionArr } data[k]['variants'][i]['compare_at_price'] = parseFloat(data[k]['variants'][i]['compare_at_price']) * 100; data[k]['variants'][i]['price'] = parseFloat(data[k]['variants'][i]['price']) * 100 } data[k]['description'] = data[k]['content'] = data[k]['body_html']; if(data[k].hasOwnProperty('original_tags') && data[k]['original_tags'].length > 0){ data[k].tags = data[k]['original_tags'].slice(0); }} return data };

// Fix image url issue of swatch option
function getFilePath(fileName, ext, version) {
    var self = bcsffilter;
    var ext = typeof ext !== 'undefined' ? ext : 'png';
    var version = typeof version !== 'undefined' ? version : '1';
    var prIndex = self.fileUrl.lastIndexOf('?');
    if (prIndex > 0) {
        var filePath = self.fileUrl.substring(0, prIndex);
    } else {
        var filePath = self.fileUrl;
    }
    filePath += fileName + '.' + ext + '?v=' + version;
    return filePath;
}

/* Begin patch boost-010 run 2 */
BCSfFilter.prototype.initFilter=function(){return this.isBadUrl()?void(window.location.href=window.location.pathname):(this.updateApiParams(!1),void this.getFilterData("init"))},BCSfFilter.prototype.isBadUrl=function(){try{var t=decodeURIComponent(window.location.search).split("&"),e=!1;if(t.length>0)for(var i=0;i<t.length;i++){var n=t[i],a=(n.match(/</g)||[]).length,r=(n.match(/>/g)||[]).length,o=(n.match(/alert\(/g)||[]).length,h=(n.match(/execCommand/g)||[]).length;if(a>0&&r>0||a>1||r>1||o||h){e=!0;break}}return e}catch(l){return!0}};
/* End patch boost-010 run 2 */
