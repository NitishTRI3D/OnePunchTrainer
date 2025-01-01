const CACHE_NAME = 'one-punch-tracker-v1';

// Add notification scheduling
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-workout') {
    event.waitUntil(checkAndNotify());
  }
});

async function checkAndNotify() {
  const now = new Date();
  const hours = now.getHours();
  
  // Only check between 3 PM and 9 PM
  if (hours >= 15 && hours <= 21) {
    const workouts = await getWorkouts();
    const today = new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' })
      .replace(/\//g, '-');
    
    if (!hasWorkoutForDate(workouts, today)) {
      self.registration.showNotification('Workout Reminder', {
        body: "Don't forget to log your workout today!",
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        tag: 'workout-reminder',
        renotify: true
      });
    }
  }
}

// Helper functions
function getWorkouts() {
  return new Promise((resolve) => {
    const workouts = localStorage.getItem('workouts');
    resolve(workouts ? JSON.parse(workouts) : []);
  });
}

function hasWorkoutForDate(workouts, date) {
  return workouts.some(workout => workout.date === date);
} 