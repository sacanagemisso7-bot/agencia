"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    posthog?: {
      capture: (event: string, properties?: Record<string, unknown>) => void;
    };
  }
}

export function Analytics({
  gaMeasurementId,
  posthogKey,
  posthogHost,
}: {
  gaMeasurementId?: string;
  posthogKey?: string;
  posthogHost?: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUrl = `${pathname}${searchParams?.size ? `?${searchParams.toString()}` : ""}`;

  useEffect(() => {
    if (gaMeasurementId && typeof window.gtag === "function") {
      window.gtag("config", gaMeasurementId, {
        page_path: currentUrl,
      });
    }

    if (posthogKey && typeof window.posthog?.capture === "function") {
      window.posthog.capture("$pageview", {
        $current_url: currentUrl,
      });
    }
  }, [currentUrl, gaMeasurementId, posthogKey]);

  return (
    <>
      {gaMeasurementId ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`} strategy="afterInteractive" />
          <Script
            id="ga4"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '${gaMeasurementId}', { send_page_view: false });
              `,
            }}
          />
        </>
      ) : null}

      {posthogKey ? (
        <Script
          id="posthog"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){
              function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){
              t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}
              (p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,
              p.src='${posthogHost ?? "https://app.posthog.com"}/static/array.js',
              (r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);
              var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],
              u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},
              u.people.toString=function(){return u.toString(1)+".people"},o="capture identify alias people.set people.set_once reset group set_config".split(" "),n=0;n<o.length;n++)g(u,o[n]);
              e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
              window.posthog.init('${posthogKey}', {
                api_host: '${posthogHost ?? "https://app.posthog.com"}',
                capture_pageview: false,
                autocapture: true,
              });
            `,
          }}
        />
      ) : null}
    </>
  );
}
