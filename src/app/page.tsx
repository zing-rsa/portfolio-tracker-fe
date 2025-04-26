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

const API_HOST = "https://prt-tracker-zing.deno.dev"
const API_KEY = "JtEhz6eCcnMDvGvrdMvCVOVpSuv7DeLmt1fr5zPTHAJbOWM5HoXHfDL69WSXrgMo"

export default function Dashboard() {
  const [historicData, setHistoricData] = useState([]);
  const [currentData, setCurrentData] = useState<CurrentBalanceResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [histRes, currRes] = await Promise.all([
          fetch(`${API_HOST}/api/v1/balances/historic`, { headers: { "x-api-key": API_KEY}}),
          fetch(`${API_HOST}/api/v1/balances`, { headers: { "x-api-key": API_KEY}})
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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Portfolio Dashboard</h1>

      {/* Historic Data Chart */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Historic Total Value</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={historicData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="#4F46E5" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Current Balances */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Current Balances</h2>
        <p className="text-xl font-medium mb-2">
          Total USD: <span className="text-indigo-600">${currentData.totalUsd.toLocaleString()}</span>
        </p>
        {currentData.addresses.map((addr: AddressBalance, idx: number) => (
          <div key={idx} className="mb-6">
            <p className="font-semibold break-all mb-1">Address: {addr.address}</p>
            <p className="mb-2">Address Total USD: ${addr.totalUsd.toLocaleString()}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {addr.values.map((val, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-lg shadow-sm">
                  <p className="font-semibold">{val.symbol}</p>
                  <p>Qty: {val.qty}</p>
                  <p>Total USD: ${val.totalUsd.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}