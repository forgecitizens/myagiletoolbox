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

    // Redirection for "Mes Projets" icon - handled by Windows 98 modal system

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
        initializeProjectsWindow();
    });

    // Update contact icon to select and open email modal
    contactIcon.addEventListener('click', function () {
        selectIcon(this);
        emailModal.classList.remove('hidden');
        emailMessage.value = '';
    });
});

// Windows 98 Projects Modal Functionality
let isProjectsDragging = false;
let isProjectsScrollDragging = false;
let projectsDragOffset = { x: 0, y: 0 };
let projectsScrollOffset = 0;

function initializeProjectsWindow() {
    const projectsModal = document.getElementById('projects-modal');
    const projectsWindow = document.getElementById('projects-window');
    const projectsTitleBar = document.getElementById('projects-title-bar');
    const projectsScrollableContent = document.getElementById('projects-scrollable-content');
    const projectsScrollThumb = document.getElementById('projects-scroll-thumb');
    
    // Show the modal
    projectsModal.classList.remove('hidden');
    
    // Initialize scroll thumb position
    updateProjectsScrollThumb();
    
    // Window dragging functionality
    projectsTitleBar.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('win98-control-button')) return;
        isProjectsDragging = true;
        const rect = projectsWindow.getBoundingClientRect();
        projectsDragOffset.x = e.clientX - rect.left;
        projectsDragOffset.y = e.clientY - rect.top;
        document.addEventListener('mousemove', dragProjectsWindow);
        document.addEventListener('mouseup', stopProjectsDragging);
    });
    
    // Scroll thumb dragging
    projectsScrollThumb.addEventListener('mousedown', (e) => {
        isProjectsScrollDragging = true;
        projectsScrollOffset = e.clientY - projectsScrollThumb.getBoundingClientRect().top;
        document.addEventListener('mousemove', dragProjectsScrollThumb);
        document.addEventListener('mouseup', stopProjectsScrollDragging);
        e.preventDefault();
    });
    
    // Update scroll thumb when content is scrolled
    projectsScrollableContent.parentElement.addEventListener('scroll', updateProjectsScrollThumb);
    
    // Add mousewheel scrolling support to both the window and content area
    const contentArea = projectsScrollableContent.parentElement;
    
    projectsWindow.addEventListener('wheel', function(e) {
        e.preventDefault(); // Prevent page scrolling
        const delta = e.deltaY > 0 ? 30 : -30; // Scroll down or up
        scrollProjectsContent(delta);
    });
    
    contentArea.addEventListener('wheel', function(e) {
        e.preventDefault(); // Prevent page scrolling
        const delta = e.deltaY > 0 ? 30 : -30; // Scroll down or up
        scrollProjectsContent(delta);
    });
    
    projectsScrollableContent.addEventListener('wheel', function(e) {
        e.preventDefault(); // Prevent page scrolling
        const delta = e.deltaY > 0 ? 30 : -30; // Scroll down or up
        scrollProjectsContent(delta);
    });
}

function dragProjectsWindow(e) {
    if (!isProjectsDragging || document.getElementById('projects-window').classList.contains('fullscreen')) return;
    const projectsWindow = document.getElementById('projects-window');
    projectsWindow.style.position = 'absolute';
    projectsWindow.style.left = (e.clientX - projectsDragOffset.x) + 'px';
    projectsWindow.style.top = (e.clientY - projectsDragOffset.y) + 'px';
}

function stopProjectsDragging() {
    isProjectsDragging = false;
    document.removeEventListener('mousemove', dragProjectsWindow);
    document.removeEventListener('mouseup', stopProjectsDragging);
}

function scrollProjectsContent(delta) {
    const contentArea = document.getElementById('projects-scrollable-content').parentElement;
    const scrollableContent = document.getElementById('projects-scrollable-content');
    const maxScroll = scrollableContent.scrollHeight - contentArea.clientHeight;
    const currentScroll = contentArea.scrollTop;
    const newScroll = Math.max(0, Math.min(maxScroll, currentScroll + delta));
    contentArea.scrollTop = newScroll;
    updateProjectsScrollThumb();
}

