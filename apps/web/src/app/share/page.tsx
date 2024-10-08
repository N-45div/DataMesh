"use client";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useMemo, useState } from "react";
import { Web3Service } from "../../web3/Web3Service";
import { EconomicDataEntry } from "../../web3/types";
import { randomUUID } from "crypto";
import Success from "../components/Success";
import styles from "./share.module.css";

const ShareAndEarn = () => {
  const [formData, setFormData] = useState<EconomicDataEntry>({
    invoiceData: "",
    hsnNumber: "",
    amount: "",
    quantity: 0,
    timestamp: "",
    signature: crypto.randomUUID().replace(/-/g, ""),
    is_verified: false,
  });

  const [rewards, setRewards] = useState<number>(0);
  const [extimatedRewards, setExtimatedRewards] = useState<number>(0);

  const [error, setError] = useState<string>();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const wallet = useAnchorWallet();
  const web3Service = useMemo(
    () => (wallet ? new Web3Service(wallet) : null),
    [wallet]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    setIsSubmitting(true);
    e.preventDefault();
    if (!web3Service) {
      setError("Please connect your wallet!");
      return;
    }

    console.log(formData);
    try {
      const signature = await web3Service.submitEconomicData(formData);
      setIsSubmitted(true);
      console.log("Signature ", signature);
    } catch (error: any) {
      console.error(error.getLogs());
      setError(error.toString());
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Simulate rewards earning
    const earned = formData.invoiceData.trim().length / 1000;
    setExtimatedRewards(rewards + earned);
  }, [formData.invoiceData]);

  // Fetch and set the invoice data when the component mounts
  const loadInvoices = async () => {
    const data = await web3Service?.fetchNodeAccount();
    if (data) {
      setRewards(data.totalRewards);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, [web3Service]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <div className={`min-h-screen p-8   ${styles.shareDiv}`}>
          <section className="max-w-4xl mx-auto bg-white-800 p-8 rounded-lg shadow-lg">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="invoiceData"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Invoice Data (JSON)
                  </label>
                  <textarea
                    name="invoiceData"
                    id="invoiceData"
                    value={formData.invoiceData}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full p-2.5 rounded-md border-gray-700 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-900 text-white"
                    placeholder='{"item": "Product A", "price": 100, "quantity": 2}'
                  />
                </div>

                <div>
                  <label
                    htmlFor="hsnNumber"
                    className="block text-sm font-medium text-gray-300"
                  >
                    HSN Number
                  </label>
                  <input
                    type="text"
                    name="hsnNumber"
                    id="hsnNumber"
                    value={formData.hsnNumber}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full p-2.5 rounded-md border-gray-700 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-900 text-white"
                    placeholder="1234"
                  />
                </div>

                <div>
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Amount
                  </label>
                  <input
                    type="number"
                    name="amount"
                    id="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full p-2.5 rounded-md border-gray-700 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-900 text-white"
                    placeholder="500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    id="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full p-2.5 rounded-md border-gray-700 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-900 text-white"
                    placeholder="2"
                  />
                </div>

                <div>
                  <label
                    htmlFor="timestamp"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Purchase Timestamp
                  </label>
                  <input
                    type="datetime-local"
                    name="timestamp"
                    id="timestamp"
                    value={formData.timestamp}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full p-2.5 rounded-md border-gray-700 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-900 text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!wallet || isSubmitting}
                  className={`w-full ${isSubmitting ? "" : "bg-blue-600"} text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition`}
                >
                  Submit and Earn Rewards
                </button>
                {error && (
                  <div
                    className="text-center p-4 mb-4 text-sm text-red-800 rounded-lg bg- dark:bg-white-800 dark:text-red-400"
                    role="alert"
                  >
                    {error}
                  </div>
                )}
              </form>
            ) : (
              <div className="div">
                <h1 className="text-3xl font-semibold text-center text-white mb-2">
                  Share to Earn <br /> for End Customers
                </h1>
                <Success message="Your invoice was successfully submitted!" />
              </div>
            )}

            <div className="mt-8 text-center">
              <h2 className="text-xl font-semibold text-white">
                Extimated Rewards:{" "}
                <span className={styles.rewards}>{extimatedRewards}</span> sol
              </h2>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ShareAndEarn;
