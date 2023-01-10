$(window).bind("load", function() {
  
   if (window.location.href.indexOf("thank_you") > -1) {
	$(".loyalty-referral-modal-container").removeClass("loyalty-hide-modal");
}

$(".loyalty-referral-modal-close").click(()=> {
	$(".loyalty-referral-modal-container").addClass("loyalty-hide-modal");
})

});