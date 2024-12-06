import { AuthSession } from '@supabase/supabase-js'
import { Component, createEffect, createSignal } from 'solid-js'
import { supabase } from '~/lib/supabase/supabase'

interface Props {
  session: AuthSession
}

const Account: Component<Props> = ({ session }) => {
  const [loading, setLoading] = createSignal(true)
  const [username, setUsername] = createSignal<string | null>(null)
  const [website, setWebsite] = createSignal<string | null>(null)
  const [avatarUrl, setAvatarUrl] = createSignal<string | null>(null)

  createEffect(() => {
    getProfile()
  })

  const getProfile = async () => {
    try {
      setLoading(true)
      const { user } = session

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (e: Event) => {
    e.preventDefault()

    try {
      setLoading(true)
      const { user } = session

      const updates = {
        id: user.id,
        username: username(),
        website: website(),
        avatar_url: avatarUrl(),
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div class='text-white'>
      <form onSubmit={updateProfile} class='space-y-6'>
        <div class='text-lg mb-4'>
          Email: <span class='font-medium'>{session.user.email}</span>
        </div>

        <div class='space-y-2'>
          <label for='username' class='block text-sm font-medium'>
            Name
          </label>
          <input
            id='username'
            type='text'
            value={username() || ''}
            onChange={(e) => setUsername(e.currentTarget.value)}
            class='w-full px-4 py-2 rounded bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-primary'
          />
        </div>

        <div class='space-y-2'>
          <label for='website' class='block text-sm font-medium'>
            Website
          </label>
          <input
            id='website'
            type='text'
            value={website() || ''}
            onChange={(e) => setWebsite(e.currentTarget.value)}
            class='w-full px-4 py-2 rounded bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-primary'
          />
        </div>

        <div class='space-y-4'>
          <button type='submit' class='w-full btn btn-primary' disabled={loading()}>
            {loading() ? 'Saving ...' : 'Update profile'}
          </button>

          <button type='button' class='w-full btn btn-secondary' onClick={() => supabase.auth.signOut()}>
            Sign Out
          </button>
        </div>
      </form>
    </div>
  )
}

export default Account
