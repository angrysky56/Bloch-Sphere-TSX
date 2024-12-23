# Bloch Sphere Visualization

![image](https://github.com/user-attachments/assets/a796bd21-75bd-4fda-ad35-397ccfa413a0)

An interactive 3D visualization of the Bloch Sphere using React and TypeScript. This project provides a visual representation of quantum states on the Bloch sphere with interactive rotation and state plotting capabilities.

## Features

- Interactive 3D rotation with mouse drag
- Dynamic state plotting with customizable labels
- Real-time transformation of states and axes
- Visual depth perception with opacity changes
- Responsive SVG-based rendering

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/bloch-sphere-tsx.git
cd bloch-sphere-tsx
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## Usage

The Bloch sphere component can be used by importing it into your React application:

```typescript
import BlochSphere from './components/BlochSphere';

// Define quantum states
const states = [
  { theta: Math.PI / 3, phi: Math.PI / 4, label: "State 1" },
  { theta: Math.PI / 2, phi: Math.PI / 6, label: "State 2" }
];

// Render the component
function App() {
  return <BlochSphere states={states} />;
}
```

## Customization

You can customize various aspects of the visualization:

- Sphere dimensions
- Colors and styles
- Grid density
- State representations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
