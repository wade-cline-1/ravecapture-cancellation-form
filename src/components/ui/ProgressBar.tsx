interface ProgressBarProps {
  percentage: number
}

export function ProgressBar({ percentage }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="rc-progress-bar">
        <div 
          className="rc-progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="mt-2 text-center">
        <span className="text-sm text-gray-600">
          {percentage}% Complete
        </span>
      </div>
    </div>
  )
}
