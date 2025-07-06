document.addEventListener('DOMContentLoaded', function() {
    const settingsDarkModeToggle = document.getElementById('settingsDarkModeToggle');
    const themeOptions = document.querySelectorAll('.theme-option');
    const resetDataBtn = document.getElementById('resetDataBtn');
    const exportDataBtn = document.getElementById('exportDataBtn');
    const importDataBtn = document.getElementById('importDataBtn');
    const importDataInput = document.getElementById('importDataInput');
    const feedbackBtn = document.getElementById('feedbackBtn');
    const confirmModal = document.getElementById('confirmModal');
    const confirmTitle = document.getElementById('confirmTitle');
    const confirmMessage = document.getElementById('confirmMessage');
    const confirmCancel = document.getElementById('confirmCancel');
    const confirmAction = document.getElementById('confirmAction');

    // Load current settings
    const currentTheme = localStorage.getItem('colorTheme') || 'blue';
    const darkModeEnabled = localStorage.getItem('theme') === 'dark';
    
    // Set initial states
    settingsDarkModeToggle.checked = darkModeEnabled;
    document.querySelector(`.theme-option.${currentTheme}`).classList.add('active');
    
    // Event listeners
    settingsDarkModeToggle.addEventListener('change', toggleDarkMode);
    themeOptions.forEach(option => {
        option.addEventListener('click', changeTheme);
    });
    
    resetDataBtn.addEventListener('click', () => {
        showConfirmation(
            'Reset All Data',
            'This will permanently delete all your saved data. Are you sure?',
            resetAllData
        );
    });
    
    exportDataBtn.addEventListener('click', exportData);
    importDataBtn.addEventListener('click', () => importDataInput.click());
    importDataInput.addEventListener('change', importData);
    feedbackBtn.addEventListener('click', sendFeedback);
    confirmCancel.addEventListener('click', hideConfirmation);
    
    function toggleDarkMode() {
        if (this.checked) {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    }
    
    function changeTheme() {
        const selectedTheme = this.dataset.theme;
        
        // Update active theme indicator
        themeOptions.forEach(option => option.classList.remove('active'));
        this.classList.add('active');
        
        // Update theme in localStorage
        localStorage.setItem('colorTheme', selectedTheme);
        
        // Update CSS variables
        if (selectedTheme === 'blue') {
            document.documentElement.style.setProperty('--primary-color', '#4361ee');
            document.documentElement.style.setProperty('--secondary-color', '#3f37c9');
        } else if (selectedTheme === 'green') {
            document.documentElement.style.setProperty('--primary-color', '#2ecc71');
            document.documentElement.style.setProperty('--secondary-color', '#27ae60');
        } else if (selectedTheme === 'purple') {
            document.documentElement.style.setProperty('--primary-color', '#9b59b6');
            document.documentElement.style.setProperty('--secondary-color', '#8e44ad');
        }
    }
    
    function showConfirmation(title, message, action) {
        confirmTitle.textContent = title;
        confirmMessage.textContent = message;
        confirmModal.style.display = 'block';
        
        // Set up action button
        confirmAction.onclick = function() {
            action();
            hideConfirmation();
        };
    }
    
    function hideConfirmation() {
        confirmModal.style.display = 'none';
    }
    
    function resetAllData() {
        // Clear all localStorage data
        localStorage.removeItem('checklistState');
        localStorage.removeItem('checklistNotes');
        localStorage.removeItem('timelineEvents');
        localStorage.removeItem('difficultQuestions');
        
        alert('All data has been reset successfully.');
    }
    
    function exportData() {
        // Gather all data
        const data = {
            checklistState: localStorage.getItem('checklistState'),
            checklistNotes: localStorage.getItem('checklistNotes'),
            timelineEvents: localStorage.getItem('timelineEvents'),
            difficultQuestions: localStorage.getItem('difficultQuestions'),
            settings: {
                theme: localStorage.getItem('theme'),
                colorTheme: localStorage.getItem('colorTheme')
            }
        };
        
        // Create and trigger download
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `japasafe-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    function importData() {
        const file = this.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                
                showConfirmation(
                    'Import Data',
                    'This will overwrite your current data. Are you sure?',
                    function() {
                        // Restore data
                        if (data.checklistState) localStorage.setItem('checklistState', data.checklistState);
                        if (data.checklistNotes) localStorage.setItem('checklistNotes', data.checklistNotes);
                        if (data.timelineEvents) localStorage.setItem('timelineEvents', data.timelineEvents);
                        if (data.difficultQuestions) localStorage.setItem('difficultQuestions', data.difficultQuestions);
                        
                        // Restore settings
                        if (data.settings) {
                            if (data.settings.theme) {
                                localStorage.setItem('theme', data.settings.theme);
                                document.body.setAttribute('data-theme', data.settings.theme);
                                settingsDarkModeToggle.checked = data.settings.theme === 'dark';
                            }
                            if (data.settings.colorTheme) {
                                localStorage.setItem('colorTheme', data.settings.colorTheme);
                                themeOptions.forEach(option => option.classList.remove('active'));
                                document.querySelector(`.theme-option.${data.settings.colorTheme}`).classList.add('active');
                            }
                        }
                        
                        alert('Data imported successfully!');
                    }
                );
            } catch (error) {
                alert('Error importing data: Invalid file format.');
            }
        };
        reader.readAsText(file);
        this.value = ''; // Reset input
    }
    
    function sendFeedback() {
        window.location.href = 'mailto:support@japasafe.com?subject=JapaSafe%20Feedback';
    }
});
