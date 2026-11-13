// ===================================================================
// PROJECT FILTER JAVASCRIPT - Dynamic category switching
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.journal-tab-btn, .filter-btn');
  const projectCards = document.querySelectorAll('.journal-work-card, .project-card');

  if (!filterButtons.length || !projectCards.length) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // 1. Update Active State on Buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      // 2. Filter Project Cards with Smooth Tactile Fade Animation
      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');

        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.28s ease, transform 0.28s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
});
