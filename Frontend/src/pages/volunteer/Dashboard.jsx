import React from "react";
import { AlertCircle, MapPin, ClipboardList, CheckCircle } from "lucide-react";

export default function Dashboard({ user, onToggleAvailability, activeAssignments, completedAssignments, alerts, onTabChange }) {
  const isAvailable   = user?.isAvailable ?? true;
  const activeCount   = activeAssignments.length;
  const completedCount = completedAssignments.length;
  const totalCount    = activeCount + completedCount;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20, width:"100%" }}>

      {/* Title */}
      <div className="anim-fade-in-up" style={{ marginBottom:4 }}>
        <h1 style={{ fontSize:26, fontWeight:700, color:"#0f172a", margin:"0 0 4px" }}>Volunteer Dashboard</h1>
        <p style={{ fontSize:14, color:"#64748b", margin:0 }}>Welcome, {user?.name || "Volunteer"}! Manage your assignments and availability</p>
      </div>

      {/* Availability */}
      <div className="anim-fade-in-up d-100 hover-card"
        style={{ backgroundColor:"#fff", border:`1.5px solid ${isAvailable?"#15803d":"#e2e8f0"}`, borderRadius:12, padding:"18px 24px", boxShadow:"0 1px 6px rgba(0,0,0,0.06)", transition:"border-color 0.3s ease, box-shadow 0.22s ease, transform 0.22s ease" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div>
            <h2 style={{ fontSize:17, fontWeight:600, color:"#0f172a", margin:"0 0 4px" }}>Availability Status</h2>
            <p style={{ fontSize:14, color:"#64748b", margin:0 }}>
              {isAvailable ? "You are currently available for assignments" : "You are currently unavailable for assignments"}
            </p>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <span style={{
              fontSize: 14, fontWeight: 600,
              color: isAvailable ? "#15803d" : "#94a3b8",
              transition: "color 0.3s ease",
            }}>
              {isAvailable ? "Available" : "Unavailable"}
            </span>

            {/* Toggle Switch */}
            <div
              onClick={onToggleAvailability}
              style={{
                position: "relative",
                width: 48,
                height: 26,
                borderRadius: 13,
                backgroundColor: isAvailable ? "#15803d" : "#cbd5e1",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
                flexShrink: 0,
                boxShadow: isAvailable ? "0 0 0 3px rgba(21,128,61,0.15)" : "none",
              }}
            >
              {/* Circle */}
              <div style={{
                position: "absolute",
                top: 3,
                left: 3,
                width: 20,
                height: 20,
                borderRadius: "50%",
                backgroundColor: "#fff",
                boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
                transition: "transform 0.28s ease",
                transform: isAvailable ? "translateX(22px)" : "translateX(0px)",
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Cards row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:16 }}>

        {/* Active Assignments */}
        <div className="anim-fade-in-up d-150"
          style={{ backgroundColor:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:"20px 22px", boxShadow:"0 1px 6px rgba(0,0,0,0.06)", display:"flex", flexDirection:"column", minHeight:320 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingBottom:14, borderBottom:"1px solid #f1f5f9", marginBottom:14 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <ClipboardList size={18} color="#15803d" />
              <span style={{ fontSize:15, fontWeight:600, color:"#0f172a" }}>Active Assignments</span>
            </div>
            <button onClick={()=>onTabChange("assignments")} style={{ background:"none", border:"none", cursor:"pointer", fontSize:13, fontWeight:600, color:"#15803d", fontFamily:"inherit", transition:"opacity 0.2s" }}
              onMouseEnter={e=>e.target.style.opacity=0.7} onMouseLeave={e=>e.target.style.opacity=1}>
              View All →
            </button>
          </div>
          <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:10 }}>
            {activeAssignments.length === 0 ? (
              <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", color:"#94a3b8", gap:8 }}>
                <CheckCircle size={32} color="#e2e8f0" />
                <span style={{ fontSize:13 }}>No active assignments</span>
              </div>
            ) : activeAssignments.slice(0,2).map((item,i)=>(
              <div key={item.id} style={{ border:"1px solid #f1f5f9", borderRadius:10, padding:"12px 14px", backgroundColor:"#f8fafc",
                transition:"background-color 0.2s ease, transform 0.2s ease", cursor:"default" }}
                onMouseEnter={e=>{e.currentTarget.style.backgroundColor="#f1f5f9";e.currentTarget.style.transform="translateX(3px)"}}
                onMouseLeave={e=>{e.currentTarget.style.backgroundColor="#f8fafc";e.currentTarget.style.transform="translateX(0)"}}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                  <span style={{ fontSize:14, fontWeight:600, color:"#0f172a" }}>{item.disaster}</span>
                  <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, textTransform:"uppercase",
                    backgroundColor: item.status==="in-progress"?"#fef3c7":"#e0f2fe",
                    color:           item.status==="in-progress"?"#92400e":"#0369a1" }}>
                    {item.status}
                  </span>
                </div>
                <p style={{ fontSize:13, color:"#64748b", margin:"0 0 6px" }}>{item.task}</p>
                <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#94a3b8" }}>
                  <MapPin size={12} /><span>{item.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="anim-fade-in-up d-200"
          style={{ backgroundColor:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:"20px 22px", boxShadow:"0 1px 6px rgba(0,0,0,0.06)", display:"flex", flexDirection:"column", minHeight:320 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingBottom:14, borderBottom:"1px solid #f1f5f9", marginBottom:14 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <AlertCircle size={18} color="#dc2626" />
              <span style={{ fontSize:15, fontWeight:600, color:"#0f172a" }}>Recent Alerts</span>
            </div>
            <button onClick={()=>onTabChange("alerts")} style={{ background:"none", border:"none", cursor:"pointer", fontSize:13, fontWeight:600, color:"#15803d", fontFamily:"inherit", transition:"opacity 0.2s" }}
              onMouseEnter={e=>e.target.style.opacity=0.7} onMouseLeave={e=>e.target.style.opacity=1}>
              View All →
            </button>
          </div>
          <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:10 }}>
            {alerts.length === 0 ? (
              <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", color:"#94a3b8", fontSize:13 }}>No active alerts</div>
            ) : alerts.slice(0,3).map(alert=>{
              const cfg = alert.priority==="high"
                ? { bg:"#fef2f2", color:"#dc2626", border:"#fecaca" }
                : alert.priority==="medium"
                ? { bg:"#fffbeb", color:"#d97706", border:"#fde68a" }
                : { bg:"#f0fdf4", color:"#16a34a", border:"#bbf7d0" };
              return (
                <div key={alert.id} style={{ borderRadius:10, padding:"12px 14px", backgroundColor:cfg.bg, border:`1px solid ${cfg.border}`,
                  transition:"transform 0.2s ease" }}
                  onMouseEnter={e=>e.currentTarget.style.transform="translateX(3px)"}
                  onMouseLeave={e=>e.currentTarget.style.transform="translateX(0)"}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, backgroundColor:"#fff", color:cfg.color, textTransform:"uppercase" }}>
                      {alert.priority}
                    </span>
                    <span style={{ fontSize:11, color:"#94a3b8" }}>{alert.time}</span>
                  </div>
                  <p style={{ fontSize:13, color:"#374151", fontWeight:500, margin:0, lineHeight:1.5 }}>{alert.message}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:16 }}>
        {[
          { label:"Total Assignments", value:totalCount,    color:"#15803d" },
          { label:"Active Tasks",      value:activeCount,   color:"#d97706" },
          { label:"Completed",         value:completedCount, color:"#16a34a" },
        ].map(({label,value,color},i)=>(
          <div key={label} className={`anim-fade-in-up hover-card d-${(i+2)*100}`}
            style={{ backgroundColor:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:"22px 16px",
              boxShadow:"0 1px 6px rgba(0,0,0,0.06)", textAlign:"center" }}>
            <div style={{ fontSize:36, fontWeight:700, color, marginBottom:6 }}>{value}</div>
            <div style={{ fontSize:12, color:"#94a3b8", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em" }}>{label}</div>
          </div>
        ))}
      </div>

    </div>
  );
}
