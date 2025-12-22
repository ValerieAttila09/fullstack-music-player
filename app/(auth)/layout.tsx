export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      <div className="w-full max-w-md p-8">
        {children}
      </div>
    </div>
  );
}