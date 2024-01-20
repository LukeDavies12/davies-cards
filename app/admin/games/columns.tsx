"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Game } from "@prisma/client"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

export type GamesWithParticipantsandType = Game & {
  participants: string;
  winner: string;
  secondPlace: string;
  thirdPlace: string;
  dateString: string;
  gameTypeName: string;
}

const deleteGame = async (gameId: number) => {
  try {
    const response = await fetch(`/api/games?id=${gameId}`, {
      method: 'DELETE',
      // Include any necessary headers, like authentication tokens
    });

    const result = await response.text();
    if (response.ok) {
      // Successfully deleted the game
      console.log(result);
      // Remove the game from the table or refresh the table data here
    } else {
      // Handle failure
      console.error('Failed to delete game:', result);
    }
  } catch (error) {
    console.error('Error while deleting game:', error);
  }
};


export const columns: ColumnDef<GamesWithParticipantsandType>[] = [
  {
    accessorKey: "gameTypeName",
    header: "Game Type",
  },
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
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const gameId = row.original.id;
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => deleteGame(gameId)}
            >
              <span className="text-red-700 font-medium">Delete Game</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]