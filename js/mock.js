document.addEventListener('DOMContentLoaded', function() {
    const questionElement = document.getElementById('currentQuestion');
    const answerText = document.getElementById('answerText');
    const answerSection = document.getElementById('answerSection');
    const nextQuestionBtn = document.getElementById('nextQuestionBtn');
    const showAnswerBtn = document.getElementById('showAnswerBtn');
    const difficultBtn = document.getElementById('difficultBtn');
    const practiceModeBtn = document.getElementById('practiceModeBtn');
    const practiceStats = document.getElementById('practiceStats');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const timerElement = document.getElementById('timer');
    const difficultQuestionsSection = document.getElementById('difficultQuestionsSection');
    const difficultQuestionsList = document.getElementById('difficultQuestionsList');
    const clearDifficultBtn = document.getElementById('clearDifficultBtn');

    let currentQuestion = null;
    let practiceMode = false;
    let questionCount = 0;
    let timerInterval;
    let timeLeft = 90; // 1.5 minutes per question

    // Load difficult questions from localStorage
    let difficultQuestions = JSON.parse(localStorage.getItem('difficultQuestions')) || [];
    if (difficultQuestions.length > 0) {
        difficultQuestionsSection.classList.remove('hidden');
        updateDifficultQuestionsList();
    }

    // Event Listeners
    nextQuestionBtn.addEventListener('click', getRandomQuestion);
    showAnswerBtn.addEventListener('click', toggleAnswer);
    difficultBtn.addEventListener('click', toggleDifficultQuestion);
    practiceModeBtn.addEventListener('click', togglePracticeMode);
    clearDifficultBtn.addEventListener('click', clearDifficultQuestions);

    function getRandomQuestion() {
        // Filter out difficult questions if we're not in practice mode
        const availableQuestions = practiceMode ? visaQuestions : 
            visaQuestions.filter(q => !difficultQuestions.includes(q.question));
        
        if (availableQuestions.length === 0) {
            questionElement.textContent = "No more questions available!";
            answerText.textContent = "";
            answerSection.classList.add('hidden');
            showAnswerBtn.disabled = true;
            difficultBtn.disabled = true;
            return;
        }

        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
        currentQuestion = availableQuestions[randomIndex];
        
        questionElement.textContent = currentQuestion.question;
        answerText.textContent = currentQuestion.answer;
        answerSection.classList.add('hidden');
        showAnswerBtn.disabled = false;
        difficultBtn.disabled = false;
        
        // Update difficult button state
        difficultBtn.innerHTML = difficultQuestions.includes(currentQuestion.question) ? 
            '<i class="fas fa-check"></i> Marked Difficult' : 
            '<i class="fas fa-exclamation-triangle"></i> Mark Difficult';
        
        if (practiceMode) {
            questionCount++;
            updateProgress();
            resetTimer();
        }
    }

    function toggleAnswer() {
        answerSection.classList.toggle('hidden');
        showAnswerBtn.innerHTML = answerSection.classList.contains('hidden') ? 
            '<i class="fas fa-lightbulb"></i> Show Answer' : 
            '<i class="fas fa-eye-slash"></i> Hide Answer';
    }

    function toggleDifficultQuestion() {
        const index = difficultQuestions.indexOf(currentQuestion.question);
        if (index === -1) {
            difficultQuestions.push(currentQuestion.question);
            difficultBtn.innerHTML = '<i class="fas fa-check"></i> Marked Difficult';
        } else {
            difficultQuestions.splice(index, 1);
            difficultBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Mark Difficult';
        }
        
        localStorage.setItem('difficultQuestions', JSON.stringify(difficultQuestions));
        
        if (difficultQuestions.length > 0) {
            difficultQuestionsSection.classList.remove('hidden');
            updateDifficultQuestionsList();
        } else {
            difficultQuestionsSection.classList.add('hidden');
        }
    }

    function updateDifficultQuestionsList() {
        difficultQuestionsList.innerHTML = '';
        difficultQuestions.forEach(question => {
            const li = document.createElement('li');
            li.textContent = question;
            difficultQuestionsList.appendChild(li);
        });
    }

    function clearDifficultQuestions() {
        difficultQuestions = [];
        localStorage.removeItem('difficultQuestions');
        difficultQuestionsSection.classList.add('hidden');
        if (currentQuestion && difficultBtn.innerHTML.includes('Marked')) {
            difficultBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Mark Difficult';
        }
    }

    function togglePracticeMode() {
        practiceMode = !practiceMode;
        
        if (practiceMode) {
            practiceModeBtn.innerHTML = '<i class="fas fa-times"></i> End Practice';
            practiceModeBtn.classList.remove('secondary');
            practiceModeBtn.classList.add('primary');
            practiceStats.classList.remove('hidden');
            questionCount = 0;
            getRandomQuestion();
        } else {
            practiceModeBtn.innerHTML = '<i class="fas fa-stopwatch"></i> Start Practice Session';
            practiceModeBtn.classList.remove('primary');
            practiceModeBtn.classList.add('secondary');
            practiceStats.classList.add('hidden');
            clearInterval(timerInterval);
            timerElement.textContent = "01:30";
            timeLeft = 90;
        }
    }

    function updateProgress() {
        const progress = (questionCount / 5) * 100;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${questionCount}/5`;
        
        if (questionCount >= 5) {
            endPracticeSession();
        }
    }

    function resetTimer() {
        clearInterval(timerInterval);
        timeLeft = 90;
        updateTimerDisplay();
        timerInterval = setInterval(updateTimer, 1000);
    }

    function updateTimer() {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            getRandomQuestion();
        }
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function endPracticeSession() {
        clearInterval(timerInterval);
        practiceMode = false;
        practiceModeBtn.innerHTML = '<i class="fas fa-stopwatch"></i> Start Practice Session';
        practiceModeBtn.classList.remove('primary');
        practiceModeBtn.classList.add('secondary');
        alert('Practice session completed! Good job!');
    }
});
