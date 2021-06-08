import React from 'react';
import { ToastContainer, toast } from 'react-toastify';

export default function Toastify() {
  const notify = () => toast('Wow so ease !');

  return (
    <div>
      <button onClick={notify}>Notify !</button>
      <ToastContainer
        position="bottom-right"
        autoClose={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
      />
    </div>
  );
}
