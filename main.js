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
        initializeAboutWindow(); // Changed from alert to open about modal
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

    // Update contact icon to select and open contact modal
    contactIcon.addEventListener('click', function () {
        selectIcon(this);
        initializeContactWindow();
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

// Windows 98 Contact Modal Functionality
let isContactDragging = false;
let isContactScrollDragging = false;
let contactDragOffset = { x: 0, y: 0 };
let contactScrollOffset = 0;

function initializeContactWindow() {
    const emailModal = document.getElementById('email-modal');
    const contactWindow = document.getElementById('contact-window');
    const contactTitleBar = document.getElementById('contact-title-bar');
    const contactScrollableContent = document.getElementById('contact-scrollable-content');
    const contactScrollThumb = document.getElementById('contact-scroll-thumb');
    
    // Show the modal
    emailModal.classList.remove('hidden');
    
    // Initialize scroll thumb position
    updateContactScrollThumb();
    
    // Window dragging functionality
    contactTitleBar.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('win98-control-button')) return;
        isContactDragging = true;
        const rect = contactWindow.getBoundingClientRect();
        contactDragOffset.x = e.clientX - rect.left;
        contactDragOffset.y = e.clientY - rect.top;
        document.addEventListener('mousemove', dragContactWindow);
        document.addEventListener('mouseup', stopContactDragging);
    });
    
    // Scroll thumb dragging
    contactScrollThumb.addEventListener('mousedown', (e) => {
        isContactScrollDragging = true;
        contactScrollOffset = e.clientY - contactScrollThumb.getBoundingClientRect().top;
        document.addEventListener('mousemove', dragContactScrollThumb);
        document.addEventListener('mouseup', stopContactScrollDragging);
        e.preventDefault();
    });
    
    // Add mousewheel scrolling support
    const contentArea = contactScrollableContent.parentElement;
    
    contactWindow.addEventListener('wheel', function(e) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 30 : -30;
        scrollContactContent(delta);
    });
    
    contentArea.addEventListener('wheel', function(e) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 30 : -30;
        scrollContactContent(delta);
    });
    
    contactScrollableContent.addEventListener('wheel', function(e) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 30 : -30;
        scrollContactContent(delta);
    });
    
    // Update scroll thumb when content is scrolled
    contentArea.addEventListener('scroll', updateContactScrollThumb);
}

function dragContactWindow(e) {
    if (!isContactDragging || document.getElementById('contact-window').classList.contains('fullscreen')) return;
    const contactWindow = document.getElementById('contact-window');
    contactWindow.style.position = 'absolute';
    contactWindow.style.left = (e.clientX - contactDragOffset.x) + 'px';
    contactWindow.style.top = (e.clientY - contactDragOffset.y) + 'px';
}

function stopContactDragging() {
    isContactDragging = false;
    document.removeEventListener('mousemove', dragContactWindow);
    document.removeEventListener('mouseup', stopContactDragging);
}

function scrollContactContent(delta) {
    const contentArea = document.getElementById('contact-scrollable-content').parentElement;
    const scrollableContent = document.getElementById('contact-scrollable-content');
    const maxScroll = scrollableContent.scrollHeight - contentArea.clientHeight;
    const currentScroll = contentArea.scrollTop;
    const newScroll = Math.max(0, Math.min(maxScroll, currentScroll + delta));
    contentArea.scrollTop = newScroll;
    updateContactScrollThumb();
}

function updateContactScrollThumb() {
    const contentArea = document.getElementById('contact-scrollable-content').parentElement;
    const scrollableContent = document.getElementById('contact-scrollable-content');
    const scrollThumb = document.getElementById('contact-scroll-thumb');
    
    if (!contentArea || !scrollableContent || !scrollThumb) return;
    
    const scrollPercentage = contentArea.scrollTop / (scrollableContent.scrollHeight - contentArea.clientHeight);
    const trackHeight = scrollThumb.parentElement.clientHeight;
    const thumbPosition = scrollPercentage * (trackHeight - scrollThumb.clientHeight);
    scrollThumb.style.top = Math.max(0, thumbPosition) + 'px';
}

function scrollContactToPosition(e) {
    const scrollThumb = document.getElementById('contact-scroll-thumb');
    if (e.target === scrollThumb) return;
    
    const track = e.currentTarget;
    const rect = track.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const scrollPercentage = clickY / track.clientHeight;
    const contentArea = document.getElementById('contact-scrollable-content').parentElement;
    const scrollableContent = document.getElementById('contact-scrollable-content');
    const maxScroll = scrollableContent.scrollHeight - contentArea.clientHeight;
    contentArea.scrollTop = scrollPercentage * maxScroll;
    updateContactScrollThumb();
}

