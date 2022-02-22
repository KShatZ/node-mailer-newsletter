// Validate Topic Selection
const form = document.getElementById("newsletterForm");
const validityCheckbox = document.getElementById("edmCheck")
    .setCustomValidity("Please select at least one topic...");

form.addEventListener("submit", function(event){
    const checkboxes = document.querySelectorAll("input[type=checkbox]");
    let counter = 0;
    checkboxes.forEach(function(checkbox){
        if (checkbox.checked) {
            counter++; 
        }
    });
    if (counter === 0) {
        event.preventDefault();
        validityCheckbox.reportValidity();
        console.log("No checkbox was selected.... validate");
    }
});