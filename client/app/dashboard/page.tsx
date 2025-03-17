// "use client"

// import { useState, useEffect } from "react"
// // import { useWeb3 } from "@/components/web3-provider"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { VotingProgress } from "@/components/voting-progress"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { motion } from "framer-motion"
// import {
//   BarChart,
//   PieChart,
//   LineChart,
//   FileText,
//   Vote,
//   CheckCircle,
//   XCircle,
//   Clock,
//   Loader2,
//   AlertCircle,
//   ArrowRight,
// } from "lucide-react"
// import Link from "next/link"
// import { useWallet } from "@/hooks/WalletContext"
// import { getContract } from "@/lib/contract"

// interface Proposal {
//   id: number
//   title: string
//   category: string
//   deadline: number
//   upvotes: number
//   downvotes: number
//   finalized: boolean
// }

// interface DashboardStats {
//   totalProposals: number
//   activeProposals: number
//   finalizedProposals: number
//   acceptedProposals: number
//   rejectedProposals: number
//   totalVotes: number
//   participationRate: number
//   categoryCounts: Record<string, number>
//   recentProposals: Proposal[]
// }

// export  default async function DashboardPage() {
//   const { isConnected } = useWallet()
//   const contract=await getContract();
//   const [stats, setStats] = useState<DashboardStats>({
//     totalProposals: 0,
//     activeProposals: 0,
//     finalizedProposals: 0,
//     acceptedProposals: 0,
//     rejectedProposals: 0,
//     totalVotes: 0,
//     participationRate: 0,
//     categoryCounts: {},
//     recentProposals: [],
//   })
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   const fetchDashboardData = async () => {
//     if (!contract) return

//     try {
//       setIsLoading(true)
//       setError(null)

//       const proposalCount = await contract.proposalCount()
//       const count = proposalCount.toNumber()

//       let activeCount = 0
//       let finalizedCount = 0
//       let acceptedCount = 0
//       let rejectedCount = 0
//       let totalVotesCount = 0
//       const categories: Record<string, number> = {}
//       const recentProposals: Proposal[] = []

//       const now = Math.floor(Date.now() / 1000)

//       for (let i = 1; i <= count; i++) {
//         const proposal = await contract.proposals(i)

//         const proposalData = {
//           id: proposal.id.toNumber(),
//           title: proposal.title,
//           category: proposal.category,
//           deadline: proposal.deadline.toNumber(),
//           upvotes: proposal.upvotes.toNumber(),
//           downvotes: proposal.downvotes.toNumber(),
//           finalized: proposal.finalized,
//         }

//         // Count by category
//         if (categories[proposalData.category]) {
//           categories[proposalData.category]++
//         } else {
//           categories[proposalData.category] = 1
//         }

//         // Count by status
//         if (proposalData.finalized) {
//           finalizedCount++
//           if (proposalData.upvotes > proposalData.downvotes) {
//             acceptedCount++
//           } else {
//             rejectedCount++
//           }
//         } else if (proposalData.deadline > now) {
//           activeCount++
//         }

//         // Total votes
//         totalVotesCount += proposalData.upvotes + proposalData.downvotes

//         // Recent proposals (last 5)
//         if (count - i < 5) {
//           recentProposals.push(proposalData)
//         }
//       }

//       // Sort recent proposals by ID (newest first)
//       recentProposals.sort((a, b) => b.id - a.id)

//       setStats({
//         totalProposals: count,
//         activeProposals: activeCount,
//         finalizedProposals: finalizedCount,
//         acceptedProposals: acceptedCount,
//         rejectedProposals: rejectedCount,
//         totalVotes: totalVotesCount,
//         participationRate: count > 0 ? (totalVotesCount / (count * 100)) * 100 : 0, // Assuming 100 potential voters per proposal
//         categoryCounts: categories,
//         recentProposals,
//       })
//     } catch (error: any) {
//       console.error("Error fetching dashboard data:", error)
//       setError("Failed to load dashboard data. Please try again later.")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   useEffect(() => {
//     if (contract) {
//       fetchDashboardData()
//     }
//   }, [contract])

//   // For demo purposes, if no contract is available, show sample data
//   useEffect(() => {
//     if (!contract && isLoading) {
//       // Sample data for demonstration
//       const sampleStats: DashboardStats = {
//         totalProposals: 24,
//         activeProposals: 8,
//         finalizedProposals: 16,
//         acceptedProposals: 10,
//         rejectedProposals: 6,
//         totalVotes: 1842,
//         participationRate: 76.75,
//         categoryCounts: {
//           Finance: 5,
//           Governance: 4,
//           Technology: 3,
//           Social: 4,
//           Environment: 3,
//           Education: 3,
//           Health: 2,
//         },
//         recentProposals: [
//           {
//             id: 24,
//             title: "City Park Renovation Project",
//             category: "Environment",
//             deadline: Math.floor(Date.now() / 1000) + 86400 * 3, // 3 days from now
//             upvotes: 156,
//             downvotes: 23,
//             finalized: false,
//           },
//           {
//             id: 23,
//             title: "Public Transportation Expansion",
//             category: "Technology",
//             deadline: Math.floor(Date.now() / 1000) + 86400 * 5, // 5 days from now
//             upvotes: 203,
//             downvotes: 87,
//             finalized: false,
//           },
//           {
//             id: 22,
//             title: "Community Education Program",
//             category: "Education",
//             deadline: Math.floor(Date.now() / 1000) - 86400 * 2, // 2 days ago
//             upvotes: 312,
//             downvotes: 45,
//             finalized: true,
//           },
//           {
//             id: 21,
//             title: "Healthcare Subsidy for Low-Income Families",
//             category: "Health",
//             deadline: Math.floor(Date.now() / 1000) - 86400 * 5, // 5 days ago
//             upvotes: 178,
//             downvotes: 192,
//             finalized: true,
//           },
//           {
//             id: 20,
//             title: "Small Business Grant Program",
//             category: "Finance",
//             deadline: Math.floor(Date.now() / 1000) + 86400 * 10, // 10 days from now
//             upvotes: 89,
//             downvotes: 34,
//             finalized: false,
//           },
//         ],
//       }

//       setStats(sampleStats)
//       setIsLoading(false)
//     }
//   }, [contract, isLoading])

//   const chartVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.5 },
//     },
//   }

//   return (
//     <div className="container py-8">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
//         <p className="text-muted-foreground">Overview of voting statistics and proposal analytics</p>
//       </div>

//       {isLoading ? (
//         <div className="flex h-[400px] items-center justify-center">
//           <div className="flex flex-col items-center gap-2">
//             <Loader2 className="h-8 w-8 animate-spin text-primary" />
//             <p className="text-muted-foreground">Loading dashboard data...</p>
//           </div>
//         </div>
//       ) : error ? (
//         <div className="flex h-[400px] items-center justify-center">
//           <div className="flex flex-col items-center gap-2 text-center">
//             <AlertCircle className="h-8 w-8 text-destructive" />
//             <p className="font-medium text-destructive">{error}</p>
//             <Button variant="outline" onClick={fetchDashboardData} className="mt-2">
//               Try Again
//             </Button>
//           </div>
//         </div>
//       ) : (
//         <>
//           {/* Stats Cards */}
//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//             <motion.div variants={chartVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between pb-2">
//                   <CardTitle className="text-sm font-medium">Total Proposals</CardTitle>
//                   <FileText className="h-4 w-4 text-muted-foreground" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">{stats.totalProposals}</div>
//                   <p className="text-xs text-muted-foreground">
//                     {stats.activeProposals} active, {stats.finalizedProposals} finalized
//                   </p>
//                 </CardContent>
//               </Card>
//             </motion.div>

//             <motion.div variants={chartVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between pb-2">
//                   <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
//                   <Vote className="h-4 w-4 text-muted-foreground" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">{stats.totalVotes}</div>
//                   <p className="text-xs text-muted-foreground">
//                     {stats.participationRate.toFixed(1)}% participation rate
//                   </p>
//                 </CardContent>
//               </Card>
//             </motion.div>

//             <motion.div variants={chartVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between pb-2">
//                   <CardTitle className="text-sm font-medium">Accepted Proposals</CardTitle>
//                   <CheckCircle className="h-4 w-4 text-success" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">{stats.acceptedProposals}</div>
//                   <p className="text-xs text-muted-foreground">
//                     {stats.finalizedProposals > 0
//                       ? ((stats.acceptedProposals / stats.finalizedProposals) * 100).toFixed(1)
//                       : 0}
//                     % acceptance rate
//                   </p>
//                 </CardContent>
//               </Card>
//             </motion.div>

//             <motion.div variants={chartVariants} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between pb-2">
//                   <CardTitle className="text-sm font-medium">Rejected Proposals</CardTitle>
//                   <XCircle className="h-4 w-4 text-destructive" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">{stats.rejectedProposals}</div>
//                   <p className="text-xs text-muted-foreground">
//                     {stats.finalizedProposals > 0
//                       ? ((stats.rejectedProposals / stats.finalizedProposals) * 100).toFixed(1)
//                       : 0}
//                     % rejection rate
//                   </p>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           </div>

//           {/* Charts and Recent Proposals */}
//           <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
//             <motion.div
//               className="md:col-span-2 lg:col-span-4"
//               variants={chartVariants}
//               initial="hidden"
//               animate="visible"
//               transition={{ delay: 0.5 }}
//             >
//               <Tabs defaultValue="categories" className="h-full">
//                 <TabsList>
//                   <TabsTrigger value="categories" className="flex items-center gap-2">
//                     <PieChart className="h-4 w-4" />
//                     Categories
//                   </TabsTrigger>
//                   <TabsTrigger value="status" className="flex items-center gap-2">
//                     <BarChart className="h-4 w-4" />
//                     Status
//                   </TabsTrigger>
//                   <TabsTrigger value="timeline" className="flex items-center gap-2">
//                     <LineChart className="h-4 w-4" />
//                     Timeline
//                   </TabsTrigger>
//                 </TabsList>
//                 <TabsContent value="categories" className="h-[400px]">
//                   <Card className="h-full">
//                     <CardHeader>
//                       <CardTitle>Proposals by Category</CardTitle>
//                       <CardDescription>Distribution of proposals across different categories</CardDescription>
//                     </CardHeader>
//                     <CardContent className="h-[300px] flex items-center justify-center">
//                       <div className="grid grid-cols-2 gap-4 w-full">
//                         {Object.entries(stats.categoryCounts).map(([category, count], index) => (
//                           <div key={category} className="flex items-center gap-3">
//                             <div
//                               className="h-3 w-3 rounded-full"
//                               style={{
//                                 backgroundColor: [
//                                   "#8b5cf6",
//                                   "#ec4899",
//                                   "#06b6d4",
//                                   "#10b981",
//                                   "#f59e0b",
//                                   "#ef4444",
//                                   "#6366f1",
//                                   "#a855f7",
//                                 ][index % 8],
//                               }}
//                             />
//                             <div className="flex-1 flex justify-between items-center">
//                               <span className="text-sm">{category}</span>
//                               <span className="text-sm font-medium">{count}</span>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </TabsContent>
//                 <TabsContent value="status" className="h-[400px]">
//                   <Card className="h-full">
//                     <CardHeader>
//                       <CardTitle>Proposals by Status</CardTitle>
//                       <CardDescription>Current status of all proposals</CardDescription>
//                     </CardHeader>
//                     <CardContent className="h-[300px] flex items-center justify-center">
//                       <div className="w-full max-w-md">
//                         <div className="mb-6 space-y-4">
//                           <div className="space-y-2">
//                             <div className="flex items-center justify-between">
//                               <div className="flex items-center gap-2">
//                                 <div className="h-3 w-3 rounded-full bg-blue-500" />
//                                 <span className="text-sm">Active</span>
//                               </div>
//                               <span className="text-sm font-medium">{stats.activeProposals}</span>
//                             </div>
//                             <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
//                               <div
//                                 className="h-full bg-blue-500"
//                                 style={{ width: `${(stats.activeProposals / stats.totalProposals) * 100}%` }}
//                               />
//                             </div>
//                           </div>
//                           <div className="space-y-2">
//                             <div className="flex items-center justify-between">
//                               <div className="flex items-center gap-2">
//                                 <div className="h-3 w-3 rounded-full bg-success" />
//                                 <span className="text-sm">Accepted</span>
//                               </div>
//                               <span className="text-sm font-medium">{stats.acceptedProposals}</span>
//                             </div>
//                             <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
//                               <div
//                                 className="h-full bg-success"
//                                 style={{ width: `${(stats.acceptedProposals / stats.totalProposals) * 100}%` }}
//                               />
//                             </div>
//                           </div>
//                           <div className="space-y-2">
//                             <div className="flex items-center justify-between">
//                               <div className="flex items-center gap-2">
//                                 <div className="h-3 w-3 rounded-full bg-destructive" />
//                                 <span className="text-sm">Rejected</span>
//                               </div>
//                               <span className="text-sm font-medium">{stats.rejectedProposals}</span>
//                             </div>
//                             <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
//                               <div
//                                 className="h-full bg-destructive"
//                                 style={{ width: `${(stats.rejectedProposals / stats.totalProposals) * 100}%` }}
//                               />
//                             </div>
//                           </div>
//                           <div className="space-y-2">
//                             <div className="flex items-center justify-between">
//                               <div className="flex items-center gap-2">
//                                 <div className="h-3 w-3 rounded-full bg-yellow-500" />
//                                 <span className="text-sm">Pending Finalization</span>
//                               </div>
//                               <span className="text-sm font-medium">
//                                 {stats.totalProposals - stats.activeProposals - stats.finalizedProposals}
//                               </span>
//                             </div>
//                             <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
//                               <div
//                                 className="h-full bg-yellow-500"
//                                 style={{
//                                   width: `${((stats.totalProposals - stats.activeProposals - stats.finalizedProposals) / stats.totalProposals) * 100}%`,
//                                 }}
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </TabsContent>
//                 <TabsContent value="timeline" className="h-[400px]">
//                   <Card className="h-full">
//                     <CardHeader>
//                       <CardTitle>Proposal Timeline</CardTitle>
//                       <CardDescription>Proposals created over time</CardDescription>
//                     </CardHeader>
//                     <CardContent className="h-[300px] flex items-center justify-center">
//                       <div className="text-center text-muted-foreground">
//                         Timeline visualization would be displayed here
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </TabsContent>
//               </Tabs>
//             </motion.div>

//             <motion.div
//               className="md:col-span-2 lg:col-span-3"
//               variants={chartVariants}
//               initial="hidden"
//               animate="visible"
//               transition={{ delay: 0.6 }}
//             >
//               <Card className="h-full">
//                 <CardHeader>
//                   <CardTitle>Recent Proposals</CardTitle>
//                   <CardDescription>Latest proposals created on the platform</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     {stats.recentProposals.map((proposal) => {
//                       const isExpired = proposal.deadline * 1000 < Date.now()

//                       return (
//                         <div key={proposal.id} className="flex items-start gap-4">
//                           <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
//                             <FileText className="h-5 w-5 text-primary" />
//                           </div>
//                           <div className="flex-1 space-y-1">
//                             <div className="flex items-center justify-between">
//                               <p className="text-sm font-medium leading-none">{proposal.title}</p>
//                               <div className="flex items-center">
//                                 {proposal.finalized ? (
//                                   proposal.upvotes > proposal.downvotes ? (
//                                     <CheckCircle className="h-4 w-4 text-success" />
//                                   ) : (
//                                     <XCircle className="h-4 w-4 text-destructive" />
//                                   )
//                                 ) : isExpired ? (
//                                   <Clock className="h-4 w-4 text-yellow-500" />
//                                 ) : (
//                                   <Clock className="h-4 w-4 text-blue-500" />
//                                 )}
//                               </div>
//                             </div>
//                             <div className="flex items-center justify-between">
//                               <p className="text-xs text-muted-foreground">{proposal.category}</p>
//                               <VotingProgress
//                                 upvotes={proposal.upvotes}
//                                 downvotes={proposal.downvotes}
//                                 className="w-24"
//                                 showLabels={false}
//                                 compact
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       )
//                     })}
//                   </div>
//                   <div className="mt-6 flex justify-center">
//                     <Button asChild variant="outline" size="sm" className="gap-2">
//                       <Link href="/proposals">
//                         View All Proposals
//                         <ArrowRight className="h-4 w-4" />
//                       </Link>
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           </div>
//         </>
//       )}
//     </div>
//   )
// }

