import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"

const Donations = () => {
  const donations = [
    { id: 1, campaign: "Save the Forests", amount: "0.5 ETH", date: "2023-06-01", status: "Completed" },
    { id: 2, campaign: "Clean Ocean Initiative", amount: "0.3 ETH", date: "2023-06-02", status: "Pending" },
    { id: 3, campaign: "Education for All", amount: "1.0 ETH", date: "2023-06-03", status: "Completed" },
    // Add more sample donations as needed
  ]

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Donations</h1>
      <Card>
        <CardHeader>
          <CardTitle>Recent Donations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell>{donation.campaign}</TableCell>
                  <TableCell>{donation.amount}</TableCell>
                  <TableCell>{donation.date}</TableCell>
                  <TableCell>{donation.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default Donations

