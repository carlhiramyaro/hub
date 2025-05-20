import { db } from "./firebase";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { Community, Post, Comment } from "../types";

// Community operations
export const createCommunity = async (
  name: string,
  description: string,
  createdBy: string
) => {
  const communityData: Omit<Community, "id"> = {
    name,
    description,
    createdAt: new Date(),
    createdBy,
    members: [createdBy],
    imageUrl: null,
  };

  const docRef = await addDoc(collection(db, "communities"), communityData);
  return { id: docRef.id, ...communityData };
};

export const joinCommunity = async (communityId: string, userId: string) => {
  const communityRef = doc(db, "communities", communityId);
  await updateDoc(communityRef, {
    members: arrayUnion(userId),
  });
};

export const leaveCommunity = async (communityId: string, userId: string) => {
  const communityRef = doc(db, "communities", communityId);
  await updateDoc(communityRef, {
    members: arrayRemove(userId),
  });
};

// Post operations
export const createPost = async (
  communityId: string,
  authorId: string,
  content: string
) => {
  const postData: Omit<Post, "id"> = {
    communityId,
    authorId,
    content,
    mediaUrls: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    likes: [],
    comments: [],
  };

  const docRef = await addDoc(collection(db, "posts"), postData);
  return { id: docRef.id, ...postData };
};

export const likePost = async (postId: string, userId: string) => {
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, {
    likes: arrayUnion(userId),
  });
};

export const unlikePost = async (postId: string, userId: string) => {
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, {
    likes: arrayRemove(userId),
  });
};

// Comment operations
export const createComment = async (
  postId: string,
  authorId: string,
  content: string
) => {
  const commentData: Omit<Comment, "id"> = {
    postId,
    authorId,
    content,
    createdAt: new Date(),
    updatedAt: new Date(),
    likes: [],
  };

  const docRef = await addDoc(collection(db, "comments"), commentData);

  // Update post's comments array
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, {
    comments: arrayUnion(docRef.id),
  });

  return { id: docRef.id, ...commentData };
};

export const likeComment = async (commentId: string, userId: string) => {
  const commentRef = doc(db, "comments", commentId);
  await updateDoc(commentRef, {
    likes: arrayUnion(userId),
  });
};

export const unlikeComment = async (commentId: string, userId: string) => {
  const commentRef = doc(db, "comments", commentId);
  await updateDoc(commentRef, {
    likes: arrayRemove(userId),
  });
};

// Fetch operations
export const getCommunity = async (communityId: string) => {
  const docRef = doc(db, "communities", communityId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Community;
  }
  return null;
};

export const getAllCommunities = async () => {
  const q = query(collection(db, "communities"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Community[];
};

export const getCommunityPosts = async (communityId: string) => {
  const q = query(
    collection(db, "posts"),
    where("communityId", "==", communityId),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Post[];
};

export const getPostComments = async (postId: string) => {
  const q = query(
    collection(db, "comments"),
    where("postId", "==", postId),
    orderBy("createdAt", "asc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Comment[];
};
