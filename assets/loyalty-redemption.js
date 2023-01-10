class RedemptionGrid {
	constructor() {
				
	}

		renderProductRedemption(redemptions) {
         
            
		redemptions.forEach((redemption) => {
			
			if (redemption.discountType === "product") { 
             
				$(".loyalty-product-redemptions").append(
					$("<a>", {
						"data-variant-id" : redemption.appliesToId

					}).addClass("loyalty-redemption-prod-container").append(
						$("<div>").addClass("loyalty-redemption-img-container").append(
						$("<img>", {
							"src" : redemption.backgroundImageUrl
						})

						),
						$("<h3>").addClass("loyalty-redemption-prod-name").text(redemption.name),
						$("<div>").addClass("loyalty-redemption-product-price").text(redemption.costText),
						$("<div>", {
						"data-variant-id" : redemption.appliesToId
					}).addClass("swell-buy-product-btn loyalty-button").text("redeem now")
							
					)
					)
			} 
		});
		$("a.swell-buy-product-btn").click(()=> {
			return false;;
		});
      	
		this.makeRedemptionSlick();

	}
  
  
  checkLoggedIn(customer) {
    console.log("check logged in is running");
   if (customer.created_at === undefined || customer.vipTier === null || customer.vipTier.id !== 4186) { 
    	 $(".swell-buy-product-btn.loyalty-button").addClass("hide");
     	$(".loyalty-redemption-prod-container").addClass("opaque");
   }
  
  }
  
		makeRedemptionSlick() {
		var newscript = document.createElement('script');
		     newscript.type = 'text/javascript';
		     newscript.async = true;
		     newscript.src = 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js';
		  (document.getElementsByTagName('head')[0]||document.getElementsByTagName('body')[0]).appendChild(newscript);
		  
		  setTimeout(function(){
		  $('.loyalty-product-redemptions').slick({
 					 infinite: true,
  					 slidesToShow: 3,
  					 slidesToScroll: 1,
  					 arrows: true,
             nextArrow: '<i class="loyalty-slick-next"></i>',
  prevArrow: '<i class="loyalty-slick-prev"></i>',
  					  responsive: [
		          {
                    breakpoint: 769, settings: {slidesToShow: 1, slidesToScroll: 1, dots: true, arrows: false, appendDots: $('.loyalty-slick-nav-container')}
		          }
		       ]
				});
		    }, 1000);
	}


}



