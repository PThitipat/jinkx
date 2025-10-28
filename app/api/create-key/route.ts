import { NextResponse } from "next/server";
import axios from "axios";

const NODE_SERVER_URL = process.env.NEXT_PUBLIC_LOCAL_API_URL!;
// const LOCAL_API_KEY = process.env.NEXT_PUBLIC_LOCAL_API_KEY!;

export async function POST() {
  try {
    const response = await axios.post(
      NODE_SERVER_URL,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "d0b09baf596osjk4gadh4bzi286z34hgzx566r4hjzalpou37cfc7b0ab",
        },
        timeout: 10000,
      }
    );

    return NextResponse.json(response.data);
  } catch (err: any) {
    console.error("Error forwarding to Node server:", err?.response?.data ?? err.message);
    return NextResponse.json(
      { error: err?.response?.data || "Internal Server Error" },
      { status: err?.response?.status || 500 }
    );
  }
}