function updateProjectsScrollThumb() {
    const contentArea = document.getElementById('projects-scrollable-content').parentElement;
    const scrollableContent = document.getElementById('projects-scrollable-content');
    const scrollThumb = document.getElementById('projects-scroll-thumb');
    
    if (!contentArea || !scrollableContent || !scrollThumb) return;
    
    const scrollPercentage = contentArea.scrollTop / (scrollableContent.scrollHeight - contentArea.clientHeight);
    const trackHeight = scrollThumb.parentElement.clientHeight;
    const thumbPosition = scrollPercentage * (trackHeight - scrollThumb.clientHeight);
    scrollThumb.style.top = Math.max(0, thumbPosition) + 'px';
}

function scrollProjectsToPosition(e) {
    const scrollThumb = document.getElementById('projects-scroll-thumb');
    if (e.target === scrollThumb) return;
    
    const track = e.currentTarget;
    const rect = track.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const scrollPercentage = clickY / track.clientHeight;
    const contentArea = document.getElementById('projects-scrollable-content').parentElement;
    const scrollableContent = document.getElementById('projects-scrollable-content');
    const maxScroll = scrollableContent.scrollHeight - contentArea.clientHeight;
    contentArea.scrollTop = scrollPercentage * maxScroll;
    updateProjectsScrollThumb();
}

function dragProjectsScrollThumb(e) {
    if (!isProjectsScrollDragging) return;
    const scrollThumb = document.getElementById('projects-scroll-thumb');
    const track = scrollThumb.parentElement;
    const trackRect = track.getBoundingClientRect();
    const newY = e.clientY - trackRect.top - projectsScrollOffset;
    const maxY = track.clientHeight - scrollThumb.clientHeight;
    const clampedY = Math.max(0, Math.min(maxY, newY));
    
    scrollThumb.style.top = clampedY + 'px';
    
    const scrollPercentage = clampedY / maxY;
    const contentArea = document.getElementById('projects-scrollable-content').parentElement;
    const scrollableContent = document.getElementById('projects-scrollable-content');
    const maxScroll = scrollableContent.scrollHeight - contentArea.clientHeight;
    contentArea.scrollTop = scrollPercentage * maxScroll;
}

function stopProjectsScrollDragging() {
    isProjectsScrollDragging = false;
    document.removeEventListener('mousemove', dragProjectsScrollThumb);
    document.removeEventListener('mouseup', stopProjectsScrollDragging);
}

function minimizeProjectsWindow() {
    const projectsWindow = document.getElementById('projects-window');
    projectsWindow.style.transform = 'scale(0.1)';
    projectsWindow.style.opacity = '0.5';
    setTimeout(() => {
        projectsWindow.style.transform = 'scale(1)';
        projectsWindow.style.opacity = '1';
    }, 500);
}

function toggleProjectsFullscreen() {
    const projectsWindow = document.getElementById('projects-window');
    projectsWindow.classList.toggle('fullscreen');
    if (projectsWindow.classList.contains('fullscreen')) {
        projectsWindow.style.position = 'fixed';
        projectsWindow.style.left = '0';
        projectsWindow.style.top = '0';
    } else {
        projectsWindow.style.position = 'relative';
        projectsWindow.style.left = 'auto';
        projectsWindow.style.top = 'auto';
    }
}

// Close button functionality
document.addEventListener('DOMContentLoaded', function() {
    const closeProjectsModal = document.getElementById('close-projects-modal');
    if (closeProjectsModal) {
        closeProjectsModal.addEventListener('click', function() {
            const projectsModal = document.getElementById('projects-modal');
            projectsModal.classList.add('hidden');
        });
    }
});