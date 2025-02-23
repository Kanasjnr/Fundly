import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import React from "react"

const NFTs = () => {
  const nfts = [
    { id: 1, name: "Donation #1", image: "/placeholder.svg?height=200&width=200", campaign: "Save the Forests" },
    { id: 2, name: "Donation #2", image: "/placeholder.svg?height=200&width=200", campaign: "Clean Ocean Initiative" },
    { id: 3, name: "Donation #3", image: "/placeholder.svg?height=200&width=200", campaign: "Education for All" },
    // Add more sample NFTs as needed
  ]

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My NFTs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nfts.map((nft) => (
          <Card key={nft.id}>
            <CardHeader>
              <CardTitle>{nft.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={nft.image || "/placeholder.svg"}
                alt={nft.name}
                className="w-full h-48 object-cover mb-4 rounded-md"
              />
              <p className="text-sm text-muted-foreground">Campaign: {nft.campaign}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default NFTs

