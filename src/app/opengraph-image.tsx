import { ImageResponse } from "next/og";

import { getBrandDescription, getBrandSlogan } from "@/lib/brand";
import { getSiteName } from "@/lib/seo";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "#060b14",
          color: "white",
          padding: "64px",
          position: "relative",
          fontFamily: "sans-serif",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at top left, rgba(40,199,165,0.26), transparent 28%), radial-gradient(circle at 85% 0%, rgba(78,155,192,0.22), transparent 24%), radial-gradient(circle at 50% 100%, rgba(27,49,91,0.2), transparent 30%)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            position: "relative",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "28px",
            padding: "56px",
            background: "rgba(255,255,255,0.04)",
          }}
        >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}
          >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 22,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 96,
                    height: 96,
                    borderRadius: 28,
                    background: "white",
                  }}
                >
                  <svg fill="none" viewBox="0 0 66 58" xmlns="http://www.w3.org/2000/svg" style={{ width: 64, height: 56 }}>
                    <path d="M12 47H24L37 11H25L12 47Z" fill="#28C7A5" />
                    <path d="M40 11H52L65 47H53L40 11Z" fill="#1B315B" />
                    <path d="M18 37H32L39 25H52L48 33H36L29 45H14L18 37Z" fill="#1B315B" />
                    <path d="M29 41H47L52 51H24L29 41Z" fill="#28C7A5" />
                  </svg>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      fontSize: 54,
                      fontWeight: 700,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {getSiteName()}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      fontSize: 18,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.58)",
                    }}
                  >
                    {getBrandSlogan()}
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  padding: "12px 18px",
                  borderRadius: "999px",
                  background: "rgba(40,199,165,0.14)",
                  color: "#9bf1de",
                  fontSize: 18,
                  textTransform: "uppercase",
                  letterSpacing: "0.16em",
                }}
              >
                Clareza | Operacao | Resultado
              </div>
            </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              maxWidth: 860,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 72,
                lineHeight: 1.02,
                fontWeight: 700,
              }}
            >
              {getBrandSlogan()}.
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 28,
                lineHeight: 1.45,
                color: "rgba(255,255,255,0.68)",
              }}
            >
              {getBrandDescription()}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
