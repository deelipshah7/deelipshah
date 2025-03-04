const workoutData = {
    1: {
        title: "Push (Chest, Shoulders, Triceps) + Quads/Calves",
        exercises: [
            { name: "Flat Barbell Bench Press", sets: 4, reps: "8-10" },
            { name: "Overhead Barbell Press", sets: 4, reps: "8-10" },
            { name: "Incline Dumbbell Press", sets: 3, reps: "10-12" },
            { name: "Lateral Raises", sets: 3, reps: "12-15" },
            { name: "Leg Press", sets: 3, reps: "10-12" },
            { name: "Triceps Dips", sets: 3, reps: "10-12" },
            { name: "Seated Calf Raises", sets: 3, reps: "15-20" }
        ]
    },
    // Add other days following the same structure
};

let currentState = {
    currentDay: 1,
    activeDay: null,
    currentExerciseIndex: 0,
    completedSets: {},
    timer: null
};

// Initialize from localStorage
function loadProgress() {
    const saved = localStorage.getItem('workoutProgress');
    if (saved) {
        currentState = JSON.parse(saved);
        updateDayStates();
    }
}

function saveProgress() {
    localStorage.setItem('workoutProgress', JSON.stringify(currentState));
}

function updateDayStates() {
    document.querySelectorAll('.day').forEach(day => {
        const dayNumber = parseInt(day.dataset.day);
        day.classList.toggle('active', dayNumber === currentState.currentDay);
        day.style.opacity = dayNumber <= currentState.currentDay ? 1 : 0.5;
        day.style.cursor = dayNumber === currentState.currentDay ? 'pointer' : 'default';
    });
}

function startTimer(duration, display, callback) {
    let timer = duration, minutes, seconds;
    currentState.timer = setInterval(() => {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(currentState.timer);
            if (callback) callback();
        }
    }, 1000);
}

function renderWorkout(dayNumber) {
    const workout = workoutData[dayNumber];
    const container = document.getElementById('workoutContainer');
    container.innerHTML = '';
    
    workout.exercises.forEach((exercise, index) => {
        const exerciseEl = document.createElement('div');
        exerciseEl.className = `exercise ${index === 0 ? 'active' : ''}`;
        exerciseEl.innerHTML = `
            <h3>${exercise.name}</h3>
            <p>${exercise.sets} sets of ${exercise.reps}</p>
            <div class="sets-container"></div>
        `;
        
        const setsContainer = exerciseEl.querySelector('.sets-container');
        for (let i = 0; i < exercise.sets; i++) {
            const setBtn = document.createElement('button');
            setBtn.className = 'set-btn';
            setBtn.textContent = `Set ${i + 1}`;
            setBtn.addEventListener('click', () => completeSet(dayNumber, index, i));
            setsContainer.appendChild(setBtn);
        }
        
        container.appendChild(exerciseEl);
    });
}

function completeSet(dayNumber, exerciseIndex, setIndex) {
    const setBtn = document.querySelectorAll('.exercise')[exerciseIndex]
        .querySelectorAll('.set-btn')[setIndex];
    
    setBtn.classList.add('completed');
    setBtn.disabled = true;

    // Check if all sets in current exercise are completed
    const allSetsCompleted = [...document.querySelectorAll('.exercise')[exerciseIndex]
        .querySelectorAll('.set-btn')].every(btn => btn.classList.contains('completed'));

    if (allSetsCompleted) {
        activateNextExercise(exerciseIndex);
    }
}

function activateNextExercise(currentIndex) {
    const exercises = document.querySelectorAll('.exercise');
    if (currentIndex < exercises.length - 1) {
        exercises[currentIndex].classList.remove('active');
        exercises[currentIndex + 1].classList.add('active');
    } else {
        document.getElementById('finishButton').classList.remove('hidden');
    }
}

// Event Listeners
document.getElementById('startButton').addEventListener('click', () => {
    document.getElementById('warmupModal').style.display = 'flex';
});

document.getElementById('startWarmup').addEventListener('click', () => {
    startTimer(420, document.getElementById('warmupTimer'), () => {
        document.getElementById('warmupModal').style.display = 'none';
        renderWorkout(currentState.currentDay);
    });
});

document.querySelectorAll('.day').forEach(day => {
    day.addEventListener('click', () => {
        const dayNumber = parseInt(day.dataset.day);
        if (dayNumber === currentState.currentDay) {
            currentState.activeDay = dayNumber;
            renderWorkout(dayNumber);
        }
    });
});

document.getElementById('finishButton').addEventListener('click', () => {
    currentState.currentDay++;
    saveProgress();
    updateDayStates();
    document.getElementById('finishButton').classList.add('hidden');
    document.getElementById('workoutContainer').innerHTML = '';
});

// Initialize
loadProgress();
updateDayStates();
