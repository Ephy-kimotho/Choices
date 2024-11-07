/* ------------------- SELECTING DOM ELEMENTS ------------------- */
const input = document.getElementById("shopping-input");
const shareBtn = document.getElementById("share-button");
const form = document.forms[0];
const list = document.querySelector(".section__list");

/* ------------------- EVENT LISTENERS ------------------- */

input.addEventListener("focus", getListItems);
form.addEventListener("submit", addListItems);
shareBtn.addEventListener("click", shareToWhatsApp);
document.addEventListener("DOMContentLoaded", loadItemsFromLocalStorage);

/* ------------------- UTILITY FUNCTIONS ------------------- */
function clearInput() {
  input.value = "";
}

function clearList() {
  list.innerHTML = "";
}

function listItemsExists() {
  return list.children.length > 0;
}

/* ------------------- UI FUNCTIONS ------------------- */
function getListItems(e) {
  const listContainer = document.querySelector(".section__list");
  let listItems = Array.from(listContainer.children);

  if (listItems[0] && listItems[0].tagName === "LI") {
    const formatedItems = listItems.map((item) => item.textContent).join("\n");
    e.target.value = formatedItems;
  } else {
    e.target.value = "";
  }
}

function addListItems(e) {
  e.preventDefault();

  let items = input.value.trim();
  clearInput();

  items = items.split("\n");

  items = items.reduce((accumlator, item) => {
    if (item) {
      const li = document.createElement("li");
      li.textContent = item;
      accumlator.push(li);
    }
    return accumlator;
  }, []);

  clearList();
  items.forEach((item) => list.appendChild(item));

  displayMessage();
  saveListItemsToLocalStorage();
}

function displayMessage() {
  const existingMessage = document.querySelector(".no-items-message");

  if (!listItemsExists() && !existingMessage) {
    const p = document.createElement("p");
    p.classList.add("no-items-message");
    p.textContent = "No items added yet...";

    list.appendChild(p);
  } else if (listItemsExists() && existingMessage) {
    existingMessage.remove();
  }
}
displayMessage();

function shareToWhatsApp() {
  let listItems = Array.from(list.children);

  if (listItems[0].classList.contains("no-items-message")) {
    const errorMessage = document.querySelector(".error-message");
    errorMessage.style.display = "flex";

    setTimeout(() => {
      errorMessage.style.display = "none";
    }, 4500);

    return;
  }

  listItems = listItems.map((item) => item.textContent).join("\n");

  const phoneNumber = "254715240982";
  const message = encodeURIComponent(`Shopping List:\n${listItems}`);
  const whatsAppLink = `https://wa.me/${phoneNumber}?text=${message}`;

  window.open(whatsAppLink, "_blank");
}

/* ------------------- LOCAL STORAGE FUNCTIONS ------------------- */
function saveListItemsToLocalStorage() {
  let listItems = Array.from(list.children);
  if (listItems[0].tagName === "LI") {
    listItems = listItems.map((item) => item.textContent);
    localStorage.setItem("shoppingList", JSON.stringify(listItems));
  } else if (listItems[0].tagName === "P") {
    localStorage.removeItem("shoppingList");
  }
}

function loadItemsFromLocalStorage() {
  const storedItems = JSON.parse(localStorage.getItem("shoppingList"));
  if (storedItems?.length > 0) {
    clearList();
    storedItems.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });
  }
}
