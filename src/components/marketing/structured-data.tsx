import Script from "next/script";

export function StructuredData({
  id,
  data,
}: {
  id: string;
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}) {
  return (
    <Script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      id={id}
      strategy="afterInteractive"
      type="application/ld+json"
    />
  );
}
