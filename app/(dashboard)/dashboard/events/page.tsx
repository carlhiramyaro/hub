"use client";

import { useState } from "react";
import { useAuth } from "@/app/lib/AuthContext";
import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { format } from "date-fns";

// Mock data for events
const mockEvents = [
  {
    id: "1",
    title: "Web Development Workshop",
    description:
      "Learn the latest web development techniques and best practices",
    date: new Date(2024, 3, 15, 14, 0),
    community: "Web Development",
    location: "Virtual",
    attendees: 45,
  },
  {
    id: "2",
    title: "Design System Workshop",
    description: "Deep dive into creating and maintaining design systems",
    date: new Date(2024, 3, 20, 15, 0),
    community: "Design Enthusiasts",
    location: "Virtual",
    attendees: 32,
  },
  {
    id: "3",
    title: "Startup Pitch Night",
    description:
      "Pitch your startup idea and get feedback from experienced founders",
    date: new Date(2024, 3, 25, 18, 0),
    community: "Startup Founders",
    location: "Virtual",
    attendees: 78,
  },
];

export default function Events() {
  const { user } = useAuth();
  const [events] = useState(mockEvents);

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Events</h1>
          <Link
            href="/dashboard/events/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Create Event
          </Link>
        </div>

        <div className="mt-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {events.map((event) => (
                <li key={event.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {event.title}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {event.description}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {event.attendees} attending
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {format(event.date, "MMMM d, yyyy h:mm a")}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          {event.location}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>{event.community}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Link
                        href={`/dashboard/events/${event.id}`}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        View Event
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
