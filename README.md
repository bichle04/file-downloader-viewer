# File Downloader & Viewer

A React + Vite application for downloading and viewing files locally using Capacitor plugins.

## Features

- **File Download**: Download files from URLs with progress tracking
- **Local Storage**: Save files locally using Capacitor Filesystem
- **File Management**: View, open, and delete downloaded files
- **File Viewer**: Preview images and open documents in browser
- **Progress Tracking**: Real-time download progress with visual indicators
- **Responsive Design**: Clean, mobile-friendly interface

## Supported File Types

- **Images**: JPG, PNG, GIF, WebP
- **Documents**: PDF, DOC, DOCX, TXT
- **Other**: Any file type (with external viewer support)

## Technology Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Mobile**: Capacitor
- **Plugins**: 
  - @capacitor/filesystem (local file storage)
  - @capacitor/browser (external file viewing)

## Project Structure

\`\`\`
src/
├── components/          # Reusable UI components
│   ├── DownloadForm.jsx    # URL input and download form
│   ├── FileList.jsx        # List of downloaded files
│   ├── FileItem.jsx        # Individual file item
│   ├── FileViewer.jsx      # File preview modal
│   ├── ProgressBar.jsx     # Download progress indicator
│   ├── DownloadProgress.jsx # Download status tracking
│   ├── StatusIndicator.jsx # Success/error messages
│   ├── LoadingSpinner.jsx  # Loading animation
│   └── Header.jsx          # App header
├── hooks/               # Custom React hooks
│   ├── useDownloader.js    # Download management
│   └── useFileManager.js   # File operations
├── pages/               # Application pages
│   ├── HomePage.jsx        # Main application page
│   └── FileViewerPage.jsx  # Full-screen file viewer
├── services/            # Business logic
│   └── fileService.js      # File operations & Capacitor integration
├── App.jsx             # Main app component
└── main.jsx            # Application entry point
\`\`\`

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Start development server:
   \`\`\`bash
   npm run dev
   \`\`\`

### For Mobile Development

1. Install Capacitor CLI:
   \`\`\`bash
   npm install -g @capacitor/cli
   \`\`\`

2. Add mobile platforms:
   \`\`\`bash
   npx cap add ios
   npx cap add android
   \`\`\`

3. Build and sync:
   \`\`\`bash
   npm run build
   npx cap sync
   \`\`\`

4. Open in native IDE:
   \`\`\`bash
   npx cap open ios
   npx cap open android
   \`\`\`

## Usage

1. **Download Files**: Enter a file URL in the download form and click "Download File"
2. **Track Progress**: Monitor download progress in real-time
3. **View Files**: Click the eye icon to preview images or open documents
4. **Delete Files**: Click the trash icon and confirm to remove files
5. **Demo Files**: Use the provided demo URLs to test the application

## Features in Detail

### Download Management
- URL validation and error handling
- Custom filename support
- Progress tracking with percentage
- Multiple concurrent downloads
- Download history and status

### File Storage
- Local storage using Capacitor Filesystem
- Organized file structure in Documents/downloads
- File metadata tracking (size, type, date)
- Automatic directory creation

### File Viewing
- Image preview with zoom support
- PDF and document handling via external browser
- File type detection and appropriate icons
- Full-screen viewer page

### User Interface
- Clean, modern design with Tailwind CSS
- Responsive layout for mobile and desktop
- Loading states and error handling
- Success/error notifications
- Intuitive file management

## Development

### Code Organization
- **Components**: Modular, reusable UI components
- **Hooks**: Custom hooks for state management
- **Services**: Business logic separated from UI
- **Pages**: Route-based page components

### Best Practices
- TypeScript-ready structure
- Error boundary implementation
- Loading state management
- Responsive design patterns
- Accessibility considerations

## License

MIT License - feel free to use this project for learning and development.
