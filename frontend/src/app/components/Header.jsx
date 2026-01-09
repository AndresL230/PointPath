'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"

export default function Header() {
    const pathname = usePathname()
    
    const navItems = [
        { href: "/", label: "Dashboard" },
        { href: "/rec-card", label: "Recommend a Card" },
        { href: "/my-cards", label: "My Cards" },
        { href: "/chat", label: "Chat" },
    ]
    
    return (
        <header className="bg-white p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Image
                        src="/waypoints.svg"
                        alt="PointPath Logo"
                        width={24}
                        height={24}
                    />
                    <h1 className="text-black text-xl font-semibold">PointPath</h1>
                </div>

                <nav className="absolute left-1/2 transform -translate-x-1/2">
                    <ul className="flex space-x-6">
                        {navItems.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`px-3 py-2 rounded-md transition-all ${
                                        pathname === item.href
                                            ? "text-black border-b-[3px] border-black pb-1"
                                            : "text-gray-500 hover:bg-gray-100 hover:text-black"
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="flex items-center gap-4">
                    <Link href="/settings">
                        <Image
                            src="/settings.png"
                            alt="Settings"
                            width={24}
                            height={24}
                            className="cursor-pointer"
                        />
                    </Link>
                    <Link href="/account">
                        <Image
                            src="/account.png"
                            alt="Account"
                            width={24}
                            height={24}
                            className="cursor-pointer"
                        />
                    </Link>
                </div>
            </div>
        </header>
    )
}