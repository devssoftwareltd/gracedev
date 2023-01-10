/*============================================================================
  Ajax the add to cart experience by revealing it in a side drawer
  Plugin Documentation - http://shopify.github.io/Timber/#ajax-cart
  (c) Copyright 2015 Shopify Inc. Author: Carson Shold (@cshold). All Rights Reserved.

  This file includes:
    - Basic Shopify Ajax API calls
    - Ajax cart plugin

  This requires:
    - jQuery 1.8+
    - handlebars.min.js (for cart template)
    - modernizer.min.js
    - snippet/ajax-cart-template.liquid

  Customized version of Shopify's jQuery API
  (c) Copyright 2009-2015 Shopify Inc. Author: Caroline Schnapp. All Rights Reserved.

==============================================================================*/
if ((typeof ShopifyAPI) === 'undefined') { ShopifyAPI = {}; }

/*============================================================================
  API Helper Functions
==============================================================================*/
function attributeToString(attribute) {
  if ((typeof attribute) !== 'string') {
    attribute += '';
    if (attribute === 'undefined') {
      attribute = '';
    }
  }
  return jQuery.trim(attribute);
};

/*============================================================================
  API Functions
==============================================================================*/
ShopifyAPI.onCartUpdate = function(cart) {
  // alert('There are now ' + cart.item_count + ' items in the cart.');
};

ShopifyAPI.updateCartNote = function(note, callback) {
  var params = {
    type: 'POST',
    url: '/cart/update.js',
    data: 'note=' + attributeToString(note),
    dataType: 'json',
    success: function(cart) {
      if ((typeof callback) === 'function') {
        callback(cart);
      }
      else {
        ShopifyAPI.onCartUpdate(cart);
      }
    },
    error: function(XMLHttpRequest, textStatus) {
      ShopifyAPI.onError(XMLHttpRequest, textStatus);
    }
  };
  jQuery.ajax(params);
};

ShopifyAPI.onError = function(XMLHttpRequest, textStatus) {
  var data = eval('(' + XMLHttpRequest.responseText + ')');
  if (!!data.message) {
    alert(data.message + '(' + data.status  + '): ' + data.description);
  }
};

/*============================================================================
  POST to cart/add.js returns the JSON of the cart
    - Allow use of form element instead of just id
    - Allow custom error callback
==============================================================================*/
ShopifyAPI.addItemFromForm = function(form, callback, errorCallback) {
 /*var upsell_id = ``;
 upsell_id = parseInt(upsell_id);
 if($("#upsell-check").is(':checked')){
     jQuery.ajax({
       type: "POST",
       url: '/cart/add.js',
       data: 'quantity=1&id='+upsell_id,             
       async: false
     });
   }*/
  var params = {
    type: 'POST',
    url: '/cart/add.js',
    data: jQuery(form).serialize(),
    dataType: 'json',
    success: function(line_item) {
      if ((typeof callback) === 'function') {
        callback(line_item, form);
      }
      else {
        ShopifyAPI.onItemAdded(line_item, form);
      }
      $(".cart-title").html("<span class='check_top'>&#10004;</span> An Item Was Added To Your Cart!");
    },
    error: function(XMLHttpRequest, textStatus) {
      if ((typeof errorCallback) === 'function') {
        errorCallback(XMLHttpRequest, textStatus);
      }
      else {
        ShopifyAPI.onError(XMLHttpRequest, textStatus);
      }
    }
  };
  jQuery.ajax(params);
};

// Get from cart.js returns the cart in JSON
ShopifyAPI.getCart = function(callback) {
  jQuery.getJSON('/cart.js', function (cart, textStatus) {
    if ((typeof callback) === 'function') {
      callback(cart);
    }
    else {
      ShopifyAPI.onCartUpdate(cart);
    }
    $(".counter").text(cart.item_count);
    var item_label = cart.item_count <= 1 ?  " Item" : " Items";
    $("#CartContainer").find(".itemcount").text(item_label);
  
    console.log(cart);console.log('yes');
    
    /* Free Shipping Text */
    var no_of_product = document.querySelectorAll(".ajaxcart__product").length;
    //var shipping_message_in_ajax = document.getElementById("shipping_message_in_ajax");
    //if(shipping_message_in_ajax){
    //  document.getElementById("shipping_message_in_ajax").remove();
    //}
    $('#shipping_message_in_ajax').text('');
    if(cart.total_price > 9900){
    	$('#shipping_message_in_ajax').text('CONGRATULATIONS! You\'ve earned FREE SHIPPING!'); 
        $('.cart__shipping-progress span').css('width','100%');
    }else{
      	var new_value = 9900 - cart.total_price;
        var percent_value = new_value*100/9900;
        percent_value = 100 - percent_value;
        $('.cart__shipping-progress span').css('width',percent_value+'%');
        var new_value1 = new_value/100;
    	$('#shipping_message_in_ajax').text('You\'re just $'+new_value1+' away from FREE SHIPPING'); 
        
    }
    
    
    
    
    if(no_of_product > 0){
      $('.free_shipping').show(); 
     // $(".cart-title").html("<i class='fa fa-check' aria-hidden='true'></i>  An Item Was Added To Cart!");
    } else {
      $('.free_shipping').hide(); 
      $(".cart-title").html("YOUR CART IS CURRENTLY EMPTY!");
    }
  });
};

