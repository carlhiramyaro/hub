"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/lib/AuthContext";
import { useRouter } from "next/navigation";
import { PlusIcon } from "@heroicons/react/24/outline";
import { createCommunity, getAllCommunities } from "@/app/lib/firebase-utils";
import { Community } from "@/app/types";
import toast from "react-hot-toast";

export default function CommunitiesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newCommunity, setNewCommunity] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    loadCommunities();
  }, []);

  const loadCommunities = async () => {
    try {
      const communitiesData = await getAllCommunities();
      setCommunities(communitiesData);
    } catch (error) {
      console.error("Error loading communities:", error);
      toast.error("Failed to load communities");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCommunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const community = await createCommunity(
        newCommunity.name,
        newCommunity.description,
        user.uid
      );
      setCommunities([community, ...communities]);
      setIsCreating(false);
      setNewCommunity({ name: "", description: "" });
      toast.success("Community created successfully!");
    } catch (error) {
      console.error("Error creating community:", error);
      toast.error("Failed to create community");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-primary">Communities</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Community
        </button>
      </div>

      {isCreating && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-medium text-primary mb-4">
              Create New Community
            </h2>
            <form onSubmit={handleCreateCommunity}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-foreground"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={newCommunity.name}
                    onChange={(e) =>
                      setNewCommunity({ ...newCommunity, name: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm text-foreground placeholder:text-muted"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-foreground"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={newCommunity.description}
                    onChange={(e) =>
                      setNewCommunity({
                        ...newCommunity,
                        description: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm text-foreground placeholder:text-muted"
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-sm font-medium text-muted bg-white border border-gray-300 rounded-md shadow-sm hover:text-primary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {communities.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              No communities
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new community.
            </p>
          </div>
        ) : (
          communities.map((community) => (
            <div
              key={community.id}
              className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow"
              onClick={() =>
                router.push(`/dashboard/communities/${community.id}`)
              }
            >
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {community.name}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {community.description}
                </p>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <span>{community.members.length} members</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
