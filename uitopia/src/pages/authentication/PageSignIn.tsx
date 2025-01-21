import { FormSignIn } from "@/forms/FormSignIn"

export default function PageSignIn() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <FormSignIn />
      </div>
    </div>
  )
}
