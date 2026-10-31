// E2E always uses its own new SQLite database, never the developer's .env DB.
import { spawn, spawnSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = fileURLToPath(new URL('../../', import.meta.url))
const backend = path.join(root, 'seapedia-backend')
const directory = path.join(root, 'tmp', 'e2e')
mkdirSync(directory, { recursive: true })
const database = path.join(directory, `catalog-${process.pid}.sqlite`)
writeFileSync(database, '')
const env = {
  ...process.env, APP_ENV: 'testing', APP_DEBUG: 'false',
  DB_CONNECTION: 'sqlite', DB_DATABASE: database, DB_URL: '',
  CACHE_STORE: 'array', SESSION_DRIVER: 'array', QUEUE_CONNECTION: 'sync',
  BCRYPT_ROUNDS: '4', APP_URL: 'http://127.0.0.1:18000',
}
const seed = spawnSync('php', ['artisan', 'migrate', '--seed', '--force'], { cwd: backend, env, stdio: 'inherit' })
if (seed.status !== 0) process.exit(seed.status || 1)
const server = spawn('php', ['artisan', 'serve', '--host=127.0.0.1', '--port=18000', '--no-reload'], { cwd: backend, env, stdio: 'inherit' })
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.kill(signal))
server.on('exit', (code) => process.exit(code || 0))
