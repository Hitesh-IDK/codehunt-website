import { CoordinatorData } from "@/contexts/login-ctx-provider";
import { MongoClient, WithId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { InternalApiResponse } from "../auth/route";

export interface RouteReqData {
  route_id: number;
}

export interface LocationData {
  location_id: number;
  reference_id: number;
  name: string;
}

export interface RouteData {
  route_id: number;
  location: LocationData[];
}

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
  if (!driver)
    return NextResponse.json({
      success: false,
      message: "Something went wrong on our side!",
      data: {},
    });

  const reqData: RouteReqData = await req.json();

  const client = await MongoClient.connect(driver);
  const route: RouteData | null = (await client
    .db()
    .collection("routes")
    .findOne({
      route_id: reqData.route_id,
    })) as unknown as RouteData;

  if (!route) {
    return NextResponse.json({
      success: false,
      message: "Invalid Route ID, check again!",
      data: {},
    });
  }
  return NextResponse.json({
    success: true,
    message: "Route found, ready to use",
    data: route,
  });
}
