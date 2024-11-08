/* ------------------- SELECTING DOM ELEMENTS ------------------- */
const input = document.getElementById("shopping-input");
const shareBtn = document.getElementById("share-button");
const errorBoxName = document.getElementById("errorBoxName");
const errorBoxLocation = document.getElementById("errorBoxLocation");
const list = document.querySelector(".section__list");
const modal = document.querySelector(".modal");
const form = document.forms[0];
const infoForm = document.forms[1];
const nameInput = infoForm.querySelector("#nameInput");
const locationInput = infoForm.querySelector("#locationInput");

/* ------------------- EVENT LISTENERS ------------------- */

input.addEventListener("focus", getListItems);
form.addEventListener("submit", addListItems);
shareBtn.addEventListener("click", verifyShare);
document.addEventListener("DOMContentLoaded", loadItemsFromLocalStorage);
infoForm.addEventListener("submit", handleSubmit);

/* ------------------- UTILITY FUNCTIONS ------------------- */
function clearInput(element) {
  element.value = "";
}

function clearList() {
  list.innerHTML = "";
}

function listItemsExists() {
  return list.children.length > 0;
}

function handleSubmit(e) {
  e.preventDefault();
  const isFormValid = validateInputs();

  if (isFormValid) {
    const name = nameInput.value.trim();
    const location = locationInput.value.trim();
    clearInput(nameInput);
    clearInput(locationInput);
    modal.style.display = "none";
    shareToWhatsApp(name, location);
  }
}

function resetErrorBoxes() {
  errorBoxName.textContent = "";
  errorBoxLocation.textContent = "";
  nameInput.style.outlineColor = "#6e6e6e";
  locationInput.style.outlineColor = "#6e6e6e";
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
  clearInput(input);

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

function verifyShare() {
  let listItems = Array.from(list.children);

  if (listItems[0].classList.contains("no-items-message")) {
    const errorMessage = document.querySelector(".error-message");
    errorMessage.style.display = "flex";

    setTimeout(() => {
      errorMessage.style.display = "none";
    }, 4500);

    return;
  } else {
    modal.style.display = "flex";
  }
}

function validateInputs() {
  resetErrorBoxes()

  const name = nameInput.value.trim();
  const location = locationInput.value.trim();
  let isValid = true;

  if (name === "") {
    errorBoxName.textContent = "Required.";
    nameInput.style.outlineColor = "#DE1701";
    isValid = false;
  } else if (name.length < 3) {
    errorBoxName.textContent = "Name is too short.";
    nameInput.style.outlineColor = "#DE1701";
    isValid = false;
  } else {
    errorBoxName.textContent = "";
    nameInput.style.outlineColor = "#6e6e6e";
  }

  if (location === "") {
    errorBoxLocation.textContent = "Required.";
    locationInput.style.outlineColor = "#DE1701";
    isValid = false;
  } else if (location.length < 4) {
    errorBoxLocation.textContent = "Must 4 characters or more";
    locationInput.style.outlineColor = "#DE1701";
    isValid = false;
  } else {
    errorBoxLocation.textContent = "";
    locationInput.style.outlineColor = "#6e6e6e";
  }

  return isValid;
}

function shareToWhatsApp(name, location) {
  let listItems = Array.from(list.children);
  listItems = listItems.map((item) => item.textContent).join("\n");

  const phoneNumber = "254715240982";
  const message = encodeURIComponent(
    `Shopping List for ${name} to be delivered at ${location}:\n${listItems}`
  );

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
