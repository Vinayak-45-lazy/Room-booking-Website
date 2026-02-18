(() => {
  'use strict';

  // Select all forms that need validation
  const forms = document.querySelectorAll('.needs-validation');

  // Loop over each form
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      'submit',
      (event) => {
        // If form is invalid, prevent submission
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        // Add Bootstrap validation class
        form.classList.add('was-validated');
      },
      false
    );
  });
})();
