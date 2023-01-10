const loyaltyConstants = {
	vipTiers: {
		currentStatusLabel: "current status",
		benefitHeaders: [
			"Per $1 Spent",
			"Birthday Discount",
			"Free U.S. Shipping",
			
			"Points for Product Redemption",
			"Exclusive Promotions and Giveaways"
		],
		tierSpend: "Points Per Calendar Year",
		benefitsList: [
			{
				tierId: 4184,
				tierRequirement: "25 - 1249 Points",
				benefits: [
					"1 Point",
					"$10 Coupon",
					"On Orders $85+",
					
					"✗",
					"✗"
				]
			},

				{
				tierId: 4185,
				tierRequirement: "1250 - 2,999 Points",
				benefits: [
					"1.25 Points",
					"$12 Coupon",
					"On Orders $50+",
					
					"✓",
					"✗"
				]
			},

				{
				tierId: 4186,
				tierRequirement: "3,000+ Points",
				benefits: [
					"1.5 Points",
					"$15 Coupon",
					"On All Orders",
					
					"✓",
					"✓"
				]
			}
		]

	},

	referralHistory: {
			firstHeader: "check rewards balance",
			secondHeader: "your referrals",
			redeemTitle: "how do I redeem my rewards points?",
			redeemExplain: "now, the fun part! simply apply your discount at checkout",
			ctaText: "shop now",
			emailHeader: "EMAIL",
			statusHeader: "STATUS",
			completedLabel : "purchased ($10 earned)",
			pendingLabel : "invited"
	}
}