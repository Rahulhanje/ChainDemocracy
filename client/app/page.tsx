"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { FileText, BarChart2, Vote, Shield, Clock, CheckCircle2, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-secondary/20 py-20 md:py-32">
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <motion.h1
              className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Decentralized Governance for a Better Future
            </motion.h1>
            <motion.p
              className="mt-6 text-lg text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              ChainDemocracy empowers citizens to participate in transparent, secure, and fair voting on proposals that
              shape our community.
            </motion.p>
            <motion.div
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button asChild size="lg" className="gap-2">
                <Link href="/proposals">
                  <Vote className="h-5 w-5" />
                  Start Voting
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link href="/dashboard">
                  <BarChart2 className="h-5 w-5" />
                  View Dashboard
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How ChainDemocracy Works</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our platform leverages blockchain technology to ensure transparent and tamper-proof voting.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: FileText,
                title: "Proposal Creation",
                description: "Government officials create detailed proposals for citizens to review and vote on.",
              },
              {
                icon: Vote,
                title: "Secure Voting",
                description: "Cast your vote securely using blockchain technology that ensures one vote per citizen.",
              },
              {
                icon: Clock,
                title: "Voting Period",
                description: "Each proposal has a specific voting period during which citizens can cast their votes.",
              },
              {
                icon: Shield,
                title: "Transparent Results",
                description: "All voting results are recorded on the blockchain, ensuring complete transparency.",
              },
              {
                icon: CheckCircle2,
                title: "Automatic Execution",
                description: "Once voting ends, results are automatically tallied and the proposal is finalized.",
              },
              {
                icon: BarChart2,
                title: "Real-time Analytics",
                description: "View detailed analytics and statistics about proposals and voting patterns.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="rounded-lg border bg-card p-6 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
                <p className="mt-2 text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to participate in shaping our future?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Connect your wallet and start voting on proposals today.
            </p>
            <div className="mt-10">
              <Button asChild size="lg" className="gap-2">
                <Link href="/proposals">
                  Browse Proposals
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

