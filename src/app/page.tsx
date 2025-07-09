"use client"

import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { AddressBalance, CurrentBalanceResponse, HistoricBalance } from './types';

const NEXT_API_HOST = process.env.NEXT_PUBLIC_API_HOST

export default function Dashboard() {
  const [historicData, setHistoricData] = useState([]);
  const [currentData, setCurrentData] = useState<CurrentBalanceResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [histRes, currRes] = await Promise.all([
          fetch(`${NEXT_API_HOST}/api/v1/balances/historic`),
          fetch(`${NEXT_API_HOST}/api/v1/balances`)
        ]);
        const [histJson, currJson] = await Promise.all([
          histRes.json(),
          currRes.json(),
        ]);

        // Format date for display
        const formatted = histJson.map((item: HistoricBalance) => ({
          date: new Date(item.date).toLocaleDateString(),
          total: item.total,
        }));

        setHistoricData(formatted);
        setCurrentData(currJson);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading || !currentData) return <div className="text-center mt-8">Loading...</div>;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-10 text-center">📊 Portfolio Dashboard</h1>

      {/* Historic Data Chart */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl rounded-2xl p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-6">Historic Total Value</h2>
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historicData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="#4B5563" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#D1D5DB' }} />
              <YAxis tick={{ fontSize: 12, fill: '#D1D5DB' }} />
              <Tooltip contentStyle={{ borderRadius: '8px', backgroundColor: '#1F2937', color: '#F9FAFB' }} />
              <Line type="monotone" dataKey="total" stroke="#6366F1" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Current Balances */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-8">Current Balances</h2>

        <div className="mb-10">
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-1">Total USD:</p>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">${currentData.totalUsd.toLocaleString()}</p>
        </div>

        {currentData.addresses.map((addr: AddressBalance, idx: number) => (
          <div key={idx} className="mb-10">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-6">
              <p className="font-semibold text-gray-700 dark:text-gray-200 break-all mb-2">📬 Address:</p>
              <p className="text-gray-500 dark:text-gray-400 break-all mb-4">{addr.address}</p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Address Total USD: <span className="text-indigo-500 dark:text-indigo-400 font-semibold">${addr.totalUsd.toLocaleString()}</span>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {addr.values.map((val, i) => (
                  <div key={i} className="p-5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition rounded-lg shadow-md">
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-100 mb-2">{val.symbol}</p>
                    <p className="text-gray-600 dark:text-gray-300 mb-1">Qty: {val.qty}</p>
                    <p className="text-gray-600 dark:text-gray-300">Price USD: ${val.priceUsd.toLocaleString()}</p>
                    <p className="text-gray-600 dark:text-gray-300">Total USD: ${val.totalUsd.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}