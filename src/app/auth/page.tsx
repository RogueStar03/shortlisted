import { Suspense } from "react"
import AuthPage from "./authClient"

export const dynamic = "force-dynamic"

export default function Page() {
  return (
    <Suspense>
      <AuthPage />
    </Suspense>
  )
}