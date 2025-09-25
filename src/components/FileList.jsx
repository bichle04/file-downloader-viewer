import FileItem from "./FileItem"

const FileList = ({ files, onDelete, onOpen, isLoading }) => {
  if (isLoading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <span className="ml-3 text-gray-600">Loading files...</span>
        </div>
      </div>
    )
  }

  if (files.length === 0) {
    return (
      <div className="card text-center py-8">
        <div className="text-gray-400 mb-2">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No files downloaded</h3>
        <p className="text-gray-500">Download your first file using the form above</p>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Downloaded Files</h2>
        <span className="text-sm text-gray-500">{files.length} files</span>
      </div>

      <div className="space-y-3">
        {files.map((file) => (
          <FileItem key={file.id} file={file} onDelete={onDelete} onOpen={onOpen} />
        ))}
      </div>
    </div>
  )
}

export default FileList
