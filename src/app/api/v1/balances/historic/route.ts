import { NextRequest, NextResponse } from "next/server";

import { API_HOST, API_KEY } from "../../../constants"

export async function GET(req: NextRequest) {

  const response = await fetch(`${API_HOST}/api/v1/balances/historic`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY!
    },
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status })
}