function dragContactScrollThumb(e) {
    if (!isContactScrollDragging) return;
    const scrollThumb = document.getElementById('contact-scroll-thumb');
    const track = scrollThumb.parentElement;
    const trackRect = track.getBoundingClientRect();
    const newY = e.clientY - trackRect.top - contactScrollOffset;
    const maxY = track.clientHeight - scrollThumb.clientHeight;
    const clampedY = Math.max(0, Math.min(maxY, newY));
    
    scrollThumb.style.top = clampedY + 'px';
    
    const scrollPercentage = clampedY / maxY;
    const contentArea = document.getElementById('contact-scrollable-content').parentElement;
    const scrollableContent = document.getElementById('contact-scrollable-content');
    const maxScroll = scrollableContent.scrollHeight - contentArea.clientHeight;
    contentArea.scrollTop = scrollPercentage * maxScroll;
}

function stopContactScrollDragging() {
    isContactScrollDragging = false;
    document.removeEventListener('mousemove', dragContactScrollThumb);
    document.removeEventListener('mouseup', stopContactScrollDragging);
}

function minimizeContactWindow() {
    const contactWindow = document.getElementById('contact-window');
    contactWindow.style.transform = 'scale(0.1)';
    contactWindow.style.opacity = '0.5';
    setTimeout(() => {
        contactWindow.style.transform = 'scale(1)';
        contactWindow.style.opacity = '1';
    }, 500);
}

function toggleContactFullscreen() {
    const contactWindow = document.getElementById('contact-window');
    contactWindow.classList.toggle('fullscreen');
    if (contactWindow.classList.contains('fullscreen')) {
        contactWindow.style.position = 'fixed';
        contactWindow.style.left = '0';
        contactWindow.style.top = '0';
    } else {
        contactWindow.style.position = 'relative';
        contactWindow.style.left = 'auto';
        contactWindow.style.top = 'auto';
    }
}

// Windows 98 About Modal Functionality
let isAboutDragging = false;
let isAboutScrollDragging = false;
let aboutDragOffset = { x: 0, y: 0 };
let aboutScrollOffset = 0;

function initializeAboutWindow() {
    const aboutModal = document.getElementById('about-modal');
    const aboutWindow = document.getElementById('about-window');
    const aboutTitleBar = document.getElementById('about-title-bar');
    const aboutScrollableContent = document.getElementById('about-scrollable-content');
    const aboutScrollThumb = document.getElementById('about-scroll-thumb');
    
    // Show the modal
    aboutModal.classList.remove('hidden');
    
    // Initialize scroll thumb position
    updateAboutScrollThumb();
    
    // Window dragging functionality
    aboutTitleBar.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('win98-control-button')) return;
        isAboutDragging = true;
        const rect = aboutWindow.getBoundingClientRect();
        aboutDragOffset.x = e.clientX - rect.left;
        aboutDragOffset.y = e.clientY - rect.top;
        document.addEventListener('mousemove', dragAboutWindow);
        document.addEventListener('mouseup', stopAboutDragging);
    });
    
    // Scroll thumb dragging
    aboutScrollThumb.addEventListener('mousedown', (e) => {
        isAboutScrollDragging = true;
        aboutScrollOffset = e.clientY - aboutScrollThumb.getBoundingClientRect().top;
        document.addEventListener('mousemove', dragAboutScrollThumb);
        document.addEventListener('mouseup', stopAboutScrollDragging);
        e.preventDefault();
    });
    
    // Add mousewheel scrolling support
    const contentArea = aboutScrollableContent.parentElement;
    
    aboutWindow.addEventListener('wheel', function(e) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 30 : -30;
        scrollAboutContent(delta);
    });
    
    contentArea.addEventListener('wheel', function(e) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 30 : -30;
        scrollAboutContent(delta);
    });
    
    aboutScrollableContent.addEventListener('wheel', function(e) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 30 : -30;
        scrollAboutContent(delta);
    });
    
    // Update scroll thumb when content is scrolled
    contentArea.addEventListener('scroll', updateAboutScrollThumb);
}

function dragAboutWindow(e) {
    if (!isAboutDragging || document.getElementById('about-window').classList.contains('fullscreen')) return;
    const aboutWindow = document.getElementById('about-window');
    aboutWindow.style.position = 'absolute';
    aboutWindow.style.left = (e.clientX - aboutDragOffset.x) + 'px';
    aboutWindow.style.top = (e.clientY - aboutDragOffset.y) + 'px';
}

function stopAboutDragging() {
    isAboutDragging = false;
    document.removeEventListener('mousemove', dragAboutWindow);
    document.removeEventListener('mouseup', stopAboutDragging);
}

