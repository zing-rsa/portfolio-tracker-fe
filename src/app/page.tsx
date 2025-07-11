"use client"

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AddressBalance, CurrentBalanceResponse, HistoricBalance } from "./types";

const NEXT_API_HOST = process.env.NEXT_PUBLIC_API_HOST;

export default function Dashboard() {
  const [historicData, setHistoricData] = useState([]);
  const [currentData, setCurrentData] = useState<CurrentBalanceResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [histRes, currRes] = await Promise.all([
          fetch(`${NEXT_API_HOST}/api/v1/balances/historic`),
          fetch(`${NEXT_API_HOST}/api/v1/balances`),
        ]);
        const [histJson, currJson] = await Promise.all([
          histRes.json(),
          currRes.json(),
        ]);
        const formatted = histJson.map((item: HistoricBalance) => ({
          date: new Date(item.date).toLocaleDateString(),
          total: item.total,
        }));
        setHistoricData(formatted);
        setCurrentData(currJson);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading || !currentData)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <span className="text-lg text-muted-foreground">Loading portfolio...</span>
      </div>
    );

  return (
    <main className="min-h-screen bg-[#0f0f11] py-10 px-4 md:px-0 text-white">
      <div className="max-w-5xl mx-auto flex flex-col gap-10">
        
        {/* Dashboard Overview */}
        <Card className="bg-[#1a1a1d] border border-[#2c2c31] shadow-xl rounded-2xl p-8 transition hover:shadow-2xl">
          <CardHeader className="flex flex-col items-center gap-3">
            <CardTitle className="text-4xl font-bold tracking-tight text-white">
              Portfolio Dashboard
            </CardTitle>
          </CardHeader>

          <div className="w-full h-72 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="#2f2f2f" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#888' }} />
                <YAxis tick={{ fontSize: 12, fill: '#888' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', backgroundColor: '#23272f', color: '#fff' }} />
                <Line type="monotone" dataKey="total" stroke="#7dd3fc" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Current Balances */}
        <Card className="bg-[#1a1a1d] border border-[#2c2c31] shadow-xl rounded-2xl p-8">
          <CardHeader className="mb-6">
            <CardTitle className="text-2xl font-semibold text-white">Current Balances</CardTitle>
          </CardHeader>

          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
            <div className="flex-1">
              <p className="text-sm text-gray-400 mb-1">Total USD</p>
              <h3 className="text-3xl font-bold text-white">${currentData.totalUsd.toLocaleString()}</h3>
            </div>
          </div>

          {/* Addresses & Tokens */}
          <div className="flex flex-col gap-8">
            {currentData.addresses.map((addr: AddressBalance, idx: number) => (
              <div
                key={idx}
                className="bg-[#212124] border border-[#2e2e33] rounded-xl p-6 flex flex-col gap-4"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <Avatar className="bg-white/10 text-white" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold break-all text-white">{addr.address}</h3>
                    <p className="text-sm text-gray-400">
                      Address Total USD:{" "}
                      <span className="text-white font-semibold">
                        ${addr.totalUsd.toLocaleString()}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {addr.values.map((val, i) => (
                    <div
                      key={i}
                      className="bg-[#29292d] border border-[#3b3b40] rounded-md p-4 hover:bg-[#323238] transition"
                    >
                      <h4 className="text-base font-semibold text-white mb-1">{val.symbol}</h4>
                      <p className="text-sm text-gray-400">Qty: {val.qty}</p>
                      <p className="text-sm text-gray-400">Price USD: ${val.priceUsd.toLocaleString()}</p>
                      <p className="text-sm text-white font-semibold">
                        Total USD: ${val.totalUsd.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
}