import { NextRequest } from "next/server";
import { validateRequest, okResponse } from "@/app/lib/apiAuth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const auth = await validateRequest(request);
  if (!auth.valid) return auth.response;

  const { slug } = await params;
  return okResponse("DYNAMIC", { message: `Hello ${slug}!` }, "Success");
}
