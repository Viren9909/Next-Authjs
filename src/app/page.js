"use client"
import Profile from "@/components/Profile";
import SessionWropper from "@/components/SessionWropper";

export default function Home() {
  return (
    <div className="h-full">
      <SessionWropper>
        <div className="h-full">
          <Profile />
        </div>
      </SessionWropper>
    </div>
  );
}
