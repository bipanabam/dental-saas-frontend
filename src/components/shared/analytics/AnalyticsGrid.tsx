interface Props {
  children: React.ReactNode;
  className?: string;
}

const AnalyticsGrid = ({ children, className }: Props) => {
  return (
    <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {children}
    </div>
  );
}

export default AnalyticsGrid;
