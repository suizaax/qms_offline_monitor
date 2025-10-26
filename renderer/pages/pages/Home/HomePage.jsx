import { Dialog, Transition } from '@headlessui/react';
import axios from 'axios';
import { format } from 'date-fns';
import ar from 'date-fns/locale/ar-DZ';
import en from 'date-fns/locale/en-US';
import fr from 'date-fns/locale/fr';
import Store from "electron-store";
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.min.css';
import Navbar from "../../components/Navbar";

import { Autoplay, FreeMode, Navigation, Thumbs } from 'swiper';
import Marquee from 'react-fast-marquee';

const HomePage = () => {

  const formatDate = (currentLanguage) => {
    const now = new Date();
    let locale;

    if (currentLanguage === "ENG") {
      locale = en;
    } else if (currentLanguage === "FR") {
      locale = fr;
    } else if (currentLanguage === "AR") {
      locale = ar;
    }

    if (currentLanguage === "AR") {
      const date = format(now, "HH:mm:ss - eeee dd MMMM yyyy", { locale: ar });
      setCurrentTime(date)
    } else {
      const date = format(now, "HH:mm:ss - eeee MMMM dd, yyyy", { locale });
      setCurrentTime(date)
    }
  };

  const store = new Store()
  const rawData = store.get("companyInfo")
  const baseURLLink = store.get("base_url")

  let parsedData;
  let accentColor;
  try {
    parsedData = JSON.parse(rawData);
    accentColor = parsedData?.position ? parsedData?.company?.accentColor : parsedData?.accentColor
    // console.log(baseURLLink)
  } catch (error) {
    console.error('Failed to parse JSON data:', error);
    // Handle the error or provide a default value for parsedData
    parsedData = null
  }

  const [currentTime, setCurrentTime] = useState(null);
  const [receivedData, setReceivedData] = useState([])
  const [showFullScreen, setShowFullScreen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioQueues, setAudioQueues] = useState({});
  const [clientsHistory, setClientsHistory] = useState([])
  const [voices, setVoices] = useState([])
  const [waitingClientsCount, setWaitingClientsCount] = useState([])
  const [currentServingCounters, setCurrentServingCounters] = useState([])
  const [counterName, setCounterName] = useState(parsedData?.position ? parsedData?.company?.counterName : parsedData?.counterName)
  const [monitorLanguage, setMonitorLanguage] = useState(parsedData?.position ? parsedData?.company?.monitorLanguage : parsedData?.monitorLanguage)
  const [newsBarSpeed, setNewsBarSpeed] = useState(parsedData?.position ? parsedData?.company?.barSpeed : parsedData?.barSpeed)
  const [newsBarDirection, setNewsBarDirection] = useState(parsedData?.position ? parsedData?.company?.barDirection : parsedData?.barDirection)
  const [enableCounterLetter, setEnableCounterLetter] = useState(parsedData?.position ? parsedData?.company?.enableLetter : parsedData?.enableLetter)

  useEffect(() => {
    const interval = setInterval(() => {
      formatDate(monitorLanguage)
    }, 1000);
    return (() => {
      clearInterval(interval)
    })
  }, []);

  // start of functions

  const audioBaseUrl = `/voice/${parsedData?.position ? parsedData?.company?.voiceLanguage : parsedData?.voiceLanguage}/female/`;
  const beepLocation = "/beep.mp3";

  const playTicketNumberAudio = (ticketNumber, counterNumber, language) => {
    // Create an array to store all the audio elements to play sequentially
    const audioElements = [];

    if ((parsedData?.position ? parsedData?.company?.beepSound : parsedData?.beepSound) === true) {
      const beepAudio = beepLocation;
      const beepAudioElement = new Audio(beepAudio);
      audioElements.push(beepAudioElement);
    }

    // Create an audio element for "ticket number.mp3"
    const ticketNumberAudioUrl = audioBaseUrl + 'ticket number.mp3';
    const ticketNumberAudioElement = new Audio(ticketNumberAudioUrl);
    audioElements.push(ticketNumberAudioElement);

    // Determine if we should include letters based on the language
    const includeLetters = language !== 'ar'; // Include letters for non-Arabic languages

    // Read the service name abbreviation separately
    const serviceNameAbbreviation = ticketNumber.charAt(0).toLowerCase();;
    if (/[0-9A-Za-z]/.test(serviceNameAbbreviation)) {
      if (enableCounterLetter) { 
      const serviceNameAbbreviationAudioUrl = audioBaseUrl + serviceNameAbbreviation + '.mp3';
      const serviceNameAbbreviationAudioElement = new Audio(serviceNameAbbreviationAudioUrl);
      audioElements.push(serviceNameAbbreviationAudioElement);} 
    }

    // The remaining part of ticketNumber should be treated as the ticket number
    ticketNumber = ticketNumber.slice(1);

    if (language === 'ar' || language === 'fr') {
      // Convert the ticket number to an integer
      const numericValue = parseInt(ticketNumber, 10);

      if (numericValue >= 100) {
        // Split the numeric value into parts of 100
        const hundreds = Math.floor(numericValue / 100) * 100;
        const remainder = numericValue % 100;

        if (hundreds > 0) {
          const audioUrl = audioBaseUrl + hundreds + '.mp3';
          const audioElement = new Audio(audioUrl);
          audioElements.push(audioElement);
        }

        if (language === 'ar') {
          const audioUrl = audioBaseUrl + 'and.mp3';
          const audioElement = new Audio(audioUrl);
          audioElements.push(audioElement);
        }

        if (remainder > 0) {
          const audioUrl = audioBaseUrl + remainder + '.mp3';
          const audioElement = new Audio(audioUrl);
          audioElements.push(audioElement);
        }
      } else {
        const audioUrl = audioBaseUrl + numericValue + '.mp3';
        const audioElement = new Audio(audioUrl);
        audioElements.push(audioElement);
      }
    } else if (language === 'en') {
      // For English language, split the numeric value into individual digits
      for (let i = 0; i < ticketNumber.length; i++) {
        const digit = ticketNumber.charAt(i);
        const audioUrl = audioBaseUrl + digit + '.mp3';
        const audioElement = new Audio(audioUrl);
        audioElements.push(audioElement);
      }
    } else {
      // For non-Arabic and non-French languages, handle as in the original code
      for (let i = 0; i < ticketNumber.length; i++) {
        const character = ticketNumber.charAt(i);

        if (includeLetters && /[A-Za-z]/.test(character)) {
          const letter = character.toLowerCase();
          const letterAudioUrl = audioBaseUrl + letter + '.mp3';
          const letterAudioElement = new Audio(letterAudioUrl);
          audioElements.push(letterAudioElement);
        } else if (/[0-9]/.test(character)) {
          const audioUrl = audioBaseUrl + character + '.mp3';
          const audioElement = new Audio(audioUrl);
          audioElements.push(audioElement);
        }
      }
    }

    // Create an audio element for "proceed to counterName.mp3"
    let proceedToCounterAudioUrl = audioBaseUrl + `proceed to ${(parsedData?.position ? parsedData?.company?.counterName : parsedData?.counterName).toLowerCase()}.mp3`;
    const proceedToCounterAudioElement = new Audio(proceedToCounterAudioUrl);
    audioElements.push(proceedToCounterAudioElement);

    // Add numeric counter number audio elements (for counterNumber with digits only)
    for (let i = 0; i < counterNumber.length; i++) {
      const digit = counterNumber.charAt(i);
      const audioUrl = audioBaseUrl + digit + '.mp3';
      const audioElement = new Audio(audioUrl);
      audioElements.push(audioElement);
    }

    // Play audio elements sequentially
    playAudioSequentially(audioElements, 0);
  };

  const playAudioSequentially = (audioElements, index) => {
    if (index < audioElements.length) {
      // Play the current audio element
      audioElements[index].play();

      // When the current audio element finishes, play the next one
      audioElements[index].addEventListener('ended', () => {
        playAudioSequentially(audioElements, index + 1);
      });
    }
  };

  function hexToRgbA(hex) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length == 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      return ('rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',0.15)');
    }
    // throw new Error('Bad Hex');
  }

  const waitingClients = async () => {
    await axios.get(`tickets/count/waiting/${parsedData?.position ? parsedData?.company?.id : parsedData?.id}`)
      .then(res => {
        setWaitingClientsCount(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const getCurrentServingCounters = async () => {
    await axios.get(`agents/current/serving/${parsedData?.position ? parsedData?.company?.id : parsedData?.id}`)
      .then(res => {
        setCurrentServingCounters(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  useEffect(() => {
    waitingClients()
    getCurrentServingCounters()
    setCounterName(translateCounterName(parsedData?.position ? parsedData?.company?.counterName : parsedData?.counterName, parsedData?.position ? parsedData?.company?.monitorLanguage : parsedData?.monitorLanguage))
    const interval = setInterval(() => {
      waitingClients()
      getCurrentServingCounters()
    }, 10000);

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, []);


  function formatNumber(number) {
    // Ensure the input is a number
    const parsedNumber = parseInt(number);

    // Check if it's a single-digit number (1-9)
    if (!isNaN(parsedNumber) && parsedNumber >= 1 && parsedNumber <= 9) {
      // Convert it to a string with leading zeros
      return parsedNumber.toString().padStart(2, '0');
    }

    // If it's not a single-digit number, return it as is
    return number;
  }


  useEffect(() => {
    const socket = io.connect(`http://${baseURLLink}:8800`, { transports: ['websocket'] });

    socket.on('receiveMessage', (data) => {
      console.log(data)
      const agentId = data.adminId; // Use socket.id as the agent identifier

      if (data.companyId === (parsedData?.position ? parsedData?.company?.id : parsedData?.id)) {
        if (!audioQueues[agentId]) {
          // If there's no queue for this agent, create one
          audioQueues[agentId] = [];
        }

        // Add the audio playback function to the agent's queue
        const agentQueue = audioQueues[agentId];
        agentQueue.push(() => {
          playTicketNumberAudio(
            `${data.letter + data.number}`,
            `${data.counterNumber}`,
            `${parsedData?.position ? parsedData?.company?.voiceLanguage : parsedData?.voiceLanguage}`
          );
          setReceivedData(data);

          // Show the full screen
          setShowFullScreen(true);

          // Set a timeout to hide the full screen after audio finishes
          setTimeout(() => {
            setShowFullScreen(false);

            // Remove the first audio playback function from the queue
            agentQueue.shift();

            if (agentQueue.length > 0) {
              // If there are more items in the queue, play the next one
              agentQueue[0]();
            } else {
              // If the queue is empty, resume video playback
              const videoElement = document.getElementById('promotionVideo');
              if (videoElement) {
                videoElement.play();
              }
            }
          }, 9000);
        });

        // If there's only one item in the agent's queue, start playback
        if (agentQueue.length === 1) {
          agentQueue[0]();
        }

        handleClientsHistory(data);
        const shouldMuteVideo = agentQueue.length > 0;

        // Set the muted attribute of the video based on the condition
        const videoElement = document.getElementById('promotionVideo'); // Add an id to your video element
        if (videoElement && shouldMuteVideo === true) {
          videoElement.pause();
        }
      }
    });


    return () => {
      socket.disconnect();
      socket.off('receiveMessage', () => {
        console.log(" C bn barkina");
      });
    };
  }, [audioQueues]);

  const handleClientsHistory = (newClient) => {
    const maxHistoryLength = 6;
    setClientsHistory((prevHistory) => {
      const existingClientIndex = prevHistory.findIndex(
        (client) =>
          client.adminId === newClient.adminId &&
          client.letter + client.number === newClient.letter + newClient.number
      );

      if (existingClientIndex !== -1) {
        // If the client already exists in the history, replace it with the latest one
        prevHistory.splice(existingClientIndex, 1);
      } else if (prevHistory.length >= maxHistoryLength) {
        // If the history is full, remove the oldest client
        prevHistory.shift();
      }

      // Add the new client to the end of the history
      return [...prevHistory, newClient];
    });
  };


  // Calculate the number of items in currentServingCounters
  const itemCount = currentServingCounters.length;


  return (
    <React.Fragment>
      <Navbar currentTime={currentTime} companyName={parsedData?.position ? parsedData?.company?.name : parsedData?.name} companyLogo={parsedData?.position ? parsedData?.company?.logo : parsedData?.logo} secondaryColor={hexToRgbA(parsedData?.position ? parsedData?.company?.accentColor : parsedData?.accentColor)} accentColor={parsedData?.position ? parsedData?.company?.accentColor : parsedData?.accentColor} />
      {/* <button onClick={() => { playTicketNumberAudio("C199", "2", `fr`) }}>play</button> */}
      <div className=' h-[85vh] flex flex-row justify-between items-center px-10'>
        <div className=' w-4/12 h-full flex flex-col justify-center space-y-6'>
          <div className=' h-[59%] rounded-3xl overflow-hidden'>
            <table className=' w-full rounded-lg h-full' style={{ border: "solid", borderWidth: '1px', borderColor: parsedData?.position ? parsedData?.company?.accentColor : parsedData?.accentColor }} dir={monitorLanguage === "AR" ? "rtl" : "ltr"} >
              <tr style={{ backgroundColor: parsedData?.position ? parsedData?.company?.accentColor : parsedData?.accentColor }}>
                <th className='text-[54px] font-medium text-white p-2 border-r-2'>{counterName}</th>
                <th className='text-[54px] font-medium text-white p-2'>{monitorLanguage === "ENG" ? "Ticket Number" : monitorLanguage === "AR" ? "رقم التذكرة" : monitorLanguage === "FR" ? "Numéro de ticket" : null}</th>
              </tr>
              {
                // Ensure at least four columns are rendered
                new Array(Math.max(4, clientsHistory.length)).fill(null).map((_, index) => {
                  const reversedHistory = [...clientsHistory].reverse();
                  const counter = reversedHistory[index];
                  return (
                    <tr key={index} style={{ backgroundColor: hexToRgbA(parsedData?.position ? parsedData?.company?.accentColor : parsedData?.accentColor) }}>
                      <td style={{ border: "solid", borderWidth: '2px', borderColor: parsedData?.position ? parsedData?.company?.accentColor : parsedData?.accentColor, borderBottomStyle: '', borderTopStyle: 'none', borderLeftStyle: 'none' }}>
                        {counter ? (
                          <p className=' text-[57px] font-bold text-center p-1'>{counter.counterNumber}</p>
                        ) : (
                          <p className=' text-[68px] font-bold text-center p-1'>&zwnj;</p>
                        )}
                      </td>
                      <td style={{ border: "solid", borderWidth: '2px', borderColor: parsedData?.position ? parsedData?.company?.accentColor : parsedData?.accentColor, borderRightStyle: '', borderTopStyle: 'none', borderLeftStyle: 'none' }}>
                        {counter ? (
                          <div className='flex flex-row w-full relative'>
                            <p className=' text-[57px] font-bold mx-auto text-center'>{(enableCounterLetter ? counter.letter : "") + formatNumber(counter.number)}</p>
                            {counter.clientType === "Handicapped" ? (
                              <img className=' p-5 absolute right-3 h-full' src="/assets/handicap.png" alt="" />
                            ) : counter.clientType === "Business" ? (
                              <img className=' p-5 absolute right-3 h-full' src="/assets/business.png" alt="" />
                            ) : counter.clientType === "Individuel" ? (
                              <img className=' p-5 absolute right-3 h-full' src="/assets/particulier.png" alt="" />
                            ) : null}
                          </div>
                        ) : null}
                      </td>
                    </tr>
                  );
                })
              }

            </table>
          </div>
          {
            Object.keys(receivedData).length > 0 ?
              <div className={'justify-center h-[35%] text-white text-center min-w-full rounded-2xl flex flex-col py-5 '} style={{ backgroundColor: parsedData?.position ? parsedData?.company?.accentColor : parsedData?.accentColor }} dir={monitorLanguage === "AR" ? "rtl" : "ltr"}>
                <p className=' text-5xl font-medium'>{monitorLanguage === "ENG" ? "Calling Ticket Number" : monitorLanguage === "AR" ? "ننادي التذكرة رقم" : monitorLanguage === "FR" ? "Numéro du ticket d'appel" : null}</p>
                <p className=' text-[160px] font-bold'>{(enableCounterLetter ? receivedData.letter : "") + formatNumber(receivedData.number)}</p>
                <p className=' text-5xl font-medium'>{monitorLanguage === "ENG" ? "To" : monitorLanguage === "AR" ? "الى" : monitorLanguage === "FR" ? "Au" : null} {counterName} {receivedData.counterNumber}</p>
              </div> :
              <div className={'justify-center h-[35%] text-white text-center min-w-full rounded-2xl flex flex-col py-5 space-y-10'} style={{ backgroundColor: parsedData?.position ? parsedData?.company?.accentColor : parsedData?.accentColor }}>
                <p className=' text-5xl font-medium'>{monitorLanguage === "ENG" ? "Agent will start calling" : monitorLanguage === "AR" ? "سيبدأ الوكيل في الاتصال" : monitorLanguage === "FR" ? "L'agent commencera à appeler" : null}</p>
                <p className=' text-5xl font-medium'>{monitorLanguage === "ENG" ? "Please be patient" : monitorLanguage === "AR" ? "يرجى الانتظار" : monitorLanguage === "FR" ? "Soyez patient" : null}</p>
              </div>
          }
        </div>

        <div className=' w-8/12 h-full flex flex-col justify-center py-8'>
          <div className='flex flex-row h-full w-full justify-center'>
            {
              (parsedData?.position ? parsedData?.company?.mediaType : parsedData?.mediaType) === "Images" ?
                <Swiper
                  style={{
                    "--swiper-navigation-color": "#fff",
                    "--swiper-pagination-color": "#fff",
                  }}
                  loop={true}
                  autoplay={true}
                  spaceBetween={10}
                  navigation={false}
                  modules={[Autoplay, Navigation, Thumbs, FreeMode]}
                  className=" h-[90%] w-[90%] rounded-2xl "
                >
                  {
                    (parsedData?.position ? parsedData?.company?.ImagesLists : parsedData?.ImagesLists) &&
                    (parsedData?.position ? parsedData?.company?.ImagesLists : parsedData?.ImagesLists).map((image, index) => (
                      <SwiperSlide data-swiper-autoplay="5000" key={index}>
                        <img src={`http://${baseURLLink}:8800${image.image}`} className='object-cover w-full h-full' />
                      </SwiperSlide>
                      // <p>{`http://${baseURLLink}:8800${image.image}`}</p>
                    ))
                  }
                </Swiper>
                :
                <video autoPlay playsInline muted={parsedData?.position ? !parsedData?.company?.videoSound : !parsedData?.videoSound} loop id="promotionVideo" className=" w-[90%] h-[90%] object-cover rounded-3xl">
                  <source src={`http://${baseURLLink}:8800${parsedData?.position ? parsedData?.company?.videoLink : parsedData?.videoLink}`} type="video/mp4" />
                </video>
            }
          </div>
          <div dir={monitorLanguage === "AR" ? "rtl" : "ltr"} className=' flex flex-row w-[90%] mx-auto rounded-lg p-4 px-20 items-center justify-between' style={{ backgroundColor: hexToRgbA(parsedData?.position ? parsedData?.company?.accentColor : parsedData?.accentColor), border: "solid", borderWidth: '1px', borderColor: parsedData?.position ? parsedData?.company?.accentColor : parsedData?.accentColor }}>
            <div className=' flex flex-row items-center justify-center space-x-4'>
              <img src="/assets/time.png" className=' h-20 ml-4' alt="" />
              <p className=' text-5xl font-semibold'>{monitorLanguage === "ENG" ? "Clients Waiting" : monitorLanguage === "AR" ? " في الانتظار" : monitorLanguage === "FR" ? "Clients en attente" : null} </p>
            </div>
            <p className='text-8xl font-semibold'>{waitingClientsCount.length}</p>
          </div>
        </div>
      </div>
      <div className=' flex flex-row h-[5vh]'>
        <div className="title text-3xl font-bold text-white p-4 mx-auto my-auto" style={{ backgroundColor: parsedData?.position ? parsedData?.company?.accentColor : parsedData?.accentColor }}>
          {parsedData?.position ? parsedData?.company?.SBTitle : parsedData?.SBTitle}
        </div>
        <Marquee speed={newsBarSpeed} direction={newsBarDirection} style={{ backgroundColor: hexToRgbA(parsedData?.position ? parsedData?.company?.accentColor : parsedData?.accentColor) }}>
          {
            (parsedData?.position ? parsedData?.company?.SBnews : parsedData?.SBnews)?.map((news, index) => (
              <p key={news.id} className='text-4xl font-semibold px-4 border-l-2 border-gray-500' > {news.news}</p>
            ))
          }
        </Marquee>
        <Transition appear show={showFullScreen} as={React.Fragment}>
          <Dialog as="div" className="relative z-10" onClose={() => { setShowFullScreen(false) }}>
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={React.Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-[80vw] h-[70vh] transform overflow-hidden rounded-2xl bg-white p-0 text-left align-middle shadow-xl transition-all">
                    <div className=' w-full h-full absolute bg-opacity-50 p-10 space-y-6' >
                      <div className=' border border-white rounded-3xl h-[40%] flex flex-row items-center justify-evenly' dir={monitorLanguage === "AR" ? "rtl" : "ltr"} style={{ backgroundColor: parsedData?.position ? parsedData?.company?.accentColor : parsedData?.accentColor }}>
                        <p className=' text-7xl text-white font-semibold'>{monitorLanguage === "ENG" ? "Calling Now Ticket Number" : monitorLanguage === "AR" ? "ننادي الان التذكرة رقم" : monitorLanguage === "FR" ? "Ticket Numéro" : null}</p>
                        {/* <p className=' text-7xl'>{receivedData.letter + receivedData.number}</p> */}
                        <div className=' max-w-[400px] w-full rounded-full h-[400px] items-center justify-center flex text-white'>
                          <p className='z-50 font-bold text-9xl'>{(enableCounterLetter ? receivedData.letter:"") + formatNumber(receivedData.number)}</p>
                        </div>
                      </div>
                      <div className=' border border-white rounded-3xl h-[40%] flex flex-row items-center justify-evenly p-5' dir={monitorLanguage === "AR" ? "rtl" : "ltr"} style={{ backgroundColor: parsedData?.position ? parsedData?.company?.accentColor : parsedData?.accentColor }}>
                        <p className=' text-7xl text-white font-semibold'>{counterName} {monitorLanguage === "ENG" ? "Number" : monitorLanguage === "AR" ? "رقم" : monitorLanguage === "FR" ? "Numéro" : null}</p>
                        {/* <p className=' text-7xl'>{receivedData.counterNumber}</p> */}
                        <div className=' max-w-[400px] w-full rounded-full h-[400px] items-center justify-center flex text-white' >
                          <p className=' z-50 font-bold text-9xl'>{receivedData.counterNumber}</p>
                        </div>
                      </div>
                      <div className=' h-[18%] flex flex-row'>
                        <div dir={monitorLanguage === "AR" ? "rtl" : "ltr"} className=' flex flex-row w-[45%] mx-auto rounded-3xl p-4 px-20 items-center justify-between' style={{ backgroundColor: hexToRgbA(parsedData?.position ? parsedData?.company?.accentColor : parsedData?.accentColor) }}>
                          <div className=' flex flex-row items-center justify-center space-x-4'>
                            <img src="/assets/time.png" class   Name=' h-20 ml-4' alt="" />
                            <p className=' text-5xl font-semibold'>{monitorLanguage === "ENG" ? "Clients Waiting" : monitorLanguage === "AR" ? " في الانتظار" : monitorLanguage === "FR" ? "Clients en attente" : null} </p>
                          </div>
                          <p className='text-6xl font-semibold'>{waitingClientsCount.length}</p>
                        </div>
                        <div dir={monitorLanguage === "AR" ? "rtl" : "ltr"} className=' flex flex-row w-[45%] mx-auto rounded-3xl p-4 px-20 items-center justify-between' style={{ backgroundColor: hexToRgbA(parsedData?.position ? parsedData?.company?.accentColor : parsedData?.accentColor) }}>
                          {
                            [...clientsHistory].reverse().slice(0, 3).map((counter, index) => (
                              <div className='flex flex-row w-full h-full items-center relative justify-evenly' key={index}>
                                <p className=' text-6xl font-bold mx-auto text-center pr-5'>{(enableCounterLetter ? counter.letter : "") + formatNumber(counter.number)}</p>
                                {counter.clientType === "Handicapped" ? (
                                  <img className=' p-6 absolute right-0 h-24 w-24' src="/assets/handicap.png" alt="" />
                                ) : counter.clientType === "Business" ? (
                                  <img className=' p-6 absolute right-0 h-24 w-24' src="/assets/business.png" alt="" />
                                ) : counter.clientType === "Individuel" ? (
                                  <img className=' p-6 absolute right-0 h-24 w-24' src="/assets/particulier.png" alt="" />
                                ) : null}
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </React.Fragment >
  )
}

export default HomePage

const translations = {
  AR: {
    Counter: 'الشباك',
    Office: 'المكتب',
    Clinic: 'العيادة',
    Room: 'الغرفة',
  },
  ENG: {
    Counter: 'Counter',
    Office: 'Office',
    Clinic: 'Clinic',
    Room: 'Room',
  },
  FR: {
    Counter: 'Guichet',
    Office: 'Bureau',
    Clinic: 'Clinique',
    Room: 'Chambre',
  },
};



function translateCounterName(counterName, language) {
  const translation = translations[language];

  if (translation && translation[counterName]) {
    return translation[counterName];
  } else {
    // If the translation for the counterName in the specified language is not available, return the original value.
    return counterName;
  }
}