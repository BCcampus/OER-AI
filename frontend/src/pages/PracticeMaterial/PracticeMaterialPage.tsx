import Header from "@/components/Header";
import StudentSideBar from "@/components/ChatInterface/StudentSideBar";
import { SidebarProvider } from "@/providers/SidebarContext";

export default function PracticeMaterialPage() {
  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <div className="pt-[70px] flex-1 flex">
          <StudentSideBar textbookTitle={""} textbookAuthor={""} />
          <main className="md:ml-64 flex flex-col flex-1 items-start justify-start max-w-screen">
            <div className="w-full max-w-2xl 2xl:max-w-3xl px-4 py-8">
              {/* blank */}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
