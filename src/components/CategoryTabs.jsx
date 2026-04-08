const CategoryTabs = () => {
  return (
    <div className="container" style={styles.wrapper}>
      <button style={{ ...styles.tab, background: "#3b82f6" }}>
        Marketplace
      </button>

      <button style={{ ...styles.tab, background: "#10b981" }}>
        Student Services
      </button>

      <button style={{ ...styles.tab, background: "#f59e0b" }}>
        Campus Jobs
      </button>

      <button style={{ ...styles.tab, background: "#ef4444" }}>
        Events
      </button>
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    gap: "12px",
    marginTop: "-20px",
  },

  tab: {
    flex: 1,
    padding: "12px",
    border: "none",
    color: "#fff",
    borderRadius: "8px",
    fontWeight: 600,
  },
};

export default CategoryTabs;