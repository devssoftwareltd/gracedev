class VipTiers {

	constructor(vipTiers, currentStatusLabel, benefitHeaders, tierSpend, benefitsList, customer) {
		this.vipTiers = vipTiers;
		this.currentStatusLabel = currentStatusLabel;
		this.benefitHeaders = benefitHeaders;
		this.tierSpend = tierSpend;
		this.benefitsList = benefitsList;
		this.customer = customer;
	}


	renderVipTiers() {
		console.log("renderVipTiers is running")

			$(".loyalty-vip-tiers-container").append(
			
			$("<div>").addClass("loyalty-benefit-headers").append(
				$("<div>").addClass("loyalty-vip-tier-spacing"),
				$("<div>").addClass("loyalty-benefit-headers-list-item").addClass("loyalty-benefit-list-header").text(this.tierSpend),
				$("<div>").addClass("loyalty-vip-tier-benefits-headers-container")
				),
				$("<div>").addClass("loyalty-benefit-list"),
				$("<div>").addClass("loyalty-slick-arrows-container")
			);
			//*******************headers column**********************
			this.benefitHeaders.forEach(header => {
				
				$(".loyalty-vip-tier-benefits-headers-container").append(
					$("<div>").addClass("loyalty-benefit-headers-list-item").text(header)
					)
			});

			// ***************creates the 4 columns - one for each tier******************
			this.benefitsList.forEach(benefit => {
				
				$(".loyalty-benefit-list").append(
					$("<div>", {
						class: `loyalty-vip-tier-item-${benefit.tierId}`
					}).addClass("loyalty-vip-tier").append(
					
					$("<div>").addClass("loyalty-vip-tier-header-container").append(
						$("<div>").addClass("loyalty-vip-tier-status-container").append(
						$("<div>").addClass("loyalty-vip-tier-current-status-container"),
						$("<div>").addClass("loyalty-vip-tier-next-requirement-container")

						),
						$("<div>").addClass("loyalty-vip-tier-content-container").append(
						$("<div>").addClass("loyalty-vip-tier-benefit-item").addClass("loyalty-vip-tier-name").text(this.getVipTierName(benefit.tierId)),
						$("<div>").addClass("loyalty-vip-tier-requirement").text(benefit.tierRequirement),
						$("<div>").addClass("loyalty-vip-tier-benefits-container")

						)
					)
					)
					);
				
				benefit.benefits.forEach(item => {

					$(`.loyalty-vip-tier-item-${benefit.tierId} .loyalty-vip-tier-benefits-container`).append(
						$("<div>").addClass("loyalty-vip-tier-benefit-item").text(item)
						)

				})


				
			})




			this.makeSlick();
			this.renderCurrentStatus();
			this.renderNextTierRequirnemts();
      		this.renderMaintainTierRequirement();
			this.replaceCheck();
		
		
	}

	
// });

// 	}

	replaceCheck() {
	$( "div.loyalty-vip-tier-benefit-item:contains('✓')" ).text("").addClass("fa fa-check");
	$( "div.loyalty-vip-tier-benefit-item:contains('✗')" ).text("").addClass("fa fa-times");
	}

	getVipTierName(id) {
		return this.vipTiers[this.vipTiers.map(tier => tier.id).indexOf(id)].name
	}

	getVipTierDivLocation() {
		return this.vipTiers.map(tier => tier.name).indexOf(this.customer.vipTier.name) + 1
	}

	renderCurrentStatus() {
		
		if (this.customer.created_at !== undefined) {
			$(`.loyalty-benefit-list .loyalty-vip-tier:nth-of-type(${this.getVipTierDivLocation()}) .loyalty-vip-tier-current-status-container`).text(this.currentStatusLabel);
			$(`.loyalty-vip-tier:nth-of-type(${this.getVipTierDivLocation()})`).addClass("loyalty-current-status-bg")
		}
	}

	getNextTierName() {

		let nextTierName = '';
		let tierNames = this.vipTiers.map(tier => tier.name);
			let currentTierIndex = tierNames.indexOf(this.customer.vipTier.name);
			if (currentTierIndex < tierNames.length - 1) {
				nextTierName = this.vipTiers[tierNames.indexOf(this.customer.vipTier.name) + 1].name;
			}
		return nextTierName;
		
	}

	renderNextTierRequirnemts() {
		if (this.customer.created_at !== undefined) {
			let nextTierName = this.getNextTierName();
			let requiredAmountToMoveUpTiers = this.customer.vipTierStatsNeeded.pointsEarned;
			if (nextTierName  !== '' || requiredAmountToMoveUpTiers !== 0) {
				$(`.loyalty-vip-tier:nth-of-type(${this.getVipTierDivLocation()}) .loyalty-vip-tier-next-requirement-container`).text(`Earn ${requiredAmountToMoveUpTiers} more points to earn ${nextTierName}`);
			}
		}
	}
  
  renderMaintainTierRequirement() {
    if (this.customer.created_at !== undefined) {
      let nextTierName = this.getNextTierName();
      let maintainTierRequirement = this.customer.vipTierStatsNeededMaintain.pointsEarned;
      if (nextTierName  === '') {
        $(".loyalty-vip-tier:nth-of-type(3) .loyalty-vip-tier-next-requirement-container").text(`Earn ${maintainTierRequirement} more points to secure your ${this.customer.vipTier.name} status for next year`);
      //Earn x more points to secure your Diamond status for next year
      }
    }
    
  }



	makeSlick() {

		if (Array.from(document.querySelectorAll("script")).filter(script => script.src.includes("slick")).length < 1) {
			var newscript = document.createElement('script');
			     newscript.type = 'text/javascript';
			     newscript.async = true;
			     newscript.src = 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js';
			  (document.getElementsByTagName('head')[0]||document.getElementsByTagName('body')[0]).appendChild(newscript);
		};
		
		  
		  setTimeout(function(){
		    $('.loyalty-benefit-list').slick({
		        slidesToShow: 3,
		        slidesToScroll: 1,
		        arrows: false,
		        
		        adaptiveHeight: true,
		        
		        responsive: [
		          {
		          	breakpoint: 770, settings: {slidesToShow: 1, slidesToScroll: 1, arrows: true,  prevArrow: "<div>❮❮</div>",
                    nextArrow: "<div>❯❯</div>", appendArrows: $('.loyalty-slick-arrows-container')}
		          }
		       ]});
		    }, 1000);


	}
	
}