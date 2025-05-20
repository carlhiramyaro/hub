"use client";

import { useAuth } from "@/app/lib/AuthContext";
import Link from "next/link";
import {
  UserGroupIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

const quickActions = [
  {
    name: "Join Community",
    description: "Find and join communities that match your interests",
    href: "/dashboard/communities",
    icon: UserGroupIcon,
  },
  {
    name: "Browse Events",
    description: "Discover upcoming events in your communities",
    href: "/dashboard/events",
    icon: CalendarIcon,
  },
  {
    name: "Start Discussion",
    description: "Create a new discussion in your communities",
    href: "/dashboard/discussions/new",
    icon: ChatBubbleLeftRightIcon,
  },
];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-primary">
          Welcome back, {user?.displayName || "there"}!
        </h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <div className="mt-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {quickActions.map((action) => (
                <Link
                  key={action.name}
                  href={action.href}
                  className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary rounded-lg shadow hover:shadow-md transition-all"
                >
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-primary/10 text-primary ring-4 ring-white">
                      <action.icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-primary">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {action.name}
                    </h3>
                    <p className="mt-2 text-sm text-muted">
                      {action.description}
                    </p>
                  </div>
                  <span
                    className="pointer-events-none absolute top-6 right-6 text-muted group-hover:text-primary transition-colors"
                    aria-hidden="true"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
