import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTopicById } from '../data/learningData';

export default function TopicRedirector() {
  const { topicId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const videoPath = getTopicById(topicId)?.videoPath || '/videos/fractions_intro.mp4';
    try {
      if (window && window.LearnCraftOpenInlineVideo) {
        window.LearnCraftOpenInlineVideo(videoPath, `/topics/${topicId}`, null);
      }
    } catch (e) {
      console.error('Failed to open inline video', e);
    }

    // Return to previous page so video overlay remains on top
    setTimeout(() => {
      try { navigate(-1); } catch (e) { /* ignore */ }
    }, 200);
  }, [topicId, navigate]);

  return null;
}
