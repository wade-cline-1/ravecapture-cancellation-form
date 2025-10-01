interface ProgressBarProps {
  percentage?: number
  percent?: number
  showPercent?: boolean
}

export function ProgressBar({ percentage, percent, showPercent }: ProgressBarProps) {
  const displayPercentage = percentage ?? percent ?? 0
  return (
    <div className="w-full">
      <div className="rc-progress-bar">
        <div 
          className="rc-progress-fill"
          style={{ width: `${displayPercentage}%` }}
        />
      </div>
      {showPercent && (
        <div className="mt-2 text-center">
          <span className="text-sm text-gray-600">
            {displayPercentage}% Complete
          </span>
        </div>
      )}
    </div>
  )
}
