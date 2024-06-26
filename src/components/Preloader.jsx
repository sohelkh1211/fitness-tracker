import React from 'react'

const Preloader = () => {
    return (
        <div className="fixed top-0 left-0">
            <div className="relative z-1">
                <img src="https://cdn.svgator.com/images/2023/06/hearthbeat-svg-loader-animation.svg" alt="Heart Monitor SVG loader animation" loading="lazy" className='lg:h-[600px] md:h-[600px] sm:w-screen xs:w-[900px] xs:h-[750px]' />
            </div>
            <div className='absolute flex xs:top-[290px] sm:top-[150px] lg:ml-[44%] md:ml-[44%] sm:ml-[43%] xs:ml-[38%] border-none border-black'>
                <p className="text-white lg:text-[36px] xs:text-[25px]">Healthify</p>
            </div>
        </div>
    )
}

export default Preloader