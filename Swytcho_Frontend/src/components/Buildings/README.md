# SWYTCHO 3D Building demo

## 1. Install dependencies

```bash
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three
```

## 2. Add the model

Create `public/models/` and copy the uploaded GLB into it as:

`public/models/residential-building.glb`

## 3. Render the component

```tsx
import Building3D from './components/Building3D';

export default function TowerCommonPlaceholder() {
  return <Building3D floorCount={20} flatsPerFloor={3} />;
}
```

Put `Building3D.tsx` and `Building3D.css` in the same component folder. Adjust `floorCount` and `flatsPerFloor` to your configured society.

## Important data note

This version uses illustrative demo loads and meter statuses. The visual floor zones are generated from the configured floor count; they are not extracted architectural floor meshes. To show actual current consumption, replace `makeDemoData` with data from your FastAPI/Supabase endpoint and map each floor/flat to its real IDs and latest meter readings.
