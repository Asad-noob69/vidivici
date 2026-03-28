"use client"

import { useRouter } from "next/navigation"
import AddDocumentForm from "@/components/account/AddDocumentForm"

export default function AddDrivingLicensePage() {
  const router = useRouter()

  const handleSubmit = async (data: {
    number: string
    month: string
    day: string
    year: string
    file: File | null
  }) => {
    const formData = new FormData()
    formData.append("type", "DRIVING_LICENSE")
    formData.append("number", data.number)
    formData.append("expiration", `${data.month}/${data.day}/${data.year}`)
    if (data.file) formData.append("file", data.file)

    const res = await fetch("/api/account/documents", { method: "POST", body: formData })
    if (res.ok) router.push("/account/documents")
  }

  return (
    <div className="overflow-hidden">
      <div className="py-16 px-7 sm:px-10 lg:px-16">
        <AddDocumentForm
          title="Add Driving License"
          numberLabel="Driving license number"
          uploadLabel="Upload Driving License"
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}