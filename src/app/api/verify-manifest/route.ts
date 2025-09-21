import { NextResponse } from "next/server";

// This function runs on the server
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const manifestUrl = searchParams.get("url");
  
  if (!manifestUrl) {
    return NextResponse.json(
      { error: "URL parameter is required" },
      { status: 400 }
    );
  }

  try {
    // Parse the URL to extract the domain
    const url = new URL(manifestUrl);
    
    // Get allowed domains from environment
    const allowedDomainsRaw = process.env.MANIFEST_ALLOWED_DOMAINS?.trim() || "";
    const allowedDomains = allowedDomainsRaw
      .split(",")
      .map(d => d.trim())
      .filter(Boolean);

    // In development or if no domains are specified, allow all
    const allowAllDomains = 
      process.env.NODE_ENV !== "production" || 
      allowedDomains.length === 0 ||
      allowedDomains.includes("*");

    const isAllowed = allowAllDomains || 
      allowedDomains.some(domain => {
        try {
          const domainUrl = domain.startsWith("http") 
            ? new URL(domain) 
            : new URL(`https://${ domain }`);
          return url.hostname === domainUrl.hostname;
        } catch {
          return false;
        }
      });
    
    if (!isAllowed) {
      return NextResponse.json(
        { error: "Domain not allowed" },
        { status: 403 }
      );
    }
    
    // If domain is allowed, return success
    return NextResponse.json({ 
      allowed: true,
      url: manifestUrl
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid URL" },
      { status: 400 }
    );
  }
}
