"use client";

import type React from "react";
import { useState } from "react";
import {
  Plus,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import requests from "../../apis/agent";
import { Bill, NewBill } from "../../types/types";

interface Notification {
  id: string;
  type: "success" | "error";
  message: string;
}

function Payments() {
  const [bills] = useState<Bill[]>([]);
  const [loading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [newBill, setNewBill] = useState<NewBill>({
    title: "",
    description: "",
    amount: 0,
    schoolLevelId: 1,
  });

  // Notification system
  const addNotification = (type: "success" | "error", message: string) => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // // Fetch bills for the student
  // const fetchBills = useCallback(async () => {
  //   try {
  //     const data = await requests.get<Bill[]>(
  //       `/api/Payments/student/${STUDENT_ID}/bills`
  //     );
  //     setBills(data);
  //   } catch (error) {
  //     addNotification("error", "Failed to fetch bills");
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [STUDENT_ID]);

  // Add new bill
  const addBill = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await requests.post<void>("/api/Payments/add-bill", newBill);
      addNotification("success", "Bill added successfully");
      setNewBill({ title: "", description: "", amount: 0, schoolLevelId: 1 });
      setShowAddForm(false);
      // fetchBills(); // Refresh the bills list
    } catch (error) {
      addNotification("error", "Failed to add bill");
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  // Get status badge classes
  const getStatusClasses = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "overdue":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const unpaidBills = bills.filter(
    (bill) => bill.paymentStatus.toLowerCase() !== "paid"
  );
  const unpaidAmount = unpaidBills.reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-center justify-between p-4 rounded-lg shadow-lg max-w-sm ${
              notification.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            <span className="text-sm font-medium">{notification.message}</span>
            <button
              onClick={() => removeNotification(notification.id)}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="container mx-auto p-6 max-w-4xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Payment Center
              </h1>
              <p className="text-gray-600">Manage your bills and payments</p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Bill
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Total Bills
              </h3>
              <div className="text-2xl font-bold text-gray-900">
                {bills.length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Total Amount
              </h3>
              <div className="text-2xl font-bold text-gray-900">
                ${totalAmount.toFixed(2)}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Unpaid Amount
              </h3>
              <div className="text-2xl font-bold text-red-600">
                ${unpaidAmount.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Add Bill Form */}
          {showAddForm && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Add New Bill
                </h2>
                <p className="text-gray-600">Create a new bill for payment</p>
              </div>
              <form onSubmit={addBill} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Title
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={newBill.title}
                      onChange={(e) =>
                        setNewBill({ ...newBill, title: e.target.value })
                      }
                      placeholder="Enter bill title"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="amount"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Amount
                    </label>
                    <input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={newBill.amount}
                      onChange={(e) =>
                        setNewBill({
                          ...newBill,
                          amount: Number.parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="0.00"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={newBill.description}
                    onChange={(e) =>
                      setNewBill({ ...newBill, description: e.target.value })
                    }
                    placeholder="Enter bill description"
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="schoolLevelId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    School Level ID
                  </label>
                  <input
                    id="schoolLevelId"
                    type="number"
                    value={newBill.schoolLevelId}
                    onChange={(e) =>
                      setNewBill({
                        ...newBill,
                        schoolLevelId: Number.parseInt(e.target.value) || 1,
                      })
                    }
                    placeholder="1"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitting ? "Adding..." : "Add Bill"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Bills List */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Your Bills
              </h2>
              <p className="text-gray-600">
                View and manage your payment bills
              </p>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  Loading bills...
                </div>
              ) : bills.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No bills found. Add your first bill to get started.
                </div>
              ) : (
                <div className="space-y-4">
                  {bills.map((bill, index) => (
                    <div key={bill.billId}>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900">
                                {bill.title}
                              </h3>
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusClasses(
                                  bill.paymentStatus
                                )}`}
                              >
                                {getStatusIcon(bill.paymentStatus)}
                                {bill.paymentStatus}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {bill.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>
                                Amount:{" "}
                                <span className="font-medium text-gray-900">
                                  ${bill.amount.toFixed(2)}
                                </span>
                              </span>
                              <span>
                                Created:{" "}
                                {new Date(bill.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 ml-4">
                            {bill.paymentStatus.toLowerCase() !== "paid" && (
                              <button className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors">
                                <CreditCard className="h-4 w-4" />
                                Pay Now
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      {index < bills.length - 1 && (
                        <hr className="my-4 border-gray-200" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payments;
