'use client';
import { useTransition } from 'react';
const commands = ['start', 'build', 'prepare', 'up', 'down'];
import { runScript } from '../actions/action';
export const CommonCommands = () => {
  const [isPending, startTransition] = useTransition();
  return (
    <div className="flex gap-5 p-4 flex-1 w-full items-start bg-slate-600">
      {commands.map((command) => {
        return (
          <button
            disabled={isPending}
            className="bg-purple-500 hover:bg-purple-600 active:bg-purple-700 py-2 px-4 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              startTransition(() => {
                runScript(command);
              });
            }}
          >
            {command}
          </button>
        );
      })}
    </div>
  );
};
