function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-xl border border-gray-800 bg-gray-950 p-6 shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;
