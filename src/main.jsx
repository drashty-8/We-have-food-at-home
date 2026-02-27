import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

let count = 0;
  function addIngredient() {
    if (count % 3 == 0) {
      let newRow = document.createElement('div');
      newRow.classList.add('row');
      newRow.id = "currRow";
      document.getElementById("ingredientList").append(newRow);
    }
    let newIng = document.createElement("div");
    newIng.classList.add("col-sm-3", "ing");
    newIng.innerHTML = "New Ingredient " + count;
    document.getElementById("currRow").append(newIng);
    let newIngConfirm = document.createElement("p");
    newIngConfirm.innerHTML = "New Ingredient " + count + " added";
    document.getElementById("ingBody").append(newIngConfirm);
    count++;
  }

  function clearIng() {
    document.getElementById("ingBody").textContent = '';
  }

