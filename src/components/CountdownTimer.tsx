
import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  initialHours: number;
  initialMinutes: number;
  initialSeconds: number;
}

const CountdownTimer = ({
  initialHours = 23,
  initialMinutes = 59,
  initialSeconds = 59
}: CountdownTimerProps) => {
  const [hours, setHours] = useState(initialHours);
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59);
      } else if (hours > 0) {
        setHours(hours - 1);
        setMinutes(59);
        setSeconds(59);
      }
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [hours, minutes, seconds]);

  // Check if we should show the timer in a warning state
  const isWarning = hours === 0 && minutes < 30;

  return (
    <div className="flex items-center gap-3 glass-card px-4 py-2 rounded-full inline-flex">
      <Clock className={`h-5 w-5 ${isWarning ? 'text-red-500' : 'text-primary'}`} />
      <div className={`font-mono text-lg font-medium ${isWarning ? 'text-red-500' : 'text-foreground'}`}>
        {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      <span className={`text-sm ${isWarning ? 'text-red-500' : 'text-muted-foreground'}`}>
        {isWarning ? 'Hurry up!' : 'Left at this price'}
      </span>
    </div>
  );
};

export default CountdownTimer;
