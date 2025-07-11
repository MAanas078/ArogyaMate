import React, { useEffect, useState } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { useNavigate } from 'react-router-dom'

const VoiceAssistant = () => {
  const navigate = useNavigate()

  const [isListening, setIsListening] = useState(false)
  const [response, setResponse] = useState('')

  const doctorMapping = {
    'Emily Larson': '6785bc078fffab4f6be4a8c5',
    'Saba Khan': '67f1f29808d37904170ed0aa',
    'John Doe': '1234567890abcdef12345678',
    'Jane Smith': '9876543210abcdef98765432',
    // Add more doctors as needed
  }

  const commands = [
    {
      command: ['go to *', 'open *'],
      callback: (page) => {
        const formatted = page.toLowerCase()
        if (formatted.includes('profile')) navigate('/my-profile')
        else if (formatted.includes('appointments')) navigate('/my-appointments')
        else if (formatted.includes('contact')) navigate('/contact')
        else if (formatted.includes('about')) navigate('/about')
        else if (formatted.includes('home')) navigate('/')
        else if (formatted.includes('doctors')) navigate('/doctors')
        else if (formatted.includes('logout')) navigate('/login')
        else if (formatted.includes('verify')) navigate('/verify')
        else if (formatted.includes('pediatricians')) navigate('/doctors/Pediatricians')
        else if (formatted.includes('general physician')) navigate('/doctors/General%20physician')
        else if (formatted.includes('gynecologist')) navigate('/doctors/Gynecologist')
        else if (formatted.includes('dermatologist')) navigate('/doctors/Dermatologist')
        else if (formatted.includes('neurologist')) navigate('/doctors/Neurologist')
        else if (formatted.includes('gastroenterologist')) navigate('/doctors/Gastroenterologist')
        else setResponse(`Sorry, I don't recognize "${page}"`)
      }
    },
    {
      command: ['open * appointment', 'open appointment for *', 'open *\'s appointment'],
      callback: (spokenName) => {
        const cleaned = spokenName.toLowerCase().replace(/^(dr\.?|doctor)\s+/, '').trim()
        const doctorEntry = Object.entries(doctorMapping).find(([name]) => {
          const normalizedKey = name.toLowerCase().trim()
          return normalizedKey.includes(cleaned) || cleaned.includes(normalizedKey)
        })

        if (doctorEntry) {
          const doctorId = doctorEntry[1]
          navigate(`/appointment/${doctorId}`)
          setResponse(`Opening appointment page for Dr. ${doctorEntry[0]}`)
        } else {
          setResponse(`Sorry, I couldn't find an appointment page for "${spokenName}"`)
        }
      }
    },
    {
      command: ['what is your name?', 'who are you?', 'what can you do?', 'tell me about yourself', 'yo'],
      callback: () => {
        setResponse('I am Sarah your virtual assistant! I can help you navigate the website and answer some basic questions.')
      }
    },
    {
      command: ['hi, how are you?', 'how are you?', 'how are you doing?', 'how is it going?', 'hi'],
      callback: () => {
        setResponse('I am just a program, but I am doing great! How about you?')
      }
    },
    {
      command: ['what is the time?', 'what time is it?', 'tell me the time'],
      callback: () => {
        const currentTime = new Date().toLocaleTimeString()
        setResponse(`The current time is ${currentTime}`)
      }
    },
    {
      command: ['hello', 'hi', 'hey'],
      callback: () => {
        setResponse('Hello! How can I assist you today?')
      }
    },
    {
      command: ['how old are you?'],
      callback: () => {
        setResponse('I don\'t have a specific age like you!')
      }
    },
    {
      command: ['goodbye', 'bye', 'see you', 'bye for now'],
      callback: () => {
        setResponse('Goodbye! Have a nice day!')
        setIsListening(false)
      }
    },
    {
      command: ['how to make an appointment', 'how to book an appointment?', 'how can I book an appointment?', 'how do I book an appointment?', 'what is the process for booking an appointment?'],
      callback: () => {
        setResponse('To book an appointment, go to the "Doctors" section, choose a doctor, and select an available time slot.')
      }
    },
    {
      command: ['what are the available appointment slots?', 'when can I book an appointment?', 'what time is available for appointments?'],
      callback: () => {
        setResponse('Please check the "Doctors" section for available slots based on the doctor you want to see.')
      }
    },
    {
      command: ['can I book an appointment with a doctor?', 'can I make an appointment?', 'how can I schedule an appointment?'],
      callback: () => {
        setResponse('Yes, you can schedule an appointment by visiting the "Doctors" section and selecting your preferred doctor.')
      }
    },
    {
      command: ['login', 'log in', 'sign in'],
      callback: () => {
        navigate('/login')
        setResponse('Navigating to login page.')
      }
    },
    {
      command: ['logout', 'log out', 'sign out'],
      callback: () => {
        localStorage.clear()
        navigate('/login') // or navigate('/')
        setResponse('You have been logged out.')
      }
    }
  ]

  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript
  } = useSpeechRecognition({ commands })

  useEffect(() => {
    if (isListening) {
      SpeechRecognition.startListening({ continuous: true })
    } else {
      SpeechRecognition.stopListening()
    }
  }, [isListening])

  useEffect(() => {
    if (transcript) {
      console.log('Transcript:', transcript)
    }
  }, [transcript])

  if (!browserSupportsSpeechRecognition) {
    return <span>Your browser does not support speech recognition.</span>
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '68%',
        right: 8,
        transform: 'translateY(-50%)',
        backgroundColor: '#ffffff',
        padding: '14px 18px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        fontSize: '14px',
        maxWidth: '260px',
        zIndex: 1000,
        fontFamily: 'Arial, sans-serif',
        lineHeight: '1.4'
      }}
    >
      <strong style={{ color: '#333' }}>Voice Assistant</strong>

      <p style={{ margin: '8px 0', color: '#555' }}>
        {listening
          ? '🎤 Listening...'
          : '🎤 Click the mic, or say: "go to profile", "go to doctors", "go to neurologist", etc. You can also ask about the site or healthcare.'}
      </p>

      {transcript && (
        <p style={{ fontStyle: 'italic', color: '#666', margin: '6px 0' }}>
          <strong>You said:</strong> {transcript}
        </p>
      )}

      {response && (
        <p style={{ color: '#444', margin: '6px 0' }}>
          <strong>Response:</strong> {response}
        </p>
      )}

      <button
        onClick={() => setIsListening(prev => !prev)}
        style={{
          marginTop: '8px',
          padding: '6px 12px',
          backgroundColor: isListening ? '#e53935' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '13px'
        }}
      >
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>
    </div>
  )
}

export default VoiceAssistant
