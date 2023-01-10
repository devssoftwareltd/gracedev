// Override Settings
var boostPFSFilterConfig = {
  general: {
    limit: boostPFSConfig.custom.products_per_page,
    // Optional
    loadProductFirst: false,
	enableOTP: true,
    aspect_ratio: boostPFSThemeConfig.custom.aspect_ratio,
    cropImagePossitionEqualHeight: boostPFSThemeConfig.custom.product_img_crop,
    defaultDisplay: boostPFSThemeConfig.custom.product_item_type,
    selectOptionContainer: '.image__container',  // CSS selector to append the product option, if left empty it will append to the product item
  },
  selector: {
    otpButtons: '.image__container',
    otpTopCartCount: '.cart_count'
  }
};

// Declare Templates
var boostPFSTemplate = {
    'saleLabelHtml': '<div class="sale_banner">' + boostPFSConfig.label.sale + '</div>',
    'newLabelHtml': '<div class="new_banner">' + boostPFSConfig.label.new + '</div>',
    'comingsoonLabelHtml': '<div class="new_banner">' + boostPFSConfig.label.coming_soon + '</div>',
    'preorderLabelHtml': '<div class="new_banner">' + boostPFSConfig.label.pre_order + '</div>',
    'reviewHtml': '<span class="shopify-product-reviews-badge" data-id="{{itemId}}"></span>',
    'vendorHtml': '<div class="vendor"><span itemprop="brand">{{itemVendorLabel}}</span></div>',
    'quickViewBtnHtml': '<div data-fancybox-href="#product-{{itemId}}" class="quick_shop action_button" data-gallery="product-{{itemId}}-gallery">' + boostPFSConfig.label.quick_shop + '</div>',
    // 'quickViewBtnHtml': '<span data-fancybox-href="#product-{{itemId}}" class="quick_shop ss-icon" data-gallery="product-{{itemId}}-gallery"><span class="icon-plus"></span></span>',
    'newRowHtml': '<br class="clear product_clear" />',

    // Grid Template
  'productGridItemHtml': '<div data-product-id="{{itemId}}" class="{{itemColumnNumberClass}} {{itemCollectionGroupThumbClass}} thumbnail {{itemCollectionGroupMobileClass}}" itemprop="itemListElement" itemscope itemtype="http://schema.org/Product">' +
                                '<div data-href="{{itemUrl}}">' +
                                    '<div class="relative product_image image__container">' +
  										'<a href="{{itemUrl}}"  itemprop="url" class="sc-pb-element">'+
                                          '<img src="{{itemThumbUrl}}" alt="{{itemTitle}}" class="lazyload transition-in primary" />' +
                                          '{{itemFlipImage}}' +
  										'</a>'+
                                    '</div>' +
                                    '<div class="info">' +
                                        '<span class="title" itemprop="name">{{itemTitle}}</span>' +
                                        '{{itemReviews}}' +
  										'{{itemVendor}}' +
                                        '{{itemPrice}}' +
                                    '</div>' +
                                    '{{itemSaleLabel}}' +
                                    '{{itemNewLabel}}' +
                                    '{{itemComingsoonLabel}}' +
                                    '{{itemPreorderLabel}}' +
                                '</div>' +
  								'{{colorSwatches}}' +
                                '{{itemWishlist}}' +
                            '</div>' +
                            '{{itemNewRow}}',

    // Pagination Template
    'previousHtml': '<span class="prev"><a href="{{itemUrl}}">« ' + boostPFSConfig.label.paginate_prev + '</a></span>',
    'nextHtml': '<span class="next"><a href="{{itemUrl}}">' + boostPFSConfig.label.paginate_next + ' »</a></span>',
    'pageItemHtml': '<span class="page"><a href="{{itemUrl}}">{{itemTitle}}</a></span>',
    'pageItemSelectedHtml': '<span class="page current">{{itemTitle}}</span>',
    'pageItemRemainHtml': '<span class="deco">{{itemTitle}}</span>',
    'paginateHtml': '{{previous}}{{pageItems}}{{next}}',

    // Sorting Template
    'sortingHtml': '<label class="inline">{{sortingLabel}}</label> <select class="sort_by">{{sortingItems}}</select>',
};

