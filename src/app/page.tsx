import Image from "next/image";
import "./globals.css";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import resumePreview from "@/assets/resume-preview-2.jpg";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-100 px-5 py-12 text-center text-gray-900 md:flex-row md:text-start lg:gap-12">
      <div className="max-w-prose space-y-3">
        <Image
          src={logo}
          alt="logo"
          width={100}
          height={100}
          className="mx-auto md:ms-0"
        />
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Create a{" "}
          <span className="inline-block bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            Perfect Resume
          </span>{" "}
          in Minutes.
        </h1>
        <p className="text-lg text-gray-500">
          More companies are using AI to review your resume every day. <br />
          Use AI to create tailored resumes for each job in minutes.
        </p>
        <Button asChild size="lg" variant="premium">
          <Link href="/resumes">Get Started</Link>
        </Button>
      </div>
      <div>
        <Image
          src={resumePreview}
          alt="resume preview"
          width={600}
          height={600}
          className="shadow-md lg:rotate-[-1.5deg]"
        />
      </div>
    </main>
  );
}
