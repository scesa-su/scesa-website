import { ImageResponse } from "next/og";

export const alt = "SCESA: Where Strathmore's Tech Pioneers Build the Future";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#161A51",
          color: "#FEFEFE",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 6, color: "#A2D2FA" }}>
          SCESA · STRATHMORE UNIVERSITY
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 88, fontWeight: 700, lineHeight: 1, letterSpacing: -3 }}>
          <span>Where Strathmore&apos;s</span>
          <span>Tech Pioneers</span>
          <span style={{ color: "#FF7A3F" }}>Build the Future</span>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#C1D5FF" }}>scesa.co.ke</div>
      </div>
    ),
    size,
  );
}
