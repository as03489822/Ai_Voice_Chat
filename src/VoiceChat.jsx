import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';


const VoiceChat = () => {
  return (
    <div className='flex flex-col justify-center items-center h-[100vh]'>
        <div className='h-[65vh] flex flex-col items-center shadow-2xl/30 w-[350px] rounded-2xl overflow-hidden '>
            <div className='bg-[#4361EE] w-full h-[60px] flex items-center px-[20px]'>
                <h1 className='font-bold text-white'>Voice Chat</h1>
            </div>
            <div>
                <p>Hello how can i help you</p>
            </div>
            <form action="" className='w-full'>
                <input type=" text" className='py-2 w-full bg-[#F3F5F6]' />
                <FontAwesomeIcon className='rotate-50 cursor-pointer' icon={faPaperPlane} />
            </form>
        </div>
    </div>
  )
}

export default VoiceChat