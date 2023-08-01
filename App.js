const height = document.querySelector("#height");
const weight = document.querySelector("#weight");
const age = document.querySelector("#age");
const gender = document.querySelector("#gender");
const activity = document.querySelector("#activity");
const submit = document.querySelector("#submit");
const cardContainer = document.getElementById("cards-container");
const mealsDetails = document.getElementById("details");
const ingredientSection = document.getElementById("ingredients");
const stepsSection = document.getElementById("steps");
const equipmentSection = document.getElementById("equipment");
const recipeSection = document.getElementById("recipe-section");

const getCalorie = () => {
  let heightval = height.value;
  let weightval = weight.value;
  let ageval = age.value;
  let genderval = gender.value;
  let actval = activity.value;
  let bmr;

  if (
    heightval === "" ||
    heightval <= 0 ||
    weightval === "" ||
    weightval <= 0 ||
    ageval === "" ||
    ageval <= 0
  ) {
    alert(
      "Required Feilds"
    );
    return;
  }


  if (genderval === "female") {
    bmr = 655.1 + 9.563 * weightval + 1.85 * heightval - 4.676 * ageval;
  } else if (genderval === "male") {
    bmr = 66.47 + 13.75 * weightval + 5.003 * heightval - 6.755 * ageval;
  }

  // Daily Calorie Requirement
  if (actval === "light") {
    bmr *= 1.375;
  } else if (actval === "moderate") {
    bmr *= 1.55;
  } else if (actval === "active") {
    bmr *= 1.725;
  }

  getMeals(bmr);
};

const getMeals = async (bmr) => {

  let datas;
  await fetch( `https://api.spoonacular.com//mealplanner/generate?timeFrame=day&targetCalories=2000&apiKey=0523e0ddefad46899420cdb43b5d603e&includeNutrition=true`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      datas = data;
    });
  generateMealsCard(datas);
  document.getElementById("loader").style.display = "none";
};

const generateMealsCard = (datas) => {
  let cards = ``;
  mealsDetails.innerHTML = `
  <h3 id="nutrient">Nutrients</h3>
  <div class="calories-Information">
      <span class="Info">Calories : ${datas?.nutrients?.calories}</span>
      <span class="Info">Carbohydrates : ${datas.nutrients?.carbohydrates}</span>
      <span class="Info">Fat : ${datas.nutrients?.fat}</span>
      <span class="Info">Protein : ${datas.nutrients?.protein}</span>
  </div>
  `;
  datas.meals.map(async (data) => {
    const url = `https://api.spoonacular.com/recipes/${data.id}/information?apiKey=0523e0ddefad46899420cdb43b5d603e&includeNutrition=false`;
    let imgURL;
    await fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        imgURL = data.image;
      });
    cards += `
        <div class="meals-card">
            <div class="card-baseBlock" style="width: 18rem;">
                <img src=${imgURL} class="card-img-top"
                    alt="meal 1">
                <div class="card-body">
                    <h5 class="card-title">${data.title}</h5>
                    <p>Preparation Time - ${data.readyInMinutes}</p>
                    <button class="card-btn" onClick="btnRecipe(${data.id})" >GET RECIPE</button>
                </div>
            </div>
        </div>
        `;
    cardContainer.innerHTML = cards;
  });
};

const btnRecipe = async (data) => {
  recipeSection.innerHTML = "";
  ingredientSection.innerHTML = "";
  stepsSection.innerHTML = "";
  equipmentSection.innerHTML = "";
  
  let information;

  await fetch(`https://api.spoonacular.com/recipes/644882/information?apiKey=0523e0ddefad46899420cdb43b5d603e&includeNutrition=false`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      information = data;
    });

  recipeSection.textContent = `${information.title} Recipe`;

  //   Ingridents
  let htmlData = ``;
  let inCardDiv = document.createElement("div");
  inCardDiv.classList.add("carddesign", "card", "h-100");
  let inCardBody = document.createElement("div");
  inCardBody.classList.add("card-body");
  let inOverlay = document.createElement("div");
  inOverlay.classList.add("overlay");
  let ul = document.createElement("ul");
  information.extendedIngredients.map((ingre) => {
    htmlData += `
        <li>${ingre.original}</li>
        `;
  });
  ul.innerHTML = htmlData;
  let ingreH1 = document.createElement("h3");
  ingreH1.textContent = "INGREDIENTS";
  inCardBody.appendChild(inOverlay);
  inCardBody.appendChild(ingreH1);
  inCardBody.appendChild(ul);
  inCardDiv.appendChild(inCardBody);
  ingredientSection.appendChild(inCardDiv);

  //   Steps
  let stepsHtml = ``;
  let stCardDiv = document.createElement("div");
  stCardDiv.classList.add("carddesign", "card", "h-100");
  let stCardBody = document.createElement("div");
  stCardBody.classList.add("card-body");
  let stOverlay = document.createElement("div");
  stOverlay.classList.add("overlay");
  let stepsOl = document.createElement("ol");
  information.analyzedInstructions[0].steps.map((step) => {
    stepsHtml += `
        <li>${step.step}</li>
        `;
  });
  stepsOl.innerHTML = stepsHtml;
  let stepsH1 = document.createElement("h3");
  stepsH1.textContent = "STEPS";
  stCardBody.appendChild(stOverlay);
  stCardBody.appendChild(stepsH1);
  stCardBody.appendChild(stepsOl);
  stCardDiv.appendChild(stCardBody);
  stepsSection.appendChild(stCardDiv);

  // equipmentSection
  
  let equip;

  await fetch(`https://api.spoonacular.com/recipes/1003464/equipmentWidget.json?apiKey=0523e0ddefad46899420cdb43b5d603e`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      equip = data;
    });

  let equipData = ``;
  let eqCardDiv = document.createElement("div");
  eqCardDiv.classList.add("carddesign", "card", "h-100");
  let eqCardBody = document.createElement("div");
  eqCardBody.classList.add("card-body");
  let eqOverlay = document.createElement("div");
  eqOverlay.classList.add("overlay");
  let equipUl = document.createElement("ul");
  equip.equipment.map((equip) => {
    equipData += `
            <li>${equip.name}</li>
            `;
  });
  equipUl.innerHTML = equipData;
  let equipH1 = document.createElement("h3");
  equipH1.textContent = "EQUIPMENT";
  eqCardBody.appendChild(eqOverlay);
  eqCardBody.appendChild(equipH1);
  eqCardBody.appendChild(equipUl);
  eqCardDiv.appendChild(eqCardBody);
  equipmentSection.appendChild(eqCardDiv);
};

submit.addEventListener("click", getCalorie);
