"use client"

import { useState, useEffect } from "react"
import Header from "../src/components/Header"
import DownloadForm from "../src/components/DownloadForm"
import FileList from "../src/components/FileList"
import DownloadProgress from "../src/components/DownloadProgress"
import FileViewer from "../src/components/FileViewer"
import StatusIndicator from "../src/components/StatusIndicator"
import { useDownloader } from "../src/hooks/useDownloader"
import { useFileManager } from "../src/hooks/useFileManager"

export default function HomePage() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [notification, setNotification] = useState(null)

  const {
    downloads,
    isLoading: isDownloading,
    error: downloadError,
    downloadFile,
    clearDownloads,
    removeDownload,
  } = useDownloader()

  const { files, isLoading: isLoadingFiles, error: fileError, deleteFile, openFile, refreshFiles } = useFileManager()

  const handleDownload = async (url, customFilename) => {
    try {
      await downloadFile(url, customFilename)
      setNotification({
        status: "success",
        message: "File downloaded successfully!",
      })
      // Refresh file list after download
      setTimeout(() => {
        refreshFiles()
      }, 1000)
    } catch (error) {
      setNotification({
        status: "error",
        message: `Download failed: ${error.message}`,
      })
    }
  }

  const handleDeleteFile = async (filename) => {
    try {
      await deleteFile(filename)
      setNotification({
        status: "success",
        message: "File deleted successfully!",
      })
    } catch (error) {
      setNotification({
        status: "error",
        message: `Delete failed: ${error.message}`,
      })
    }
  }

  const handleOpenFile = async (filename) => {
    try {
      await openFile(filename)
    } catch (error) {
      // For preview, open in modal instead
      setSelectedFile(filename)
    }
  }

  const clearNotification = () => {
    setNotification(null)
  }

  // Auto-clear notifications after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(clearNotification, 5000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Notification */}
        {notification && (
          <StatusIndicator status={notification.status} message={notification.message} className="mb-4" />
        )}

        {/* Download Form */}
        <DownloadForm onDownload={handleDownload} isLoading={isDownloading} />

        {/* Demo URLs Section */}
        <DemoUrls onDownload={handleDownload} isLoading={isDownloading} />

        {/* Download Progress */}
        {downloads.length > 0 && <DownloadProgress downloads={downloads} onRemove={removeDownload} />}

        {/* Error Messages */}
        {downloadError && <StatusIndicator status="error" message={downloadError} />}

        {fileError && <StatusIndicator status="error" message={fileError} />}

        {/* File List */}
        <FileList files={files} onDelete={handleDeleteFile} onOpen={handleOpenFile} isLoading={isLoadingFiles} />

        {/* File Viewer Modal */}
        {selectedFile && <FileViewer filename={selectedFile} onClose={() => setSelectedFile(null)} />}
      </div>
    </div>
  )
}

// Demo URLs component for testing
const DemoUrls = ({ onDownload, isLoading }) => {
  const demoFiles = [
    {
      name: "Sample PDF Document",
      url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      type: "PDF",
    },
    {
      name: "Sample Image (JPG)",
      url: "https://picsum.photos/800/600.jpg",
      type: "Image",
    },
    {
      name: "Sample Image (PNG)",
      url: "https://via.placeholder.com/600x400.png",
      type: "Image",
    },
  ]

  const handleDemoDownload = async (demoFile) => {
    const filename = `demo-${demoFile.type.toLowerCase()}-${Date.now()}.${demoFile.url.split(".").pop().split("?")[0]}`
    await onDownload(demoFile.url, filename)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Demo Files</h3>
      <p className="text-sm text-gray-600 mb-4">Try downloading these sample files to test the application:</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {demoFiles.map((file, index) => (
          <button
            key={index}
            onClick={() => handleDemoDownload(file)}
            disabled={isLoading}
            className="p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="font-medium text-gray-900 text-sm mb-1">{file.name}</div>
            <div className="text-xs text-gray-500">{file.type} • Click to download</div>
          </button>
        ))}
      </div>
    </div>
  )
}
