document.addEventListener('DOMContentLoaded', function() {
    const tipsData = {
        dos: [
            {
                title: "Be Prepared with Documents",
                content: "Organize all required documents in a neat folder. Have both original and copies ready. Practice retrieving documents quickly so you're not fumbling during the interview."
            },
            {
                title: "Dress Professionally",
                content: "First impressions matter. Wear business casual or formal attire to show you're serious about your studies. This demonstrates respect for the process."
            },
            {
                title: "Be Concise and Clear",
                content: "Answer questions directly and honestly. Keep responses to 2-3 sentences unless asked for more detail. Avoid rambling or providing unnecessary information."
            },
            {
                title: "Show Strong Ties to Home Country",
                content: "Be ready to discuss family, property, job prospects, or other commitments that prove you'll return after studies. Have documentation if possible."
            },
            {
                title: "Practice Common Questions",
                content: "Rehearse answers to typical questions about your university choice, program, finances, and post-study plans. But don't memorize answers word-for-word."
            }
        ],
        donts: [
            {
                title: "Don't Memorize Answers",
                content: "While you should practice, avoid sounding rehearsed. Officers can tell when answers aren't genuine. Speak naturally and conversationally."
            },
            {
                title: "Don't Volunteer Extra Information",
                content: "Only answer what's asked. Providing unsolicited details might raise unnecessary questions or concerns about your application."
            },
            {
                title: "Don't Argue or Get Defensive",
                content: "If questioned about something, stay calm and provide clear explanations. Never argue with the consular officer, even if you disagree."
            },
            {
                title: "Don't Show Uncertainty",
                content: "Avoid phrases like 'I think' or 'maybe'. Be confident about your plans, university choice, and reasons for studying abroad."
            },
            {
                title: "Don't Lie or Exaggerate",
                content: "Any inconsistencies can lead to denial. If you don't know an answer, it's better to say so than to make something up."
            }
        ]
    };

    const dosAccordion = document.getElementById('dosAccordion');
    const dontsAccordion = document.getElementById('dontsAccordion');
    const prevStoryBtn = document.getElementById('prevStory');
    const nextStoryBtn = document.getElementById('nextStory');
    const sliderDots = document.querySelector('.slider-dots');
    const stories = document.querySelectorAll('.story');

    // Initialize tips accordions
    function initAccordion(container, items) {
        container.innerHTML = '';
        
        items.forEach((item, index) => {
            const tipItem = document.createElement('div');
            tipItem.className = 'accordion-item';
            
            tipItem.innerHTML = `
                <button class="accordion-header">
                    <span>${item.title}</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
                <div class="accordion-content">
                    <p>${item.content}</p>
                </div>
            `;
            
            container.appendChild(tipItem);
        });
        
        // Add event listeners to accordion headers
        container.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', function() {
                this.classList.toggle('active');
                const content = this.nextElementSibling;
                
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                    this.querySelector('i').className = 'fas fa-chevron-down';
                } else {
                    content.style.maxHeight = content.scrollHeight + 'px';
                    this.querySelector('i').className = 'fas fa-chevron-up';
                }
            });
        });
    }

    // Initialize story slider
    function initStorySlider() {
        // Create dots
        stories.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.className = `dot ${index === 0 ? 'active' : ''}`;
            dot.dataset.index = index;
            sliderDots.appendChild(dot);
        });
        
        // Set up event listeners
        prevStoryBtn.addEventListener('click', showPrevStory);
        nextStoryBtn.addEventListener('click', showNextStory);
        
        document.querySelectorAll('.dot').forEach(dot => {
            dot.addEventListener('click', function() {
                showStory(parseInt(this.dataset.index));
            });
        });
        
        // Auto-advance stories
        setInterval(showNextStory, 5000);
    }

    let currentStory = 0;
    
    function showStory(index) {
        // Wrap around if at ends
        if (index >= stories.length) index = 0;
        if (index < 0) index = stories.length - 1;
        
        // Update active story
        stories[currentStory].classList.remove('active');
        stories[index].classList.add('active');
        
        // Update active dot
        document.querySelectorAll('.dot')[currentStory].classList.remove('active');
        document.querySelectorAll('.dot')[index].classList.add('active');
        
        currentStory = index;
    }
    
    function showNextStory() {
        showStory(currentStory + 1);
    }
    
    function showPrevStory() {
        showStory(currentStory - 1);
    }

    // Initialize components
    initAccordion(dosAccordion, tipsData.dos);
    initAccordion(dontsAccordion, tipsData.donts);
    initStorySlider();
});
