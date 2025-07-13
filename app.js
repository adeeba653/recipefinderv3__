// const container = document.querySelector('.recipe-scroll-container');
// document.getElementById('scroll-left').onclick = () => {
//     container.scrollBy({ left: -300, behavior: 'smooth' });
// };
// document.getElementById('scroll-right').onclick = () => {
//     container.scrollBy({ left: 300, behavior: 'smooth' });
// };



const mealcard = document.querySelector('.mealcard');

if (mealcard) {
    mealcard.addEventListener('click', () => {
        mealcard.classList.toggle('flipped');
    });
}



const random = document.querySelector(".generateRandomBtn")
const randomRecipe = document.querySelector(".randomRecipe")

if (random) {
    random.addEventListener('click', (e) => {
        randomRecipe.innerHTML = ""
        console.log("generate random!")
        getRandom();
    })
}
const getRandom = async () => {
    try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        const data = await res.json()
        console.log(data)
        const meal = data.meals[0]


        console.log(meal)
        const mealcard = document.createElement("DIV");
        mealcard.classList.add('mealcard')

        mealcard.innerHTML = `
                <div class="mealcard_front">
                    <div class="meal_img"><img src="${meal.strMealThumb}"></div>
                    <div class="meal_name">
                        <p>${meal.strMeal}</p>
                        <span class="favorite-icon" data-id="${meal.idMeal}">♡</span>
                        
                    </div>
                </div>
                <div class="mealcard_back">
                    <h3>Ingredients</h3>
                    <ul>
                        ${getIngredientsList(meal)}
                    </ul>
                    <h3>Instructions</h3>
                    <p>${meal.strInstructions}</p>
                </div>`;

        mealcard.addEventListener('click', () => {
            showMealModal(meal); // Use the meal object
        });


        randomRecipe.appendChild(mealcard);
        setupFavoriteIcons();
    }


    catch (e) {
        console.log("ERROR!!!", e);
    }
};


function getIngredientsWithMeasures(meal) {
    let ingredients = [];

    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i} `];
        const measure = meal[`strMeasure${i} `];

        if (ingredient && ingredient.trim() !== "") {
            ingredients.push(`${measure ? measure.trim() : ""} ${ingredient.trim()} `);
        }
    }

    return ingredients;
}




let search_area = '';
let result_area = '';
let fetch_character = '';
let search = '';
let filter = '';

const btn1 = document.querySelector('#btn1');
const btn2 = document.querySelector('#btn2');
const btn3 = document.querySelector('#btn3');
const btn4 = document.querySelector('#btn4');

function setupFormListeners() {
    const searchForm = document.querySelector(`#${search_area}_search`);
    const mealGrid = document.querySelector(`#${result_area}_results .mealGrid`);

    if (searchForm && mealGrid) {
        searchForm.onsubmit = function (e) {
            e.preventDefault();
            mealGrid.innerHTML = "";
            search = searchForm.elements.searchInput.value;
            console.log(search);
            if (search) {
                getRecipebyname(search, mealGrid);
            }
            else {
                mealGrid.innerHTML = "Please enter somthing before submitting!!!"
                mealGrid.style.color = 'darkred';
            }


        }
    }
}

function handleClick(event) {
    if (event.target.id === 'btn1') {
        filter = "search";
        search_area = "byname";
        result_area = "byname";
        fetch_character = "s";
    } else if (event.target.id === 'btn2') {
        filter = "filter";
        search_area = "byarea";
        result_area = "byarea";
        fetch_character = "a";
    } else if (event.target.id === 'btn3') {
        filter = "filter";

        search_area = "byingred";
        result_area = "byingred";
        fetch_character = "i";
    } else if (event.target.id === 'btn4') {
        filter = "filter";
        search_area = "bycategory";
        result_area = "bycategory";
        fetch_character = "c";
    }

    console.log(`Search area: ${search_area}, Fetch key: ${fetch_character} `);
    setupFormListeners(); // Set up form listener for the selected area
}


if (btn1)
    btn1.addEventListener('click', handleClick);
if (btn2)
    btn2.addEventListener('click', handleClick);
if (btn3)
    btn3.addEventListener('click', handleClick);
if (btn4)
    btn4.addEventListener('click', handleClick);

