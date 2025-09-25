const StatusIndicator = ({ status, message, className = "" }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "success":
        return "bg-green-50 text-green-800 border-green-200"
      case "error":
        return "bg-red-50 text-red-800 border-red-200"
      case "warning":
        return "bg-yellow-50 text-yellow-800 border-yellow-200"
      case "info":
        return "bg-blue-50 text-blue-800 border-blue-200"
      default:
        return "bg-gray-50 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case "success":
        return (
          <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )
      case "error":
        return (
          <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )
      case "warning":
        return (
          <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        )
      case "info":
        return (
          <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )
      default:
        return null
    }
  }

  if (!message) return null

  return (
    <div className={`flex items-center p-3 border rounded-lg ${getStatusStyles()} ${className}`}>
      {getStatusIcon() && <div className="flex-shrink-0 mr-3">{getStatusIcon()}</div>}
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  )
}

export default StatusIndicator
