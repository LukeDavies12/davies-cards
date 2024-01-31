'use client'

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from 'react';
import { Button } from "../ui/button";

export const RemoveParticipantFrom = () => {
  const [participantId, setParticipantId] = useState('');

  const handleChange = (e: any) => {
    setParticipantId(e.target.value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log('Deleting Participant', participantId);

    try {
      const response = await fetch(`/api/participants/${participantId}`, { // Replace with your actual endpoint
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      console.log('Participant deleted successfully');
      setParticipantId('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-md bg-white shadow-sm rounded-lg mb-12">
      <form onSubmit={handleSubmit}>
        <Label htmlFor="participantId" className="text-muted-foreground">
          Participant ID
        </Label>
        <Input name="participantId" id="participantId" value={participantId} onChange={handleChange} />
        <br />
        <Button type="submit">Delete Participant</Button>
      </form>
    </div>
  );
};
