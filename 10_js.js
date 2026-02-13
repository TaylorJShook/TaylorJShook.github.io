// 10_js.js

// show or hide display
function setDisplay(el, displayValue) 
{
  if (!el) return;
  el.style.display = displayValue;
}

//show filter menu
function showFilter() 
{
  const filterForm = document.getElementById("filterContent");
  const newForm = document.getElementById("newContent");

  // Show filter menu, hide add form
  setDisplay(filterForm, "block");
  setDisplay(newForm, "none");
}

//show add new article form
function showAddNew() 
{
  const filterForm = document.getElementById("filterContent");
  const newForm = document.getElementById("newContent");

  // Show add form, hide filter menu
  setDisplay(newForm, "flex");   
  setDisplay(filterForm, "none");
}

//
function filterArticles() 
{
  const showOpinion = document.getElementById("opinionCheckbox")?.checked ?? true;
  const showRecipe = document.getElementById("recipeCheckbox")?.checked ?? true;
  const showUpdate = document.getElementById("updateCheckbox")?.checked ?? true;

  // Toggle display for each type
  document.querySelectorAll("article.opinion").forEach(a => {
    a.style.display = showOpinion ? "" : "none";
  });

  document.querySelectorAll("article.recipe").forEach(a => {
    a.style.display = showRecipe ? "" : "none";
  });

  document.querySelectorAll("article.update").forEach(a => {
    a.style.display = showUpdate ? "" : "none";
  });
}

function addNewArticle() 
{
  const titleEl = document.getElementById("inputHeader");
  const textEl = document.getElementById("inputArticle");

  const title = (titleEl?.value ?? "").trim();
  const text = (textEl?.value ?? "").trim();

  // Determine selected type (based on your IDs)
  const opinionChecked = document.getElementById("opinionRadio")?.checked ?? false;
  const recipeChecked = document.getElementById("recipeRadio")?.checked ?? false;
  const updateChecked = document.getElementById("lifeRadio")?.checked ?? false;

  let typeClass = "";
  let typeLabel = "";

  if (opinionChecked) 
    {
    typeClass = "opinion";
    typeLabel = "Opinion";
    } 
  else if (recipeChecked) 
    {
    typeClass = "recipe";
    typeLabel = "Recipe";
    } 
  else if (updateChecked) 
    {
    typeClass = "update";
    typeLabel = "Update";
    }

  // Basic validation
  if (!title) 
  {
    alert("Please enter a title.");
    return;
  }
  if (!typeClass) 
  {
    alert("Please select an article type.");
    return;
  }
  if (!text) 
  {
    alert("Please enter article text.");
    return;
  }

  const list = document.getElementById("articleList");
  if (!list) return;

  // Build the article element matching your existing structure/styles
  const article = document.createElement("article");
  article.classList.add(typeClass);

  // (Optional) give it a unique id similar to existing ones
  article.id = `a${Date.now()}`;

  const marker = document.createElement("span");
  marker.className = "marker";
  marker.textContent = typeLabel;

  const h2 = document.createElement("h2");
  h2.textContent = title;

  const pText = document.createElement("p");
  pText.textContent = text;

  const pLink = document.createElement("p");
  const link = document.createElement("a");
  link.href = "moreDetails.html";
  link.textContent = "Read more...";
  pLink.appendChild(link);

  article.appendChild(marker);
  article.appendChild(h2);
  article.appendChild(pText);
  article.appendChild(pLink);

  // Add to page
  list.appendChild(article);

  // Clear the form for the next entry
  titleEl.value = "";
  textEl.value = "";
  document.getElementById("opinionRadio").checked = false;
  document.getElementById("recipeRadio").checked = false;
  document.getElementById("lifeRadio").checked = false;

  // Apply current filters so the new article immediately hides/shows correctly
  filterArticles();
}

//Show filter content by default)
window.addEventListener("DOMContentLoaded", () => {
  const filterForm = document.getElementById("filterContent");
  const newForm = document.getElementById("newContent");

  // Start with both hidden
  setDisplay(filterForm, "none");
  setDisplay(newForm, "none");

  // Ensure the initial checkboxes state is applied to existing articles if needed
  filterArticles();
});
