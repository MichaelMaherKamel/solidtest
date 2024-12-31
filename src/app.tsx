import { Router } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start/router'
import { Suspense } from 'solid-js'
import '@fontsource/inter'
import { SessionProvider } from '@solid-mediakit/auth/client'
import { MetaProvider } from '@solidjs/meta'
import { Toaster } from '~/components/ui/toast'
import { I18nProvider } from '~/contexts/i18n'
import { AuthProvider } from '~/contexts/auth'
import './app.css'

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <SessionProvider>
            <AuthProvider>
              <I18nProvider>
                <Suspense>{props.children}</Suspense>
                <Toaster />
              </I18nProvider>
            </AuthProvider>
          </SessionProvider>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  )
}
