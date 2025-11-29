# CodePlay.cp - Online Code Compiler

A production-ready, secure online code compiler supporting multiple languages. Built with React, TypeScript, Express, and Docker.

## Features

- **Multi-language Support**: Python, JavaScript, TypeScript, Java, C++, and HTML.
- **Secure Execution**: Code execution is proxied through a secured backend to Piston API.
- **HTML Preview**: Sandboxed iframe for rendering HTML/CSS/JS snippets with external link protection.
- **Theme Support**: Built-in Dark and Light modes.
- **Shareable Snippets**: State (code, language) is compressed and stored in the URL for easy sharing.
- **Error Handling**: Dedicated panel for runtime and compilation errors.
- **Non-Interactive**: Optimized for batch execution; stdin is disabled for security and simplicity.

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Monaco Editor.
- **Backend**: Node.js, Express, Rate Limiting.
- **DevOps**: Docker, Docker Compose.

## Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose (optional, for containerized run)

### Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root:
   ```env
   PORT=3000
   PISTON_URL=https://emkc.org/api/v2/piston
   # PISTON_API_KEY=your_key_here (Optional if using public tier)
   ```

3. **Run Backend**
   ```bash
   npx ts-node server/server.ts
   ```

4. **Run Frontend**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173`.

### Docker Deployment

1. **Build and Run**
   ```bash
   docker-compose up --build
   ```
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:3000`

## Security Notes

- **Input Sanitization**: The application explicitly disables stdin to prevent interactive shell exploits.
- **Iframe Sandboxing**: HTML previews run in `sandbox="allow-scripts allow-same-origin allow-popups"`.
- **Rate Limiting**: The backend enforces a limit of 20 requests per minute per IP.
- **Timeouts**: Execution is hard-limited to 5 seconds.

## Keyboard Shortcuts

- `Ctrl/Cmd + Enter`: Run Code
- `Shift + Alt + F`: Format Code (if supported by editor)

## License

MIT
