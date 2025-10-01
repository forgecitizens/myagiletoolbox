// Mise à jour de l'heure
function updateTime() {
    const now = new Date();
    const timeString = now.getHours().toString().padStart(2, '0') + ':' +
        now.getMinutes().toString().padStart(2, '0');
    document.getElementById('current-time').textContent = timeString;
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

// Initialisation après chargement du DOM
document.addEventListener('DOMContentLoaded', function () {
    updateTime();
    setInterval(updateTime, 1000);

    // Redirection for "Mes Projets" icon
    document.getElementById('icon-projects').addEventListener('click', function () {
        document.getElementById('projects-modal').classList.remove('hidden');
    });
    document.getElementById('close-projects-modal').addEventListener('click', function () {
        document.getElementById('projects-modal').classList.add('hidden');
    });
    // Optional: close modal when clicking outside content
    document.getElementById('projects-modal').addEventListener('click', function (e) {
        if (e.target === this) {
            this.classList.add('hidden');
        }
    });

    // Show start menu on hover, hide when mouse leaves both button and menu
    const startButton = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');
    let menuTimeout;

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

    // Make desktop icons draggable and droppable
    const desktop = document.querySelector('.desktop');
    let draggedIcon = null;
    let offsetX = 0;
    let offsetY = 0;

    document.querySelectorAll('.desktop-icon').forEach(icon => {
        icon.setAttribute('draggable', 'false'); // We'll use mouse events, not HTML5 drag

        icon.addEventListener('mousedown', function (e) {
            draggedIcon = icon;
            // Calculate offset between mouse and icon's top-left
            const rect = icon.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            icon.style.zIndex = 1000;
            document.body.style.userSelect = 'none';
        });
    });

    document.addEventListener('mousemove', function (e) {
        if (draggedIcon) {
            // Calculate new position relative to desktop
            const desktopRect = desktop.getBoundingClientRect();
            let x = e.clientX - desktopRect.left - offsetX;
            let y = e.clientY - desktopRect.top - offsetY;

            // Optional: keep icon within desktop bounds
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

    // Email modal logic
    const contactIcon = document.querySelector('.icon-contact');
    const emailModal = document.getElementById('email-modal');
    const closeEmailModal = document.getElementById('close-email-modal');
    const emailForm = document.getElementById('email-form');
    const emailMessage = document.getElementById('email-message');

    closeEmailModal.addEventListener('click', function () {
        emailModal.classList.add('hidden');
    });

    emailForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const body = encodeURIComponent(emailMessage.value);
        window.location.href = `mailto:eleodorandrei@gmail.com?subject=Contact%20depuis%20My%20Agile%20Toolkit&body=${body}`;
        emailModal.classList.add('hidden');
    });

    // Add click functionality for all icons
    const aboutIcon = document.querySelector('.icon-about');
    const portfolioIcon = document.querySelector('.icon-portfolio');
    const trashIcon = document.querySelector('.icon-trash');
    const projectsIcon = document.getElementById('icon-projects');

    // Add click event listeners for all icons
    aboutIcon.addEventListener('click', function () {
        selectIcon(this);
        alert('À Propos - Fonctionnalité à implémenter !');
    });

    portfolioIcon.addEventListener('click', function () {
        selectIcon(this);
        alert('Mon Portfolio - Fonctionnalité à implémenter !');
    });

    trashIcon.addEventListener('click', function () {
        selectIcon(this);
        alert('Corbeille (Pleine) - Fonctionnalité à implémenter !');
    });

    // Update projects icon to select and open modal
    projectsIcon.addEventListener('click', function () {
        selectIcon(this);
    });

    // Update contact icon to select and open email modal
    contactIcon.addEventListener('click', function () {
        selectIcon(this);
        emailModal.classList.remove('hidden');
        emailMessage.value = '';
    });
});