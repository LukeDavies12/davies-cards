"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Game } from "@prisma/client"
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() !== "desc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "participants",
    header: "Participants",
    cell: ({ row }) => {
      // Assuming row.original.participants is an array of objects with a 'name' property
      if (Array.isArray(row.original.participants)) {
        return row.original.participants
          .map((participant: { name?: string }) => participant.name)
          .filter(name => name) // Filter out undefined or null names
          .join(', ');
      }
      return ''; // Return an empty string if participants is not an array
    }
  },
  {
    accessorKey: "winner",
    header: "Winner",
  },
  {
    accessorKey: "winnerScore",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() !== "desc")}
        >
          Winning Score
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "secondPlace",
    header: "2nd Place",
  },
  {
    accessorKey: "secondPlaceScore",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() !== "desc")}
        >
          2nd Place Score
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "thirdPlace",
    header: "3rd Place",
  },
  {
    accessorKey: "thirdPlaceScore",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() !== "desc")}
        >
          3rd Place Score
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  }
]