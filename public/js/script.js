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
  })()

  const filters = document.querySelectorAll('.filter');
const contentDiv = document.getElementById('content');

// Function to fetch and display data
async function filterContent(category) {
    try {
        const response = await fetch(`/listings/api/items?category=${category}`);
        const data = await response.json();

        // Clear previous content
        contentDiv.innerHTML = '';

        if (data.length > 0) {
            data.forEach(item => {
                const div = document.createElement('div');
                div.textContent = item.title || item.name; // Adjust based on your schema
                div.classList.add('content-item');
                contentDiv.appendChild(div);
            });
        } else {
            contentDiv.innerHTML = '<p>No items found for this category.</p>';
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        contentDiv.innerHTML = '<p>Error loading content.</p>';
    }
}

// Event listeners for filters
filters.forEach(filter => {
    filter.addEventListener('click', () => {
        filters.forEach(f => f.classList.remove('active'));
        filter.classList.add('active');
        const category = filter.getAttribute('data-category');
        filterContent(category);
    });
});
