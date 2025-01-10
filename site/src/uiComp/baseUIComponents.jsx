export function PageMargin({ children }) {
  return (
    <div
      style={{
        margin: "100px",
      }}
    >
      {children}
    </div>
  );
}

export function Container({ children, type }) {
  return <div class={"container" + type + " container"}>
    {children}
  </div>;
}

export function CtaContainer({ children, color }) {
  return <div class={"ctainer" + color + " ctainer"}>
  {children}
</div>;
}