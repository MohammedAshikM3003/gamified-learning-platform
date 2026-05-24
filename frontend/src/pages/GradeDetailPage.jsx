import React from 'react';
import { useParams, Link } from 'react-router-dom';
import worldMap from '../data/worldMap';
import SubjectKingdom from '../components/world/SubjectKingdom';

export default function GradeDetailPage() {
  const { gradeId } = useParams();
  const gradeNum = Number(gradeId);
  const world = worldMap.find((w) => w.grade === gradeNum);

  if (!world) {
    return <div style={{ padding: 20 }}>Grade not found.</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>{world.worldName} — Grade {world.grade}</h1>
      <div style={{ marginTop: 12 }}>
        {world.subjects?.length ? (
          world.subjects.map((s) => (
            <div key={s.id} style={{ marginBottom: 12 }}>
              <Link to={`/worlds/${world.grade}/${s.id}`} style={{ textDecoration: 'none' }}>
                <h3>{s.kingdomName}</h3>
              </Link>
              <SubjectKingdom kingdom={s} onOpenChapter={() => {}} />
            </div>
          ))
        ) : (
          <div>No subjects yet for this grade.</div>
        )}
      </div>
    </div>
  );
}
