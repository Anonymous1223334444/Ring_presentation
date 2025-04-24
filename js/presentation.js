document.addEventListener('DOMContentLoaded', function() {
    // Vérifie si impress.js est chargé et attendre qu'il soit disponible
    if (typeof impress === 'undefined') {
        console.error("impress.js n'est pas chargé correctement");
        // Attendre un peu pour voir si impress.js se charge avec retard
        setTimeout(initPresentation, 1000);
    } else {
        initPresentation();
    }
    
    function initPresentation() {
        try {
            // Initialiser impress.js seulement s'il est disponible
            if (typeof impress === 'function') {
                const api = impress();
                api.init();
                
                // Variables pour suivre et contrôler la présentation
                let currentStep = 0;
                const steps = document.querySelectorAll('.step');
                const totalSteps = steps.length;
                const progressBar = document.querySelector('.progress');
                
                // Boutons de navigation
                const prevBtn = document.getElementById('prev');
                const nextBtn = document.getElementById('next');
                const overviewBtn = document.getElementById('overview-btn');
                
                // Mettre à jour la barre de progression
                function updateProgress() {
                    const progress = (currentStep / (totalSteps - 1)) * 100;
                    progressBar.style.width = `${progress}%`;
                }
                
                // Suivre les changements d'étape
                document.addEventListener('impress:stepenter', function(event) {
                    // Trouver l'index de l'étape courante
                    steps.forEach((step, index) => {
                        if (step === event.target) {
                            currentStep = index;
                        }
                    });
                    
                    updateProgress();
                    
                    // Mise à jour visuelle des icônes selon le slide actif
                    updateActiveIcon(event.target.id);
                });
                
                // Gérer les boutons de navigation
                if (prevBtn) prevBtn.addEventListener('click', function() {
                    api.prev();
                });
                
                if (nextBtn) nextBtn.addEventListener('click', function() {
                    api.next();
                });
                
                if (overviewBtn) overviewBtn.addEventListener('click', function() {
                    api.goto('overview');
                });
                
                // Navigation au clavier
                document.addEventListener('keydown', function(event) {
                    switch(event.key) {
                        case 'ArrowLeft':
                            api.prev();
                            break;
                        case 'ArrowRight':
                        case ' ':
                            api.next();
                            break;
                        case 'o':
                            api.goto('overview');
                            break;
                    }
                });
            
                // Configuration des petits cercles dans la vue circulaire
                setupCircleIcons(api);
                
                // Animation initiale des éléments
                animateCircleElements();
                
                // Configuration de MutationObserver pour détecter les changements de diapositive active
                setupSlideObserver();
                
                // Mise à jour initiale de la progression
                updateProgress();
                
                // Afficher les tooltips des sous-thèmes au survol
                setupSubThemeTooltips();
            } else {
                console.error("La fonction impress() n'est pas disponible");
                showError("La bibliothèque impress.js n'a pas été chargée correctement.");
            }
        } catch (error) {
            console.error("Erreur lors de l'initialisation de la présentation:", error);
            showError("Erreur d'initialisation: " + error.message);
        }
    }
    
    // Configuration des icônes circulaires
    function setupCircleIcons(api) {
        const circleIcons = document.querySelectorAll('.circle-icon');
        
        circleIcons.forEach(icon => {
            icon.addEventListener('click', function() {
                const targetSlide = this.getAttribute('data-target');
                if (targetSlide) {
                    // Animation de l'icône
                    highlightIcon(this);
                    
                    // Aller au slide correspondant (si disponible)
                    const targetElement = document.getElementById(targetSlide);
                    if (targetElement) {
                        api.goto(targetSlide);
                    } else {
                        // Si le slide n'existe pas encore, afficher un message
                        showThemeInfo(this.getAttribute('data-theme'));
                    }
                }
            });
        });
    }
    
    // Afficher un message temporaire avec le thème sélectionné
    function showThemeInfo(theme) {
        // Créer un élément de message
        const infoBox = document.createElement('div');
        infoBox.className = 'theme-info-box';
        infoBox.innerHTML = `
            <h3>Sous-thème: ${theme}</h3>
            <p>Ce contenu est en cours de développement.</p>
        `;
        
        // Styles pour le message
        infoBox.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(0, 0, 0, 0.8);
            border: 2px solid #f97316;
            border-radius: 10px;
            padding: 20px;
            color: white;
            z-index: 9999;
            text-align: center;
            box-shadow: 0 0 20px rgba(249, 115, 22, 0.5);
        `;
        
        // Ajouter à la page
        document.body.appendChild(infoBox);
        
        // Supprimer après quelques secondes
        setTimeout(() => {
            infoBox.style.opacity = '0';
            infoBox.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                infoBox.remove();
            }, 500);
        }, 2000);
    }
    
    // Mise en évidence de l'icône cliquée
    function highlightIcon(icon) {
        // Réinitialiser toutes les icônes
        document.querySelectorAll('.circle-icon').forEach(i => {
            i.classList.remove('active-icon');
            i.classList.remove('pulse-animation');
        });
        
        // Mettre en évidence l'icône actuelle
        icon.classList.add('active-icon');
        icon.classList.add('pulse-animation');
        
        // Supprimer l'animation après un délai
        setTimeout(() => {
            icon.classList.remove('pulse-animation');
        }, 2000);
    }
    
    // Mettre à jour l'icône active selon le slide courant
    function updateActiveIcon(slideId) {
        // Réinitialiser toutes les icônes
        document.querySelectorAll('.circle-icon').forEach(icon => {
            icon.classList.remove('active-icon');
        });
        
        // Trouver et activer l'icône correspondante
        const matchingIcon = document.querySelector(`.circle-icon[data-target="${slideId}"]`);
        if (matchingIcon) {
            matchingIcon.classList.add('active-icon');
        }
    }
    
    // Configuration des tooltips pour les sous-thèmes
    function setupSubThemeTooltips() {
        const circleIcons = document.querySelectorAll('.circle-icon');
        
        circleIcons.forEach(icon => {
            // L'info-bulle est déjà dans le HTML, la rendre visible au survol
            icon.addEventListener('mouseenter', function() {
                const tooltip = this.querySelector('.icon-tooltip');
                if (tooltip) {
                    tooltip.style.opacity = '1';
                }
            });
            
            icon.addEventListener('mouseleave', function() {
                const tooltip = this.querySelector('.icon-tooltip');
                if (tooltip) {
                    tooltip.style.opacity = '0';
                }
            });
        });
    }
    
    // Animation des éléments du cercle
    function animateCircleElements() {
        const mainCircle = document.querySelector('.main-circle');
        const circleIcons = document.querySelectorAll('.circle-icon');
        const centralContent = document.querySelector('.circle-content');
        
        if (mainCircle) {
            // Animation d'apparition du cercle principal
            mainCircle.style.opacity = '0';
            mainCircle.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                mainCircle.style.transition = 'all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
                mainCircle.style.opacity = '1';
                mainCircle.style.transform = 'scale(1)';
            }, 300);
        }
        
        if (centralContent) {
            // Animation d'apparition du contenu central
            centralContent.style.opacity = '0';
            centralContent.style.transform = 'scale(0.9) translateY(20px)';
            
            setTimeout(() => {
                centralContent.style.transition = 'all 1s ease';
                centralContent.style.opacity = '1';
                centralContent.style.transform = 'scale(1) translateY(0)';
            }, 1000);
        }
        
        // Animation des petits cercles/icônes
        circleIcons.forEach((icon, index) => {
            // Cacher initialement
            icon.style.opacity = '0';
            icon.style.transform = icon.style.transform.replace('scale(1)', 'scale(0)');
            
            // Animation d'apparition avec délai pour créer un effet de vague
            setTimeout(() => {
                icon.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
                
                // Restaurer la transformation d'origine avec scale(1)
                const originalTransform = icon.style.transform;
                icon.style.transform = originalTransform.replace('scale(0)', 'scale(1)');
                icon.style.opacity = '1';
            }, 1200 + (index * 30)); // Délai croissant pour effet en cascade
        });
    }
    
    // Configuration de l'observateur de slides
    function setupSlideObserver() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class') {
                    const step = mutation.target;
                    if (step.classList.contains('active')) {
                        // Actions personnalisées lorsqu'une diapositive devient active
                        handleActiveSlide(step);
                    }
                }
            });
        });
        
        // Observer tous les éléments de diapositive
        const steps = document.querySelectorAll('.step');
        steps.forEach(function(step) {
            observer.observe(step, { attributes: true });
        });
    }
    
    // Gérer les effets personnalisés pour des diapositives spécifiques
    function handleActiveSlide(slide) {
        const id = slide.id;
        
        // Effets spéciaux pour des diapositives spécifiques
        switch(id) {
            case 'overview':
                // Réanimer les éléments du cercle quand on revient à l'aperçu
                animateCircleElements();
                break;
            case 'conclusion':
                animateConclusion();
                break;
            case 'results':
                // Les animations pour results seront gérées par charts.js
                break;
        }
    }
    
    // Animer les éléments de la conclusion
    function animateConclusion() {
        const icons = document.querySelectorAll('#conclusion .icon');
        const cards = document.querySelectorAll('#conclusion .card');
        
        // Animer les icônes
        icons.forEach((icon, index) => {
            icon.style.opacity = '0';
            icon.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                icon.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
                icon.style.opacity = '1';
                icon.style.transform = 'translateY(0)';
            }, 300 * (index + 1));
        });
        
        // Animer les cartes
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.8s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 600 + (index * 200));
        });
    }
    
    // Afficher un message d'erreur
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; background-color: #ef4444; color: white; padding: 15px; text-align: center; z-index: 9999;';
        errorDiv.innerHTML = `<strong>Erreur:</strong> ${message} Essayez de recharger la page.`;
        document.body.appendChild(errorDiv);
    }
});