// Handles "no meals found"
const mealnotFound = function (search, mealGrid) {

    mealGrid.innerHTML = `No meals found for '${search}', Try something else !`;
    mealGrid.style.color = 'darkred';

};
// Helper to get meal details by ID
const getrecipebyid = async (mealid) => {
    try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealid}`);
        const data = await res.json();
        return data.meals[0];  // Return the actual meal object
    } catch (e) {
        console.log("ERROR!! ", e);
    }
};

// Helper to generate ingredients list
const getIngredientsList = (meal) => {
    let ingredientsHTML = '';
    for (let i = 1; i <= 20; i++) {
        const ing = meal[`strIngredient${i}`];
        const meas = meal[`strMeasure${i}`];
        if (ing && ing.trim() !== "") {
            ingredientsHTML += `<li>${meas ? meas.trim() : ""} ${ing.trim()}</li>`;
        }
    }
    return ingredientsHTML;
};

// Fetch and display meals
const getRecipebyname = async (search, mealGrid) => {
    try {
        const fetch_from = `https://www.themealdb.com/api/json/v1/1/${filter}.php?${fetch_character}=${search}`;
        console.log(fetch_from);
        const res = await fetch(fetch_from);
        const data = await res.json();
        const meals = data.meals;

        if (!meals) {
            console.log("No meals found!");
            mealnotFound(search, mealGrid);
            return;
        }

        let count = 0;
        const id = mealGrid.getAttribute('id');

        for (let meal of meals) {
            count++;
            let mealData = meal;

            // If not searching by name, get full meal data using ID
            if (id !== 'byname') {
                const fullData = await getrecipebyid(meal.idMeal);
                if (!fullData) continue;
                mealData = fullData;
            }

            const mealcard = document.createElement("div");
            mealcard.classList.add('mealcard');
            mealcard.id = `meal-${count}`;

            mealcard.innerHTML = `
                <div class="mealcard_front">
                    <div class="meal_img"><img src="${mealData.strMealThumb}"></div>
                    <div class="meal_name">
                        <p>${mealData.strMeal}</p>
                        <span class="favorite-icon" data-id="${mealData.idMeal}">♡</span>
                        
                    </div>
                </div>
                <div class="mealcard_back">
                    <h3>Ingredients</h3>
                    <ul>
                        ${getIngredientsList(mealData)}
                    </ul>
                    <h3>Instructions</h3>
                    <p>${mealData.strInstructions}</p>
                </div>`;

            // Flip functionality (optional)
            // mealcard.addEventListener('click', () => {
            //     mealcard.classList.toggle("flipped");
            // });
            mealcard.addEventListener('click', () => {
                showMealModal(mealData); // Use the meal object
            });

            // Add to DOM
            mealGrid.appendChild(mealcard);
            setupFavoriteIcons();

        }

    } catch (e) {
        console.log("ERROR!!!", e);
    }
};


function showMealModal(meal) {
    document.getElementById('modalMealName').textContent = meal.strMeal;
    document.getElementById('modalMealImage').src = meal.strMealThumb;

    const ul = document.getElementById('modalIngredients');
    ul.innerHTML = "";

    for (let i = 1; i <= 20; i++) {
        const ing = meal[`strIngredient${i}`];
        const meas = meal[`strMeasure${i}`];
        if (ing && ing.trim()) {
            const li = document.createElement('li');
            li.textContent = `${meas ? meas.trim() : ""} ${ing.trim()}`;
            ul.appendChild(li);
        }
    }

    document.getElementById('modalInstructions').textContent = meal.strInstructions;
    document.getElementById('mealModal').style.display = "block";
    document.getElementById('ytLink').innerHTML = `<a  target="_blank" href="${meal.strYoutube}"> Youtube Link </a>`;

}

const closebtn = document.querySelector('.close-button')
if (closebtn) {
    closebtn.addEventListener('click', () => {
        document.getElementById('mealModal').style.display = "none";
    });


    window.addEventListener('click', (e) => {
        if (e.target.id === 'mealModal') {
            document.getElementById('mealModal').style.display = "none";
        }
    });
}

function setupFavoriteIcons() {
    const icons = document.querySelectorAll('.favorite-icon');
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    icons.forEach(icon => {
        const mealId = icon.dataset.id;

        // Set initial state
        if (favorites.includes(mealId)) {
            icon.classList.add('active');
            icon.textContent = '♥';
        }

        icon.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent opening modal


            let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

            if (favorites.includes(mealId)) {
                // Remove from favorites
                favorites = favorites.filter(id => id !== mealId);
                icon.classList.remove('active');
                icon.textContent = '♡';
            } else {
                // Add to favorites only if not already present
                favorites.push(mealId);
                icon.classList.add('active');
                icon.textContent = '♥';
            }

            localStorage.setItem("favorites", JSON.stringify(favorites));
        });

    });
    console.log(localStorage)

}

const favoritesGrid = document.getElementById("favoritesGrid");



async function renderFavorites() {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorites.length === 0) {
        favoritesGrid.innerHTML = "<p>No favorite meals added yet.</p>";
        favoritesGrid.style.color = darkred;
        return;
    }

    for (const id of favorites) {
        const meal = await getrecipebyid(id);
        if (!meal) continue;

        const card = document.createElement("div");
        card.classList.add("mealcard");

        card.innerHTML = `
      <div class="mealcard_front">
        <div class="meal_img"><img src="${meal.strMealThumb}" alt="${meal.strMeal}"></div>
        <div class="meal_name"><p>${meal.strMeal}</p> <span class="favorite-icon" data-id="${meal.idMeal}">♡</span></div>
        

      </div>
      <div class="mealcard_back">
        <h3>Ingredients</h3>
        <ul>${getIngredientsList(meal)}</ul>
        <h3>Instructions</h3>
        <p>${meal.strInstructions}</p>
      </div>
    `;

        card.addEventListener('click', () => {
            showMealModal(meal); // Use the meal object
        });

        favoritesGrid.appendChild(card);
        setupFavoriteIcons();
    }
}

// Run on page load
if (favoritesGrid)
    renderFavorites();
