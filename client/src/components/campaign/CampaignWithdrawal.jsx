"use client"

import { useState } from "react"
import { Wallet, Loader2, AlertCircle } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../ui/card"
import { Alert, AlertDescription } from "../ui/alert"
import useWithdrawCampaignFunds from "../../hooks/Campaigns/useWithdrawCampaignFunds"
import { useAppKitAccount } from "@reown/appkit/react"

const CampaignWithdrawal = ({ campaignId, campaignOwner, isEnded, isSuccessful, isPaidOut, amountCollected }) => {
  const { withdrawCampaignFunds, loading, error } = useWithdrawCampaignFunds()
  const { address } = useAppKitAccount()
  const [isWithdrawn, setIsWithdrawn] = useState(false)

  // Normalize addresses for comparison (convert to lowercase)
  const normalizedOwner = campaignOwner?.toLowerCase()
  const normalizedAddress = address?.toLowerCase()

  // Debug logging
  console.log("Address Comparison:", {
    originalOwner: campaignOwner,
    originalAddress: address,
    normalizedOwner,
    normalizedAddress,
    isMatch: normalizedOwner === normalizedAddress,
  })

  // If any of these conditions are not met, don't show the withdrawal component
  if (!isEnded) {
    console.log("Campaign has not ended yet")
    return null
  }

  if (!isSuccessful) {
    console.log("Campaign was not successful")
    return null
  }

  if (isPaidOut) {
    console.log("Campaign has already been paid out")
    return null
  }

  if (!address || !campaignOwner) {
    console.log("Missing address or campaign owner")
    return null
  }

  if (normalizedOwner !== normalizedAddress) {
    console.log("Connected wallet is not the campaign owner", {
      owner: normalizedOwner,
      connected: normalizedAddress,
    })
    return null
  }

  const handleWithdraw = async () => {
    try {
      const success = await withdrawCampaignFunds(campaignId)
      if (success) {
        setIsWithdrawn(true)
      }
    } catch (err) {
      console.error("Withdrawal error:", err)
    }
  }

  if (isWithdrawn) {
    return (
      <Card className="border-2 border-green-500/20 bg-green-500/5">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Wallet className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg">Funds Withdrawn Successfully!</h3>
            <p className="text-sm text-muted-foreground">{amountCollected} XFI has been transferred to your wallet</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          Withdraw Campaign Funds
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-muted p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span>Available to withdraw:</span>
            <span className="font-semibold">{amountCollected} XFI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Your campaign has successfully reached its goal. You can now withdraw the collected funds to your wallet.
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleWithdraw} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing Withdrawal...
            </>
          ) : (
            <>
              <Wallet className="mr-2 h-4 w-4" />
              Withdraw {amountCollected} XFI
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default CampaignWithdrawal

