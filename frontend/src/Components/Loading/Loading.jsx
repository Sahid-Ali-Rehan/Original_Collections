import React from 'react';
import { BeatLoader } from 'react-spinners';

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <BeatLoader color="#8d5c51" size={15} margin={5} />
    </div>
  );
};

export default Loading;
