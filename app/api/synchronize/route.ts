import { CoordinatorData } from "@/contexts/login-ctx-provider";
import { MongoClient, WithId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { InternalApiResponse } from "../auth/route";

export async function GET(
  req: NextRequest,
  res: NextResponse
): Promise<NextResponse<InternalApiResponse>> {
  const driver = process.env.NEXT_PUBLIC_MONGODRIVER;
  if (!driver)
    return NextResponse.json({
      success: false,
      message: "Something went wrong on our side!",
      data: {},
    });

  const client = await MongoClient.connect(driver);
  const data = (
    await client.db().collection("syncrhonize").find().toArray()
  )[0] as unknown as { time: number };

  return NextResponse.json({
    success: true,
    message: "Synchronizing with the database",
    data,
  });
}

export async function POST(
  req: NextRequest,
  res: NextResponse
): Promise<NextResponse<InternalApiResponse>> {
  return NextResponse.json({
    success: true,
    message: "Api endpoint is up and running",
    data: {},
  });
}
