import React, { useState } from "react";
import { Button } from "../ui/button";
import axiosInstance from "@/config/axiosInstance";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const DownloadUserEmails = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const validateDates = () => {
    if (!startDate || !endDate) {
      setError("Both start and end dates are required.");
      return false;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setError("Start date cannot be after end date.");
      return false;
    }
    setError("");
    return true;
  };

  const handleDownload = async () => {
    if (!validateDates()) return;
    try {
      const response = await axiosInstance.get(
        `/orders/admin/download-user-emails?startDate=${startDate}&endDate=${endDate}`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "user_emails.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setOpen(false);
    } catch (err) {
      setError("Error downloading emails.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 text-white" onClick={() => setOpen(true)}>
          Download User Emails
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Date Range</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col">
              <label htmlFor="start-date" className="mb-1 text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="end-date" className="mb-1 text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          {error && <span className="text-red-500 text-sm">{error}</span>}
        </div>
        <DialogFooter>
          <Button onClick={handleDownload} className="bg-blue-600 text-white">
            Download
          </Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadUserEmails;