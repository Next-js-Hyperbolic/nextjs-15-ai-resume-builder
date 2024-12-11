// Required to fix 7 clerk errors pertaining to the UserButton component
"use client";

import Image from "next/image";
import Link from "next/link";
import Logo from "@/assets/logo.png";
import { UserButton } from "@clerk/nextjs";
import { CreditCardIcon } from "lucide-react";
import { ModeToggle } from "@/components/ModeToggle";

export default function Navbar() {
  return (
    <header className="shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 p-3">
        <Link href="/resumes" className="flex items-center gap-2">
          <Image
            src={Logo}
            alt="logo"
            width={35}
            height={35}
            className="rounded-full"
          />
          <span className="text-xl font-bold tracking-tight">
            AI Resume Blaster
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <ModeToggle />
          <UserButton
            appearance={{
              elements: {
                avatarBox: {
                  width: 35,
                  height: 35,
                },
              },
            }}
          >
            <UserButton.MenuItems>
              <UserButton.Link
                label="Billing"
                labelIcon={<CreditCardIcon className="size-4" />}
                href="/billing"
              />
            </UserButton.MenuItems>
          </UserButton>
        </div>
      </div>
    </header>
  );
}
