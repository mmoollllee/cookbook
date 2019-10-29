const apiURL = "https://www.themealdb.com/api/json/v1/1/"; // https://www.themealdb.com/api/json/v1/1/filter.php?i=chicken_breast
const mainKey = "meals";
const resultContainer = document.getElementById("meals");

function fetchJSON(url) {
   return new Promise(function(resolve, reject) {

      let request = new XMLHttpRequest();
      request.open('GET', url);
      request.addEventListener("load", function() {
         if (request.status != "200")
            reject(Error ("no Data. API down?"));

         let response = JSON.parse(request.response);
         resolve(response);
      })
      request.send();
   })
}

function createCard(title, thumb) {
   let card = document.createElement("article");
   let cardFigure = document.createElement("figure");
   let cardImage = document.createElement("img");
   let cardHeading = document.createElement("h3");
   let cardButton = document.createElement("button");

   card.classList.add("card");
   cardImage.src = thumb;
   cardImage.alt = title;
   cardHeading.textContent = title;
   cardButton.textContent = "Show meal";
   
   card.appendChild(cardFigure).appendChild(cardImage);
   card.appendChild(cardHeading);
   card.appendChild(cardButton);

   return card;
}

function showDetail(apiURL, id) {

   let detailResponse = fetchJSON (apiURL + "lookup.php?i=" + id);
   
   detailResponse.then(function (data) {
      console.log(data);
   })
}

function searchInit(apiURL, mainKey, resultContainer) {
   
   document.querySelector("#search form").addEventListener("submit", function(e) {
      e.preventDefault();

      let value = this.querySelector("input[type='text']").value;

      if (!value) { return }

      let resultContainerInner = resultContainer.querySelector(".inner");
      let resultContainerHeading = resultContainer.querySelector("h2");

      // empty the results.
      resultContainerInner.innerHTML = "";

      // Check if value is meant for multiple ingredients.
      if (value.includes(" ") && value[value.length-1] != " " || value.includes(",")) {
         resultContainerHeading.textContent = "Ey! I told you. Only use one ingredient or pay !%#]{}[.";
         return;
      }

      let listResponse = fetchJSON (apiURL + "filter.php?i=" + value);
      resultContainerHeading.textContent = "Loading everything with " + value;

      listResponse.then(function (data) {
         let meals = data[mainKey];

         if ( !meals ) {
            resultContainerHeading.textContent = "Nothing with " + value + ". Seems like you have a bad taste?";
            return;
         }
         
         resultContainerHeading.textContent = "This is what we have with " + value;

         for (meal of meals) {
            resultContainerInner
               .appendChild(createCard(meal.strMeal, meal.strMealThumb))
               .addEventListener("click", function() { showDetail(apiURL, meal.idMeal) });
         }

      })
   });

}

function init() {
   searchInit(apiURL, mainKey, resultContainer);
}

init();