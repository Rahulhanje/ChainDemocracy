"use client";

import type React from "react";

import { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Loader2 } from "lucide-react";
import { useWallet } from "@/hooks/WalletContext";
import { get } from "http";
import { createProposal, getContract, getIsGovernment } from "@/lib/contract";
import { ethers } from "ethers";

const categories = [
  "Finance",
  "Governance",
  "Technology",
  "Social",
  "Environment",
  "Education",
  "Health",
  "Other",
];

export function CreateProposalDialog() {
  const { isConnected } = useWallet();
  const [isGovernment, setIsGovernment] = useState(false);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    duration: "604800", // 7 days in seconds
  });

  async function logContractInstance() {
    const contract = await getContract();
    const isGovernment = await getIsGovernment();
    setContract(contract);
    setIsGovernment(isGovernment ?? false);
    // console.log("Is Government:", isGovernment);
    // console.log("Contract Instance from CreateProposalDialog:", contract);
  }

  useEffect(() => {
    logContractInstance();
  }, []);

  // Replace 'false' with the appropriate logic or value
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !isGovernment || !contract) return;

    try {
      setIsSubmitting(true);
      setError(null);
      
      console.log(formData.title,
        formData.description,
        formData.category,
        parseInt(formData.duration, 10))
      const tx = await contract.createProposal(
        formData.title,
        formData.description,
        formData.category,
        parseInt(formData.duration, 10)
      );
     
      console.log("Transaction Hash:", tx.hash);

      setFormData({
        title: "",
        description: "",
        category: "",
        duration: "604800",
      });
      setOpen(false);
    } catch (error: any) {
      console.error("Error creating proposal:", error);
      setError(error.message || "Failed to create proposal");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isConnected || !isGovernment) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Create Proposal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Proposal</DialogTitle>
            <DialogDescription>
              Create a new proposal for citizens to vote on. Fill out the
              details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter proposal title"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide a detailed description of the proposal"
                className="min-h-[100px]"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleSelectChange("category", value)
                  }
                  required
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
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
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration (days)</Label>
                <Select
                  value={formData.duration}
                  onValueChange={(value) =>
                    handleSelectChange("duration", value)
                  }
                  required
                >
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="86400">1 day</SelectItem>
                    <SelectItem value="259200">3 days</SelectItem>
                    <SelectItem value="604800">7 days</SelectItem>
                    <SelectItem value="1209600">14 days</SelectItem>
                    <SelectItem value="2592000">30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {error && <div className="text-sm text-destructive">{error}</div>}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Proposal"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
