import { useEffect, useRef, useState } from 'react'
import { loadYouTube } from './utils/loadApi'

//SONG LIST
const PLAYLIST = [
  'f5hxIMXFxSo',
  '0v5feHPfy5Lk',
  'SBfPs-PMGTA',
  'WlWlGlvN4L4',
  'Y7QwlhOGZJI',
  'uZ0A8B0kN4E',
  'lTzEtoRXLXo',
  'pgQPquFKKpc',
  'beqprrnaKFc',
  'plB0ytzIlqI',
  'CKDcqKS1Eqg',
  'nrqKoe7Moe8',
  'r_lxE7kF0Fo',
  'lX3vT_Gm_HE',
  't5OKlU0icRs',
  'ktf4y-sYboE',
  'R7fwt89Vbd0',
  'gST08mWonCI',
  'GXYucMSjkzU',
  '55BS8QO5C9o',
  '2E2WA8_teMY',
  'LpX-fCgat1M',
  'aRNfSqsgrgE',
  'f5hxIMXFxSo',
  'nDjloeIB3Pc',
  '_IcVb6hFhPs',
  'siw7-MTgE4s',
  'Q_cq8__k--M',
  'qeAduSIZmaI',
  'cQM55aOrZCg',
  'GX9x62kFsVU',
  'B2Tn7sF4Jag',
  'NZ1EBaqDL0M',
  
]

//QUOTES

const QUOTES = [
  'LIGHT WEIGHT BABY!',
  'EVERYBODY WANTS TO BE A BODYBUILDER...',
  "AIN'T NOTHIN' BUT A PEANUT!",
  'ONE MORE REP FOR THE GODS.',
  'FULL RANGE OF MOTION OR NOTHING.',
  'THE PUMP IS BETTER THAN SLEEP.',
  'NO PAIN, NO GAIN.',
  'STAY HUNGRY.',
  'SHUT UP AND SQUAT.',
  'YEP! YEP! YEP!',
]

export default function App() {
  
  //STATES
  const [playing, setPlaying] = useState(false)

  const [trackTitle, setTrackTitle] = useState(
    'GAANE LOAD HO RAHE...'
  )

  const [currentSong, setCurrentSong] = useState(0)
  const [quote, setQuote] = useState(QUOTES[0])
  const [quoteVisible, setQuoteVisible] = useState(true)
  
  //REFS
  const playerRef = useRef(null)
  const hostRef = useRef(null)
  const contentRef = useRef(null)
  const lightRef = useRef(null)
  const progressRef = useRef(null)

  //YOUTUBE PLAYER
  useEffect(() => {
    let cancelled = false
    let target = null

    loadYouTube()
      .then((YT) => {
        if (cancelled || !hostRef.current) return

        // Create YouTube player container
        target = document.createElement('div')

        hostRef.current.appendChild(target)

        // Create YouTube player
        playerRef.current = new YT.Player(target, {
          // Hidden YouTube player
          height: '0',
          width: '0',
          playerVars: {
            autoplay: 0,
            controls: 0,
            modestbranding: 1,
            playsinline: 1,
          },

          events: {
            //PLAYER READY
            onReady: (event) => {
              console.log('YouTube Player Ready')
              // Load first song
              event.target.loadVideoById(
                PLAYLIST[0]
              )
            },

           //STATE CHANGE
            onStateChange: (event) => {
              const state = event.data

              //PLAYING
              if (
                state === YT.PlayerState.PLAYING
              ) {
                setPlaying(true)

                const data =
                  playerRef.current?.getVideoData?.()
                if (data?.title) {
                  setTrackTitle(
                    data.title.toUpperCase()
                  )
                }
              }
              // PAUSED
              if (
                state === YT.PlayerState.PAUSED
              ) {
                setPlaying(false)
              }
              //CUED

              if (
                state === YT.PlayerState.CUED
              ) {
                const data =
                  playerRef.current?.getVideoData?.()

                if (data?.title) {
                  setTrackTitle(
                    data.title.toUpperCase()
                  )
                }
              }

              //SONG ENDED
              if (
                state === YT.PlayerState.ENDED
              ) {
                setPlaying(false)
                // Automatically play next song
                setCurrentSong((current) => {
                  const next =
                    (current + 1) %
                    PLAYLIST.length
                  console.log(
                    'Auto Next Song:',
                    next + 1
                  )

                  playerRef.current?.loadVideoById(
                    PLAYLIST[next]
                  )

                  return next
                })
              }
            },
            //YOUTUBE ERROR

            onError: (event) => {
              console.error(
                'YouTube Player Error:',
                event.data
              )
            },
          },
        })
      })
      .catch((error) => {
        console.error(
          'YouTube API failed to load:',
          error
        )
      })
      // CLEANUP
    return () => {
      cancelled = true

      try {
        playerRef.current?.destroy()
      } catch {
        // Ignore cleanup errors
      }
      playerRef.current = null
      if (hostRef.current) {
        hostRef.current.innerHTML = ''
      }
    }
  }, [])
  // PROGRESS BAR

 useEffect(() => {
  let animationFrame
  const updateProgress = () => {
    const player = playerRef.current

    if (
      player &&
      typeof player.getDuration === 'function'
    ) {
      const duration = player.getDuration()
      const current =
        player.getCurrentTime?.() || 0

      if (
        duration > 0 &&
        progressRef.current
      ) {
        const percentage =
          (current / duration) * 100

        progressRef.current.value = percentage
      }
    }

    animationFrame =
      requestAnimationFrame(updateProgress)
  }

  animationFrame =
    requestAnimationFrame(updateProgress)

  return () => {
    cancelAnimationFrame(animationFrame)
  }
}, [])

//ROTATING QUOTES
  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      setQuoteVisible(false)
      setTimeout(() => {
        index =
          (index + 1) % QUOTES.length
        setQuote(QUOTES[index])
        setQuoteVisible(true)
      }, 500)
    }, 4000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  //AMBIENT LIGHT
  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!lightRef.current) return

      lightRef.current.style.left =
        `${event.clientX - 300}px`

      lightRef.current.style.top =
        `${event.clientY - 300}px`
    }

    document.addEventListener(
      'mousemove',
      handleMouseMove
    )

    return () => {
      document.removeEventListener(
        'mousemove',
        handleMouseMove
      )
    }
  }, [])

  //PLAY / PAUSE
  const togglePlay = () => {
    const player = playerRef.current

    if (!player) return
    const state =
      player.getPlayerState?.()
    if (state === 1) {
      // Currently playing
      player.pauseVideo()
    } else {
      // Paused / stopped / cued
      player.playVideo()
    }
  }

