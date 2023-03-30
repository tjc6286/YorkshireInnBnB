import React from "react";




const AdminPricing: React.FC = () => {
    return (
        <div className="bg-gray-900 min-h-screen flex items-center justify-center">
          <div className="bg-gray-800 flex-1 flex flex-col space-y-5 lg:space-y-0 lg:flex-row lg:space-x-10 max-w-6xl sm:p-6 sm:my-2 sm:mx-4 sm:rounded-2xl">
            <div className="flex-1 px-2 sm:px-0">
              {/* <!-- Title --> */}
              <div className="flex justify-between items-center">
                <h3 className="text-3xl text-white font-bold text-center md:mt-2 mt-10">
                  Yorkshire Inn Admin Portal - Room Pricing
                </h3>
                <div className="inline-flex items-center space-x-2">
                  <p className="text-white">Logged in as : test</p>
                  <a
                    className="bg-gray-900 text-white/50 p-2 rounded-md hover:text-white smooth-hover"
                    href="#"
                  >
                    <button>Logout</button>
                  </a>
                </div>
              </div>
              {/* Content */}
              <div className="mb-10 sm:mb-0 mt-10 grid gap-4 grid-cols-1">
                
                <details class="relative group text-3xl bg-gray-900 py-10 px-4 flex flex-col space-y-2 items-center cursor-pointer rounded-md hover:bg-gray-900/80 hover:smooth-hover">
                <summary class="w-full text-white capitalize text-center flex justify-between px-4 py-3  after:content-['+']">Blue Room</summary>
                  <p className="text-white">Stuff about the blue room. How to view and set price for the future days?</p>
                </details>
    
                <details class="relative group text-3xl bg-gray-900 py-10 px-4 flex flex-col space-y-2 items-center cursor-pointer rounded-md hover:bg-gray-900/80 hover:smooth-hover">
                <summary class="w-full text-white capitalize text-center flex justify-between px-4 py-3  after:content-['+']">Bolero Room</summary>
                  <p className="text-white">Stuff about the Bolero room. How to view and set price for the future days?</p>
                </details>
    
                <details class="relative group text-3xl bg-gray-900 py-10 px-4 flex flex-col space-y-2 items-center cursor-pointer rounded-md hover:bg-gray-900/80 hover:smooth-hover">
                <summary class="w-full text-white capitalize text-center flex justify-between px-4 py-3  after:content-['+']">Rose Suite</summary>
                  <p className="text-white">Stuff about the Rose Suite. How to view and set price for the future days?</p>
                </details>
    
                <details class="relative group text-3xl bg-gray-900 py-10 px-4 flex flex-col space-y-2 items-center cursor-pointer rounded-md hover:bg-gray-900/80 hover:smooth-hover">
                <summary class="w-full text-white capitalize text-center flex justify-between px-4 py-3  after:content-['+']">Lodge Suite</summary>
                  <p className="text-white">Stuff about the lodge suite. How to view and set price for the future days?</p>
                </details>
    
            
              </div>
              
            </div>
          </div>
        </div>
      );
};

export default AdminPricing;
