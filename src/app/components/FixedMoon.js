const FixedMoon = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: "60%", // Adjusted to be lower
        left: "50%",
        transform: "translateX(-50%) rotate3d(1, 1, 0, 45deg)", // 3D rotation
        zIndex: "-1", // Ensure it's in the background
        animation: "float 10s ease-in-out infinite", // Optional floating effect
      }}
    >
      <img
        src="/assets/moon.png" // Replace with the moon image path
        alt="Moon"
        style={{
          transform: "scale(1.5)",
          filter: "drop-shadow(0px 0px 15px rgba(255, 255, 255, 0.5))", // Adds glowing effect
        }}
      />
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) scale(1.5);
          }
          50% {
            transform: translateY(-20px) scale(1.6);
          }
          100% {
            transform: translateY(0) scale(1.5);
          }
        }
      `}</style>
    </div>
  );
};

export default FixedMoon;