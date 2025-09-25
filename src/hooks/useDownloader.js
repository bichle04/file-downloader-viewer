"use client"

import { useState, useCallback } from "react"
import fileService from "../services/fileService"

export const useDownloader = () => {
  const [downloads, setDownloads] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const downloadFile = useCallback(async (url, customFilename = null) => {
    setIsLoading(true)
    setError(null)

    const downloadId = Date.now().toString()

    try {
      // Extract filename from URL or use custom name
      const urlFilename = url.split("/").pop().split("?")[0]
      const filename = customFilename || urlFilename || `download_${Date.now()}`

      // Create download entry with progress tracking
      const downloadEntry = {
        id: downloadId,
        filename,
        url,
        progress: 0,
        status: "downloading",
        startTime: new Date(),
      }

      setDownloads((prev) => [...prev, downloadEntry])

      // Download with progress callback
      const result = await fileService.downloadFile(url, filename, (progress) => {
        setDownloads((prev) => prev.map((d) => (d.id === downloadId ? { ...d, progress } : d)))
      })

      // Update download entry with completion
      setDownloads((prev) =>
        prev.map((d) =>
          d.id === downloadId
            ? {
                ...d,
                progress: 100,
                status: "completed",
                fileInfo: result,
                endTime: new Date(),
              }
            : d,
        ),
      )

      return result
    } catch (err) {
      setError(err.message)

      // Update download entry with error
      setDownloads((prev) => prev.map((d) => (d.id === downloadId ? { ...d, status: "error", error: err.message } : d)))

      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearDownloads = useCallback(() => {
    setDownloads([])
    setError(null)
  }, [])

  const removeDownload = useCallback((downloadId) => {
    setDownloads((prev) => prev.filter((d) => d.id !== downloadId))
  }, [])

  return {
    downloads,
    isLoading,
    error,
    downloadFile,
    clearDownloads,
    removeDownload,
  }
}