function scrollAboutContent(delta) {
    const contentArea = document.getElementById('about-scrollable-content').parentElement;
    const scrollableContent = document.getElementById('about-scrollable-content');
    const maxScroll = scrollableContent.scrollHeight - contentArea.clientHeight;
    const currentScroll = contentArea.scrollTop;
    const newScroll = Math.max(0, Math.min(maxScroll, currentScroll + delta));
    contentArea.scrollTop = newScroll;
    updateAboutScrollThumb();
}

function updateAboutScrollThumb() {
    const contentArea = document.getElementById('about-scrollable-content').parentElement;
    const scrollableContent = document.getElementById('about-scrollable-content');
    const scrollThumb = document.getElementById('about-scroll-thumb');
    
    if (!contentArea || !scrollableContent || !scrollThumb) return;
    
    const scrollPercentage = contentArea.scrollTop / (scrollableContent.scrollHeight - contentArea.clientHeight);
    const trackHeight = scrollThumb.parentElement.clientHeight;
    const thumbPosition = scrollPercentage * (trackHeight - scrollThumb.clientHeight);
    scrollThumb.style.top = Math.max(0, thumbPosition) + 'px';
}

function scrollAboutToPosition(e) {
    const scrollThumb = document.getElementById('about-scroll-thumb');
    if (e.target === scrollThumb) return;
    
    const track = e.currentTarget;
    const rect = track.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const scrollPercentage = clickY / track.clientHeight;
    const contentArea = document.getElementById('about-scrollable-content').parentElement;
    const scrollableContent = document.getElementById('about-scrollable-content');
    const maxScroll = scrollableContent.scrollHeight - contentArea.clientHeight;
    contentArea.scrollTop = scrollPercentage * maxScroll;
    updateAboutScrollThumb();
}

function dragAboutScrollThumb(e) {
    if (!isAboutScrollDragging) return;
    const scrollThumb = document.getElementById('about-scroll-thumb');
    const track = scrollThumb.parentElement;
    const trackRect = track.getBoundingClientRect();
    const newY = e.clientY - trackRect.top - aboutScrollOffset;
    const maxY = track.clientHeight - scrollThumb.clientHeight;
    const clampedY = Math.max(0, Math.min(maxY, newY));
    
    scrollThumb.style.top = clampedY + 'px';
    
    const scrollPercentage = clampedY / maxY;
    const contentArea = document.getElementById('about-scrollable-content').parentElement;
    const scrollableContent = document.getElementById('about-scrollable-content');
    const maxScroll = scrollableContent.scrollHeight - contentArea.clientHeight;
    contentArea.scrollTop = scrollPercentage * maxScroll;
}

function stopAboutScrollDragging() {
    isAboutScrollDragging = false;
    document.removeEventListener('mousemove', dragAboutScrollThumb);
    document.removeEventListener('mouseup', stopAboutScrollDragging);
}

function minimizeAboutWindow() {
    const aboutWindow = document.getElementById('about-window');
    aboutWindow.style.transform = 'scale(0.1)';
    aboutWindow.style.opacity = '0.5';
    setTimeout(() => {
        aboutWindow.style.transform = 'scale(1)';
        aboutWindow.style.opacity = '1';
    }, 500);
}

function toggleAboutFullscreen() {
    const aboutWindow = document.getElementById('about-window');
    aboutWindow.classList.toggle('fullscreen');
    if (aboutWindow.classList.contains('fullscreen')) {
        aboutWindow.style.position = 'fixed';
        aboutWindow.style.left = '0';
        aboutWindow.style.top = '0';
    } else {
        aboutWindow.style.position = 'relative';
        aboutWindow.style.left = 'auto';
        aboutWindow.style.top = 'auto';
    }
}

// Close button functionality
document.addEventListener('DOMContentLoaded', function() {
    const closeProjectsModal = document.getElementById('close-projects-modal');
    const closeEmailModal = document.getElementById('close-email-modal');
    const closeAboutModal = document.getElementById('close-about-modal'); // New close button
    
    if (closeProjectsModal) {
        closeProjectsModal.addEventListener('click', function() {
            const projectsModal = document.getElementById('projects-modal');
            projectsModal.classList.add('hidden');
        });
    }
    
    if (closeEmailModal) {
        closeEmailModal.addEventListener('click', function() {
            const emailModal = document.getElementById('email-modal');
            emailModal.classList.add('hidden');
        });
    }
    
    if (closeAboutModal) {
        closeAboutModal.addEventListener('click', function() {
            const aboutModal = document.getElementById('about-modal');
            aboutModal.classList.add('hidden');
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
            
            const emailModal = document.getElementById('email-modal');
            emailModal.classList.add('hidden');
        });
    }
});