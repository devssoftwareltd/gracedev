var boostPFSIntegrationTemplate = {
   compileTemplate: {
     reviews: "var itemOkendoReviewsHtml = Utils.getProductMetafield(data, 'okendo', 'StarRatingSnippet') !== null ? Utils.getProductMetafield(data, 'okendo', 'StarRatingSnippet') : ''; itemHtml = itemHtml.replace(/{{itemReviews}}/g, itemOkendoReviewsHtml);"
   },
   call3rdFunction: {
     reviews: ''
   }
 };