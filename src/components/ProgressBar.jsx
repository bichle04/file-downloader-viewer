const ProgressBar = ({ progress, status, className = "" }) => {
  const getStatusColor = () => {
    switch (status) {
      case "downloading":
        return "bg-primary-500"
      case "completed":
        return "bg-green-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-gray-300"
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "downloading":
        return `Downloading... ${progress}%`
      case "completed":
        return "Download completed"
      case "error":
        return "Download failed"
      default:
        return "Preparing..."
    }
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">{getStatusText()}</span>
        {status === "downloading" && <span className="text-sm text-gray-500">{progress}%</span>}
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getStatusColor()}`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
