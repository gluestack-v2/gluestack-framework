import { CommonCommands } from '@/components/CommonCommands';
import { LogPanel } from '@/components/LogPanel';
export default function Page({ params }: { params: { slug: string } }) {
  return (
    <div className="flex flex-1 flex-col">
      <CommonCommands />
      <LogPanel />
    </div>
  );
}
