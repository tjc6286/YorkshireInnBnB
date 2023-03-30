import React from "react";


const AdminBooking: React.FC = () => {
    return (
        <div>
            <div class="bg-gray-900 min-h-screen flex items-center justify-center">
                <div class="bg-gray-800 flex-1 flex flex-col space-y-5 lg:space-y-0 lg:flex-row lg:space-x-10 max-w-6xl sm:p-6 sm:my-2 sm:mx-4 sm:rounded-2xl">
                    <div class="flex-1 px-2 sm:px-0">
                        <div class="flex justify-between items-center">
                            <h3 class="text-3xl text-white font-bold text-center md:mt-2 mt-10">Yorkshire Inn Admin Portal - Booking</h3>
                            <div class="inline-flex items-center space-x-2"><p class="text-white">Logged in as : test</p>
                              <a class="bg-gray-900 text-white/50 p-2 rounded-md hover:text-white smooth-hover" href="#">
                                  <button>Logout</button>
                              </a>
                            </div>
                        </div>
                    <div class="mb-10 sm:mb-0 mt-10">
                      <div class=""> 
                        <div class="text-white">
                          Customer Information
                        </div>
                      </div>
                        
                        <div class="flex space-x-4 ...">
                          <input type="text" placeholder="First Name" class="input w-40 max-w-sm" />
                          <input type="text" placeholder="Last Name" class="input w-40 max-w-sm" />
                          <input type="text" placeholder="Phone Number" class="input w-40 max-w-sm" />
                          <button class="bg-gray-900 text-white/70 p-2 rounded-md hover:text-white smooth-hover">Submit</button>
                        </div>
                    </div>
    
                    <div> 
                      <div class="container p-2 mx-auto sm:p-4 dark:text-gray-100">
                        <h2 class="mb-4 text-2xl font-semibold leading-tight">Reservations</h2>
                        <div class="overflow-x-auto">
                          <table class="min-w-full text-xs">
                            <colgroup>
                              <col></col>
                              <col></col>
                              <col></col>
                              <col></col>
                              <col></col>
                              <col></col>
                              <col class="w-24"></col>
                            </colgroup>
                              
                            <thead class="dark:bg-gray-700">
                              <tr class="text-left">
                                <th class="p-3">Select</th>
                                <th class="p-3">Reservation ID</th>
                                <th class="p-3">Customer Name</th>
                                <th class="p-3">Phone Number</th>
                                <th class="p-3">Dates Booked</th>
                                <th class="p-3 text-right">Total</th>
                                <th class="p-3">Payment Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr class="border-b border-opacity-20 dark:border-gray-700 dark:bg-gray-900">
                                <td class="p-3">
                                  <input type="radio" name="radio-1" class="radio" />
                                </td>
                                <td class="p-3">
                                  <p>1234</p>
                                </td>
                                <td class="p-3">
                                  <p>Customer Name</p>
                                </td>
                                <td class="p-3">
                                  <p>123-456-7890</p>
                                </td>
                                <td class="p-3">
                                  <p>01 Feb 2023 - 02 Feb 2023</p>
                                </td>
                                <td class="p-3 text-right">
                                  <p>$10</p>
                                </td>
                                <td class="p-3 text-right">
                                  <span class="px-3 py-1 font-semibold rounded-md dark:bg-violet-400 dark:text-gray-900">
                                    <span>Pending</span>
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
    
                    <div class="text-white space-x-4">
                      
    
                      <a href="">
                        <button class="bg-gray-900 text-white/70 p-2 rounded-md hover:text-white smooth-hover">Create New Booking</button>
                      </a>
                      <button class="bg-gray-900 text-white/70 p-2 rounded-md hover:text-white smooth-hover">Edit Booking</button>
                      <button class="bg-gray-900 text-white/70 p-2 rounded-md hover:text-white smooth-hover">Cancel Booking</button>
                    </div>
    
    
    
                  </div>
                </div>
            </div>
        </div>
      );
};

export default AdminBooking;