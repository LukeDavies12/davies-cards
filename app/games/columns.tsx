"use client"

import { ColumnDef, FilterFnOption } from "@tanstack/react-table"
import { Game, Participant } from "@prisma/client"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export type GamesWithParticipants = Game & {
  participants: {
    name: string;
  }[];
  winner: string;
  secondPlace: string;
  thirdPlace: string;
  dateString: string;
}

export const columns: ColumnDef<GamesWithParticipants>[] = [
  {
    accessorKey: "dateString",
    header: "Date",
  },
  {
    accessorKey: "participants",
    header: "Participants",
    cell: ({ row }) => {
      return row.original.participants.map((participant: { name: string }) => participant.name).join(', ');
    }
  },
  {
    accessorKey: "winner",
    header: "Winner",
  },
  {
    accessorKey: "winnerScore",
    header: "Winning Score",
  },
  {
    accessorKey: "secondPlace",
    header: "2nd Place",
  },
  {
    accessorKey: "secondPlaceScore",
    header: "2nd Place Score",
  },
  {
    accessorKey: "thirdPlace",
    header: "3rd Place",
  },
  {
    accessorKey: "thirdPlaceScore",
    header: "3rd Place Score",
  }
]