import { useEffect } from 'react'

const DailyDictationChat = () => {
  useEffect(() => {
    // Kiểm tra script đã load chưa
    if (document.getElementById('chat-iframe-script')) return

    const script = document.createElement('script')
    script.id = 'chat-iframe-script'
    script.src = 'http://localhost:3000/js/chatIframe.js'
    script.onload = () => {
      window.initChatIframe({
        baseUrl: 'http://localhost:3000',
        assistantAlias: 'daily-dictation',
        fullPortalUrl: 'http://localhost:3000',
        openPortalInNewTab: false,
        brand: {
          primaryColor: '#1976d2',
          welcomeMessage: 'Xin chào! Tôi có thể giúp gì cho bạn?',
        }
      })
    }
    document.body.appendChild(script)

    // Cleanup khi unmount
    return () => {
      const el = document.getElementById('chat-iframe-script')
      if (el) el.remove()
    }
  }, [])

  return null  // Portal script tự tạo UI
}

export default DailyDictationChat