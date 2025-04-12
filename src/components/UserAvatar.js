import React from 'react';

export const UserAvatar = () => (
  <div className="w-10 h-10 rounded-full bg-indigo-100 flex justify-center items-center ml-2 flex-shrink-0">
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="4" fill="#4F46E5" />
      <path d="M4 18C4 14.6863 7.58172 12 12 12C16.4183 12 20 14.6863 20 18V20H4V18Z" fill="#4F46E5" />
    </svg>
  </div>
);
