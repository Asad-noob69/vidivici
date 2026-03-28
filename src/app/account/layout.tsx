"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AccountSidebar from "@/components/layout/AccountSidebar"

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profileImage, setProfileImage] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      fetch("/api/account/profile")
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data?.image) setProfileImage(data.image)
        })
        .catch(() => {})
    }
  }, [session])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-mist-100 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-mist-200 border-t-mist-900 rounded-full animate-spin" />
      </div>
    )
  }

  if (!session?.user) return null

  const { user } = session

  return (
    <>
      {/* CONTENT */}
      <div className="">
        <div className="">
          <div className="flex flex-col lg:flex-row gap-3 bg-mist-100">

            {/* SIDEBAR */}
            <AccountSidebar
              name={user.name}
              email={user.email}
              profileImage={profileImage}
            />

            {/* PAGE CONTENT */}
            <main className="flex-1 min-w-0 pr-32">
              {children}
            </main>

          </div>
        </div>
      </div>
    </>
  )
}