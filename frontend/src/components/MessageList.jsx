// import React from 'react'
// import dp from "../assets/dp.webp";

// function MessageList({selectedUser}) {
// if(!selectedUser){
//     return(
//           <div className="flex-1 flex items-center justify-center text-gray-400">
//         Select a user to start chat
//       </div>
//     )
// }
//   return (
//     <div className="w-4/5 h-16 px-6 flex items-center justify-between pt-30">
//   {/* Left: user info */}
//   <div className="flex items-center gap-4">
//     <div className="w-10 h-10 rounded-full overflow-hidden">
//       <img
//         src={selectedUser.profileImage?.url || dp}
//         alt="user"
//         className="w-full h-full object-cover"
//       />
//     </div>

//     <div className="flex flex-col leading-tight">
//       <span className="font-semibold text-gray-800">
//         {selectedUser.firstName} {selectedUser.lastName}
//       </span>
//     </div>
//   </div>
// </div>

//   )
// }

// export default MessageList




import React from 'react';
import dp from "../assets/dp.webp";

function MessageList({ selectedUser, onBack }) {
  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a user to start chat
      </div>
    );
  }

  return (
    <div className="w-full h-16 px-6 flex justify-between pt-24 ">
      
      {/* Back button for small devices */}
      <div className="flex items-center gap-4 sm:hidden">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-gray-200"
        >
          ← Back
        </button>
      </div>

      {/* User info */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            src={selectedUser.profileImage?.url || dp}
            alt="user"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col leading-tight">
          <span className="font-semibold text-gray-800">
            {selectedUser.firstName} {selectedUser.lastName}
          </span>
        </div>
      </div>
    </div>
  );
}

export default MessageList;
