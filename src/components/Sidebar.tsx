import { MessageSquare, Calendar, ExternalLink, Users, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink } from "./NavLink";

const menuItems = [
  { icon: MessageSquare, label: "Chat Assistant", path: "/" },
  { icon: Calendar, label: "Timetable", path: "/timetable" },
  { icon: ExternalLink, label: "ERP Portal", path: "/erp", external: true },
  { icon: Users, label: "Faculty Directory", path: "/faculty", external: true },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-gradient-primary text-white flex flex-col">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg">GEHU Assistant</h1>
            <p className="text-xs text-white/80">Graphic Era Hill University</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            if (item.external) {
              return (
                <a
                  key={item.path}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  <ExternalLink className="w-4 h-4 ml-auto" />
                </a>
              );
            }
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
                activeClassName="bg-white/20"
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="bg-white/10 rounded-lg p-4">
          <p className="text-xs font-medium mb-2">Quick Stats</p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-white/70">Campus Status</span>
              <span className="font-medium">Online</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/70">Language</span>
              <span className="font-medium">EN</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
