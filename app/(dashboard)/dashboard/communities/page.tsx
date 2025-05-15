"use client";

import { useState } from "react";
import { useAuth } from "@/app/lib/AuthContext";
import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

// Mock data for communities
const mockCommunities = [
  {
    id: "1",
    name: "Web Development",
    description:
      "A community for web developers to share knowledge and experiences",
    memberCount: 1234,
    imageUrl:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2072&q=80",
  },
  {
    id: "2",
    name: "Design Enthusiasts",
    description: "Share and discuss design trends, tools, and inspiration",
    memberCount: 856,
    imageUrl:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2064&q=80",
  },
  {
    id: "3",
    name: "Startup Founders",
    description: "Connect with other founders and share your startup journey",
    memberCount: 567,
    imageUrl:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
  },
];

export default function Communities() {
  const { user } = useAuth();
  const [communities] = useState(mockCommunities);

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Communities</h1>
          <Link
            href="/dashboard/communities/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Create Community
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {communities.map((community) => (
            <div
              key={community.id}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="relative h-48">
                <img
                  src={community.imageUrl}
                  alt={community.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {community.name}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {community.description}
                </p>
                <div className="mt-4">
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    {community.memberCount} members
                  </span>
                </div>
                <div className="mt-6">
                  <Link
                    href={`/dashboard/communities/${community.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    View Community
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
