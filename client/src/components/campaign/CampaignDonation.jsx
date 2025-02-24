"use client"
import React from "react";

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { Label } from "../ui/label";
import { Loader2, Wallet, Gift, Check, Share2, ArrowLeft } from "lucide-react"
import useDonateToCompaign from "../../hooks/Campaigns/useDonateToCompaign"
import { toast } from "react-toastify"
import confetti from "canvas-confetti"


const CampaignDonation = ({ campaignId, isActive, minAmount = 0.01 }) => {
    const [amount, setAmount] = useState("")
    const [showSuccess, setShowSuccess] = useState(false)
    const [donatedAmount, setDonatedAmount] = useState(null)
    const { donateToCampaign, loading, error } = useDonateToCompaign()
  
    const triggerConfetti = () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }
  
    const handleDonate = async () => {
      if (!amount || isNaN(amount) || Number.parseFloat(amount) < minAmount) {
        toast({
          variant: "destructive",
          title: "Error",
          description: `Minimum donation amount is ${minAmount} XFI`,
        })
        return
      }
  
      const success = await donateToCampaign(campaignId, amount)
      if (success) {
        setDonatedAmount(amount)
        setShowSuccess(true)
        triggerConfetti()
      }
    }
  
    const handleAmountChange = (e) => {
      const value = e.target.value
      if (value === "" || (/^\d*\.?\d*$/.test(value) && !isNaN(value))) {
        setAmount(value)
      }
    }
  
    const handleShare = async () => {
      try {
        await navigator.share({
          title: "I just supported a campaign!",
          text: `I just donated ${donatedAmount} XFI to this amazing campaign. Check it out!`,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Share failed:", err)
      }
    }
  
    if (showSuccess) {
      return (
        <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm overflow-hidden">
          <CardHeader className="text-center border-b pb-6">
            <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Thank You!</CardTitle>
            <p className="text-muted-foreground mt-2">Your generous donation will help make this project a reality</p>
          </CardHeader>
  
          <CardContent className="space-y-6 pt-6">
            {/* Donation Amount */}
            <div className="text-center">
              <h3 className="text-3xl font-bold text-primary">{donatedAmount} XFI</h3>
              <p className="text-sm text-muted-foreground">Amount Donated</p>
            </div>
  
            {/* NFT Preview */}
            <div className="relative mx-auto w-48 h-48 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-pulse">
                  <Gift className="h-16 w-16 text-primary/40" />
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <p className="text-sm font-medium">NFT Minting</p>
                <p className="text-xs text-muted-foreground">Check your wallet soon</p>
              </div>
            </div>
  
            {/* What's Next Section */}
            <div className="space-y-3">
              <h4 className="font-semibold">What's Next?</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  Your NFT is being minted
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  You'll receive campaign updates
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  Your name added to supporters
                </div>
              </div>
            </div>
          </CardContent>
  
          <CardFooter className="flex flex-col gap-2">
            <Button variant="outline" className="w-full" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share Your Support
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                setShowSuccess(false)
                setAmount("")
              }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Make Another Donation
            </Button>
          </CardFooter>
        </Card>
      )
    }
  
    return (
      <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            Back this Campaign
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Donation Amount (XFI)</Label>
            <div className="relative">
              <Input
                id="amount"
                type="text"
                placeholder="0.0"
                value={amount}
                onChange={handleAmountChange}
                className="pr-12"
                disabled={!isActive || loading}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">XFI</span>
            </div>
            <p className="text-xs text-muted-foreground">Minimum donation: {minAmount} XFI</p>
          </div>
  
          {error && <p className="text-sm text-destructive">{error}</p>}
  
          <div className="rounded-lg bg-muted p-4">
            <h4 className="font-medium flex items-center gap-2 mb-2">
              <Gift className="h-4 w-4" />
              Donation Perks
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">• Exclusive NFT commemorating your support</li>
              <li className="flex items-center gap-2">• Access to campaign updates</li>
              <li className="flex items-center gap-2">• Your name in the supporters list</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleDonate}
            disabled={!isActive || loading || !amount || Number.parseFloat(amount) < minAmount}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : !isActive ? (
              <>
                <Wallet className="mr-2 h-4 w-4" />
                Campaign Ended
              </>
            ) : (
              "Back this Campaign"
            )}
          </Button>
        </CardFooter>
      </Card>
    )
  }
  
  export default CampaignDonation
  

