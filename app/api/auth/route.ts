import { CoordinatorData } from "@/contexts/login-ctx-provider";
import { MongoClient, WithId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export interface InternalApiResponse {
  success: boolean;
  message: string;
  data: any;
}

export interface AuthReqData {
  coordinator_id: string;
}

export const MongoUndefinedError: NextResponse<InternalApiResponse> =
  NextResponse.json({
    success: false,
    message: "Something went wrong on our side!",
    data: {},
  });

export async function GET(
  req: NextRequest,
  res: NextResponse
): Promise<NextResponse<InternalApiResponse>> {
  return NextResponse.json({
    success: true,
    message: "Api endpoint is up and running",
    data: {},
  });
}

export async function POST(
  req: NextRequest,
  res: NextResponse
): Promise<NextResponse<InternalApiResponse>> {
  const driver = process.env.NEXT_PUBLIC_MONGODRIVER;
  if (!driver) return MongoUndefinedError;

  const reqData: AuthReqData = await req.json();

  const client = await MongoClient.connect(driver);
  const coordinator: CoordinatorData | null = (await client
    .db()
    .collection("coordinators")
    .findOne({ code: reqData.coordinator_id })) as unknown as CoordinatorData;

  if (!coordinator) {
    return NextResponse.json({
      success: false,
      message: "Invalid Coordinator ID, check again!",
      data: {},
    });
  }
  return NextResponse.json({
    success: true,
    message: "Logging in now....",
    data: coordinator,
  });
}
