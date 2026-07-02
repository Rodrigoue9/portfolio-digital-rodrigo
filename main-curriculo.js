/* ==========================================================================
   CURRICULO PROFISSIONAL - WEB BEHAVIORS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initPrint();
});

/* ==========================================================================
   THEME MANAGER (DARK / LIGHT SYNCHRONIZED)
   ========================================================================== */
function initTheme() {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    const icon = toggleBtn.querySelector('i');
    
    // Check saved theme or system preferences
    let savedTheme = localStorage.getItem('portfolio-theme') || 'light'; // Default light for recruiter
    
    if (savedTheme === 'dark') {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        icon.className = 'fa-solid fa-sun';
    } else {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        icon.className = 'fa-solid fa-moon';
    }
    
    toggleBtn.addEventListener('click', () => {
        if (document.body.classList.contains('light-theme')) {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            icon.className = 'fa-solid fa-sun';
            localStorage.setItem('portfolio-theme', 'dark');
        } else {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            icon.className = 'fa-solid fa-moon';
            localStorage.setItem('portfolio-theme', 'light');
        }
    });
}

/* ==========================================================================
   PRINT WINDOW HANDLER
   ========================================================================== */
function initPrint() {
    const printBtn = document.getElementById('print-btn');
    if (!printBtn) return;
    
    printBtn.addEventListener('click', () => {
        window.print();
    });
}
