import { NextRequest, NextResponse } from "next/server";
import { InternalApiResponse, MongoUndefinedError } from "../auth/route";
import { CoordinatorData } from "@/contexts/login-ctx-provider";
import { MongoClient } from "mongodb";

export interface UpdatesReqData {
  coordinator: CoordinatorData;
  message: string;
  insert_time: number;
}

export async function GET(
  req: NextRequest,
  res: NextResponse
): Promise<NextResponse<InternalApiResponse>> {
  const driver = process.env.NEXT_PUBLIC_MONGODRIVER;
  if (!driver) return MongoUndefinedError;

  const client = await MongoClient.connect(driver);
  const updates: UpdatesReqData[] = (await client
    .db()
    .collection("updates")
    .find()
    .toArray()) as unknown as UpdatesReqData[];

  if (!updates) {
    return NextResponse.json({
      success: false,
      message: "Something went wrong on our end!",
      data: updates,
    });
  }

  return NextResponse.json({
    success: true,
    message: "Updates retrieval was successfull!",
    data: updates,
  });
}

export async function POST(
  req: NextRequest,
  res: NextResponse
): Promise<NextResponse<InternalApiResponse>> {
  const driver = process.env.NEXT_PUBLIC_MONGODRIVER;
  if (!driver) return MongoUndefinedError;

  const reqData: UpdatesReqData = await req.json();

  const client = await MongoClient.connect(driver);

  client.db().collection("updates").insertOne(reqData);

  return NextResponse.json({
    success: true,
    message: "Inserted an update successfully!",
    data: {},
  });
}
