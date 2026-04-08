"use client"

import { useEffect, useRef } from "react"
import Script from "next/script"

interface TurnstileProps {
  onVerify: (token: string) => void
  onExpire?: () => void
}

export default function Turnstile({ onVerify, onExpire }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const onVerifyRef = useRef(onVerify)
  const onExpireRef = useRef(onExpire)

  onVerifyRef.current = onVerify
  onExpireRef.current = onExpire

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  useEffect(() => {
    const render = () => {
      if (!containerRef.current || !siteKey || widgetIdRef.current !== null) return
      if (typeof window === "undefined" || !(window as any).turnstile) return
      widgetIdRef.current = (window as any).turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token: string) => onVerifyRef.current(token),
        "expired-callback": () => onExpireRef.current?.(),
        theme: "light",
        size: "normal",
      })
    }

    if ((window as any).turnstile) render()

    ;(window as any).__turnstileOnLoad = render

    return () => {
      if (widgetIdRef.current !== null && (window as any).turnstile) {
        (window as any).turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [siteKey])

  if (!siteKey) return null

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=__turnstileOnLoad"
        strategy="afterInteractive"
      />
      <div ref={containerRef} />
    </>
  )
}
