"use client";

import { useState } from "react";
import { useAuth } from "@/app/lib/AuthContext";
import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { format } from "date-fns";

// Mock data for discussions
const mockDiscussions = [
  {
    id: "1",
    title: "Best practices for React performance optimization",
    content:
      "What are your favorite techniques for optimizing React applications?",
    author: "John Doe",
    community: "Web Development",
    createdAt: new Date(2024, 3, 10, 14, 30),
    replies: 12,
    views: 156,
  },
  {
    id: "2",
    title: "Design system implementation strategies",
    content:
      "How do you approach implementing a design system in a large organization?",
    author: "Jane Smith",
    community: "Design Enthusiasts",
    createdAt: new Date(2024, 3, 11, 10, 15),
    replies: 8,
    views: 98,
  },
  {
    id: "3",
    title: "Fundraising tips for early-stage startups",
    content: "What are your experiences with raising seed funding?",
    author: "Mike Johnson",
    community: "Startup Founders",
    createdAt: new Date(2024, 3, 12, 16, 45),
    replies: 15,
    views: 234,
  },
];

export default function Discussions() {
  const { user } = useAuth();
  const [discussions] = useState(mockDiscussions);

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-primary">Discussions</h1>
          <Link
            href="/dashboard/discussions/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Start Discussion
          </Link>
        </div>

        <div className="mt-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {discussions.map((discussion) => (
                <li key={discussion.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-primary truncate">
                          {discussion.title}
                        </p>
                        <p className="mt-1 text-sm text-muted">
                          {discussion.content}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex space-x-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {discussion.replies} replies
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted/10 text-muted">
                          {discussion.views} views
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-muted">
                          Posted by {discussion.author}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-muted sm:mt-0 sm:ml-6">
                          in {discussion.community}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-muted sm:mt-0">
                        <p>
                          {format(discussion.createdAt, "MMMM d, yyyy h:mm a")}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Link
                        href={`/dashboard/discussions/${discussion.id}`}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-primary bg-primary/10 hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                      >
                        View Discussion
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
