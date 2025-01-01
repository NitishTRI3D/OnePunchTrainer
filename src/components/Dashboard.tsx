import { useState } from 'react';
import { WorkoutEntry, calculatePunches } from '../types/workout';
import { WeightGraph } from './WeightGraph';

interface DashboardProps {
  workouts: WorkoutEntry[];
}

export function Dashboard({ workouts }: DashboardProps) {
  const [showGraph, setShowGraph] = useState(false);
  const { completePunches, remaining } = calculatePunches(workouts);

  const handleViewGraph = () => {
    setShowGraph(true);
  };

  // Format the remaining values for display
  const formatRemaining = (value: number) => {
    if (value <= 0) return "Nothing";
    return value.toFixed(value === Math.floor(value) ? 0 : 1);
  };

  // Calculate total counts for each activity
  const totalRuns = workouts.reduce((sum, workout) => sum + workout.distance, 0);
  const totalCrunches = workouts.reduce((sum, workout) => sum + workout.crunches, 0);
  const totalPushups = workouts.reduce((sum, workout) => sum + workout.pushups, 0);
  const totalSquats = workouts.reduce((sum, workout) => sum + workout.squats, 0);

  // Calculate punch fractions
  const runPunches = (totalRuns / 10).toFixed(1);
  const crunchPunches = (totalCrunches / 100).toFixed(1);
  const pushupPunches = (totalPushups / 100).toFixed(1);
  const squatPunches = (totalSquats / 100).toFixed(1);

  return (
    <div className="p-4 space-y-4 relative">
      <div className="text-center mb-8 relative">
        <div className="flex items-center justify-center gap-4">
          <h1 className="text-4xl font-bold text-blue-600">
            {completePunches} {completePunches === 1 ? 'Punch' : 'Punches'}
          </h1>
          <button 
            onClick={handleViewGraph}
            className="w-10 h-10 bg-green-500 rounded-full text-white flex items-center justify-center hover:bg-green-600 shadow-lg"
            aria-label="View weight graph"
          >
            📈
          </button>
        </div>
        <p className="text-gray-500">accumulated so far</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Running Card */}
        <div className="bg-white p-6 rounded-lg shadow space-y-2">
          <div className="text-gray-600 text-xl">Running</div>
          <div className="flex justify-between items-baseline">
            <div>
              <div className="text-3xl font-bold">
                {remaining.distance <= 0 ? "Nothing" : `${formatRemaining(remaining.distance)}km`}
              </div>
              <div className="text-sm text-gray-500">remaining for next punch</div>
            </div>
            <div className="text-lg text-gray-500">{runPunches}x</div>
          </div>
        </div>

        {/* Crunches Card */}
        <div className="bg-white p-6 rounded-lg shadow space-y-2">
          <div className="text-gray-600 text-xl">Crunches</div>
          <div className="flex justify-between items-baseline">
            <div>
              <div className="text-3xl font-bold">{formatRemaining(remaining.crunches)}</div>
              <div className="text-sm text-gray-500">remaining for next punch</div>
            </div>
            <div className="text-lg text-gray-500">{crunchPunches}x</div>
          </div>
        </div>

        {/* Pushups Card */}
        <div className="bg-white p-6 rounded-lg shadow space-y-2">
          <div className="text-gray-600 text-xl">Pushups</div>
          <div className="flex justify-between items-baseline">
            <div>
              <div className="text-3xl font-bold">{formatRemaining(remaining.pushups)}</div>
              <div className="text-sm text-gray-500">remaining for next punch</div>
            </div>
            <div className="text-lg text-gray-500">{pushupPunches}x</div>
          </div>
        </div>

        {/* Squats Card */}
        <div className="bg-white p-6 rounded-lg shadow space-y-2">
          <div className="text-gray-600 text-xl">Squats</div>
          <div className="flex justify-between items-baseline">
            <div>
              <div className="text-3xl font-bold">{formatRemaining(remaining.squats)}</div>
              <div className="text-sm text-gray-500">remaining for next punch</div>
            </div>
            <div className="text-lg text-gray-500">{squatPunches}x</div>
          </div>
        </div>
      </div>

      <WeightGraph 
        workouts={workouts}
        isOpen={showGraph}
        onClose={() => setShowGraph(false)}
      />
    </div>
  );
} 