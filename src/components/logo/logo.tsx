import { Dog } from "lucide-react"
import Link from "next/link"

export const Logo = () => {
  return (
    <Link
      href="/"
      className="flex items-center gap-4 bg-[#2E2C20] w-fit p-3 rounded-b-lg"
    >
      <div className="w-8 h-8 bg-background-brand rounded flex items-center justify-center">
        <Dog />
      </div>

      <span className="text-label-large-size font-bold text-content-brand">
        MUNDO PET
      </span>
    </Link>
  )
}