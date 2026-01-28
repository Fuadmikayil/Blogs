import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import UserPanelClient from './UserPanelClient'

export default async function UserPanelPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    redirect('/login')
  }

  // Token exists → render client UI
  return <UserPanelClient />
}