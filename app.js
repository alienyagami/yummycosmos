// ============================
// YUMMYCOSMOS — App JS (Static)
// ============================

document.addEventListener('DOMContentLoaded', () => {
    const recipesGrid = document.getElementById('recipesGrid');
    const loading = document.getElementById('loading');
    const searchInput = document.getElementById('searchInput');
    const categoryFilters = document.getElementById('categoryFilters');
    const recipeModal = document.getElementById('recipeModal');
    const modalClose = document.getElementById('modalClose');
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const ctaForm = document.getElementById('ctaForm');
    const heroParticles = document.getElementById('heroParticles');

    let allRecipes = [];
    let currentCategory = 'all';

    // ============================
    // NAVBAR SCROLL EFFECT
    // ============================
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Mobile nav toggle
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const spans = navToggle.querySelectorAll('span');
        if (navLinks.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '1';
            spans[2].style.transform = '';
        }
    });

    // Close nav on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '1';
            spans[2].style.transform = '';
        });
    });

    // ============================
    // HERO PARTICLES
    // ============================
    function createParticles() {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 8 + 6) + 's';
            particle.style.animationDelay = (Math.random() * 6) + 's';
            particle.style.width = (Math.random() * 3 + 2) + 'px';
            particle.style.height = particle.style.width;
            heroParticles.appendChild(particle);
        }
    }
    createParticles();

    // ============================
    // COUNTER ANIMATION
    // ============================
    function animateCounters() {
        document.querySelectorAll('.stat-number').forEach(counter => {
            const target = +counter.dataset.target;
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    counter.textContent = target + '+';
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current);
                }
            }, 16);
        });
    }

    // Intersection Observer for counter animation
    const heroObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            animateCounters();
            heroObserver.disconnect();
        }
    }, { threshold: 0.5 });
    const heroSection = document.getElementById('hero');
    if (heroSection) heroObserver.observe(heroSection);

    // ============================
    // LOAD RECIPES (from embedded data)
    // ============================
    function loadRecipes(category = 'all') {
        loading.classList.add('active');
        recipesGrid.innerHTML = '';

        // Use embedded data from recipes-data.js
        let recipes = window.RECIPES_DATA || [];

        if (category && category !== 'all') {
            recipes = recipes.filter(r => r.category === category);
        }

        allRecipes = recipes;
        renderRecipes(allRecipes);
        loading.classList.remove('active');
    }

    // ============================
    // RENDER RECIPE CARDS
    // ============================
    function renderRecipes(recipes) {
        recipesGrid.innerHTML = '';

        if (recipes.length === 0) {
            recipesGrid.innerHTML = '<p style="text-align:center;color:var(--text-muted);grid-column:1/-1;padding:60px 0;font-size:1.1rem;">No recipes found. Try a different search.</p>';
            return;
        }

        recipes.forEach((recipe, index) => {
            const card = document.createElement('div');
            card.classList.add('recipe-card', 'fade-in');
            card.innerHTML = `
        <div class="card-image">
          <img src="${recipe.image}" alt="${recipe.title}" loading="lazy">
          <div class="card-image-overlay"></div>
          <span class="card-category">${recipe.category}</span>
          <span class="card-difficulty ${recipe.difficulty}">${recipe.difficulty}</span>
        </div>
        <div class="card-body">
          <h3 class="card-title">${recipe.title}</h3>
          <p class="card-desc">${recipe.description}</p>
          <div class="card-meta">
            <div class="card-meta-item"><span>⏱</span> ${recipe.prep_time}</div>
            <div class="card-meta-item"><span>🔥</span> ${recipe.cook_time}</div>
            <div class="card-meta-item"><span>👥</span> ${recipe.servings} servings</div>
          </div>
        </div>
      `;

            card.addEventListener('click', () => openModal(recipe));
            recipesGrid.appendChild(card);

            // Staggered animation
            setTimeout(() => card.classList.add('visible'), 50 * index);
        });
    }

    // ============================
    // MODAL
    // ============================
    function openModal(recipe) {
        document.getElementById('modalImage').src = recipe.image;
        document.getElementById('modalImage').alt = recipe.title;
        document.getElementById('modalCategory').textContent = recipe.category;
        document.getElementById('modalTitle').textContent = recipe.title;
        document.getElementById('modalDescription').textContent = recipe.description;

        // Meta info
        document.getElementById('modalMeta').innerHTML = `
      <div class="meta-item"><span class="meta-icon">⏱</span><div><div class="meta-label">Prep Time</div><div class="meta-value">${recipe.prep_time}</div></div></div>
      <div class="meta-item"><span class="meta-icon">🔥</span><div><div class="meta-label">Cook Time</div><div class="meta-value">${recipe.cook_time}</div></div></div>
      <div class="meta-item"><span class="meta-icon">👥</span><div><div class="meta-label">Servings</div><div class="meta-value">${recipe.servings}</div></div></div>
      <div class="meta-item"><span class="meta-icon">📊</span><div><div class="meta-label">Difficulty</div><div class="meta-value">${recipe.difficulty}</div></div></div>
    `;

        // Nutrition
        const nutrition = recipe.nutrition;
        document.getElementById('modalNutrition').innerHTML = `
      <div class="nutrition-item"><div class="nutrition-value">${nutrition.calories}</div><div class="nutrition-label">Calories</div></div>
      <div class="nutrition-item"><div class="nutrition-value">${nutrition.protein}</div><div class="nutrition-label">Protein</div></div>
      <div class="nutrition-item"><div class="nutrition-value">${nutrition.carbs}</div><div class="nutrition-label">Carbs</div></div>
      <div class="nutrition-item"><div class="nutrition-value">${nutrition.fat}</div><div class="nutrition-label">Fat</div></div>
    `;

        // Ingredients
        const ingredientsList = document.getElementById('modalIngredients');
        ingredientsList.innerHTML = recipe.ingredients.map(i => `<li>${i}</li>`).join('');

        // Instructions
        const instructionsList = document.getElementById('modalInstructions');
        instructionsList.innerHTML = recipe.instructions.map(i => `<li>${i}</li>`).join('');

        recipeModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        recipeModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    recipeModal.addEventListener('click', (e) => {
        if (e.target === recipeModal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // ============================
    // CATEGORY FILTERING
    // ============================
    categoryFilters.addEventListener('click', (e) => {
        const btn = e.target.closest('.category-btn');
        if (!btn) return;

        categoryFilters.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        currentCategory = btn.dataset.category;
        searchInput.value = '';
        loadRecipes(currentCategory);
    });

    // Global filter function for footer links
    window.filterByCategory = function (category) {
        currentCategory = category;
        searchInput.value = '';

        categoryFilters.querySelectorAll('.category-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.category === category);
        });

        loadRecipes(category);
        document.getElementById('recipes').scrollIntoView({ behavior: 'smooth' });
    };

    // ============================
    // SEARCH
    // ============================
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const query = e.target.value.toLowerCase().trim();
            if (!query) {
                renderRecipes(allRecipes);
                return;
            }
            const filtered = allRecipes.filter(r =>
                r.title.toLowerCase().includes(query) ||
                r.description.toLowerCase().includes(query) ||
                r.category.toLowerCase().includes(query) ||
                r.ingredients.some(i => i.toLowerCase().includes(query))
            );
            renderRecipes(filtered);
        }, 300);
    });

    // ============================
    // CTA FORM
    // ============================
    ctaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('ctaEmail').value;
        if (email) {
            const btn = ctaForm.querySelector('.cta-btn');
            btn.textContent = '✓ Subscribed!';
            btn.style.background = 'linear-gradient(135deg, #4CAF50, #388E3C)';
            document.getElementById('ctaEmail').value = '';
            setTimeout(() => {
                btn.textContent = 'Get Free Cookbook';
                btn.style.background = '';
            }, 3000);
        }
    });

    // ============================
    // SCROLL ANIMATIONS
    // ============================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    function observeFadeIns() {
        document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    }

    // ============================
    // INIT
    // ============================
    loadRecipes();
    observeFadeIns();
});
