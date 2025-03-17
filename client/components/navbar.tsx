"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, FileText, BarChart2, Wallet, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useWallet } from "@/hooks/WalletContext"

const navItems = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "Proposals",
    href: "/proposals",
    icon: FileText,
  },
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: BarChart2,
  },
]

export function Navbar() {
  const { account, isConnected, connectWallet, disconnectWallet } = useWallet()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              ChainDemocracy
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Desktop Wallet Connection */}
        <div className="hidden md:flex items-center gap-4">
          {isConnected ? (
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium text-muted-foreground">
                {account?.slice(0, 6)}...{account?.slice(-4)}
              </div>
              <Button variant="outline" size="sm" onClick={disconnectWallet} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Disconnect
              </Button>
            </div>
          ) : (
            <Button onClick={connectWallet} className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center justify-center"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b">
          <div className="container py-4 flex flex-col gap-4">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-md text-sm font-medium transition-colors",
                      isActive ? "bg-primary/10 text-primary" : "hover:bg-accent text-muted-foreground",
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
            <div className="pt-2 border-t">
              {isConnected ? (
                <div className="flex flex-col gap-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Connected: {account?.slice(0, 6)}...{account?.slice(-4)}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      disconnectWallet()
                      setMobileMenuOpen(false)
                    }}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Disconnect
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    connectWallet()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full flex items-center gap-2"
                >
                  <Wallet className="h-4 w-4" />
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

