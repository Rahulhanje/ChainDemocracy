"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Globe, Shield, Lightbulb, Calendar, ArrowRight, Github, Twitter, Linkedin } from "lucide-react"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-b from-purple-50 to-white dark:from-purple-950/30 dark:to-background">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
        </div>

        <div className="container relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <motion.div initial="hidden" animate="visible" variants={fadeIn} className="flex flex-col gap-6">
              <Badge className="w-fit" variant="secondary">
                About ChainDemocracy
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Revolutionizing <span className="text-purple-600 dark:text-purple-400">Governance</span> Through
                Blockchain
              </h1>
              <p className="text-xl text-muted-foreground">
                We're building a more transparent, secure, and accessible future for democratic decision-making.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/proposals">Explore Proposals</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/dashboard">View Dashboard</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative mx-auto lg:mr-0"
            >
              <div className="relative w-full max-w-md aspect-square">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 blur-2xl opacity-20" />
                <div className="relative h-full w-full rounded-full border-2 border-purple-200 dark:border-purple-900 bg-white dark:bg-gray-900 p-4">
                  <div className="h-full w-full rounded-full overflow-hidden">
                    <Image
                      src="https://media.istockphoto.com/id/1473166916/photo/concept-of-cloud-technologies-artificial-intelligence-blockchain-technologies-big-data-cube.jpg?s=612x612&w=0&k=20&c=GBje609ja1zkaAJoasqYOkx5rg02z5lvj2qKgpJwMeg="
                      alt="Blockchain Governance"
                      width={600}
                      height={600}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>

                <div className="absolute -top-4 -left-4 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="mx-auto max-w-3xl text-center mb-16"
          >
            <Badge className="mb-4">Our Mission</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Empowering Communities Through Decentralized Governance
            </h2>
            <p className="text-lg text-muted-foreground">
              ChainDemocracy was founded with a clear vision: to create a world where governance is transparent,
              accessible, and truly representative of the people it serves.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid gap-8 md:grid-cols-3"
          >
            {[
              {
                icon: Globe,
                title: "Global Accessibility",
                description: "Making governance accessible to everyone, regardless of location or background.",
              },
              {
                icon: Shield,
                title: "Uncompromising Security",
                description: "Leveraging blockchain technology to ensure votes are secure, immutable, and verifiable.",
              },
              {
                icon: Lightbulb,
                title: "Radical Transparency",
                description: "Creating systems where every decision and vote is transparent and accountable.",
              },
            ].map((item, index) => (
              <motion.div key={index} variants={fadeIn} className="relative">
                <Card className="h-full overflow-hidden group hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="mx-auto max-w-3xl text-center mb-16"
          >
            <Badge className="mb-4">Our Team</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Meet the Visionaries Behind ChainDemocracy
            </h2>
            <p className="text-lg text-muted-foreground">
              Our diverse team brings together expertise in blockchain technology, governance systems, and user
              experience design to create the future of democratic participation.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {[
              {
                name: "Rahul Hanje",
                role: "Founder & CEO",
                bio: "Former governance advisor with 10+ years experience in civic technology.",
                image: "/placeholder.svg?height=400&width=400",
                twitter: "#",
                github: "#",
                linkedin: "#",
              },
              {
                name: "Sophia Chen",
                role: "CTO",
                bio: "Blockchain architect who previously led development at Ethereum Foundation.",
                image: "/placeholder.svg?height=400&width=400",
                twitter: "#",
                github: "#",
                linkedin: "#",
              },
              {
                name: "Marcus Johnson",
                role: "Head of Research",
                bio: "PhD in Distributed Systems with focus on consensus mechanisms.",
                image: "/placeholder.svg?height=400&width=400",
                twitter: "#",
                github: "#",
                linkedin: "#",
              },
              {
                name: "Leila Patel",
                role: "Head of Design",
                bio: "Award-winning UX designer specializing in making complex systems accessible.",
                image: "/placeholder.svg?height=400&width=400",
                twitter: "#",
                github: "#",
                linkedin: "#",
              },
            ].map((member, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className="overflow-hidden h-full group">
                  <div className="aspect-square overflow-hidden">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      width={400}
                      height={400}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    <p className="text-sm text-purple-600 dark:text-purple-400 mb-2">{member.role}</p>
                    <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                    <div className="flex gap-2">
                      <Link
                        href={member.twitter}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Twitter className="h-4 w-4" />
                        <span className="sr-only">Twitter</span>
                      </Link>
                      <Link
                        href={member.github}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Github className="h-4 w-4" />
                        <span className="sr-only">GitHub</span>
                      </Link>
                      <Link
                        href={member.linkedin}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Linkedin className="h-4 w-4" />
                        <span className="sr-only">LinkedIn</span>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      {/* <section className="py-20">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="mx-auto max-w-3xl text-center mb-16"
          >
            <Badge className="mb-4">Our Journey</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">From Idea to Reality</h2>
            <p className="text-lg text-muted-foreground">
              The path to revolutionizing governance hasn't been straightforward, but every step has brought us closer
              to our vision.
            </p>
          </motion.div>

          <div className="relative mx-auto max-w-3xl">
            <div className="absolute left-1/2 h-full w-px -translate-x-1/2 bg-border" />

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-12"
            >
              {[
                {
                  year: "2020",
                  title: "The Beginning",
                  description:
                    "ChainDemocracy was founded with the mission to make governance more transparent and accessible.",
                },
                {
                  year: "2021",
                  title: "First Prototype",
                  description:
                    "Launched our first prototype on Ethereum testnet, allowing for basic proposal creation and voting.",
                },
                {
                  year: "2022",
                  title: "Major Funding",
                  description: "Secured $5M in seed funding to expand our team and accelerate development.",
                },
                {
                  year: "2023",
                  title: "Mainnet Launch",
                  description:
                    "Deployed our production-ready smart contracts on Ethereum mainnet and launched our platform.",
                },
                {
                  year: "2024",
                  title: "Global Expansion",
                  description:
                    "Expanded to multiple blockchains and launched partnerships with major DAOs and organizations.",
                },
              ].map((item, index) => (
                <motion.div key={index} variants={fadeIn} className="relative pl-8 md:ml-8 md:pl-0 md:pr-8">
                  <div
                    className={`absolute left-0 top-1 h-4 w-4 rounded-full border-2 border-purple-600 bg-background md:left-auto md:right-0 ${index % 2 === 0 ? "md:-translate-x-1/2" : "md:translate-x-1/2"}`}
                  />
                  <div
                    className={`relative rounded-lg border bg-card p-6 shadow-sm ${index % 2 === 0 ? "md:text-right" : ""}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-purple-600" />
                      <span className="font-semibold text-purple-600">{item.year}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-20 bg-purple-600 text-white">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Join Us in Shaping the Future of Governance
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Whether you're a developer, governance expert, or simply passionate about democracy, there's a place for
              you in our community.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/proposals">Explore Proposals</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-white border-white hover:bg-white/10"
                asChild
              >
                <Link href="/dashboard">
                  <span>View Dashboard</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

