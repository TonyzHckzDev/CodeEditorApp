// sidebar.js - gestion de la sidebar et menu de navigation

// Récupération des éléments du menu de navigation et de la sidebar const navButtons = document.querySelectorAll('header nav button'); const sidebar = document.querySelector('aside'); const toggleBtn = document.getElementById('btn-toggle-sidebar');

// Fonction pour afficher/masquer la sidebar (utile sur mobile) if (toggleBtn) { toggleBtn.addEventListener('click', () => { sidebar.classList.toggle('hidden'); }); }

// Fonction pour mettre en avant le bouton de navigation actif function highlightActive(key) { navButtons.forEach(btn => { const btnKey = btn.id.replace('btn-', ''); if (btnKey === key) { btn.classList.add('font-semibold', 'bg-gray-200'); } else { btn.classList.remove('font-semibold', 'bg-gray-200'); } }); }

// Association des événements de navigation navButtons.forEach(btn => { btn.addEventListener('click', () => { const key = btn.id.replace('btn-', ''); highlightActive(key); }); });

// Initialisation du surlignage sur la page d'accueil highlightActive('home');

// Liste des langages supportés et génération dynamique du select const languages = [ { value: 'html', label: 'HTML' }, { value: 'css', label: 'CSS' }, { value: 'javascript', label: 'JavaScript' }, { value: 'python', label: 'Python' }, { value: 'java', label: 'Java' } ]; const languageSelect = document.getElementById('language-select'); if (languageSelect) { languageSelect.innerHTML = languages .map(lang => <option value="${lang.value}">${lang.label}</option>) .join(''); }

// Gestion du collapse de la sidebar quand une navigation est sélectionnée (responsive) navButtons.forEach(btn => { btn.addEventListener('click', () => { if (window.innerWidth < 768 && !sidebar.classList.contains('hidden')) { sidebar.classList.add('hidden'); } }); });