// POST to cart/change.js returns the cart in JSON
ShopifyAPI.changeItem = function(variant_id, quantity, callback) {
  var params = {
    type: 'POST',
    url: '/cart/change.js',
    data:  'quantity='+quantity+'&id='+variant_id,
    dataType: 'json',
    success: function(cart) {
      if ((typeof callback) === 'function') {
        callback(cart);
      }
      else {
        ShopifyAPI.onCartUpdate(cart);
      }
    },
    error: function(XMLHttpRequest, textStatus) {
      ShopifyAPI.onError(XMLHttpRequest, textStatus);
    }
  };
  jQuery.ajax(params);
};

/*============================================================================
  Ajax Shopify Add To Cart
==============================================================================*/
var ajaxCart = (function(module, $) {

  'use strict';

  // Public functions
  var init, loadCart;

  // Private general variables
  var settings, $body;

  // Private plugin variables
  var $formContainer, $addToCart, $cartCountSelector, $cartCostSelector, $cartContainer, $drawerContainer;

  // Private functions
  var updateCountPrice, formOverride, itemAddedCallback, itemErrorCallback, cartUpdateCallback, buildCart, cartCallback, adjustCart, adjustCartCallback, createQtySelectors, qtySelectors, validateQty;

  /*============================================================================
    Initialise the plugin and define global options
  ==============================================================================*/
  init = function (options) {

    // Default settings
    settings = {
      formSelector       : 'form[action^="/cart/add"]',
      cartContainer      : '#CartContainer',
      addToCartSelector  : 'input[type="submit"]',
      cartCountSelector  : '#CartCount',
      cartCostSelector   : null,
      moneyFormat        : '$',
      disableAjaxCart    : false,
      enableQtySelectors : true
    };

    // Override defaults with arguments
    $.extend(settings, options);

    // Select DOM elements
    $formContainer     = $(settings.formSelector);
    $cartContainer     = $(settings.cartContainer);
    $addToCart         = $formContainer.find(settings.addToCartSelector);
    $cartCountSelector = $(settings.cartCountSelector);
    $cartCostSelector  = $(settings.cartCostSelector);

    // General Selectors
    $body = $('body');

    // Setup ajax quantity selectors on the any template if enableQtySelectors is true
    if (settings.enableQtySelectors) {
      qtySelectors();
    }

    // Take over the add to cart form submit action if ajax enabled
    if (!settings.disableAjaxCart && $addToCart.length) {
      formOverride();
    }

    // Run this function in case we're using the quantity selector outside of the cart
    adjustCart();
  };

  loadCart = function () {
    $body.addClass('drawer--is-loading');
    ShopifyAPI.getCart(cartUpdateCallback);
    
  };
  updateCountPrice = function (cart) {
    if ($cartCountSelector) {
      $cartCountSelector.html(cart.item_count).removeClass('hidden-count');

      if (cart.item_count === 0) {
        $cartCountSelector.addClass('hidden-count');
      }
    }
    if ($cartCostSelector) {
      $cartCostSelector.html(Shopify.formatMoney(cart.total_price, settings.moneyFormat));
    }
  };

  formOverride = function () {
    $formContainer.on('submit', function(evt) {
      evt.preventDefault();

      // Add class to be styled if desired
      $addToCart.removeClass('is-added').addClass('is-adding');

      // Remove any previous quantity errors
      $('.qty-error').remove();

      ShopifyAPI.addItemFromForm(evt.target, itemAddedCallback, itemErrorCallback);
    });
  };

  itemAddedCallback = function (product) {
    $addToCart.removeClass('is-adding').addClass('is-added');

    ShopifyAPI.getCart(cartUpdateCallback);
  };

  itemErrorCallback = function (XMLHttpRequest, textStatus) {
    var data = eval('(' + XMLHttpRequest.responseText + ')');
    $addToCart.removeClass('is-adding is-added');

    if (!!data.message) {
      if (data.status == 422) {
        $formContainer.after('<div class="errors qty-error">'+ data.description +'</div>')
      }
    }
  };

  cartUpdateCallback = function (cart) {
    // Update quantity and price
    updateCountPrice(cart);
    buildCart(cart);
  };

  buildCart = function (cart) {
    // Start with a fresh cart div
    $cartContainer.empty();
  
    // Show empty cart
    if (cart.item_count === 0) {
      $cartContainer
        .append('<p class="empty">' + 'Empty Cart' + '</p>');
      cartCallback(cart);
      return;
    }

    // Handlebars.js cart layout
    var items = [],
        item = {},
        data = {},
        source = $("#CartTemplate").html(),
        template = Handlebars.compile(source);

    // Add each item to our handlebars.js data
    $.each(cart.items, function(index, cartItem) {
      var itemAdd = cartItem.quantity + 1,
          itemMinus = cartItem.quantity - 1,
          itemQty = cartItem.quantity;

      /* Hack to get product image thumbnail
       *   - If image is not null
       *     - Remove file extension, add _small, and re-add extension
       *     - Create server relative link
       *   - A hard-coded url of no-image
      */

      if (cartItem.image != null){
        var prodImg = cartItem.image.replace(/(\.[^.]*)$/, "_small$1").replace('http:', '');
      } else {
        var prodImg = "//cdn.shopify.com/s/assets/admin/no-image-medium-cc9732cb976dd349a0df1d39816fbcc7.gif";
      }

      var prodName = cartItem.product_title,
          prodVariation = cartItem.variant_title;

      if (prodVariation == 'Default Title') {
        prodVariation = false;
      }

      // Create item's data object and add to 'items' array
      item = {
        id:cartItem.id,
        key: cartItem.key,
        line: index + 1, // Shopify uses a 1+ index in the API
        url: cartItem.url,
        img: prodImg,
        name: cartItem.product_title,
        variation: cartItem.variant_title,
        properties: cartItem.properties,
        itemAdd: cartItem.quantity + 1,
        itemMinus: cartItem.quantity - 1,
        itemQty: cartItem.quantity,
        price: Shopify.formatMoney(cartItem.price, settings.moneyFormat),
        vendor: cartItem.vendor,
        linePrice: Shopify.formatMoney(cartItem.line_price, settings.moneyFormat),
        originalLinePrice: Shopify.formatMoney(cartItem.original_line_price, settings.moneyFormat),
        discounts: cartItem.discounts,
        discountsApplied: cartItem.line_price === cartItem.original_line_price ? false : true
      };

      items.push(item);
    });

    // Gather all cart data and add to DOM
    data = {
      items: items,
      note: cart.note,
      totalPrice: Shopify.formatMoney(cart.total_price, settings.moneyFormat)
    }

    $cartContainer.append(template(data));

    cartCallback(cart);
  };

  cartCallback = function(cart) {
    $body.removeClass('drawer--is-loading');
    $body.trigger('ajaxCart.afterCartLoad', cart);
  };

  adjustCart = function () {
    // Delegate all events because elements reload with the cart

    // Add or remove from the quantity
    $body.on('click', '.ajaxcart__qty-adjust', function() {
      var el = $(this),
          id = el.data('id'),
          qtySelector = el.siblings('.ajaxcart__qty-num'),
          qty = parseInt(qtySelector.val().replace(/\D/g, ''));

      var qty = validateQty(qty);

      // Add or subtract from the current quantity
      if (el.hasClass('ajaxcart__qty--plus')) {
        qty = qty + 1;
      } else {
        qty = qty - 1;
        if (qty <= 0) qty = 0;
      }

      // If it has a data-id, update the cart.
      // Otherwise, just update the input's number
      if (id) {
        updateQuantity(id, qty);
      } else {
        qtySelector.val(qty);
      }
    });
    
     // Add or remove from the quantity
    $body.on('click', '.ajaxcart__qty-remove', function(e) {
        e.preventDefault();
   		var el = $(this),
          id = el.data('id'),
          qtySelector = el.siblings('.ajaxcart__qty-num'),
          qty = 0;

      var qty = validateQty(qty);

      // Add or subtract from the current quantity
      if (el.hasClass('ajaxcart__qty--plus')) {
        qty = qty + 1;
      } else {
        qty = qty - 1;
        if (qty <= 0) qty = 0;
      }

      // If it has a data-id, update the cart.
      // Otherwise, just update the input's number
      if (id) {
        updateQuantity(id, qty);
      } else {
        qtySelector.val(qty);
      }
    //  $(this).closest(".ajaxcart__row").slideUp();
    });

    // Update quantity based on input on change
    $body.on('change', '.ajaxcart__qty-num', function() {
      var el = $(this),
          id = el.data('id'),
          qty = parseInt(el.val().replace(/\D/g, ''));

      var qty = validateQty(qty);

      // Only update the cart via ajax if we have a variant ID to work with
      if (id) {
        updateQuantity(id, qty);
      }
    });

    // Highlight the text when focused
    $body.on('focus', '.ajaxcart__qty-adjust', function() {
      var el = $(this);
      setTimeout(function() {
        el.select();
      }, 50);
    });

    function updateQuantity(id, qty) {
      // Add activity classes when changing cart quantities
      var row = $('.ajaxcart__row[data-id="' + id + '"]').addClass('is-loading');

      if (qty === 0) {
        row.parent().addClass('is-removed');
      }

      // Slight delay to make sure removed animation is done
      setTimeout(function() {
        ShopifyAPI.changeItem(id, qty, adjustCartCallback);
      }, 250);
    }

    // Save note anytime it's changed
    $body.on('change', 'textarea[name="note"]', function() {
      var newNote = $(this).val();

      // Update the cart note in case they don't click update/checkout
      ShopifyAPI.updateCartNote(newNote, function(cart) {});
    });
  };

  adjustCartCallback = function (cart) {
    // Update quantity and price
    updateCountPrice(cart);

    // Reprint cart on short timeout so you don't see the content being removed
    setTimeout(function() {
      ShopifyAPI.getCart(buildCart);
    }, 150)
  };

  createQtySelectors = function() {
    // If there is a normal quantity number field in the ajax cart, replace it with our version
    if ($('.ajaxcart__qty-num', $cartContainer).length) {
      $('.ajaxcart__qty-num', $cartContainer).each(function() {
        var el = $(this),
            currentQty = el.val();

        var itemAdd = currentQty + 1,
            itemMinus = currentQty - 1,
            itemQty = currentQty;

        var source   = $("#AjaxQty").html(),
            template = Handlebars.compile(source),
            data = {
              id: el.data('id'),
              itemQty: itemQty,
              itemAdd: itemAdd,
              itemMinus: itemMinus
            };

        // Append new quantity selector then remove original
        el.after(template(data)).remove();
      });
    }

    // If there is a regular link to remove an item, add attributes needed for ajax
    if ($('a[href^="/cart/change"]', $cartContainer).length) {
      $('a[href^="/cart/change"]', $cartContainer).each(function() {
        var el = $(this).addClass('ajaxcart__remove');
      });
    }
  };

  qtySelectors = function() {
    // Change number inputs to JS ones, similar to ajax cart but without API integration.
    // Make sure to add the existing name and id to the new input element
    var numInputs = $('input.ajaxcart__qty-num');

    if (numInputs.length) {
      numInputs.each(function() {
        var el = $(this),
            currentQty = el.val(),
            inputName = el.attr('name'),
            inputId = el.attr('id');

        var itemAdd = currentQty + 1,
            itemMinus = currentQty - 1,
            itemQty = currentQty;

        var source   = $("#JsQty").html(),
            template = Handlebars.compile(source),
            data = {
              id: el.data('id'),
              itemQty: itemQty,
              itemAdd: itemAdd,
              itemMinus: itemMinus,
              inputName: inputName,
              inputId: inputId
            };

        // Append new quantity selector then remove original
        el.after(template(data)).remove();
      });

      // Setup listeners to add/subtract from the input
      $('.js-qty__adjust').on('click', function() {
        var el = $(this),
            id = el.data('id'),
            qtySelector = el.siblings('.js-qty__num'),
            qty = parseInt(qtySelector.val().replace(/\D/g, ''));

        var qty = validateQty(qty);

        // Add or subtract from the current quantity
        if (el.hasClass('js-qty__adjust--plus')) {
          qty = qty + 1;
        } else {
          qty = qty - 1;
          if (qty <= 1) qty = 1;
        }

        // Update the input's number
        qtySelector.val(qty);
      });
    }
  };

  $("body").on("click","button.product-add-cart.Button",function(){
    var id  = $(this).attr('data-product-id');
    jQuery.ajax({ url:'/cart/add.js',                      
                 type:'post',                      
                 dataType:'json',                      
                 data:{ quantity: 1, id: id},                      
                 success:function(){                   
                   ShopifyAPI.getCart(cartUpdateCallback);					
                 }
                });
  });
  
  validateQty = function (qty) {
    if((parseFloat(qty) == parseInt(qty)) && !isNaN(qty)) {
      // We have a valid number!
    } else {
      // Not a number. Default to 1.
      qty = 1;
    }
    return qty;
  };

  module = {
    init: init,
    load: loadCart
  };

  return module;

}(ajaxCart || {}, jQuery));