// NEXT SONG
  const nextVideo = () => {
    setCurrentSong((current) => {
      const next =
        (current + 1) %
        PLAYLIST.length
      console.log(
        'Next Song:',
        next + 1
      )
      playerRef.current?.loadVideoById(
        PLAYLIST[next]
      )

      return next
    })
  }

  //PREVIOUS SONG
  const prevVideo = () => {
    setCurrentSong((current) => {
      const previous =
        (current - 1 + PLAYLIST.length) %
        PLAYLIST.length
      console.log(
        'Previous Song:',
        previous + 1
      )

      playerRef.current?.loadVideoById(
        PLAYLIST[previous]
      )

      return previous
    })
  }

  //UI
  return (
    <>
      <div className="vhs-overlay" />
      <div className="grain" />
      <div
        className="ambient-light"
        ref={lightRef}
      />

      <div
        className="container"
        ref={contentRef}
      >
        {/* Header Labels */}

        <div className="header-labels">
          <div>EST. 2026</div>
          <div>
            STATUS: MUSIC ON
          </div>
          <div>
            LOCATION: HIGHWAY
          </div>
        </div>
        {/* Main Title */}
        <h1 className="main-title">
          कार वाला
        </h1>
       {/* CAR VISUAL */}

        <div className="visual-center">
          <div className="car-wrap">
            
          </div>
        </div>
         {/* QUOTE */}
        <div
          className="quote-container"
          style={{
            opacity: quoteVisible ? 1 : 0,
          }}
        >
          &ldquo;{quote}&rdquo;
        </div>
      </div>

       {/* MUSIC PLAYER */}
      <div className="player-wrap">

        {/* PLAYER CONTROLS */}
        <div className="player-controls">

          {/* Previous */}
          <button
            className="control-btn"
            onClick={prevVideo}
            aria-label="Previous"
          >
            <svg
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>

          {/* Play / Pause */}
          <button
            className="control-btn"
            onClick={togglePlay}
            aria-label="Play/Pause"
          >
            {playing ? (
              <svg
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Next */}
          <button
            className="control-btn"
            onClick={nextVideo}
            aria-label="Next"
          >
            <svg
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </button>

        </div>

        {/* SONG NAME */}
          <div className="track-name">
            {trackTitle}
          </div>

          {/* Progress */}
         <div className="progress-container">
         <input
           type="range"
           className="progress-slider"
           min="0"
           max="100"
           defaultValue="0"
           ref={progressRef}
           onChange={(e) => {
        const player = playerRef.current

      if (!player) return
      const duration = player.getDuration()

      if (duration > 0) {
        const percentage = Number(
          e.target.value
        )
        const newTime =
          (percentage / 100) * duration

        player.seekTo(newTime, true)
      }
    }}
  />
</div>
</div>
{/* INSTAGRAM CREDIT */}

      {/* <a
        className="insta-credit"
        href="https://instagram.com/kaash.tech"
        target="_blank"
        rel="noreferrer"
        aria-label="Instagram @kaash.tech"
      > */}
        {/* <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        > */}
          {/* <rect
            x="2"
            y="2"
            width="20"
            height="20"
            rx="5.5"
            stroke="currentColor"
            strokeWidth="2"
          /> */}

          {/* <circle
            cx="12"
            cy="12"
            r="4.2"
            stroke="currentColor"
            strokeWidth="2"
          /> */}

          {/* <circle
            cx="17.4"
            cy="6.6"
            r="1.3"
            fill="currentColor"
          />
        </svg>

        kaash.tech
      </a> */}
      {/* HIDDEN YOUTUBE PLAYER */}
      <div
        className="youtube-host"
        ref={hostRef}
      />
    </>
  )
}