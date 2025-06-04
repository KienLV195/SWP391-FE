import React from "react";

const steps = [
    { label: "KIỂM TRA LẠI THÔNG TIN", icon: "person" },
    { label: "ĐIỀN THỜI GIAN VÀ ĐỊA ĐIỂM", icon: "alarm" },
    { label: "ĐIỀN PHIẾU HIẾN MÁU", icon: "list" },
];

const iconMap = {
    person: <i className="bi bi-person" style={{ fontSize: 28 }}></i>,
    alarm: <i className="bi bi-alarm" style={{ fontSize: 28 }}></i>,
    list: <i className="bi bi-list-task" style={{ fontSize: 28 }}></i>,
    check: <i className="bi bi-check-lg" style={{ fontSize: 32, color: "#fff" }}></i>,
};

const Slidebar = ({ step, infoValid }) => (
    <div style={{ background: "#02314B", color: "#fff", width: 320, minHeight: 500, borderRadius: "32px 0 0 32px", padding: 36, display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center" }}>
        <h2 style={{ fontWeight: 800, fontSize: 28, marginBottom: 32 }}>ĐẶT LỊCH HIẾN MÁU</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 0, width: "100%", alignItems: "flex-start" }}>
            {steps.map((s, idx) => (
                <div key={s.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 18, width: "100%" }}>
                        <div style={{
                            width: 64,
                            height: 64,
                            borderRadius: "50%",
                            background: idx === step ? "#e53935" : (idx < step || (idx === 0 && infoValid)) ? "#e53935" : "#f36b7f",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: idx === 0 && infoValid ? "2px solid #e53935" : "2px solid #fff",
                            transition: "all 0.2s"
                        }}>
                            {idx === 0 && infoValid
                                ? iconMap.check
                                : iconMap[s.icon]}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: 18, color: idx === step ? "#e53935" : "#fff" }}>{s.label}</span>
                    </div>
                    {idx < steps.length - 1 && (
                        <div style={{ height: 48, display: "flex", alignItems: "center" }}>
                            <div style={{ width: 4, height: 48, background: "#e53935", margin: "0 auto" }}></div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    </div>
);

export default Slidebar;
