export const metadata = {
  title: "The Life Writing Program | just have a little meaning",
  description:
    "A guided writing process designed to help you understand your past, clarify your present, and intentionally shape your future.",
};

export default function ProgramLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {children}
    </div>
  );
}
