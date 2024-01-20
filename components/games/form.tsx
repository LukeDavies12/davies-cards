'use client'

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from 'react';
import { Button } from "../ui/button";

const GameForm = () => {
  const [gameData, setGameData] = useState({
    date: '',
    participants: [],
    winnerName: '',
    winnerScore: 0,
    secondPlaceName: '',
    secondPlaceScore: 0,
    thirdPlaceName: '',
    thirdPlaceScore: 0,
    gameTypeId: 1,
  });

  const handleChange = (e: any) => {
    setGameData({ ...gameData, [e.target.name]: e.target.value });
  };

  const handleGameTypeChange = (e: any) => {
    const gameTypeId = e.target.value === 'option-one' ? 2 : 1;
    setGameData({ ...gameData, gameTypeId });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/games', { // Replace with your actual endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Handle success
    } catch (error) {
      // Handle errors
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-md bg-white shadow-sm rounded-lg mb-12">
      <form onSubmit={handleSubmit}>
        {/* Date Field */}
        <Label htmlFor="date">Date</Label>
        <Input type="date" name="date" id="date" onChange={handleChange} />
        <br />

        {/* Participants Field */}
        <Label htmlFor="participants">Participants (Names separated by commas)</Label>
        <Input name="participants" id="participants" onChange={handleChange} />
        <br />

        {/* Winner Fields */}
        <Label htmlFor="winnerName">Winner</Label>
        <Input type="text" name="winnerName" id="winnerName" onChange={handleChange} />
        <br />

        <Label htmlFor="winnerScore">Winner Score</Label>
        <Input type="number" name="winnerScore" id="winnerScore" onChange={handleChange} />
        <br />

        {/* Second Place Fields */}
        <Label htmlFor="secondPlaceName">Second Place</Label>
        <Input type="text" name="secondPlaceName" id="secondPlaceName" onChange={handleChange} />
        <br />

        <Label htmlFor="secondPlaceScore">Second Place Score</Label>
        <Input type="number" name="secondPlaceScore" id="secondPlaceScore" onChange={handleChange} />
        <br />

        {/* Third Place Fields */}
        <Label htmlFor="thirdPlaceName">Third Place</Label>
        <Input type="text" name="thirdPlaceName" id="thirdPlaceName" onChange={handleChange} />
        <br />

        <Label htmlFor="thirdPlaceScore">Third Place Score</Label>
        <Input type="number" name="thirdPlaceScore" id="thirdPlaceScore" onChange={handleChange} />
        <br />

        {/* Game Type ID */}
        <Label htmlFor="gameTypeId">Game Type</Label>
        <RadioGroup defaultValue="option-one" onChange={handleGameTypeChange}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option-one" id="option-one" />
            <Label htmlFor="option-one">Hearts</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option-two" id="option-two" />
            <Label htmlFor="option-two">O-Hell</Label>
          </div>
        </RadioGroup>
        <br />
        <Button type="submit" className="w-full">Submit</Button>
      </form>
    </div>
  );
};

export default GameForm;
