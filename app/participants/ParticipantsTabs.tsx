'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation'
import { heartsColumns } from '../heartsParticipants/columns';
import { columns } from '../o-hell/columns';
import { DataTable } from './data-table';
import { HeartsDataTable } from '../heartsParticipants/data-table';

export default function ParticipantsTabs({ oHellData, heartsData }: { oHellData: any, heartsData: any }) {
  const router = useSearchParams();
  const tab = router.get('tab');

  const defaultTab = tab === 'hearts' ? 'hearts' : 'o-hell';

  return (
    <Tabs defaultValue="o-hell" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-11">
          <TabsTrigger value="o-hell" className="py-2">O-Hell Leaderboard</TabsTrigger>
          <TabsTrigger value="password" className="py-2">Hearts Leaderboard</TabsTrigger>
        </TabsList>
        <TabsContent value={defaultTab}>
          <div className="py-4">
            <DataTable columns={columns} data={oHellData} />
          </div>
          <Link href={`/o-hell`} className="font-medium text-primary underline underline-offset-4">Game Log</Link>
        </TabsContent>
        <TabsContent value="hearts">
            <div className="py-4">
              <HeartsDataTable columns={heartsColumns} data={heartsData} />
            </div>
            <Link href={`/hearts`} className="font-medium text-primary underline underline-offset-4">Game Log</Link>
        </TabsContent>
      </Tabs>
  );
}