import React from "react";
import { LayoutDashboard, ClipboardList, Award, Bell, User } from "lucide-react";
import { useTranslation } from "react-i18next";

const ITEMS = [
  { id: "dashboard",   key: "sidebar.dashboard",   Icon: LayoutDashboard },
  { id: "assignments", key: "sidebar.assignments",  Icon: ClipboardList   },
  { id: "skills",      key: "sidebar.skills",       Icon: Award           },
  { id: "alerts",      key: "sidebar.alerts",       Icon: Bell            },
  { id: "profile",     key: "sidebar.profile",      Icon: User            },
];

export default function Sidebar({ activeTab, onTabChange }) {
  const { t } = useTranslation();

  return (
    <aside style={{ width:240, minWidth:240, height:"100%", backgroundColor:"#fff", borderRight:"1px solid #e2e8f0",
      padding:"16px 12px", display:"flex", flexDirection:"column", gap:4, overflowY:"auto" }}>
      {ITEMS.map(({ id, key, Icon }, i) => {
        const active = activeTab === id;
        return (
          <button key={id} onClick={() => onTabChange(id)}
            className={`sidebar-item anim-fade-in-left d-${(i+1)*50}`}
            style={{
              width:"100%", display:"flex", alignItems:"center", gap:12,
              padding:"11px 14px", borderRadius:10, border:"none", cursor:"pointer",
              fontFamily:"inherit", fontSize:14, fontWeight:500, textAlign:"left",
              backgroundColor: active ? "rgba(21,128,61,0.10)" : "transparent",
              color: active ? "#15803d" : "#64748b",
            }}>
            <Icon size={18} color={active ? "#15803d" : "#94a3b8"} />
            {t(key)}
          </button>
        );
      })}
    </aside>
  );
}
