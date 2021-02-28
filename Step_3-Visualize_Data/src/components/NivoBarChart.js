// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/bar
import { ResponsiveBar } from "@nivo/bar";
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

// Define patterns and gradients.
const defs = [
  {
    id: "dots",
    type: "patternDots",
    background: "inherit",
    color: "#38bcb2",
    size: 4,
    padding: 1,
    stagger: true,
  },
  {
    id: "lines",
    type: "patternLines",
    background: "inherit",
    color: "#eed312",
    rotation: -45,
    lineWidth: 6,
    spacing: 10,
  },
];

// Define rules to apply patterns and gradients
const fill = [
  {
    match: {
      id: "fries",
    },
    id: "dots",
  },
  {
    match: {
      id: "sandwich",
    },
    id: "lines",
  },
];

const axisBottom = {
  tickSize: 5,
  tickPadding: 5,
  tickRotation: 0,
  legend: "Documents Count",
  legendPosition: "middle",
  legendOffset: 32,
};

const axisLeft = {
  tickSize: 10,
  tickPadding: 5,
  tickRotation: 0,
  legendPosition: "middle",
  legendOffset: -40,
};

const legends = [
  {
    dataFrom: "keys",
    anchor: "bottom-right",
    direction: "column",
    justify: false,
    translateX: 120,
    translateY: 0,
    itemsSpacing: 2,
    itemWidth: 100,
    itemHeight: 20,
    itemDirection: "left-to-right",
    itemOpacity: 0.85,
    symbolSize: 20,
    effects: [
      {
        on: "hover",
        style: {
          itemOpacity: 1,
        },
      },
    ],
  },
];

const NivoBarChart = ({ data, keys /* see data tab */ }) => {
  return (
    <ResponsiveBar
      data={data}
      keys={keys}
      indexBy="topic"
      enableGridX={true}
      enableGridY={false}
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      groupMode="grouped"
      layout="horizontal"
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "nivo" }}
      defs={defs}
      fill={fill}
      borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      axisTop={null}
      axisRight={null}
      axisBottom={axisBottom}
      axisLeft={axisLeft}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      legends={legends}
      animate={true}
      motionStiffness={90}
      motionDamping={15}
    />
  );
};

export default NivoBarChart;
