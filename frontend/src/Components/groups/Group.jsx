import React from 'react'
import { useChatStore } from '../../store/useChatStore';
import NoGroupSelected from './NoGroupSelected';
import GroupContainer from './GroupContainer';
import Groupbar from './Groupbar';

const Group = () => {
    const getGroups = useChatStore((state) => state.getGroups);
  return (
    <div className="h-screen bg-base-200">
    <div className="flex items-center justify-center pt-20 px-4">
      <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
        <div className="flex h-full rounded-lg overflow-hidden">
          <Groupbar />

          {!getGroups ? <NoGroupSelected /> : <GroupContainer />}
        </div>
      </div>
    </div>
  </div>
);
};

export default Group