document.addEventListener('DOMContentLoaded', function() {
    // Initialize impress.js
    const api = impress();
    api.init();

    // Variables for tracking and controlling the presentation
    let currentStep = 0;
    const steps = document.querySelectorAll('.step');
    const totalSteps = steps.length;
    const progressBar = document.querySelector('.progress');
    
    // Navigation buttons
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const overviewBtn = document.getElementById('overview-btn');
    
    // Update progress bar
    function updateProgress() {
        const progress = (currentStep / (totalSteps - 1)) * 100;
        progressBar.style.width = `${progress}%`;
    }
    
    // Track step changes
    document.addEventListener('impress:stepenter', function(event) {
        // Find the current step index
        steps.forEach((step, index) => {
            if (step === event.target) {
                currentStep = index;
            }
        });
        
        updateProgress();
    });
    
    // Handle navigation buttons
    prevBtn.addEventListener('click', function() {
        api.prev();
    });
    
    nextBtn.addEventListener('click', function() {
        api.next();
    });
    
    overviewBtn.addEventListener('click', function() {
        api.goto('overview');
    });
    
    // Keyboard navigation
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

    // Ring navigation functionality
    const textRing = document.getElementById('text-ring');
    const tableRing = document.getElementById('table-ring');
    const graphRing = document.getElementById('graph-ring');
    
    // Add click events to rings for direct navigation to related content
    if (textRing) {
        textRing.addEventListener('click', function() {
            api.goto('analysis');
            
            // Add special zoom effect
            zoomToElement(textRing);
        });
    }
    
    if (tableRing) {
        tableRing.addEventListener('click', function() {
            api.goto('results');
            
            // Add special zoom effect
            zoomToElement(tableRing);
        });
    }
    
    if (graphRing) {
        graphRing.addEventListener('click', function() {
            api.goto('vectorization');
            
            // Add special zoom effect
            zoomToElement(graphRing);
        });
    }
    
    // Function for zoom effect on rings
    function zoomToElement(element) {
        // Add zoom animation class
        element.classList.add('zoom-effect');
        
        // Remove class after animation completes
        setTimeout(function() {
            element.classList.remove('zoom-effect');
        }, 1000);
    }
    
    // Add special navigation back to overview
    document.addEventListener('impress:stepenter', function(event) {
        if (event.target.id === 'return-overview') {
            setTimeout(function() {
                api.goto('overview');
            }, 500);
        }
    });
    
    // Add custom animation for rings on first load
    if (document.querySelector('.rings-container')) {
        setTimeout(function() {
            const mainRing = document.querySelector('.main-ring');
            const subRings = document.querySelectorAll('.sub-ring');
            
            // Animate main ring
            if (mainRing) {
                mainRing.style.transform = 'scale(1.05)';
                setTimeout(() => mainRing.style.transform = 'scale(1)', 800);
            }
            
            // Animate sub rings
            subRings.forEach((ring, index) => {
                setTimeout(() => {
                    ring.style.transform = 'scale(1.2)';
                    setTimeout(() => ring.style.transform = 'scale(1)', 400);
                }, 300 * (index + 1));
            });
        }, 1000);
    }
    
    // Setup MutationObserver to detect active slide changes
    // This is needed for additional custom effects not handled by impress.js
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                const step = mutation.target;
                if (step.classList.contains('active')) {
                    // Custom actions when a slide becomes active
                    handleActiveSlide(step);
                }
            }
        });
    });
    
    // Observe all slide elements
    steps.forEach(function(step) {
        observer.observe(step, { attributes: true });
    });
    
    // Handle custom effects for specific slides when they become active
    function handleActiveSlide(slide) {
        const id = slide.id;
        
        // Special effects for specific slides
        switch(id) {
            case 'overview':
                animateRingsContainer();
                break;
            case 'results':
                // Animation will be triggered by charts.js
                break;
            case 'analysis':
                // Animation will be triggered by charts.js
                break;
            case 'conclusion':
                animateConclusion();
                break;
        }
    }
    
    // Animate rings container for overview slide
    function animateRingsContainer() {
        const ringsContainer = document.querySelector('.rings-container');
        if (ringsContainer) {
            ringsContainer.style.opacity = 0;
            setTimeout(() => {
                ringsContainer.style.transition = 'opacity 1s ease';
                ringsContainer.style.opacity = 1;
            }, 300);
        }
    }
    
    // Animate conclusion icons
    function animateConclusion() {
        const icons = document.querySelectorAll('#conclusion .icon');
        icons.forEach((icon, index) => {
            icon.style.opacity = 0;
            icon.style.transform = 'scale(0.5)';
            
            setTimeout(() => {
                icon.style.transition = 'all 0.5s ease';
                icon.style.opacity = 1;
                icon.style.transform = 'scale(1)';
            }, 300 * (index + 1));
        });
    }
    
    // Add CSS for zoom effect animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes zoomIn {
            0% { transform: scale(1); }
            50% { transform: scale(1.5); }
            100% { transform: scale(30); opacity: 0; }
        }
        
        .zoom-effect {
            animation: zoomIn 1s forwards;
        }
        
        .sub-ring {
            transition: transform 0.3s ease, opacity 0.3s ease;
        }
        
        .main-ring {
            transition: transform 0.8s ease;
        }
        
        .rings-container {
            transition: opacity 1s ease;
        }
    `;
    document.head.appendChild(style);
    
    // Initial update of progress
    updateProgress();
});