'use client'
import { use, useEffect, useState } from "react";
import { createProposal, getProposal } from "@/lib/contract";

export default function ProposalForm() {
    const [form, setForm] = useState({
        title: "",
        description: "",
        category: "",
        duration: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const durationValue = Number(form.duration);
  
      if (!form.title || !form.description || !form.category || isNaN(durationValue) || durationValue <= 0) {
          alert("Please enter a valid duration (positive number) and fill all fields");
          return;
      }
  
      try {
          const tx=await createProposal(form.title, form.description, form.category, durationValue);
          console.log(tx);
          alert("Proposal submitted successfully!");
          setForm({ title: "", description: "", category: "", duration: "" });
      } catch (error) {
          console.error(error);
          alert("Failed to submit proposal");
      }
  };

    useEffect(() => {
        getProposal(1);
    }, []);

    return (
        <div className="max-w-md mx-auto p-4 border rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Create Proposal</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                    type="text" 
                    name="title" 
                    placeholder="Title" 
                    value={form.title} 
                    onChange={handleChange} 
                    className="w-full p-2 border rounded"
                />
                <textarea 
                    name="description" 
                    placeholder="Description" 
                    value={form.description} 
                    onChange={handleChange} 
                    className="w-full p-2 border rounded"
                />
                <input 
                    type="text" 
                    name="category" 
                    placeholder="Category" 
                    value={form.category} 
                    onChange={handleChange} 
                    className="w-full p-2 border rounded"
                />
                <input 
                    type="number" 
                    name="duration" 
                    placeholder="Duration (in days)" 
                    value={form.duration} 
                    onChange={handleChange} 
                    className="w-full p-2 border rounded"
                />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Submit Proposal</button>
            </form>
        </div>
    );
}