import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'vercel-api-dev-server',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url && req.url.startsWith('/api/')) {
            try {
              const url = new URL(req.url, `http://${req.headers.host}`);
              // Retira query params
              const apiName = url.pathname.replace(/^\/api\//, '');
              const modulePath = `./api/${apiName}.ts`;
              const apiModule = await server.ssrLoadModule(modulePath);
              
              let body = {};
              if (req.method === 'POST' || req.method === 'PUT') {
                body = await new Promise((resolve) => {
                  let chunks = '';
                  req.on('data', chunk => chunks += chunk);
                  req.on('end', () => {
                    try {
                      resolve(JSON.parse(chunks));
                    } catch {
                      resolve(chunks);
                    }
                  });
                });
              }

              const mockRes = {
                statusCode: 200,
                headers: {} as Record<string, string>,
                setHeader(name: string, value: string) {
                  this.headers[name] = value;
                  res.setHeader(name, value);
                  return this;
                },
                status(code: number) {
                  this.statusCode = code;
                  res.statusCode = code;
                  return this;
                },
                json(data: any) {
                  this.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(data));
                  return this;
                },
                end(data?: any) {
                  res.end(data);
                  return this;
                }
              };

              const mockReq = {
                method: req.method,
                headers: req.headers,
                url: req.url,
                body
              };

              await apiModule.default(mockReq, mockRes);
            } catch (err: any) {
              console.error('Local API Error:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
            return;
          }
          next();
        });
      }
    }
  ],
})

