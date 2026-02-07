import { NextRequest, NextResponse } from "next/server";

export type RuntimeConfig = {
  readiumServerUrl: string;
  readiumServerPort: string;
  readiumProtocol: string;
  backLinkUrl: string;
  linkServerUrl: string;
};

const config: RuntimeConfig = {
  readiumServerUrl: process.env.READIUM_SERVER || "",
  readiumServerPort: process.env.READIUM_PORT || "",
  readiumProtocol: process.env.READIUM_PROTOCOL || "",
  backLinkUrl: process.env.BACKLINK_URL || "",
  linkServerUrl: process.env.LINK_SERVER_URL || "",
};

export async function GET(req: NextRequest) {
  return NextResponse.json(config);
}