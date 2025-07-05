import type { PropsWithChildren } from "react";

export default function ContentsArea({ children }: PropsWithChildren) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "var(--width-content)",
        margin: "0 auto",
      }}
    >
      {children}
    </div>
  );
}
