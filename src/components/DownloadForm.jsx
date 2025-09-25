"use client"

import { useState } from "react"

const DownloadForm = ({ onDownload, isLoading }) => {
  const [url, setUrl] = useState("")
  const [customFilename, setCustomFilename] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!url.trim()) {
      setError("Please enter a valid URL")
      return
    }

    // Basic URL validation
    try {
      new URL(url)
    } catch {
      setError("Please enter a valid URL")
      return
    }

    try {
      await onDownload(url.trim(), customFilename.trim() || null)
      setUrl("")
      setCustomFilename("")
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Download File</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
            File URL
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/file.pdf"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="filename" className="block text-sm font-medium text-gray-700 mb-2">
            Custom Filename (optional)
          </label>
          <input
            type="text"
            id="filename"
            value={customFilename}
            onChange={(e) => setCustomFilename(e.target.value)}
            placeholder="my-document.pdf"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
        </div>

        {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Downloading..." : "Download File"}
        </button>
      </form>

      <div className="mt-4 text-sm text-gray-600">
        <p className="font-medium mb-2">Supported formats:</p>
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">PDF</span>
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">JPG</span>
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">PNG</span>
          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">GIF</span>
        </div>
      </div>
    </div>
  )
}

export default DownloadForm
