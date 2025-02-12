import { Routes, Route } from "react-router-dom"
import React from "react"

import { Sidebar } from "../components/Sidebar"
import { DashboardHeader } from "../components/DashboardHeader"
// import DashboardContent from "../components/Dashboard/DashboardContent"
// import CampaignListing from "../components/Dashboard/CampaignListing"
// import CampaignDetails from "../components/Dashboard/CampaignDetails"
// import FundingOverview from "../components/Dashboard/FundingOverview"
// import BackerManagement from "../components/Dashboard/BackerManagement"
// import RewardManagement from "../components/Dashboard/RewardManagement"
// import ReportGeneration from "../components/Dashboard/ReportGeneration"
// import { KYCStatus } from "../components/KYC/KYCStatus"
// import { KYCSubmissionForm } from "../components/KYC/KYCSubmissionForm"
// import { KYCVerificationList } from "../components/KYC/KYCVerificationList"
// import Notifications from "../components/Dashboard/Notifications"

function DashboardPage() {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-100">
          <div className="max-w-7xl mx-auto">
            <Routes>
              {/* <Route path="/" element={<DashboardContent />} />
              <Route path="/campaigns" element={<CampaignListing />} />
              <Route path="/campaigns/:id" element={<CampaignDetails />} />
              <Route path="/funding" element={<FundingOverview />} />
              <Route path="/backers" element={<BackerManagement />} />
              <Route path="/rewards" element={<RewardManagement />} />
              <Route path="/reports" element={<ReportGeneration />} /> */}
              <Route
                path="/kyc"
                element={
                  <div className="space-y-8">
                    {/* <KYCStatus />
                    <KYCSubmissionForm />
                    <KYCVerificationList /> */}
                  </div>
                }
              />
            </Routes>
          </div>
        </main>
      </div>
      {/* <Notifications /> */}
    </div>
  )
}

export default DashboardPage

