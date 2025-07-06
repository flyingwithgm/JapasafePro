document.addEventListener('DOMContentLoaded', function() {
    const checklistData = [
        {
            category: 'identificationDocs',
            items: [
                { id: 'passport', name: 'Valid Passport (with at least 6 months validity)', required: true },
                { id: 'photos', name: 'Passport-sized photographs (as per specifications)', required: true },
                { id: 'birth_cert', name: 'Birth Certificate', required: false },
                { id: 'national_id', name: 'National ID Card', required: false }
            ]
        },
        {
            category: 'academicDocs',
            items: [
                { id: 'acceptance_letter', name: 'University Acceptance Letter', required: true },
                { id: 'transcripts', name: 'Academic Transcripts and Certificates', required: true },
                { id: 'test_scores', name: 'Language Test Scores (TOEFL/IELTS/etc.)', required: true },
                { id: 'recommendations', name: 'Letters of Recommendation', required: false },
                { id: 'sop', name: 'Statement of Purpose', required: false }
            ]
        },
        {
            category: 'financialDocs',
            items: [
                { id: 'bank_stmt', name: 'Bank Statements (last 6 months)', required: true },
                { id: 'affidavit', name: 'Affidavit of Support (if sponsored)', required: false },
                { id: 'scholarship', name: 'Scholarship Award Letter', required: false },
                { id: 'tax_returns', name: 'Tax Returns (if applicable)', required: false }
            ]
        },
        {
            category: 'applicationForms',
            items: [
                { id: 'visa_form', name: 'Completed Visa Application Form', required: true },
                { id: 'sevis', name: 'SEVIS Fee Receipt', required: true },
                { id: 'visa_fee', name: 'Visa Application Fee Receipt', required: true },
                { id: 'health_ins', name: 'Health Insurance Documentation', required: false }
            ]
        },
        {
            category: 'additionalReqs',
            items: [
                { id: 'medical', name: 'Medical Examination Results', required: false },
                { id: 'police_clearance', name: 'Police Clearance Certificate', required: false },
                { id: 'cv', name: 'Curriculum Vitae/Resume', required: false },
                { id: 'research_proposal', name: 'Research Proposal (for research students)', required: false }
            ]
        }
    ];

    const progressBarFill = document.getElementById('progressBarFill');
    const progressText = document.getElementById('progressText');
    const checklistNotes = document.getElementById('checklistNotes');

    // Load saved checklist state
    let savedChecklist = JSON.parse(localStorage.getItem('checklistState')) || {};
    let savedNotes = localStorage.getItem('checklistNotes') || '';

    // Initialize checklist
    checklistData.forEach(category => {
        const container = document.getElementById(category.category);
        container.innerHTML = '';

        category.items.forEach(item => {
            const li = document.createElement('li');
            const checkboxId = `check_${item.id}`;
            
            li.innerHTML = `
                <input type="checkbox" id="${checkboxId}" ${savedChecklist[item.id] ? 'checked' : ''}>
                <label for="${checkboxId}" class="${item.required ? 'required' : ''}">
                    ${item.name} ${item.required ? '<span class="required-badge">Required</span>' : ''}
                </label>
            `;
            
            const checkbox = li.querySelector('input');
            checkbox.addEventListener('change', updateProgress);
            
            container.appendChild(li);
        });
    });

    // Load notes
    checklistNotes.value = savedNotes;
    checklistNotes.addEventListener('input', function() {
        localStorage.setItem('checklistNotes', this.value);
    });

    // Calculate initial progress
    updateProgress();

    function updateProgress() {
        // Save current state
        const checkboxes = document.querySelectorAll('.checklist-items input[type="checkbox"]');
        const checklistState = {};
        
        checkboxes.forEach(checkbox => {
            const id = checkbox.id.replace('check_', '');
            checklistState[id] = checkbox.checked;
        });
        
        localStorage.setItem('checklistState', JSON.stringify(checklistState));
        
        // Calculate progress
        const requiredItems = document.querySelectorAll('.required input[type="checkbox"]');
        const checkedRequired = document.querySelectorAll('.required input[type="checkbox"]:checked');
        
        const totalRequired = requiredItems.length;
        const completedRequired = checkedRequired.length;
        
        const progress = totalRequired > 0 ? Math.round((completedRequired / totalRequired) * 100) : 0;
        
        // Update progress display
        progressBarFill.style.width = `${progress}%`;
        progressText.textContent = `${progress}% Complete`;
        
        // Change color based on progress
        if (progress < 30) {
            progressBarFill.style.backgroundColor = '#ff4d4d';
        } else if (progress < 70) {
            progressBarFill.style.backgroundColor = '#ffcc00';
        } else {
            progressBarFill.style.backgroundColor = '#4CAF50';
        }
    }
});
