const apiURL = "https://www.themealdb.com/api/json/v1/1/"; // https://www.themealdb.com/api/json/v1/1/filter.php?i=chicken_breast
const mainKey = "meals"; // ToDo: Make a function for key change.
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

   // ToDo: Structure as HTML Tree

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
   // ToDo: Use global apiURL here
   let detailResponse = fetchJSON (apiURL + "lookup.php?i=" + id);
   
   detailResponse.then(function (data) {
      console.log(data);
   })
}

function searchInit(apiURL, mainKey, resultContainer) {

   let resultContainerInner = resultContainer.querySelector(".inner");
   let resultContainerHeading = resultContainer.querySelector("h2");
   
   document.querySelector("#search form").addEventListener("submit", function(e) {
      e.preventDefault();

      // ToDo: Create recuring showResults Function to increase readability
      // function showResults (heading, contents) {
      //    resultContainer.querySelector(".inner").textContent = heading;
      
      //    if (contents) 
      
      //    else
         
      
      // }
      

      let value = this.querySelector("input[type='text']").value;

      if (!value) { return }

      // Check if value is meant for multiple ingredients.
      if (value.includes(" ") && value[value.length-1] != " " || value.includes(",")) {
         resultContainerInner.innerHTML = "";
         resultContainerHeading.textContent = "Ey! I told you. Only use one ingredient or pay !%#]{}[.";
         return;
      }

      let listResponse = fetchJSON (apiURL + "filter.php?i=" + value);
      resultContainerInner.innerHTML = "";
      resultContainerHeading.textContent = "Loading everything with " + value;

      listResponse.then(function (data) {
         // ToDo: Function for keymapping
         let meals = data[mainKey];

         if ( !meals ) {
            resultContainerInner.innerHTML = "";
            resultContainerHeading.textContent = "Nothing with " + value + ". Seems like you have a bad taste?";
            return;
         }
         
         resultContainerInner.innerHTML = "";
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

   // ToDo: no need
   searchInit(apiURL, mainKey, resultContainer);
}

init();