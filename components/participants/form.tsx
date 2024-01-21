'use client'

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from 'react';
import { Button } from "../ui/button";

export const ParticipantForm = () => {
  const [name, setName] = useState('');

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setName(value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log('Form submitted', name);

    try {
      const response = await fetch('/api/participants', { // Replace with your actual endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      console.log('Success:', responseData);
      setName('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-md bg-white shadow-sm rounded-lg mb-12">
      <form onSubmit={handleSubmit}>
        <Label htmlFor="name" className="text-muted-foreground">
          Name
        </Label>
        <Input name="name" id="name" value={name} onChange={handleChange} />
        <br />
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}