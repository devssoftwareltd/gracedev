window.okeReviewsWidgetOnInit = function () {
    setupAggregateSection();

    const reviewMain = document.querySelector(".js-okeReviews-reviews-main");
    if (reviewMain) {
        const config = {
            childList: true
        };
        const callback = function (mutationList) {
            for (const mutation of mutationList) {
                mutation.addedNodes.forEach((n) => formatDateForElement(n));
            }
        };
        const observer = new MutationObserver(callback, config);
        observer.observe(reviewMain, config);

        const reviews = document.querySelectorAll(".okeReviews-reviews-review");
        reviews.forEach((n) => formatDateForElement(n));
    }
};

function formatDateForElement(nodeElement) {
    if (nodeElement) {
        // Convert dates
        const reviewDates = nodeElement.querySelectorAll("[data-oke-reviews-date]");
        for (const reviewDate of reviewDates) {
            const dateIsoString = reviewDate.getAttribute("data-oke-reviews-date");
            const date = new Date(dateIsoString);
            const localeDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
            reviewDate.innerText = localeDate;
        }
    }
}

function setupAggregateSection() {
  
    // Move aggregate section into header
    const summaryReviewAggregate = document.querySelector(".okeReviews-reviewsAggregate-summary");
    const summaryReviewAggregateRecommend = document.querySelector(".okeReviews-reviewsAggregate-recommends");
    if (summaryReviewAggregate && summaryReviewAggregateRecommend) {
        summaryReviewAggregate.insertAdjacentElement('afterend', summaryReviewAggregateRecommend);
    }
  
    // Move aggregate section into header
    const summaryRatingValue = document.querySelector(".okeReviews-reviewsAggregate-summary-rating-value");
    const summaryStarRating = document.querySelector(".okeReviews-reviewsAggregate-summary-rating-starRating");
    if (summaryRatingValue && summaryStarRating) {
        summaryRatingValue.insertAdjacentElement('beforebegin', summaryStarRating);
    }
  
    // Move aggregate section into header
    const aggregatePrimary = document.querySelector(".okeReviews-reviewsAggregate-primary");
    const writeaReviewButton = document.querySelector(".okeReviews-reviewsWidget-header-controls");
    const filterButton = document.querySelector(".okeReviews-reviews-controls-filterToggle");
    const filterList = document.querySelector(".okeReviews-reviews-controls-filters");
    if (aggregatePrimary && writeaReviewButton && filterButton && filterList) {
        aggregatePrimary.insertAdjacentElement('beforeend', writeaReviewButton);
      	aggregatePrimary.insertAdjacentElement('beforeend', filterButton);
      	aggregatePrimary.insertAdjacentElement('beforeend', filterList);
    }
}