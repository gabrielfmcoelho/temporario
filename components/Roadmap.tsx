"use client"
import { useEffect, useRef, useState } from 'react';

interface RoadmapStep {
  id: string;
  title: string;
  isPlaceholder?: boolean;
}

interface RoadmapProps {
  roadmapSteps?: RoadmapStep[];
}

const Roadmap = ({ roadmapSteps = [] }: RoadmapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [connectors, setConnectors] = useState<Array<{ start: [number, number]; end: [number, number] }>>([]);
  const [nodesPerRow, setNodesPerRow] = useState(3); // Default to 3 nodes per row

  // Reset refs on each render
  nodeRefs.current = [];

  // Function to determine nodes per row based on screen width
  const calculateNodesPerRow = () => {
    if (window.innerWidth < 640) {
      return 1; // 1 node per row for phones
    } else if (window.innerWidth < 1024) {
      return 2; // 2 nodes per row for tablets
    } else {
      return 3; // 3 nodes per row for larger screens
    }
  };

  // Update nodesPerRow on window resize
  useEffect(() => {
    const handleResize = () => {
      setNodesPerRow(calculateNodesPerRow());
    };

    // Set initial nodes per row
    handleResize();

    // Add resize event listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const groupSteps = (steps: RoadmapStep[]) => {
    if (!steps.length) return [];

    const groups = [];
    let rowIndex = 0;
    for (let i = 0; i < steps.length; i += nodesPerRow) {
      let group = steps.slice(i, i + nodesPerRow);
      const neededPlaceholders = nodesPerRow - group.length;

      // Add placeholder steps if needed
      if (neededPlaceholders > 0) {
        group = [
          ...group,
          ...Array(neededPlaceholders).fill(null).map((_, idx) => ({
            id: `placeholder-${rowIndex}-${idx}`,
            title: '',
            isPlaceholder: true
          }))
        ];
      }

      groups.push({
        nodes: group,
        reversed: rowIndex % 2 === 1 // Reverse odd rows
      });
      rowIndex++;
    }
    return groups;
  };

  useEffect(() => {
    const calculatePositions = () => {
      if (!containerRef.current || !nodeRefs.current.length) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newConnectors = [];

      // Create connections between all consecutive real nodes
      for (let i = 1; i < nodeRefs.current.length; i++) {
        const prevRef = nodeRefs.current[i - 1];
        const currentRef = nodeRefs.current[i];

        if (prevRef && currentRef) {
          const prevRect = prevRef.getBoundingClientRect();
          const currentRect = currentRef.getBoundingClientRect();

          newConnectors.push({
            start: [
              prevRect.left - containerRect.left + prevRect.width / 2,
              prevRect.top - containerRect.top + prevRect.height / 2
            ],
            end: [
              currentRect.left - containerRect.left + currentRect.width / 2,
              currentRect.top - containerRect.top + currentRect.height / 2
            ]
          });
        }
      }

      setConnectors(newConnectors);
    };

    calculatePositions();
    window.addEventListener('resize', calculatePositions);
    return () => window.removeEventListener('resize', calculatePositions);
  }, [roadmapSteps, nodesPerRow]);

  const rows = groupSteps(roadmapSteps);

  if (!roadmapSteps.length) {
    return <div className="text-center p-8 text-gray-500">No roadmap steps available</div>;
  }

  return (
    <div ref={containerRef} className="relative w-full p-8">
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {connectors.map(({ start, end }, i) => {
          const isVerticalConnection = Math.abs(start[1] - end[1]) > 50;

          return (
            <path
              key={i}
              d={isVerticalConnection
                ? `M ${start[0]} ${start[1]} Q ${(start[0] + end[0]) / 2} ${start[1] + 50} ${end[0]} ${end[1]}`
                : `M ${start[0]} ${start[1]} L ${end[0]} ${end[1]}`
              }
              stroke="#4F46E5"
              strokeWidth="2"
              fill="none"
              strokeDasharray={isVerticalConnection ? "4 4" : "0"}
            />
          );
        })}
      </svg>

      <div className="flex flex-col gap-24">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`flex ${row.reversed ? 'flex-row-reverse' : 'flex-row'} justify-around items-center gap-4`}
          >
            {row.nodes.map((step, stepIndex) => (
              step.isPlaceholder ? (
                <div
                  key={step.id}
                  className="invisible w-48"
                  aria-hidden="true"
                />
              ) : (
                <div
                  key={step.id}
                  ref={(el) => nodeRefs.current.push(el)}
                  className="relative bg-white p-6 rounded-lg shadow-lg border-2 border-indigo-200 w-48 text-center transition-all hover:scale-105 hover:shadow-xl"
                >
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                    {step.id}
                  </div>
                  <h3 className="text-indigo-600 font-semibold">{step.title}</h3>
                </div>
              )
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Roadmap;