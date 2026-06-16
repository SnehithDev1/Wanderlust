(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })

  // Rating slider functionality
  const ratingSlider = document.getElementById('rating');
  const ratingDisplay = document.querySelector('.rating-display');
  
  if (ratingSlider && ratingDisplay) {
    ratingSlider.addEventListener('input', (e) => {
      ratingDisplay.textContent = e.target.value + '/5';
    });
  }
})()