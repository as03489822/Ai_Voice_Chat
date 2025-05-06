import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faMicrophone, faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
import aiImage from './assets/Logo.png';
import userImage from './assets/user-blue-gradient_78370-4692.avif';
import './index.css';
import axios from 'axios';

const VoiceChat = () => {
  const [data, setData] = useState([]);
  const [inputData, setInputData] = useState('');
  const [start, setStart] = useState(false);
//   for future use or  to make user friendly
  const [speak, setSpeak] = useState(false);
  const [failed , setFailed] = useState(false);

  const finalTranscriptRef = useRef('');
  const url = 'https://saasserversidescript-production.up.railway.app/chat';

  const synth = window.speechSynthesis;

  const recognition = new (
    window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    window.mozSpeechRecognition ||
    window.msSpeechRecognition
  )();
  
  recognition.interimResults = true;

  const fetchData = async (text) => {
    try {
      const response = await axios.post(url, { text });
      console.log(response.data.geminiResponse);
      if (response.status === 200) {
        setData((preArr) => [
          ...preArr,
          {
            message: response.data.geminiResponse,
            type: 'ai',
          },
        ]);
        speakText(response.data.geminiResponse)
      }
    } catch (error) {
      console.error('Error fetching response:', error);
    }
  };

  const speakText = (speakText) => {
    if (synth.speaking) synth.cancel();
    const utterance = new SpeechSynthesisUtterance(speakText);
    utterance.lang = 'en-US';

    utterance.onend = () => {
        recognition.start();
      };

    synth.speak(utterance);
  };

  const startClick = () => {
    setStart(true);
    speakText('Hello! How can I help you?');
  };

// for manual chat
  const startAgain = () => {
   recognition.start()
   setFailed(false)
  };

  recognition.onstart = () => {
    console.log("start")
    finalTranscriptRef.current = '';
    setSpeak(true);
  };

  recognition.onend = () => {
    console.log('stop')
    setSpeak(false);
    const finalText = finalTranscriptRef.current.trim();

    if (!finalText) return;

    setData((preArr) => [
      ...preArr,
      {
        message: finalText,
        type: 'user',
      },
    ]);
    setInputData('');
    fetchData(finalText);
  };

  recognition.onerror = () => {
    console.log('hello')
    setFailed(true);
  }

  recognition.onnomatch = () => {
    setFailed(true);
  }

//   utterance.onend = () => {
//     recognition.start();
//   };

  recognition.onresult = (event) => {
    let interimTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscriptRef.current += transcript;
      } else {
        interimTranscript += transcript;
      }
    }
    setInputData(finalTranscriptRef.current + interimTranscript);
  };

  return (
    <>
    <div className="flex flex-col justify-center items-center h-[100vh]">
      <div
        className={`h-[65vh] flex flex-col ${
          start ? 'justify-between' : 'justify-center'
        } items-center shadow-2xl/30 w-[350px] rounded-2xl overflow-hidden `}
      >
        {start ? (
          <>
            <div className="bg-[#4361EE] w-full h-[20%] flex items-center justify-between px-[20px]">
              <h1 className="font-bold text-white">Voice Chat</h1>
              {
              !failed ?
                <p 
                className='bg-[#F3F5F6] rounded-xl px-3 py-1'
                style={{
                    animation: 'blinker 2s linear infinite',
                  }}
                >
                    {!speak? 'speaking' : 'listining'}
                </p>
              :
                <button
                onClick={startAgain}
                className="bg-[#ff0c0c] font-bold text-white px-5 py-1 rounded-xl cursor-pointer"
                >
                    Start Again
                </button>
            }    
            </div>
            <div className="w-full h-full scroll px-[20px] overflow-y-auto scrollbar-hide pt-2 pb-4 flex flex-col gap-3">
              {data.length > 0 ? (
                data.map((message, index) =>
                  message.type === 'ai' ? (
                    <div key={index} className="w-[90%] flex flex-col gap-3">
                      <img
                        src={aiImage}
                        alt=""
                        className="bg-[#7B2CBF] w-[30px] rounded-full p-1"
                      />
                      <p className="w-full bg-[#3C096C] text-white ml-3 px-3 py-2 rounded-md relative">
                        <span className="absolute top-[-10px] left-[0px] bg-[#3C096C] w-5 h-5 [clip-path:polygon(0%_0%,_0_100%,_100%_100%)]"></span>
                        {message.message}
                      </p>
                    </div>
                  ) : (
                    <div
                      key={index}
                      dir="rtl"
                      className="w-[90%] ml-[30px] flex flex-col gap-3"
                    >
                      <img
                        src={userImage}
                        alt=""
                        className="bg-[#7B2CBF] w-[30px] rounded-full"
                      />
                      <p className="text-left relative w-full bg-[#DEE2E6] mr-3 px-3 py-2 rounded-md">
                        <span className="absolute top-[-10px] right-[0px] bg-[#DEE2E6] w-5 h-5 [clip-path:polygon(100%_0%,_0_100%,_100%_100%)]"></span>
                        {message.message}
                      </p>
                    </div>
                  )
                )
              ) : (
                <p className="flex justify-center items-center h-full">
                  Hello, how can I help you?
                </p>
              )}
            </div>
            <form
              action=""
              className="relative flex items-center w-full pb-5 h-[16%] px-[20px]"
            >
              <textarea
                className="py-2 border border-gray-300 w-[90%] pl-[10px] pr-[40px] bg-[#F3F5F6] resize-none outline-none overflow-hidden rounded-md absolute bottom-3 left-[19px]"
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                rows={1}
              />
              {/* <FontAwesomeIcon
                onClick={handelVoice}
                className="absolute top-[10px] right-9 cursor-pointer"
                icon={!speak ? faMicrophone : faVolumeHigh}
              /> */}
            </form>
          </>
        ) : (
          <button
            className="bg-[#4361EE] font-bold text-white px-5 py-2 rounded-xl cursor-pointer"
            onClick={startClick}
          >
            Start
          </button>
        )}
      </div>
    </div>
      <style>
      {`
        @keyframes blinker {
          50% {
            opacity: 0;
          }
        }
      `}
    </style>
    </>
  );
};

export default VoiceChat;
