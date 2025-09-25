"use client"
import ProgressBar from "./ProgressBar"

const DownloadProgress = ({ downloads, onRemove }) => {
  if (downloads.length === 0) return null

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Download Progress</h3>
        <button
          onClick={() => downloads.forEach((d) => onRemove(d.id))}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-4">
        {downloads.map((download) => (
          <DownloadItem key={download.id} download={download} onRemove={onRemove} />
        ))}
      </div>
    </div>
  )
}

const DownloadItem = ({ download, onRemove }) => {
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString()
  }

  const getDownloadDuration = () => {
    if (!download.startTime) return null

    const endTime = download.endTime || new Date()
    const duration = Math.round((endTime - new Date(download.startTime)) / 1000)

    if (duration < 60) return `${duration}s`
    return `${Math.floor(duration / 60)}m ${duration % 60}s`
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 truncate">{download.filename}</h4>
          <p className="text-xs text-gray-500 truncate mt-1">{download.url}</p>
        </div>

        <button onClick={() => onRemove(download.id)} className="ml-2 p-1 text-gray-400 hover:text-gray-600 rounded">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <ProgressBar progress={download.progress} status={download.status} className="mb-3" />

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Started: {formatTime(download.startTime)}</span>
        {download.status === "completed" && download.endTime && <span>Duration: {getDownloadDuration()}</span>}
        {download.status === "error" && <span className="text-red-600">Error: {download.error}</span>}
      </div>

      {download.status === "completed" && download.fileInfo && (
        <div className="mt-2 flex items-center space-x-4 text-xs text-gray-600">
          <span>Size: {download.fileInfo.size ? `${Math.round(download.fileInfo.size / 1024)} KB` : "Unknown"}</span>
          <span>Type: {download.fileInfo.type}</span>
        </div>
      )}
    </div>
  )
}

export default DownloadProgress
