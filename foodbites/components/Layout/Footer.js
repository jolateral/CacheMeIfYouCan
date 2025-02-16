export default function Footer() {
  return (
    <footer className="text-center p-4 text-gray-600 text-sm border-t">
      <div className="max-w-6xl mx-auto">
        © {new Date().getFullYear()} LifeBites. All rights reserved.
      </div>
    </footer>
  );
}