import React from 'react';
import GradeWorldMap from '../components/world/GradeWorldMap';
import { useNavigate } from 'react-router-dom';

export default function WorldPage() {
  const navigate = useNavigate();

  function handleOpenWorld(world) {
    if (!world) return;
    navigate(`/worlds/${world.grade}`);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Worlds</h1>
      <GradeWorldMap onOpenWorld={handleOpenWorld} />
    </div>
  );
}
