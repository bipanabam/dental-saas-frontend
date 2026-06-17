import StatCard from "./stats-card";
import { statConfig } from "@/config/dashboard";

const StatsGrid = ({ stats }: { stats: any }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statConfig(stats).map((item) => (
        <StatCard key={item.title} {...item} />
      ))}
    </div>
  );
};

export default StatsGrid;
