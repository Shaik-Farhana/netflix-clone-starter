"use client"
import Link from "next/link"
import { useAuth } from "@/components/providers"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User, LogOut, Star, Heart } from "lucide-react"

export function Navbar() {
  const { user, signOut } = useAuth()

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Star className="w-8 h-8 text-yellow-500 fill-current" />
            <span className="text-xl font-bold text-white">MovieRate</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Discover
            </Link>
            <Link href="/search" className="text-gray-300 hover:text-white transition-colors">
              Search
            </Link>
            {user && (
              <>
                <Link href="/watchlist" className="text-gray-300 hover:text-white transition-colors">
                  Watchlist
                </Link>
                <Link href="/ratings" className="text-gray-300 hover:text-white transition-colors">
                  My Ratings
                </Link>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white">
                    <User className="w-4 h-4 mr-2" />
                    {user.email?.split("@")[0] || "User"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="text-white">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/ratings" className="text-white">
                      <Star className="w-4 h-4 mr-2" />
                      My Ratings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/watchlist" className="text-white">
                      <Heart className="w-4 h-4 mr-2" />
                      Watchlist
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut} className="text-white cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button asChild variant="ghost" size="sm" className="text-white">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button asChild size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-black">
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
