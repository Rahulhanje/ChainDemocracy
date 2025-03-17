"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, SortAsc, SortDesc, CheckCircle, XCircle, Clock, Tag } from "lucide-react"

interface ProposalFiltersProps {
  onFilterChange: (filters: {
    search: string
    category: string
    status: string
    sort: string
  }) => void
}

const categories = [
  "All Categories",
  "Finance",
  "Governance",
  "Technology",
  "Social",
  "Environment",
  "Education",
  "Health",
  "Other",
]

export function ProposalFilters({ onFilterChange }: ProposalFiltersProps) {
  const [filters, setFilters] = useState({
    search: "",
    category: "All Categories",
    status: "All",
    sort: "newest",
  })

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = {
      ...filters,
      search: e.target.value,
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleFilterChange = (name: string, value: string) => {
    const newFilters = {
      ...filters,
      [name]: value,
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search proposals..."
          className="pl-10"
          value={filters.search}
          onChange={handleSearchChange}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="Active">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>Active</span>
                </div>
              </SelectItem>
              <SelectItem value="Accepted">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Accepted</span>
                </div>
              </SelectItem>
              <SelectItem value="Rejected">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-destructive" />
                  <span>Rejected</span>
                </div>
              </SelectItem>
              <SelectItem value="Pending">Pending Finalization</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          {filters.sort === "newest" ? (
            <SortDesc className="h-4 w-4 text-muted-foreground" />
          ) : (
            <SortAsc className="h-4 w-4 text-muted-foreground" />
          )}
          <Select value={filters.sort} onValueChange={(value) => handleFilterChange("sort", value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="most-votes">Most Votes</SelectItem>
              <SelectItem value="ending-soon">Ending Soon</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

