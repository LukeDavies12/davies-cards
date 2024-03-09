"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Switch } from "@/components/ui/switch"; // Make sure this path is correct
import { Label } from "@/components/ui/label"; // Make sure this path is correct
// Dynamic import for the ParticipantChart to disable SSR
const ParticipantChart = dynamic(() => import("../charts/mainCharts"), {
  ssr: false,
});
const PointsChart = dynamic(() => import("../charts/pointsChart"), {
  ssr: false,
});

// Define a TypeScript interface for the component props
interface SwitchChartsProps {
  percNames: string[];
  winPercentages: number[];
  pointsNames: string[];
  points: number[];
}

const SwitchCharts: React.FC<SwitchChartsProps> = ({
  percNames,
  winPercentages,
  pointsNames,
  points,
}) => {
  // State to track the switch position
  const [showNormalized, setShowNormalized] = useState(false);
  const handleChange = () => {
    setShowNormalized(!showNormalized);
    console.log("Switch toggled. New state: ", !showNormalized);
  };

  return (
    <div>
      {showNormalized ? (
        <PointsChart
          names={pointsNames}
          points={points}
          height={350}
          width={1000}
        />
      ) : (
        <ParticipantChart
          names={percNames}
          winPercentages={winPercentages}
          height={350}
          width={1000}
        />
      )}
      <div className="flex items-center space-x-2">
        <Switch
          checked={showNormalized}
          onCheckedChange={handleChange}
          id="points-table"
        />
        <Label htmlFor="points-table">Show Normalized Points Chart</Label>
      </div>
    </div>
  );
};

export default SwitchCharts;
