// Mise à jour de l'heure
function updateTime() {
    const now = new Date();
    const timeString = now.getHours().toString().padStart(2, '0') + ':' +
        now.getMinutes().toString().padStart(2, '0');
    document.getElementById('current-time').textContent = timeString;
}

// Unified Modal System
const modalTitles = {
    'about': 'À propos',
    'portfolio': 'Mon portfolio', 
    'projects': 'Mes projets',
    'contact': 'Contact'
};

let activeModals = new Set();
let dragState = { isDragging: false, element: null, offset: { x: 0, y: 0 } };

function openModal(modalId) {
    const modal = document.getElementById(modalId + '-modal');
    if (!modal) return;
    
    const window = modal.querySelector('.window');
    
    modal.style.display = 'block';
    window.style.left = (50 + Math.random() * 100) + 'px';
    window.style.top = (50 + Math.random() * 100) + 'px';

    // Add to active modals
    activeModals.add(modalId);

    // Add taskbar entry
    addTaskbarEntry(modalTitles[modalId], modal);

    // Initialize window controls
    initializeWindowControls(modal, modalId);

    // Make draggable
    makeWindowDraggable(window);
    
    // Initialize scrolling
    initializeScrolling(window);
}

function initializeWindowControls(modal, modalId) {
    const window = modal.querySelector('.window');
    
    // Close button
    const closeButton = window.querySelector('.close-button');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            modal.style.display = 'none';
            activeModals.delete(modalId);
            removeTaskbarEntry(modalTitles[modalId]);
        });
    }

    // Minimize button
    const minimizeButton = window.querySelector('.minimize-button');
    if (minimizeButton) {
        minimizeButton.addEventListener('click', function() {
            window.style.display = 'none';
        });
    }

    // Maximize button
    const maximizeButton = window.querySelector('.maximize-button');
    if (maximizeButton) {
        let isMaximized = false;
        let originalSize = { width: window.style.width, height: window.style.height, left: window.style.left, top: window.style.top };
        
        maximizeButton.addEventListener('click', function() {
            if (isMaximized) {
                // Restore
                window.style.width = originalSize.width || '600px';
                window.style.height = originalSize.height || '400px';
                window.style.left = originalSize.left || '50px';
                window.style.top = originalSize.top || '50px';
                window.style.position = 'absolute';
                isMaximized = false;
            } else {
                // Maximize
                originalSize = {
                    width: window.style.width,
                    height: window.style.height,
                    left: window.style.left,
                    top: window.style.top
                };
                window.style.width = 'calc(100vw - 10px)';
                window.style.height = 'calc(100vh - 50px)';
                window.style.left = '5px';
                window.style.top = '5px';
                window.style.position = 'fixed';
                isMaximized = true;
            }
        });
    }
}

function makeWindowDraggable(window) {
    const titleBar = window.querySelector('.title-bar');
    if (!titleBar) return;
    
    titleBar.addEventListener('mousedown', function(e) {
        // Don't drag if clicking on control buttons
        if (e.target.classList.contains('control-button')) return;
        
        dragState.isDragging = true;
        dragState.element = window;
        
        const rect = window.getBoundingClientRect();
        dragState.offset.x = e.clientX - rect.left;
        dragState.offset.y = e.clientY - rect.top;
        
        document.addEventListener('mousemove', handleDrag);
        document.addEventListener('mouseup', stopDrag);
        
        e.preventDefault();
    });
}

function handleDrag(e) {
    if (!dragState.isDragging || !dragState.element) return;
    
    const window = dragState.element;
    window.style.left = (e.clientX - dragState.offset.x) + 'px';
    window.style.top = (e.clientY - dragState.offset.y) + 'px';
    window.style.position = 'absolute';
}

function stopDrag() {
    dragState.isDragging = false;
    dragState.element = null;
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', stopDrag);
}

function initializeScrolling(window) {
    const contentArea = window.querySelector('.content-area');
    const scrollbar = window.querySelector('.scrollbar-vertical');
    
    if (!contentArea || !scrollbar) return;
    
    // Mouse wheel scrolling
    window.addEventListener('wheel', function(e) {
        e.preventDefault();
        const scrollAmount = e.deltaY > 0 ? 30 : -30;
        contentArea.scrollTop = Math.max(0, contentArea.scrollTop + scrollAmount);
        updateScrollThumb(contentArea, scrollbar);
    });
    
    // Update scroll thumb position
    contentArea.addEventListener('scroll', function() {
        updateScrollThumb(contentArea, scrollbar);
    });
    
    // Initialize scroll thumb
    updateScrollThumb(contentArea, scrollbar);
}

function updateScrollThumb(contentArea, scrollbar) {
    const thumb = scrollbar.querySelector('.scroll-thumb');
    if (!thumb) return;
    
    const scrollPercentage = contentArea.scrollTop / (contentArea.scrollHeight - contentArea.clientHeight);
    const trackHeight = scrollbar.clientHeight;
    const thumbHeight = Math.max(20, (contentArea.clientHeight / contentArea.scrollHeight) * trackHeight);
    const thumbPosition = scrollPercentage * (trackHeight - thumbHeight);
    
    thumb.style.height = thumbHeight + 'px';
    thumb.style.top = Math.max(0, thumbPosition) + 'px';
}

