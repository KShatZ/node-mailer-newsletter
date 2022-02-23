// Validate Topic Selection
const form = document.getElementById("newsletterForm");
const checkboxes = document.querySelectorAll("input[type=checkbox]");
const validityCheckbox = document.getElementById("edmCheck");

// Checking checkbox validity on submit
form.addEventListener("submit", function(event){
    let counter = 0;
    checkboxes.forEach(function(checkbox){
        if (checkbox.checked) {
            counter++; 
        }
    });
    if (counter == 0) {
        event.preventDefault();
        validityCheckbox.setCustomValidity("Please select at least one topic...");
        validityCheckbox.reportValidity();
    }
});

// Clearing checkbox validity - needed to 'reset' form
checkboxes.forEach(function(checkbox) {
    checkbox.addEventListener("change", function(event) {
        validityCheckbox.setCustomValidity("");
    });
});