(function() {
  var onSale = false,
      soldOut = false,
      priceVaries = false,
      images = [],
      firstVariant = {},
      boostPFSImgDefaultSrc = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
      boostPFSRangeWidths = [180, 360, 540, 720, 900, 1080, 1296, 1512, 1728, 2048];

  BoostPFS.inject(this);

  // Build Product Grid Item
  ProductGridItem.prototype.compileTemplate = function (data, index) {
    if (!data) data = this.data;
    if (!index) index = this.index + 1;
    "undefined"==typeof freegifts_product_json&&(window.freegifts_product_json=function(r){if(r){for(var i=function(r){for(var i in r)if(r.hasOwnProperty(i))return!1;return!0},e=r.price,a=r.price_max,_=r.price_min,p=r.compare_at_price,c=r.compare_at_price_max,t=r.compare_at_price_min,o=0;o<r.variants.length;o++){var n=r.variants[o];"undefined"==typeof SECOMAPP||void 0===SECOMAPP.gifts_list_avai||i(SECOMAPP.gifts_list_avai)||void 0===SECOMAPP.gifts_list_avai[n.id]?(a>=n.price&&(a=n.price,e=n.price),_<=n.price&&(_=n.price),n.compare_at_price&&(c>=n.compare_at_price&&(c=n.compare_at_price,p=n.compare_at_price),t<=n.compare_at_price&&(t=n.compare_at_price)),1==n.available&&(r.available=!0)):(r.variants.splice(o,1),o-=1)}r.price=e,r.price_max=_,r.price_min=a,r.compare_at_price=p,r.compare_at_price_max=t,r.compare_at_price_min=c,r.price_varies=_>a,r.compare_at_price_varies=t>c}return r});
	data = freegifts_product_json(data);
    /*** Prepare data ***/
    var images = data.images_info;
    // Displaying price base on the policy of Shopify, have to multiple by 100
    var soldOut = !data.available; // Check a product is out of stock
    var onSale = data.compare_at_price_min > data.price_min; // Check a product is on sale
    var priceVaries = data.price_min != data.price_max; // Check a product has many prices

    // Get Template
    var itemHtml = boostPFSTemplate.productGridItemHtml;

    var saleClass = onSale ? 'sale' : '';
    var soldOutClass = soldOut ? 'out_of_stock' : 'in_stock';

    var itemColumnNumberClass = '';
    var itemCollectionGroupThumbClass = buildItemCollectionGroupThumbClass(index, boostPFSConfig.custom.products_per_row);
    var itemCollectionGroupMobileClass = (index - 1) % 2 == 0 ? 'even' : 'odd';
    switch (boostPFSConfig.custom.products_per_row) {
        case 2: itemColumnNumberClass = boostPFSConfig.custom.show_sidebar ? 'six columns' : 'six columns'; break;
        case 3: itemColumnNumberClass = boostPFSConfig.custom.show_sidebar ? 'four columns' : 'one-third column'; break;
        default: itemColumnNumberClass = boostPFSConfig.custom.show_sidebar ? 'three columns' : 'four columns'; break;
    }
    itemHtml = itemHtml.replace(/{{itemColumnNumberClass}}/g, itemColumnNumberClass);
    itemHtml = itemHtml.replace(/{{itemCollectionGroupThumbClass}}/g, itemCollectionGroupThumbClass);
    itemHtml = itemHtml.replace(/{{itemCollectionGroupMobileClass}}/g, itemCollectionGroupMobileClass);

    // Add onSale label
    var itemSaleLabel = onSale ? boostPFSTemplate.saleLabelHtml : '';
    itemHtml = itemHtml.replace(/{{itemSaleLabel}}/g, '');

    // Add Label (New, Coming soon, Pre order)
    var itemNewLabelHtml = '', itemComingsoonLabelHtml = '', itemPreorderLabelHtml = '';
    if (data.collections) {
        var newLabel = data.collections.filter(function(e) { return e.handle == 'new'; });
        itemNewLabelHtml = typeof newLabel[0] != 'undefined' ? '<div class="new_banner">' + boostPFSConfig.label.new + '</div>' : '';

        var comingsoonLabel = data.collections.filter(function(e) { return e.handle == 'coming-soon'; });
        itemComingsoonLabelHtml = typeof comingsoonLabel[0] != 'undefined' ? '<div class="new_banner">' + boostPFSConfig.label.coming_soon + '</div>' : '';

        var preorderLabel = data.collections.filter(function(e) { return e.handle == 'pre-order'; });
        itemPreorderLabelHtml = typeof preorderLabel[0] != 'undefined' ? '<div class="new_banner">' + boostPFSConfig.label.pre_order + '</div>' : '';
    }
    itemHtml = itemHtml.replace(/{{itemNewLabel}}/g, itemNewLabelHtml);
    itemHtml = itemHtml.replace(/{{itemComingsoonLabel}}/g, itemComingsoonLabelHtml);
    itemHtml = itemHtml.replace(/{{itemPreorderLabel}}/g, itemPreorderLabelHtml);

    // Add Quick view button
    var itemQuickViewBtnHtml = boostPFSConfig.custom.quick_shop_enabled ? boostPFSTemplate.quickViewBtnHtml : '';
    itemHtml = itemHtml.replace(/{{itemQuickViewBtn}}/g, itemQuickViewBtnHtml);

    // Add Thumbnail
    var itemThumbUrl = boostPFSConfig.general.no_image_url;
    if (images.length > 0) {
        switch (boostPFSConfig.custom.products_per_row) {
            case 2: itemThumbUrl = Utils.optimizeImage(images[0]['src'], '580x@2x'); break;
            case 3: itemThumbUrl = Utils.optimizeImage(images[0]['src'], '380x@2x'); break;
            default: itemThumbUrl = Utils.optimizeImage(images[0]['src'], '280x@2x'); break;
        }
    }
    itemHtml = itemHtml.replace(/{{itemThumbUrl}}/g, itemThumbUrl);

    // Add Flip Image
    var itemFlipImageHtml = '';
    if (boostPFSConfig.custom.collection_secondary_image) {
        var itemFlipImageUrl = images.length > 1 ? Utils.optimizeImage(images[1]['src'], '580x') : itemThumbUrl;
        itemFlipImageHtml += '<img src="' + itemFlipImageUrl + '" class="secondary" alt="{{itemTitle}}" />';
    }
    itemHtml = itemHtml.replace(/{{itemFlipImage}}/g, itemFlipImageHtml);

    // Add Vendor
    var itemVendorHtml = boostPFSConfig.custom.display_vendor_collection ? boostPFSTemplate.vendorHtml : '';
    itemHtml = itemHtml.replace(/{{itemVendor}}/g, itemVendorHtml);

    // Add Reviews
    if (typeof Integration === 'undefined' || !Integration.hascompileTemplate('reviews')) {
      	itemHtml = itemHtml.replace(/{{itemReviews}}/g, '');
    }

    // Add Price
    var itemPriceHtml = '';
    itemPriceHtml += '<span class="price ' + saleClass + '" itemprop="offers" itemscope itemtype="http://schema.org/Offer">';
    itemPriceHtml += '<meta itemprop="price" content="' + Utils.formatMoney(data.price_min, this.moneyFormat) + '" />';
    itemPriceHtml += '<meta itemprop="priceCurrency" content="' + boostPFSConfig.shop.currency + '" />';
    itemPriceHtml += '<meta itemprop="seller" content="' + boostPFSConfig.shop.name + '" />';
    itemPriceHtml += '<meta itemprop="availability" content="' + soldOutClass + '" />';
    itemPriceHtml += '<meta itemprop="itemCondition" content="New" />';



// Sale on Sale
    if (!soldOut) {
        if (priceVaries && data.price_min > 0) {
            itemPriceHtml += '<small><em>' + boostPFSConfig.label.from_price + '</em></small> ';
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
            itemPriceHtml += '<span class="money ccs">' + Utils.formatMoney(data.price_min*percentage_discount, Globals.moneyFormat) + '</span>';
          }else{
            itemPriceHtml += '<span class="money cdf">' + Utils.formatMoney(data.price_min, Globals.moneyFormat) + '</span>';
          }

        } else {
            itemPriceHtml += boostPFSConfig.label.free_price;
        }
    } else {

        itemPriceHtml += '<span class="sold_out">' + boostPFSConfig.label.sold_out +'</span>';
    }
    is_sale=false;

    data.tags.forEach((tag , index) =>{
        if(tag.toLowerCase() == 'additional_discount'){
            is_sale=true;
        }
    });
    if (onSale) {

        if(typeof discount_enabled != 'undefined' && discount_enabled==='true' && is_sale===true && script_running===true){
            itemPriceHtml += ' <span class="sale money" >' + Utils.formatMoney(data.price_min, Globals.moneyFormat) + '</span>';
        }
        itemPriceHtml += ' <span class="was_price">' + Utils.formatMoney(data.compare_at_price_max, Globals.moneyFormat) + '</span>';
    }
    itemPriceHtml += '</span>';
    itemHtml = itemHtml.replace(/{{itemPrice}}/g, itemPriceHtml);

    // Add new row
    var itemNewRowHtml = index % boostPFSConfig.custom.products_per_row == 0 ? boostPFSTemplate.newRowHtml : '';
    itemHtml = itemHtml.replace(/{{itemNewRow}}/g, itemNewRowHtml);


  	itemHtml = itemHtml.replace(/{{colorSwatches}}/g, buildSwatches(data));

    var wishListHtml = '<span class="smartwishlist" data-product="'+ data.id +'" data-variant="'+ data.variants[0].id +'"></span>';
    itemHtml = itemHtml.replace(/{{itemWishlist}}/g, '');

    // Add main attribute
    itemHtml = itemHtml.replace(/{{itemId}}/g, data.id);
    itemHtml = itemHtml.replace(/{{itemTitle}}/g, data.title);
    itemHtml = itemHtml.replace(/{{itemVendorLabel}}/g, data.vendor);
    itemHtml = itemHtml.replace(/{{itemUrl}}/g, Utils.buildProductItemUrl(data));

    return itemHtml;
  };

  // Build advanced class
  function buildItemCollectionGroupThumbClass(index, productsPerRow) {
    var temp = index < productsPerRow ? index : index % productsPerRow;
    if (temp == 0) { return 'omega'; }
    else if (temp == 1) { return 'alpha'; }
    return '';
  }

  function buildImages(data){
    var images = data.images_info;
    if (!images || images.length == 0){
      images = [];
      images.push({
        src: boostPFSAppConfig.general.no_image_url,
        width: 480,
        height: 480
      })
    }

    var maxWidth = images[0].width;
    if (boostPFSConfig.custom.align_height && boostPFSConfig.custom.collection_height){
      var aspectRatio = images[0].width / images[0].height;
      maxWidth = aspectRatio * boostPFSConfig.custom.collection_height;
    }

    var alignHeightStyle = images[0].width > images[0].height ? ' height: auto;' : '';

    var html = '<div class="image__container" style="max-width: '+ maxWidth +'px;">' +
        '<img src="'+ Utils.optimizeImage(images[0].src, '300x') +'"' +
        ' alt="{{itemTitle}}"' +
        ' class="lazyload lazyload--fade-in"' +
        ' style="width: 100%; max-width: '+ images[0].width +'px; '+ alignHeightStyle +'"' +
        ' data-sizes="auto"' +
        ' data-src="'+ Utils.optimizeImage(images[0].src, '2048x') +'"' +
        ' data-srcset="'+ bgset(images[0]) +'"/>' +
        '{{flipImageHtml}}' +
        '</div>';

    var flipImageHtml = '';
    if (images.length > 1 && boostPFSConfig.custom.collection_secondary_image){
      flipImageHtml = '<div class="image__container" style="max-width: '+ images[1].width +'">' +
        '<img src="'+ Utils.optimizeImage(images[1].src, '900x') +'"' +
        ' class="secondary lazyload"' +
        ' alt="{{itemTitle}}"/>' +
        '</div>';
    }
    html = html.replace(/{{flipImageHtml}}/g, flipImageHtml);
    return html;
  }


  function buildSwatches(data){
    var swatchesHtml;
    data.options.forEach((option , index) =>{
      if(option.toLowerCase().indexOf("color") > -1 || option.toLowerCase().indexOf("colour") > -1 ){
        let values = [];
        var option_index = index;
        swatchesHtml = '<div class="collection_swatches">';
        data.variants.forEach(variant => {
          var value = variant.options[index];
          if(values.indexOf(value) < 0){
            values.push(value);
            swatchesHtml += '<a href="{{itemUrl}}?variant='+variant.id+'" class="swatch">';
            var value = value.toLowerCase().replace(/\s/g , "-");
            var swatchHandle = boostPFSAppConfig.general.asset_url.replace('boost-pfs.js', Utils.slugify(value) + '_50x.png');

            swatchesHtml += '<span data-image="'+variant.image+'" style="background-image: url('+swatchHandle+'); background-color: '+value+'"></span></a>';
          }
        })
      }
      swatchesHtml += '</div>';
    })
    return swatchesHtml;
  }



  function bgset(image) {
    var bgset = '';
    if (image) {
      var aspect_ratio = image.width / image.height;

      if (image.width > 180) bgset += ' ' + Utils.optimizeImage(image.src, '180x') + ' 180w ' + Math.round(180 / aspect_ratio) + 'h,';
      if (image.width > 360) bgset += ' ' + Utils.optimizeImage(image.src, '360x') + ' 360w ' + Math.round(360 / aspect_ratio) + 'h,';
      if (image.width > 540) bgset += ' ' + Utils.optimizeImage(image.src, '540x') + ' 540w ' + Math.round(540 / aspect_ratio) + 'h,';
      if (image.width > 720) bgset += ' ' + Utils.optimizeImage(image.src, '720x') + ' 720w ' + Math.round(720 / aspect_ratio) + 'h,';
      if (image.width > 900) bgset += ' ' + Utils.optimizeImage(image.src, '900x') + ' 900w ' + Math.round(900 / aspect_ratio) + 'h,';
      if (image.width > 1080) bgset += ' ' + Utils.optimizeImage(image.src, '1080x') + ' 1080w ' + Math.round(1080 / aspect_ratio) + 'h,';
      if (image.width > 1296) bgset += ' ' + Utils.optimizeImage(image.src, '1296x') + ' 1296w ' + Math.round(1296 / aspect_ratio) + 'h,';
      if (image.width > 1512) bgset += ' ' + Utils.optimizeImage(image.src, '1512x') + ' 1512w ' + Math.round(1512 / aspect_ratio) + 'h,';
      if (image.width > 1728) bgset += ' ' + Utils.optimizeImage(image.src, '1728x') + ' 1728w ' + Math.round(1728 / aspect_ratio) + 'h,';
      if (image.width > 1950) bgset += ' ' + Utils.optimizeImage(image.src, '1950x') + ' 1950w ' + Math.round(1950 / aspect_ratio) + 'h,';
      if (image.width > 2100) bgset += ' ' + Utils.optimizeImage(image.src, '2100x') + ' 2100w ' + Math.round(2100 / aspect_ratio) + 'h,';
      if (image.width > 2260) bgset += ' ' + Utils.optimizeImage(image.src, '2260x') + ' 2260w ' + Math.round(2260 / aspect_ratio) + 'h,';
      if (image.width > 2450) bgset += ' ' + Utils.optimizeImage(image.src, '2450x') + ' 2450w ' + Math.round(2450 / aspect_ratio) + 'h,';
      if (image.width > 2700) bgset += ' ' + Utils.optimizeImage(image.src, '2700x') + ' 2700w ' + Math.round(2700 / aspect_ratio) + 'h,';
      if (image.width > 3000) bgset += ' ' + Utils.optimizeImage(image.src, '3000x') + ' 3000w ' + Math.round(3000 / aspect_ratio) + 'h,';
      if (image.width > 3350) bgset += ' ' + Utils.optimizeImage(image.src, '3350x') + ' 3350w ' + Math.round(3350 / aspect_ratio) + 'h,';
      if (image.width > 3750) bgset += ' ' + Utils.optimizeImage(image.src, '3750x') + ' 3750w ' + Math.round(3750 / aspect_ratio) + 'h,';
      if (image.width > 4100) bgset += ' ' + Utils.optimizeImage(image.src, '4100x') + ' 180w ' + Math.round(4100 / aspect_ratio) + 'h,';
      bgset += ' ' + image.src + ' ' + image.width + 'w ' + image.height + 'h,';
    }
    return bgset;
  }

  // Build Pagination
  ProductPaginationDefault.prototype.compileTemplate = function (totalProduct) {
    if (!totalProduct) totalProduct = this.totalProduct;
    // Get page info
    var currentPage = parseInt(Globals.queryParams.page);
    var totalPage = Math.ceil(totalProduct / Globals.queryParams.limit);

    // If it has only one page, clear Pagination
    if (totalPage == 1) {
      return '';
    }

    if (Settings.getSettingValue('general.paginationType') == 'default') {
      var paginationHtml = boostPFSTemplate.paginateHtml;

      // Build Previous
      var previousHtml = (currentPage > 1) ? boostPFSTemplate.previousHtml : '';
      previousHtml = previousHtml.replace(/{{itemUrl}}/g, Utils.buildToolbarLink('page', currentPage, currentPage - 1));
      paginationHtml = paginationHtml.replace(/{{previous}}/g, previousHtml);

      // Build Next
      var nextHtml = (currentPage < totalPage) ? boostPFSTemplate.nextHtml : '';
      nextHtml = nextHtml.replace(/{{itemUrl}}/g, Utils.buildToolbarLink('page', currentPage, currentPage + 1));
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
          pageItemsHtml += boostPFSTemplate.pageItemRemainHtml;
        } else {
          pageItemsHtml += (pageArr[iPage] == currentPage) ? boostPFSTemplate.pageItemSelectedHtml : boostPFSTemplate.pageItemHtml;
        }
        pageItemsHtml = pageItemsHtml.replace(/{{itemTitle}}/g, pageArr[iPage]);
        pageItemsHtml = pageItemsHtml.replace(/{{itemUrl}}/g, Utils.buildToolbarLink('page', currentPage, pageArr[iPage]));
      }
      paginationHtml = paginationHtml.replace(/{{pageItems}}/g, pageItemsHtml);

      return paginationHtml;
    }

    return '';
  };

  // Build Sorting
  ProductSorting.prototype.compileTemplate = function () {
    if (boostPFSTemplate.hasOwnProperty('sortingHtml')) {
      jQ(Selector.topSorting).html('');

      var sortingArr = Utils.getSortingList();
      if (sortingArr) {
        // Build content
        var sortingItemsHtml = '';
        for (var k in sortingArr) {
          sortingItemsHtml += '<option value="' + k + '">' + sortingArr[k] + '</option>';
        }
        var html = boostPFSTemplate.sortingHtml.replace(/{{sortingItems}}/g, sortingItemsHtml).replace(/{{sortingLabel}}/g, Labels.sorting);
        jQ(Selector.topSorting).html(html);

        // Set current value
        jQ(Selector.topSorting + ' select').val(Globals.queryParams.sort);
      }
    }
  };

  // Build Breadcrumb
  Breadcrumb.prototype.compileTemplate = function (colData, apiData) {
    if (typeof colData !== 'undefined' && colData.hasOwnProperty('collection')) {
      var colInfo = colData.collection;
      var breadcrumbHtml = '<span itemscope itemtype="http://data-vocabulary.org/Breadcrumb"><a href="/" title="' + boostPFSConfig.shop.name + '"><span itemprop="title">' + boostPFSConfig.label.breadcrumb_home + '</span></a></span>';
      breadcrumbHtml += ' <span class="icon-right-arrow"></span>';
      breadcrumbHtml += ' <span itemscope itemtype="http://data-vocabulary.org/Breadcrumb"><a href="/collections' + colInfo.handle + '" title="' + colInfo.title + '" itemprop="url"><span itemprop="title">' + colInfo.title + '</span></a></span>';
      breadcrumbHtml += ' <span class="boost-pfs-filter-top-pagination"></span>';
      jQ('.breadcrumb').html(breadcrumbHtml);
    }
  };

  // Add additional feature for product list, used commonly in customizing product list
  ProductList.prototype.afterRender = function (data) {
    if (!data) data = this.data;
    // Build content for Quick view
    if (!Utils.isMobile() && boostPFSConfig.custom.quick_shop_enabled) {
      this.buildExtrasProductListByAjax(data, "boost-pfs", function(results){
        results.forEach(function(result, index){
          // Append the custom html to product item
          jQ(result.quickshop_html).insertAfter(jQ('[data-boost-theme-quickview="'+ result.id+ '"]'));
          if(index == results.length - 1){
            buildTheme();
          }
        })
      });
    }

    if(typeof collection !== "undefined" && collection.hasOwnProperty('init')){
        collection.init()
      }
  };

  // Build additional elements
  FilterResult.prototype.afterRender = function (data) {
    if (!data) data = this.data;
    // Add Wrapper for Product list
    if (jQ('.boost-pfs-filter-products').children().hasClass('product-list') || jQ('.boost-pfs-filter-products').children().hasClass('products')) {
      jQ('.boost-pfs-filter-products').children().children().unwrap();
    }

    // Build Top Pagination
    var totalPage = Math.ceil(data.total_product / Globals.queryParams.limit);
    var topPaginationHtml = ' <span class="icon-right-arrow"></span> ' + (boostPFSConfig.label.breadcrumb_page).replace(/{{ current_page }}/g, Globals.queryParams.page).replace(/{{ pages }}/g, totalPage);
    jQ('.boost-pfs-filter-top-pagination').html(topPaginationHtml);

    scLoadScript("//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js", function() {
      scjQueryPB = jQuery.noConflict(true);
      scjQueryPB("#sc_pb_css").attr("href", "/apps/product-desc-tabs/scripts/css/pb.css");
      if(sc_pb_app_process)sc_pb_app_process(scjQueryPB);
    });

    // if (data.event_type != 'init' && typeof ReloadSmartWishlist !== 'undefined') { ReloadSmartWishlist(); }
  };

  function buildTheme(){
    if (typeof window.lazyload == 'function'){
      lazyload();
    }
    if (boostPFSConfig.custom.show_multiple_currencies && typeof window.convertCurrencies == 'function'){
      convertCurrencies();
    }
    collection.init();
    product.init();
    Shopify.PaymentButton.init();
  }

  BoostOTP.AjaxCart.prototype.isRender = function() { return false; }

  // Prevent call cart.js after adding a product
  BoostOTP.AjaxCart.prototype.getCart = function(isOpenCart) { }

  // Customize Success add to Cart method
  var onSuccessAddToCart = BoostOTP.AjaxCart.prototype.onSucess;

  BoostOTP.AjaxCart.prototype.onSucess = function(data, $addingLabel, $errorLabel) {
    onSuccessAddToCart.call(this, data, $addingLabel, $errorLabel);

    // Call theme function
    if(Utils.isMobile()) {
    	jQ('.boost-pfs-select-option-close').click();
    }
    jQ('.boost-pfs-quickview-close.boost-pfs-filter-button').click()
    ajaxCart.load();
    jQ('body').addClass('drawer-cart-open');
  }


})();
