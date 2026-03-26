import { NextRequest, NextResponse } from "next/server";
import { ContentProtectionConfig, strictContentProtectionConfig, defaultContentProtectionConfig, devContentProtectionConfig } from "@/preferences/models/protection";

export type RuntimeConfig = {
  readiumServerUrl: string;
  readiumServerPort: string;
  readiumProtocol: string;
  backLinkUrl: string;
  linkServerUrl: string;
  contentProtectionConfig: ContentProtectionConfig | undefined;
};

const contentProtectionMap = {
  strict: strictContentProtectionConfig,
  dev: devContentProtectionConfig,
  default: defaultContentProtectionConfig
};

const config: RuntimeConfig = {
  readiumServerUrl: process.env.READIUM_SERVER || "",
  readiumServerPort: process.env.READIUM_PORT || "",
  readiumProtocol: process.env.READIUM_PROTOCOL || "",
  backLinkUrl: process.env.BACKLINK_URL || "",
  linkServerUrl: process.env.LINK_SERVER_URL || "",
  contentProtectionConfig: contentProtectionMap[process.env.CONTENT_PROTECTION_CONFIG as keyof typeof contentProtectionMap]
};

export async function GET(req: NextRequest) {
  return NextResponse.json(config);
}