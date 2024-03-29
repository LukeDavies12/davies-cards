// app.d.ts
/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("@/auth/lucia").Auth;
  type DatabaseUserAttributes = {
    username: string;
    name: string;
  };
  type DatabaseSessionAttributes = {};
}