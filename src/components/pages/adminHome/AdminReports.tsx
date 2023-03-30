import React from "react";


const AdminReports: React.FC = () => {
  

    return (
        <div>
            <div class="bg-gray-900 min-h-screen flex items-center justify-center">
                <div class="bg-gray-800 flex-1 flex flex-col space-y-5 lg:space-y-0 lg:flex-row lg:space-x-10 max-w-6xl sm:p-6 sm:my-2 sm:mx-4 sm:rounded-2xl">
                    <div class="flex-1 px-2 sm:px-0">
                        <div class="flex justify-between items-center">
                            <h3 class="text-3xl text-white font-bold text-center md:mt-2 mt-10">Yorkshire Inn Admin Portal - Reports</h3>
                            <div class="inline-flex items-center space-x-2"><p class="text-white">Logged in as : test</p>
                              <a class="bg-gray-900 text-white/50 p-2 rounded-md hover:text-white smooth-hover" href="#">
                                  <button>Logout</button>
                              </a>
                            </div>
                        </div>
                    <div class="mb-10 sm:mb-0 mt-10">
                        
    
                    <div class="text-white mb-10">
                      Put report screen here or be lazy and export to csv maybe
    
                    </div>
    
    
                    <div class="overflow-x-auto text-white">
                              <table class="min-w-full text-xs">
                                <colgroup>
                                  <col></col>
                                  <col></col>
                                  <col class="w-24"></col>
                                </colgroup>
                                  
                                <thead class="dark:bg-gray-700">
                                  <tr class="text-left">
                                    <th class="p-3">Select</th>
                                    <th class="p-3">Report Name</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr class="border-b border-opacity-20 dark:border-gray-700 dark:bg-gray-900">
                                    <td class="p-3">
                                      <input type="radio" name="radio-1" class="radio" />
                                    </td>
                                    <td class="p-3">
                                      <p>Room revenue</p>
                                    </td>
                                  </tr>
                                </tbody>
                                <tbody>
                                  <tr class="border-b border-opacity-20 dark:border-gray-700 dark:bg-gray-900">
                                    <td class="p-3">
                                      <input type="radio" name="radio-1" class="radio" />
                                    </td>
                                    <td class="p-3">
                                      <p>Room booked percentage</p>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
    
    
                    <div class="text-white">
                      Put in calendar date selector. Can reusue the one from the booking proccess? 
                    </div>
                    <div class="text-white space-x-4">
                      <button class="bg-gray-900 text-white/70 p-2 rounded-md hover:text-white smooth-hover">Generate</button>
                      <button class="bg-gray-900 text-white/70 p-2 rounded-md hover:text-white smooth-hover">Clear</button>
    
                    </div>
    
    
    
                  </div>
                </div>
            </div>
        </div>
        </div>
      );
};

export default AdminReports;