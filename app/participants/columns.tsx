"use client"

import { ColumnDef, FilterFnOption } from "@tanstack/react-table"
import { Participant } from "@prisma/client"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

export type ParticipantWithStats = Participant & {
  gamesPlayed: number;
  gamesWon: number;
  gamesSecondPlace: number;
  gamesThirdPlace: number;
  percentageWon: string;
  totalPoints: number;
}

export const columns: ColumnDef<ParticipantWithStats>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "gamesWon",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-lg"
        >
          Games Won
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "gamesPlayed",
    filterFn: 'greaterThan' as FilterFnOption<ParticipantWithStats>,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-lg"
        >
          Games Played
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "percentageWon",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-lg italic"
        >
          Win %
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "totalPoints",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-lg"
        >
          Points
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
]
