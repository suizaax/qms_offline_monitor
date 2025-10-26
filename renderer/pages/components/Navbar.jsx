import React, { useState } from 'react'
import moment from 'moment'


const Navbar = ({ accentColor, currentTime, companyName, secondaryColor, companyLogo }) => {

    // const [currentTime, setCurrentTime] = useState(null);

    // setInterval(function () {
    //     // Get the current time using Moment.js
    //     setCurrentTime(moment(Date.now()).format("h:mm:ss a - dddd MMM DD, YYYY"));
    // }, 1000);

    return (
        <React.Fragment>

            <div className={'flex flex-row justify-between items-center h-[10vh] bg-[#4B2DCC] bg-opacity-10 px-20 '} style={{ backgroundColor: secondaryColor }}>
                <div className=' flex items-center'>
                    <img
                        src={companyLogo === null ? "/assets/logo.png" : `${companyLogo}`}
                        // width={120}
                        // height={120}
                        className=' w-48 p-4'
                    />
                    <p className=' text-4xl font-bold tracking-wider uppercase'>{companyName === null ? "Company Name" : companyName}</p>
                </div>
                <div className=' flex items-center space-x-5'>
                    <h1 className=' text-center text-4xl font-medium text-[#363636]'>
                        {currentTime == null ? moment(Date.now()).format("h:mm:ss a - dddd MMM DD, YYYY") : currentTime}
                    </h1>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Navbar