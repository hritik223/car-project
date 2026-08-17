let ytPromise

export function loadYouTube() {
  if (window.YT && window.YT.Player) {
    return Promise.resolve(window.YT)
  }

  if (ytPromise) {
    return ytPromise
  }

  ytPromise = new Promise((resolve) => {
    const previous =
      window.onYouTubeIframeAPIReady

    window.onYouTubeIframeAPIReady = () => {
      if (typeof previous === 'function') {
        previous()
      }

      resolve(window.YT)
    }

    const script =
      document.createElement('script')

    script.src =
      'https://www.youtube.com/iframe_api'

    document.head.appendChild(script)
  })

  return ytPromise
}