// Sélection des icônes
function selectIcon(icon) {
    // Désélectionner toutes les icônes
    document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
    // Sélectionner l'icône cliquée
    icon.classList.add('selected');
}

// Navigation vers les pages
function navigateToPage(pageNumber) {
    alert(`Navigation vers la Page ${pageNumber} - Fonctionnalité à implémenter !`);
}

// Fonction d'arrêt
function shutdown() {
    if (confirm('Voulez-vous vraiment arrêter Windows ?')) {
        document.body.style.background = '#000000';
        document.body.innerHTML = '<div style="color: white; text-align: center; padding-top: 200px; font-family: monospace;">Il est maintenant possible d\'éteindre votre ordinateur en toute sécurité.</div>';
    }
}

// Taskbar management
function addTaskbarEntry(title, modal) {
    // Simple taskbar functionality - could be expanded
    console.log('Added taskbar entry:', title);
}

function removeTaskbarEntry(title) {
    // Simple taskbar functionality - could be expanded
    console.log('Removed taskbar entry:', title);
}

// Initialisation après chargement du DOM
document.addEventListener('DOMContentLoaded', function () {
    updateTime();
    setInterval(updateTime, 1000);

    // Show start menu on hover, hide when mouse leaves both button and menu
    const startButton = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');
    let menuTimeout;

    if (startButton && startMenu) {
        startButton.addEventListener('mouseenter', () => {
            clearTimeout(menuTimeout);
            startMenu.classList.remove('hidden');
        });

        startButton.addEventListener('mouseleave', () => {
            menuTimeout = setTimeout(() => {
                startMenu.classList.add('hidden');
            }, 150);
        });

        startMenu.addEventListener('mouseenter', () => {
            clearTimeout(menuTimeout);
        });

        startMenu.addEventListener('mouseleave', () => {
            startMenu.classList.add('hidden');
        });

        // Remove default open menu
        startMenu.classList.add('hidden');
    }

    // Make desktop icons draggable and droppable
    const desktop = document.querySelector('.desktop');
    let draggedIcon = null;
    let offsetX = 0;
    let offsetY = 0;

    document.querySelectorAll('.desktop-icon').forEach(icon => {
        icon.setAttribute('draggable', 'false');

        icon.addEventListener('mousedown', function (e) {
            draggedIcon = icon;
            const rect = icon.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            icon.style.zIndex = 1000;
            document.body.style.userSelect = 'none';
        });
    });

    document.addEventListener('mousemove', function (e) {
        if (draggedIcon) {
            const desktopRect = desktop.getBoundingClientRect();
            let x = e.clientX - desktopRect.left - offsetX;
            let y = e.clientY - desktopRect.top - offsetY;

            x = Math.max(0, Math.min(x, desktop.offsetWidth - draggedIcon.offsetWidth));
            y = Math.max(0, Math.min(y, desktop.offsetHeight - draggedIcon.offsetHeight));

            draggedIcon.style.left = x + 'px';
            draggedIcon.style.top = y + 'px';
        }
    });

    document.addEventListener('mouseup', function () {
        if (draggedIcon) {
            draggedIcon.style.zIndex = 1;
            draggedIcon = null;
            document.body.style.userSelect = '';
        }
    });

    // Add click functionality for all icons
    const aboutIcon = document.querySelector('.icon-about');
    const portfolioIcon = document.querySelector('.icon-portfolio');
    const trashIcon = document.querySelector('.icon-trash');
    const projectsIcon = document.getElementById('icon-projects');
    const contactIcon = document.querySelector('.icon-contact');

    // Add click event listeners for all icons
    if (aboutIcon) {
        aboutIcon.addEventListener('click', function () {
            selectIcon(this);
            openModal('about');
        });
    }

    if (portfolioIcon) {
        portfolioIcon.addEventListener('click', function () {
            selectIcon(this);
            openModal('portfolio');
        });
    }

    if (trashIcon) {
        trashIcon.addEventListener('click', function () {
            selectIcon(this);
            alert('Corbeille (Pleine) - Fonctionnalité à implémenter !');
        });
    }

    if (projectsIcon) {
        projectsIcon.addEventListener('click', function () {
            selectIcon(this);
            openModal('projects');
        });
    }

    if (contactIcon) {
        contactIcon.addEventListener('click', function () {
            selectIcon(this);
            openModal('contact');
        });
    }

    // Email form functionality
    const emailForm = document.getElementById('email-form');
    if (emailForm) {
        emailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupérer les données du formulaire
            const firstname = document.getElementById('sender-firstname').value;
            const lastname = document.getElementById('sender-lastname').value;
            const senderEmail = document.getElementById('sender-email').value;
            const message = document.getElementById('email-message').value;
            
            // Construire le corps de l'email
            const emailBody = `Nom: ${firstname} ${lastname}
Email: ${senderEmail}

Message:
${message}`;
            
            const subject = `Contact depuis My Agile Toolkit - ${firstname} ${lastname}`;
            const body = encodeURIComponent(emailBody);
            const encodedSubject = encodeURIComponent(subject);
            
            window.location.href = `mailto:eleodorandrei@gmail.com?subject=${encodedSubject}&body=${body}`;
            
            // Close the contact modal
            const contactModal = document.getElementById('contact-modal');
            if (contactModal) {
                contactModal.style.display = 'none';
                activeModals.delete('contact');
                removeTaskbarEntry('Contact');
            }
        });
    }
});

