document.addEventListener('DOMContentLoaded', function() {
    const addEventBtn = document.getElementById('addEventBtn');
    const eventModal = document.getElementById('eventModal');
    const closeBtn = document.querySelector('.close-btn');
    const eventForm = document.getElementById('eventForm');
    const countdownCards = document.getElementById('countdownCards');
    const timeline = document.getElementById('timeline');

    // Load saved events
    let events = JSON.parse(localStorage.getItem('timelineEvents')) || [];
    
    // Initialize
    renderTimeline();
    updateCountdowns();
    
    // Set up event listeners
    addEventBtn.addEventListener('click', () => {
        eventModal.style.display = 'block';
        document.getElementById('eventDate').valueAsDate = new Date();
    });
    
    closeBtn.addEventListener('click', () => {
        eventModal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === eventModal) {
            eventModal.style.display = 'none';
        }
    });
    
    eventForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newEvent = {
            id: Date.now(),
            name: document.getElementById('eventName').value,
            date: document.getElementById('eventDate').value,
            description: document.getElementById('eventDescription').value,
            priority: document.getElementById('eventPriority').value,
            completed: false
        };
        
        events.push(newEvent);
        saveEvents();
        renderTimeline();
        updateCountdowns();
        
        // Reset form and close modal
        eventForm.reset();
        eventModal.style.display = 'none';
    });
    
    function saveEvents() {
        localStorage.setItem('timelineEvents', JSON.stringify(events));
    }
    
    function renderTimeline() {
        // Sort events by date
        events.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        timeline.innerHTML = '';
        
        if (events.length === 0) {
            timeline.innerHTML = '<p class="empty-message">No events added yet. Click "Add New Event" to get started.</p>';
            return;
        }
        
        events.forEach(event => {
            const eventDate = new Date(event.date);
            const now = new Date();
            const isPast = eventDate < now;
            
            const eventElement = document.createElement('div');
            eventElement.className = `timeline-event ${event.priority} ${isPast ? 'past' : ''} ${event.completed ? 'completed' : ''}`;
            eventElement.dataset.id = event.id;
            
            eventElement.innerHTML = `
                <div class="timeline-date">
                    ${formatDate(event.date)}
                    ${getDaysRemaining(event.date)}
                </div>
                <div class="timeline-content">
                    <h3>${event.name}</h3>
                    ${event.description ? `<p>${event.description}</p>` : ''}
                    <div class="timeline-actions">
                        <button class="btn small ${event.completed ? 'secondary' : 'primary'} complete-btn">
                            ${event.completed ? '<i class="fas fa-undo"></i> Mark Incomplete' : '<i class="fas fa-check"></i> Mark Complete'}
                        </button>
                        <button class="btn small secondary delete-btn">
                            <i class="fas fa-trash-alt"></i> Delete
                        </button>
                    </div>
                </div>
            `;
            
            timeline.appendChild(eventElement);
        });
        
        // Add event listeners to buttons
        document.querySelectorAll('.complete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const eventId = parseInt(this.closest('.timeline-event').dataset.id);
                toggleEventCompletion(eventId);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const eventId = parseInt(this.closest('.timeline-event').dataset.id);
                deleteEvent(eventId);
            });
        });
    }
    
    function toggleEventCompletion(eventId) {
        const eventIndex = events.findIndex(e => e.id === eventId);
        if (eventIndex !== -1) {
            events[eventIndex].completed = !events[eventIndex].completed;
            saveEvents();
            renderTimeline();
            updateCountdowns();
        }
    }
    
    function deleteEvent(eventId) {
        if (confirm('Are you sure you want to delete this event?')) {
            events = events.filter(e => e.id !== eventId);
            saveEvents();
            renderTimeline();
            updateCountdowns();
        }
    }
    
    function updateCountdowns() {
        // Filter out completed and past events, then sort by nearest date
        const upcomingEvents = events
            .filter(e => !e.completed && new Date(e.date) >= new Date())
            .sort((a, b) => new Date(a.date) - new Date(b.date));
        
        countdownCards.innerHTML = '';
        
        if (upcomingEvents.length === 0) {
            countdownCards.innerHTML = '<p class="empty-message">No upcoming deadlines. Add events to track important dates.</p>';
            return;
        }
        
        // Show up to 3 nearest events
        upcomingEvents.slice(0, 3).forEach(event => {
            const daysRemaining = Math.ceil((new Date(event.date) - new Date()) / (1000 * 60 * 60 * 24));
            
            const card = document.createElement('div');
            card.className = `countdown-card ${event.priority}`;
            card.innerHTML = `
                <h3>${event.name}</h3>
                <div class="countdown-days">${daysRemaining}</div>
                <p>${daysRemaining === 1 ? 'day' : 'days'} remaining</p>
                <small>Due: ${formatDate(event.date)}</small>
            `;
            
            countdownCards.appendChild(card);
        });
    }
    
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
    
    function getDaysRemaining(dateString) {
        const days = Math.ceil((new Date(dateString) - new Date()) / (1000 * 60 * 60 * 24));
        
        if (days < 0) {
            return `<span class="days-remaining past">${Math.abs(days)} days ago</span>`;
        } else if (days === 0) {
            return '<span class="days-remaining today">Today</span>';
        } else {
            return `<span class="days-remaining">${days} ${days === 1 ? 'day' : 'days'} left</span>`;
        }
    }
});
