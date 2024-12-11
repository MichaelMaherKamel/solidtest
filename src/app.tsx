import { Router } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start/router'
import { Suspense } from 'solid-js'
import '@fontsource/inter'
import { SessionProvider } from '@solid-mediakit/auth/client'
import { MetaProvider } from '@solidjs/meta'
import './app.css'

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <SessionProvider>
            <Suspense>{props.children}</Suspense>
          </SessionProvider>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  )
}
