import { ImageResponse } from "next/og"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f472a0, #e11d5f)",
          borderRadius: 7,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
          <path
            d="M20 2C20 2 8 14.5 8 23a12 12 0 0 0 24 0C32 14.5 20 2 20 2Z"
            fill="white"
          />
          <path
            d="M20 12c0 4.5-6 8-6 13.5a6 6 0 0 0 12 0c0-5.5-6-9-6-13.5Z"
            fill="#e11d5f"
            fillOpacity="0.55"
          />
        </svg>
      </div>
    ),
    { ...size }
  )
}
