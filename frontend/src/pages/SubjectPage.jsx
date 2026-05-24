import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import worldMap from '../data/worldMap';
import BossGate from '../components/world/BossGate';

export default function SubjectPage() {
  const { gradeId, subjectId } = useParams();
  const navigate = useNavigate();
  const gradeNum = Number(gradeId);
  const world = worldMap.find((w) => w.grade === gradeNum);
  const subject = world?.subjects?.find((s) => s.id === subjectId);

  if (!world || !subject) {
    return <div style={{ padding: 20 }}>Subject not found.</div>;
  }

  function openChapter(ch) {
    navigate(`/worlds/${gradeId}/${subjectId}/${ch.id}`);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>{subject.kingdomName}</h1>
      <div style={{ marginTop: 12 }}>
        {subject.chapters?.length ? (
          subject.chapters.map((ch) => (
            <div key={ch.id} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4>{ch.regionName}</h4>
                  <div>
                    {ch.topics?.map((t) => (
                      <Link key={t.id} to={`/topics/${t.id}`} style={{ marginRight: 8 }}>
                        {t.dungeonName}
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <button onClick={() => openChapter(ch)}>Open Chapter</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>No chapters yet for this subject.</div>
        )}
      </div>

      <h3>Bosses</h3>
      <div>
        {subject.chapters?.flatMap((c) => c.topics || []).map((t) => (
          <div key={t.id} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div>{t.bossName}</div>
              <Link to={`/boss/${t.id}`}>Go to Boss</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
