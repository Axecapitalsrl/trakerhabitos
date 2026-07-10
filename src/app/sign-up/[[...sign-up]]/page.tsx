import { SignUp } from "@clerk/nextjs";
import { Logo } from "@/components/Logo";

export default function SignUpPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-12">
      <Logo />
      <SignUp />
    </main>
  );
}
