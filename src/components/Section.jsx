const Section = ({ title, children }) => (
  <div className="container section">
    <div className="card" style={{ padding: 20 }}>
      <div style={header}>
        <h3>{title}</h3>
        <span style={{ color: "#3b82f6" }}>View All</span>
      </div>

      <div style={{ marginTop: 12 }}>{children}</div>
    </div>
  </div>
);

const header = {
  display: "flex",
  justifyContent: "space-between",
};

export default Section;