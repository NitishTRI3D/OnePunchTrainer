import { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { History } from './components/History';
import { WorkoutEntry } from './types/workout';
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'history'>('dashboard');
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>([]);
  const [showForm, setShowForm] = useState(false);

  const getIndianDate = () => {
    // Create date in IST
    const options: Intl.DateTimeFormatOptions = { timeZone: 'Asia/Kolkata' };
    const indianDate = new Date().toLocaleString('en-US', options);
    const date = new Date(indianDate);
    
    // Format to YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    date: getIndianDate(),
    distance: '4',
    crunches: '40',
    pushups: '40',
    squats: '40',
    weight: '70'
  });

  // Load workouts from localStorage on mount
  useEffect(() => {
    const savedWorkouts = localStorage.getItem('workouts');
    if (savedWorkouts) {
      setWorkouts(JSON.parse(savedWorkouts));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      // If date is changed, check for existing workout
      if (name === 'date') {
        const formattedDate = value.replace(/-/g, '/');
        const existingWorkout = workouts.find(w => w.date === formattedDate);
        if (existingWorkout) {
          return {
            date: value,
            distance: existingWorkout.distance.toString(),
            crunches: existingWorkout.crunches.toString(),
            pushups: existingWorkout.pushups.toString(),
            squats: existingWorkout.squats.toString(),
            weight: existingWorkout.weight?.toString() || '70'
          };
        }
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newWorkout: WorkoutEntry = {
      date: formData.date.replace(/-/g, '/'),
      distance: Number(formData.distance),
      crunches: Number(formData.crunches),
      pushups: Number(formData.pushups),
      squats: Number(formData.squats),
      weight: formData.weight
    };

    // Secret feature: Check for -1 values
    const negativeOneCount = Object.values(newWorkout)
      .filter(value => typeof value === 'number' && value === -1)
      .length;

    if (negativeOneCount === 1) {
      // Delete just this day's entry
      const updatedWorkouts = workouts.filter(w => w.date !== newWorkout.date);
      setWorkouts(updatedWorkouts);
      localStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
      setShowForm(false);
      resetForm();
      return;
    }

    if (negativeOneCount >= 2) {
      // Nuclear option: Clear all history
      setWorkouts([]);
      localStorage.removeItem('workouts');
      setShowForm(false);
      resetForm();
      return;
    }

    // Normal workflow continues if no -1 values...
    const updatedWorkouts = workouts.filter(w => w.date !== newWorkout.date);
    const finalWorkouts = [...updatedWorkouts, newWorkout];
    finalWorkouts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setWorkouts(finalWorkouts);
    localStorage.setItem('workouts', JSON.stringify(finalWorkouts));
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      date: getIndianDate(),
      distance: '4',
      crunches: '40',
      pushups: '40',
      squats: '40',
      weight: '70'
    });
    setShowForm(false);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const today = getIndianDate();

  const openForm = () => {
    // Find the latest workout to get the most recent weight
    const latestWorkout = workouts.length > 0 
      ? workouts.reduce((latest, current) => 
          new Date(current.date) > new Date(latest.date) ? current : latest
        )
      : null;

    setFormData({
      date: getIndianDate(),
      distance: '4',
      crunches: '40',
      pushups: '40',
      squats: '40',
      weight: latestWorkout?.weight?.toString() || '100'
    });
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-md min-h-screen bg-white flex flex-col">
        <nav className="flex p-4">
          <button 
            className={`flex-1 py-2 ${currentView === 'dashboard' ? 'bg-blue-500' : 'bg-gray-500'} text-white rounded-l-lg`}
            onClick={() => setCurrentView('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`flex-1 py-2 ${currentView === 'history' ? 'bg-blue-500' : 'bg-gray-500'} text-white rounded-r-lg`}
            onClick={() => setCurrentView('history')}
          >
            History
          </button>
        </nav>

        <div className="flex-1">
          {currentView === 'dashboard' ? (
            <Dashboard workouts={workouts} />
          ) : (
            <History workouts={workouts} />
          )}
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-80">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {workouts.some(w => w.date === formData.date.replace(/-/g, '/')) 
                    ? 'Edit Workout' 
                    : 'Add New Workout'}
                </h2>
                <span className="text-sm text-gray-500">
                  {formData.date === today 
                    ? 'Today' 
                    : formatDate(formData.date)}
                </span>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Distance (km)</label>
                    <input
                      type="number"
                      name="distance"
                      value={formData.distance}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      step="0.1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Crunches</label>
                    <input
                      type="number"
                      name="crunches"
                      value={formData.crunches}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pushups</label>
                    <input
                      type="number"
                      name="pushups"
                      value={formData.pushups}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Squats</label>
                    <input
                      type="number"
                      name="squats"
                      value={formData.squats}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      step="0.1"
                      required
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        <button 
          onClick={openForm}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 rounded-full text-white text-3xl flex items-center justify-center hover:bg-blue-600 shadow-lg"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default App;