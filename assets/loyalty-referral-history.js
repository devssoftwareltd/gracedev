class ReferralHistory {
	constructor(firstHeader, secondHeader, redeemTitle, redeemExplain, ctaText, emailHeader, statusHeader, completedLabel, pendingLabel, customer) {
		this.firstHeader = firstHeader;
		this.secondHeader = secondHeader;
		this.redeemTitle = redeemTitle;
		this.redeemExplain = redeemExplain;
		this.ctaText = ctaText;
		this.emailHeader = emailHeader;
		this.statusHeader = statusHeader;
		this.completedLabel = completedLabel;
		this.pendingLabel = pendingLabel;
		this.customer = customer
	}


	renderRefferalHistory() {
		
		if (this.customer.email !== undefined && this.customer.email !== '' && this.customer.referrals.length >=1) {
			$(".loyalty-referral-history-container").append(
				$(".hide.loyalty-rewards-link").removeClass("hide"),

				$("<h5>").addClass("loyalty-referral-history-second-header").text(this.secondHeader),
				$("<div>").addClass("loyalty-referral-history-list"),
				$("<h5>").addClass("loyalty-referral-history-redeem-title").text(this.redeemTitle),
				$("<h6>").addClass("loyalty-referral-history-redeem-desc").text(this.redeemExplain),
				$("<a>", {"href": "/collections/all"}).addClass("loyalty-referral-history-button").text(this.ctaText)
				)


			$(".loyalty-referral-history-list").append(
				$("<div>").addClass("loyalty-referral-history-list-header-container").append(
					$("<span>").addClass("loyalty-referral-history-list-header").text(this.emailHeader),
					$("<span>").addClass("loyalty-referral-history-list-header").text(this.statusHeader)
					)
				)

			this.customer.referrals.forEach((referral) => {
				
				$(".loyalty-referral-history-list").append(
					$("<div>").addClass("loyalty-referral-history-line").append(
						$("<span>").addClass("loyalty-referral-history-email").text(referral.email),
						$("<span>").addClass("loyalty-referral-history-status")
						)
					)
			})


	this.referralStatus ?  $(".loyalty-referral-history-status").text(this.pendingLabel) : $(".loyalty-referral-history-status").text(this.completedLabel);

	$(".loyalty-referral-history-section-container").append(
		$("<div>").addClass("loyalty-referral-history-img-container").append(
			$("<img>").addClass("loyalty-referral-history-img").attr('src', '//cdn.shopify.com/s/files/1/3047/6286/t/202/assets/loyalty-ref.png?v=92506922840570450011672861339')
			)
		)
	
		}


	}


	referralStatus() {
	
		if(this.customer.referrals.completedAt === null) {
			return false
		} else {
			return true
		}
	}
}





