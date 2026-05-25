import React, { useEffect, useRef, useState } from 'react'
import lottie from 'lottie-web'
import animData from '../../../lottie/fractions_intro.json'
import './FractionsLesson.css'

// FractionsLesson
// - Loads the Lottie composition using lottie-web
// - Pauses at the marker named INTERACTION_START so the app can show interactive UI
// - Resumes playback programmatically after the interaction

export default function FractionsLesson({ onComplete }) {
  const containerRef = useRef(null)
  const animRef = useRef(null)
  const [isPausedForInteraction, setIsPausedForInteraction] = useState(false)
  const [showQuestion, setShowQuestion] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    animRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      animationData: animData,
    })

    const anim = animRef.current

    // Find markers if present in animation data
    const markers = (anim.getDuration && anim.animationData && anim.animationData.markers) || (anim.animationData && anim.animationData.markers) || []

    // If markers exist, find INTERACTION_START
    const interactionMarker = markers.find(m => m && (m.comment === 'INTERACTION_START' || m.label === 'INTERACTION_START'))

    if (interactionMarker) {
      // Convert marker time to frame/time depending on Lottie version
      const startFrame = interactionMarker.tm !== undefined ? interactionMarker.tm : interactionMarker.start || interactionMarker.time || 0
      const frameRate = anim.frameRate || 30
      const startTime = startFrame / frameRate

      // Listen to enterFrame and pause when we reach marker
      const onEnterFrame = () => {
        const currentFrame = anim.currentFrame
        if (currentFrame >= startFrame && !isPausedForInteraction) {
          anim.pause()
          setIsPausedForInteraction(true)
          setShowQuestion(true)
        }
      }

      anim.addEventListener('enterFrame', onEnterFrame)

      // Cleanup
      return () => {
        anim.removeEventListener('enterFrame', onEnterFrame)
        anim.destroy()
      }
    }

    // If no markers: pause at end and show question
    anim.addEventListener('complete', () => {
      setShowQuestion(true)
    })

    return () => anim.destroy()
  }, [])

  function handleCorrectAnswer() {
    // Hide question, play success micro-animation inside Lottie if available, then resume
    setShowQuestion(false)
    setIsPausedForInteraction(false)

    const anim = animRef.current
    if (!anim) return

    // If the Lottie file supports a resume marker, go to it
    const markers = anim.animationData && anim.animationData.markers ? anim.animationData.markers : []
    const resumeMarker = markers.find(m => m && (m.comment === 'INTERACTION_END' || m.label === 'INTERACTION_END'))

    if (resumeMarker) {
      const frameRate = anim.frameRate || 30
      const resumeFrame = resumeMarker.tm !== undefined ? resumeMarker.tm : resumeMarker.start || resumeMarker.time || 0
      anim.play(resumeFrame, true)
    } else {
      // Default: just resume playback
      anim.play()
    }

    if (onComplete) onComplete()
  }

  return (
    <div className="fractions-lesson">
      <div className="lottie-container" ref={containerRef} aria-hidden={showQuestion ? 'true' : 'false'} />

      {showQuestion && (
        <div className="question-overlay" role="dialog" aria-modal="true">
          <h3>Find the half of the apple</h3>
          <div className="choices">
            <button onClick={() => handleCorrectAnswer()} className="choice">Half</button>
            <button onClick={() => alert('Try again!')} className="choice">Quarter</button>
            <button onClick={() => alert('Try again!')} className="choice">Other</button>
          </div>
        </div>
      )}
    </div>
  )
}
