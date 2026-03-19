import { AppSidebar } from "./AppSidebar";
import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      {/* Content area offset by sidebar width */}
      <main className="ml-[60px] flex-1 overflow-auto">
        <div className="mx-auto max-w-[1200px] px-6 py-6 lg:px-10 lg:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
