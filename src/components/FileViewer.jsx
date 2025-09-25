"use client"

import { useState, useEffect } from "react"
import fileService from "../services/fileService"
import LoadingSpinner from "./LoadingSpinner"
import StatusIndicator from "./StatusIndicator"

const FileViewer = ({ filename, onClose }) => {
  const [fileContent, setFileContent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [fileInfo, setFileInfo] = useState(null)

  useEffect(() => {
    loadFileContent()
  }, [filename])

  const loadFileContent = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const content = await fileService.getFileContent(filename)
      const info = await fileService.getFileInfo(filename)

      setFileContent(content)
      setFileInfo({
        ...info,
        type: fileService.getFileType(filename),
        mimeType: fileService.getMimeType(filename),
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const openInBrowser = async () => {
    try {
      await fileService.openFile(filename)
    } catch (err) {
      setError(err.message)
    }
  }

  const renderFileContent = () => {
    if (!fileContent || !fileInfo) return null

    const { type, mimeType } = fileInfo

    if (type === "image") {
      return (
        <div className="flex justify-center">
          <img
            src={`data:${mimeType};base64,${fileContent}`}
            alt={filename}
            className="max-w-full max-h-96 object-contain rounded-lg shadow-sm"
          />
        </div>
      )
    }

    if (type === "document" && mimeType === "application/pdf") {
      return (
        <div className="text-center">
          <div className="mb-4">
            <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">PDF files cannot be previewed directly in the app.</p>
          <button onClick={openInBrowser} className="btn-primary">
            Open in Browser
          </button>
        </div>
      )
    }

    return (
      <div className="text-center">
        <div className="mb-4">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p className="text-gray-600 mb-4">This file type cannot be previewed in the app.</p>
        <button onClick={openInBrowser} className="btn-primary">
          Open in Browser
        </button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl max-h-full w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 truncate">{filename}</h2>
            {fileInfo && (
              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                <span>Type: {fileInfo.type}</span>
                {fileInfo.size && <span>Size: {fileService.formatFileSize(fileInfo.size)}</span>}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 ml-4">
            <button onClick={openInBrowser} className="btn-secondary text-sm" disabled={isLoading}>
              Open in Browser
            </button>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-auto">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
              <span className="ml-3 text-gray-600">Loading file...</span>
            </div>
          )}

          {error && <StatusIndicator status="error" message={error} className="mb-4" />}

          {!isLoading && !error && renderFileContent()}
        </div>
      </div>
    </div>
  )
}

export default FileViewer
