import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WorkoutEntry } from '../types/workout';

interface WeightGraphProps {
  workouts: WorkoutEntry[];
  isOpen: boolean;
  onClose: () => void;
}

export function WeightGraph({ workouts, isOpen, onClose }: WeightGraphProps) {
  if (!isOpen) return null;

  // Prepare data for the graph
  const weightData = workouts
    .filter(workout => workout.weight != null) // Filter out null/undefined weights
    .map(workout => ({
      date: new Date(workout.date).toLocaleDateString(),
      weight: workout.weight ? parseFloat(workout.weight.toString()) : 0
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Reverse sort order
    .reverse(); // Flip the array to show oldest to newest

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Weight Progress</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                reversed={false}
              />
              <YAxis 
                domain={['dataMin - 1', 'dataMax + 1']}
                tick={{ fontSize: 12 }}
                label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ fill: '#22c55e' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 