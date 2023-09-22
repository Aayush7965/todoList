const checkboxes = document.querySelectorAll(".myCheckbox");
const listItems = document.querySelectorAll(".listItem");
const deleteIcon = document.querySelectorAll(".deleteIcon");
const formURL = document.getElementById("formID").attributes[0].nodeValue;
const numberOfTasks = document.getElementById("taskNumbers");

for (let i = 0; i < listItems.length; i++) {
  listItems[i].addEventListener("mouseenter", (e) => {
    deleteIcon[i].classList.remove("hidden");
  });

  listItems[i].addEventListener("mouseleave", (e) => {
    deleteIcon[i].classList.add("hidden");
  });
}

for (let i = 0; i < checkboxes.length; i++) {
  checkboxes[i].addEventListener("change", () => {
    const isChecked = checkboxes[i].checked; // true of false
    const id = checkboxes[i].id;
    // Send checkbox data to the Node.js server using fetch
    fetch(formURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isChecked, id }),
    });
  });

  deleteIcon[i].addEventListener("click", async () => {
    const numberOfItems = document.querySelectorAll(".listItem");
    numberOfTasks.innerHTML = `<b>${(numberOfItems.length - 1)}</b> Tasks`;
    
    const deleteIconID = deleteIcon[i].id;

    if (formURL === "/") {
      await fetch("/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deleteIconID }),
      });
    } else if (formURL === "/work") {
      await fetch("/workdelete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deleteIconID }),
      });
    }

    // Remove the deleted item from the UI
    const deletedItem = document.getElementsByClassName(deleteIconID);

    if (deletedItem[0]) {
      deletedItem[0].remove(); // Remove the item from the DOM
    }
  });
}
