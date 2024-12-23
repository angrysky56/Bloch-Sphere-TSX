import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const BlochSphere = ({ states = [] }) => {
  const [rotation, setRotation] = useState({ x: 45, y: 45, z: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  const width = 500;
  const height = 500;
  const radius = 150;
  const centerX = width / 2;
  const centerY = height / 2;

  // Matrix multiplication helper
  const multiplyMatrices = (m1, m2) => {
    const result = [];
    for (let i = 0; i < 4; i++) {
      result[i] = [];
      for (let j = 0; j < 4; j++) {
        result[i][j] = 0;
        for (let k = 0; k < 4; k++) {
          result[i][j] += m1[i][k] * m2[k][j];
        }
      }
    }
    return result;
  };

  // Create rotation matrix
  const createRotationMatrix = (rx, ry, rz) => {
    const cx = Math.cos(rx * Math.PI / 180);
    const sx = Math.sin(rx * Math.PI / 180);
    const cy = Math.cos(ry * Math.PI / 180);
    const sy = Math.sin(ry * Math.PI / 180);
    const cz = Math.cos(rz * Math.PI / 180);
    const sz = Math.sin(rz * Math.PI / 180);

    return [
      [cy*cz, -cy*sz, sy, 0],
      [cx*sz + sx*sy*cz, cx*cz - sx*sy*sz, -sx*cy, 0],
      [sx*sz - cx*sy*cz, sx*cz + cx*sy*sz, cx*cy, 0],
      [0, 0, 0, 1]
    ];
  };

  // Transform point using rotation matrix
  const transformPoint = (point, matrix) => {
    const { x, y, z } = point;
    const w = 1;
    const result = {
      x: matrix[0][0]*x + matrix[0][1]*y + matrix[0][2]*z + matrix[0][3]*w,
      y: matrix[1][0]*x + matrix[1][1]*y + matrix[1][2]*z + matrix[1][3]*w,
      z: matrix[2][0]*x + matrix[2][1]*y + matrix[2][2]*z + matrix[2][3]*w
    };
    return result;
  };

  // Generate sphere points
  const generateSpherePoints = () => {
    const points = [];
    const segments = 20;
    const rotationMatrix = createRotationMatrix(rotation.x, rotation.y, rotation.z);

    // Generate latitude lines
    for (let i = 0; i <= segments; i++) {
      const lat = (i / segments) * Math.PI;
      const latPoints = [];
      
      for (let j = 0; j <= segments; j++) {
        const lon = (j / segments) * 2 * Math.PI;
        const x = radius * Math.sin(lat) * Math.cos(lon);
        const y = radius * Math.sin(lat) * Math.sin(lon);
        const z = radius * Math.cos(lat);
        
        const transformed = transformPoint({ x, y, z }, rotationMatrix);
        const projected = {
          x: centerX + transformed.x,
          y: centerY + transformed.y,
          z: transformed.z
        };
        latPoints.push(projected);
      }
      points.push(latPoints);
    }

    return points;
  };

  // Handle mouse events for rotation
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setLastMousePos({
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;

    setRotation({
      x: rotation.x + deltaY * 0.5,
      y: rotation.y + deltaX * 0.5,
      z: rotation.z
    });

    setLastMousePos({
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Transform state points
  const transformStates = () => {
    const rotationMatrix = createRotationMatrix(rotation.x, rotation.y, rotation.z);
    
    return states.map(state => {
      const { theta, phi, label } = state;
      const x = radius * Math.sin(theta) * Math.cos(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(theta);
      
      const transformed = transformPoint({ x, y, z }, rotationMatrix);
      return {
        x: centerX + transformed.x,
        y: centerY + transformed.y,
        z: transformed.z,
        label
      };
    });
  };

  // Draw axes
  const drawAxes = () => {
    const rotationMatrix = createRotationMatrix(rotation.x, rotation.y, rotation.z);
    const axes = [
      { point: { x: radius, y: 0, z: 0 }, color: '#ff0000', label: 'X' },
      { point: { x: 0, y: radius, z: 0 }, color: '#00ff00', label: 'Y' },
      { point: { x: 0, y: 0, z: radius }, color: '#0000ff', label: 'Z' }
    ];

    return axes.map((axis, index) => {
      const transformed = transformPoint(axis.point, rotationMatrix);
      return (
        <g key={index}>
          <line
            x1={centerX}
            y1={centerY}
            x2={centerX + transformed.x}
            y2={centerY + transformed.y}
            stroke={axis.color}
            strokeWidth="2"
            opacity={transformed.z > 0 ? 1 : 0.3}
          />
          <text
            x={centerX + transformed.x * 1.1}
            y={centerY + transformed.y * 1.1}
            fill={axis.color}
            fontSize="14"
            opacity={transformed.z > 0 ? 1 : 0.3}
          >
            {axis.label}
          </text>
        </g>
      );
    });
  };

  const spherePoints = generateSpherePoints();
  const transformedStates = transformStates();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>3D Bloch Sphere</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <svg
            width={width}
            height={height}
            className="cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Draw sphere grid */}
            {spherePoints.map((latPoints, i) => (
              <g key={i}>
                <path
                  d={`M ${latPoints.map(p => `${p.x},${p.y}`).join(' L ')}`}
                  fill="none"
                  stroke="#ccc"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
              </g>
            ))}

            {/* Draw axes */}
            {drawAxes()}

            {/* Draw states */}
            {transformedStates.map((state, index) => (
              <g key={index}>
                <line
                  x1={centerX}
                  y1={centerY}
                  x2={state.x}
                  y2={state.y}
                  stroke="black"
                  strokeWidth="1"
                  strokeDasharray="4"
                  opacity={state.z > 0 ? 1 : 0.3}
                />
                <circle
                  cx={state.x}
                  cy={state.y}
                  r="4"
                  fill="black"
                  opacity={state.z > 0 ? 1 : 0.3}
                />
                <text
                  x={state.x + 10}
                  y={state.y + 10}
                  fontSize="12"
                  opacity={state.z > 0 ? 1 : 0.3}
                >
                  {state.label}
                </text>
              </g>
            ))}
          </svg>
          <div className="absolute bottom-2 left-2 text-sm text-gray-500">
            Drag to rotate
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Example usage
const BlochSphereExample = () => {
  const states = [
    { theta: Math.PI / 3, phi: Math.PI / 4, label: "State 1" },
    { theta: Math.PI / 2, phi: Math.PI / 6, label: "State 2" },
    { theta: Math.PI, phi: 0, label: "State 3" }
  ];

  return <BlochSphere states={states} />;
};

export default BlochSphereExample;