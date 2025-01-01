import { WorkoutEntry } from '../types/workout';

interface HistoryProps {
  workouts: WorkoutEntry[];
}

export const History: React.FC<HistoryProps> = ({ workouts }) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 space-y-4">
      {workouts.map((workout) => (
        <div 
          key={workout.date}
          className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-lg">{formatDate(workout.date)}</h3>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center">
              <span className="text-gray-600">🏃 Distance:</span>
              <span className="ml-2 font-medium">{workout.distance}km</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600">⚖️ Weight:</span>
              <span className="ml-2 font-medium">{workout.weight}kg</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600">🔄 Crunches:</span>
              <span className="ml-2 font-medium">{workout.crunches}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600">💪 Push-ups:</span>
              <span className="ml-2 font-medium">{workout.pushups}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600">🦵 Squats:</span>
              <span className="ml-2 font-medium">{workout.squats}</span>
            </div>
          </div>
        </div>
      ))}
      {workouts.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No workouts recorded yet
        </div>
      )}
    </div>
  );
}; 