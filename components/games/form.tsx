'use client'

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from 'react';
import { Button } from "../ui/button";

const GameForm = () => {
  const [gameData, setGameData] = useState({
    date: '',
    participantNames: '',
    winnerName: '',
    winnerScore: 0,
    secondPlaceName: '',
    secondPlaceScore: 0,
    thirdPlaceName: '',
    thirdPlaceScore: 0,
    gameTypeId: 1,
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setGameData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleGameTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGameData({ ...gameData, gameTypeId: parseInt(e.target.value) });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log('Form submitted', gameData);

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

      const responseData = await response.json();
      console.log('Success:', responseData);
      setGameData({
        date: '',
        participantNames: '',
        winnerName: '',
        winnerScore: 0,
        secondPlaceName: '',
        secondPlaceScore: 0,
        thirdPlaceName: '',
        thirdPlaceScore: 0,
        gameTypeId: 1,
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-md bg-white shadow-sm rounded-lg mb-12">
      <form onSubmit={handleSubmit}>
        {/* Date Field */}
        <Label htmlFor="date">Date</Label>
        <Input type="date" name="date" id="date" onChange={handleChange} value={gameData.date} />
        <br />

        {/* Participants Field */}
        <Label htmlFor="participantNames">Participants (Names separated by commas)</Label>
        <Input name="participantNames" id="participantNames" onChange={handleChange} value={gameData.participantNames} />
        <br />

        {/* Winner Fields */}
        <Label htmlFor="winnerName">Winner</Label>
        <Input type="text" name="winnerName" id="winnerName" onChange={handleChange} value={gameData.winnerName} />
        <br />

        <Label htmlFor="winnerScore">Winner Score</Label>
        <Input type="number" name="winnerScore" id="winnerScore" onChange={handleChange} min={0} value={gameData.winnerScore} />
        <br />

        {/* Second Place Fields */}
        <Label htmlFor="secondPlaceName">Second Place</Label>
        <Input type="text" name="secondPlaceName" id="secondPlaceName" onChange={handleChange} value={gameData.secondPlaceName} />
        <br />

        <Label htmlFor="secondPlaceScore">Second Place Score</Label>
        <Input type="number" name="secondPlaceScore" id="secondPlaceScore" onChange={handleChange} min={0} value={gameData.secondPlaceScore} />
        <br />

        {/* Third Place Fields */}
        <Label htmlFor="thirdPlaceName">Third Place</Label>
        <Input type="text" name="thirdPlaceName" id="thirdPlaceName" onChange={handleChange} value={gameData.thirdPlaceName} />
        <br />

        <Label htmlFor="thirdPlaceScore">Third Place Score</Label>
        <Input type="number" name="thirdPlaceScore" id="thirdPlaceScore" onChange={handleChange} min={0} value={gameData.thirdPlaceScore} />
        <br />

        {/* Game Type ID */}
        <Label htmlFor="gameTypeId">Game Type</Label>
        <RadioGroup defaultValue="1" onChange={handleGameTypeChange} value={gameData.gameTypeId.toString()}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1" id="option-one" />
            <Label htmlFor="option-one">O-Hell</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="2" id="option-two" />
            <Label htmlFor="option-two">Hearts</Label>
          </div>
        </RadioGroup>
        <br />
        <Button type="submit" className="w-full">Submit</Button>
      </form>
    </div>
  );
};

export default GameForm;
