import { CreativeShell } from "./_components/creative-shell";
import "./globals.css";

export const metadata = {
  title: "Next Creative Studio Demo",
  description:
    "Creative navigation demo with interruption-safe exits, directional history, intercepted modals, and persistent R3F stage.",
};

export default function RootLayout({ children, modal }) {
  return (
    <html lang="en">
      <body>
        <CreativeShell modal={modal}>{children}</CreativeShell>
      </body>
    </html>
  );
}
