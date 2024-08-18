from flask import Flask, request, jsonify, render_template
import random
import datetime

app = Flask(__name__)

# Dummy data for alarm and puzzle settings
alarms = {}
questions = {
    "math": [
        {"question": "What is 5 + 7?", "answer": "12"},
        {"question": "What is 9 * 6?", "answer": "54"}
    ],
    "general": [
        {"question": "What is the capital of France?", "answer": "Paris"},
        {"question": "Who wrote 'To Kill a Mockingbird'?", "answer": "Harper Lee"}
    ],
    "random": [
        {"question": "What is the color of the sky?", "answer": "blue"},
        {"question": "How many days are in a year?", "answer": "365"}
    ]
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/set_alarm', methods=['POST'])
def set_alarm():
    data = request.json
    alarm_time = data.get('alarm_time')
    snooze_time = data.get('snooze_time')
    ringtone = data.get('ringtone')
    question_type = data.get('question_type')
    difficulty_level = data.get('difficulty_level')

    alarms[alarm_time] = {
        'snooze_time': snooze_time,
        'ringtone': ringtone,
        'question_type': question_type,
        'difficulty_level': difficulty_level
    }
    return jsonify({"message": "Alarm set successfully!"})

@app.route('/generate_puzzle')
def generate_puzzle():
    question_type = request.args.get('question_type')
    questions_list = questions.get(question_type, [])
    question = random.choice(questions_list)
    return jsonify({"question": question["question"], "answer": question["answer"]})

@app.route('/check_answer', methods=['POST'])
def check_answer():
    data = request.json
    user_answer = data.get('answer')
    correct_answer = data.get('correct_answer')
    if user_answer.lower() == correct_answer.lower():
        return jsonify({"message": "Correct answer!"})
    else:
        return jsonify({"message": "Incorrect answer, try again."})

if __name__ == '__main__':
    app.run(debug=True)
