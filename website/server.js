import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');

const server = http.createServer((req, res) => {
  // Reject paths with .. to prevent directory traversal
  if (req.url.includes('..') || req.url.startsWith('/')) {
    const normalized = req.url.replace(/\.\./g, '');
    if (normalized !== req.url || req.url.startsWith('/')) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Forbidden');
      return;
    }
  }

  // Normalize and resolve path
  const requestPath = req.url === '/' ? 'index.html' : req.url;
  let filePath = path.resolve(DIST_DIR, requestPath);

  // Security: prevent directory traversal by checking canonical paths
  const realDistDir = path.resolve(DIST_DIR);
  if (!filePath.startsWith(realDistDir + path.sep) && filePath !== realDistDir) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  // Try to serve the file
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // If file not found, try index.html (for SPA routing)
      if (err.code === 'ENOENT' && !req.url.includes('.')) {
        fs.readFile(path.join(DIST_DIR, 'index.html'), (err2, data2) => {
          if (err2) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
            return;
          }
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data2);
        });
        return;
      }
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }

    // Determine content type
    const ext = path.extname(filePath);
    let contentType = 'text/plain';
    if (ext === '.html') contentType = 'text/html';
    else if (ext === '.css') contentType = 'text/css';
    else if (ext === '.js') contentType = 'application/javascript';
    else if (ext === '.json') contentType = 'application/json';
    else if (ext === '.svg') contentType = 'image/svg+xml';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.woff') contentType = 'font/woff';
    else if (ext === '.woff2') contentType = 'font/woff2';

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Fornax website running on http://localhost:${PORT}`);
});
