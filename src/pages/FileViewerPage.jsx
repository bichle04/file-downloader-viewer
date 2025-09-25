"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { useFileManager } from "../hooks/useFileManager"
import Header from "../components/Header"
import LoadingSpinner from "../components/LoadingSpinner"
import StatusIndicator from "../components/StatusIndicator"
import fileService from "../services/fileService"

const FileViewerPage = ({ fileId }) => {
  const router = useRouter()
  const { files } = useFileManager()
  const [fileContent, setFileContent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const currentFileId = fileId || router.query.fileId

  const file = files.find((f) => f.id === currentFileId || f.filename === currentFileId)

  useEffect(() => {
    if (file) {
      loadFileContent()
    } else if (files.length > 0) {
      setError("File not found")
      setIsLoading(false)
    }
  }, [file, files])

  const loadFileContent = async () => {
    if (!file) return

    setIsLoading(true)
    setError(null)

    try {
      const content = await fileService.getFileContent(file.filename)
      setFileContent(content)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const openInBrowser = async () => {
    if (!file) return

    try {
      await fileService.openFile(file.filename)
    } catch (err) {
      setError(err.message)
    }
  }

  const renderFileContent = () => {
    if (!fileContent || !file) return null

    if (file.type === "image") {
      return (
        <div className="flex justify-center">
          <img
            src={`data:${fileService.getMimeType(file.filename)};base64,${fileContent}`}
            alt={file.filename}
            className="max-w-full max-h-screen object-contain rounded-lg shadow-lg"
          />
        </div>
      )
    }

    if (file.type === "document") {
      return (
        <div className="text-center py-12">
          <div className="mb-6">
            <svg className="mx-auto h-20 w-20 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Document Preview</h3>
          <p className="text-gray-600 mb-6">This document cannot be previewed directly in the browser.</p>
          <button onClick={openInBrowser} className="btn-primary">
            Open in External Viewer
          </button>
        </div>
      )
    }

    return (
      <div className="text-center py-12">
        <div className="mb-6">
          <svg className="mx-auto h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">File Preview</h3>
        <p className="text-gray-600 mb-6">This file type is not supported for preview.</p>
        <button onClick={openInBrowser} className="btn-primary">
          Open in External Viewer
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Navigation */}
        <div className="mb-6">
          <button onClick={() => router.back()} className="flex items-center text-blue-600 hover:text-blue-700">
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Files
          </button>
        </div>

        {/* File Info */}
        {file && (
          <div className="card mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{file.filename}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Type: {file.type}</span>
                  {file.size && <span>Size: {fileService.formatFileSize(file.size)}</span>}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button onClick={openInBrowser} className="btn-secondary" disabled={isLoading}>
                  Open in Browser
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="card">
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

export default FileViewerPage
