document.getElementById('set-alarm').addEventListener('click', function() {
    const alarmTime = document.getElementById('alarm-time').value;
    const snoozeTime = document.getElementById('snooze-time').value;
    const ringtone = document.getElementById('ringtone').value;
    const questionType = document.getElementById('question-type').value;
    const difficultyLevel = document.getElementById('difficulty-level').value;

    fetch('/set_alarm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            alarm_time: alarmTime,
            snooze_time: snoozeTime,
            ringtone: ringtone,
            question_type: questionType,
            difficulty_level: difficultyLevel
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

// Function to play the alarm sound
function playAlarmSound(ringtone) {
    const alarmSound = document.getElementById('alarm-sound');
    alarmSound.src = `static/${ringtone}`;
    alarmSound.play();
}

// Check alarm every minute (simple polling)
setInterval(function() {
    const currentTime = new Date();
    const formattedTime = `${currentTime.getHours()}:${currentTime.getMinutes()}`;
    
    // Replace with real logic to compare with alarm time
    if (formattedTime === '09:00') {  // Replace '09:00' with your alarm time
        fetch('/generate_puzzle?' + new URLSearchParams({
            question_type: 'math',
            difficulty_level: 1
        }))
        .then(response => response.json())
        .then(data => {
            document.getElementById('puzzle-question').textContent = data.question;
            document.getElementById('puzzle').style.display = 'block';
            playAlarmSound('ringtone1.mp3'); // Play the selected ringtone
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}, 60000); // Poll every minute

document.getElementById('submit-answer').addEventListener('click', function() {
    const userAnswer = document.getElementById('puzzle-answer').value;
    const correctAnswer = document.getElementById('puzzle-answer').dataset.correctAnswer;

    fetch('/check_answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            answer: userAnswer,
            correct_answer: correctAnswer
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        if (data.message === "Correct answer!") {
            document.getElementById('puzzle').style.display = 'none';
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});


