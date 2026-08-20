import React from "react";
import UnifiedApplyPage from "../page";

export default async function LegacyTypeApplyPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  return <UnifiedApplyPage searchParams={Promise.resolve({ tab: type })} />;
}