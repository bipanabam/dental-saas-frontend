interface Props {
  children: React.ReactNode;
}

const AnalyticsGrid = ({ children }: Props) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {children}
    </div>
  );
}

export default AnalyticsGrid;
