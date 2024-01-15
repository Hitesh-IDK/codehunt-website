import { CoordinatorData } from "@/contexts/login-ctx-provider";
import { MongoClient } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export interface InternalApiResponse {
  success: boolean;
  message: string;
  data: Object | any;
}

export interface AuthReqData {
  coordinator_id: string;
}

// export const MongoUndefinedError: NextResponse<InternalApiResponse> =
//   NextResponse.json({
//     success: false,
//     message: "Something went wrong on our side!",
//     data: {},
//   });

export async function GET(): Promise<NextResponse<InternalApiResponse>> {
  return NextResponse.json({
    success: true,
    message: "Api endpoint is up and running",
    data: {},
  });
}

export async function POST(
  req: NextRequest
): Promise<NextResponse<InternalApiResponse>> {
  const driver = process.env.NEXT_PUBLIC_MONGODRIVER;
  if (!driver)
    return NextResponse.json({
      success: false,
      message: "Something went wrong on our side!",
      data: {},
    });

  const reqData: AuthReqData = await req.json();

  const client = await MongoClient.connect(driver);
  if (!client)
    return NextResponse.json({
      success: false,
      message: "Driver is missing",
      data: {},
    });

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
