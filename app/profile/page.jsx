"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import Profile from "@components/Profile";

const MyProfile = () => {

  const routes = useRouter()
  const {data: session} = useSession();
  const [posts,setPosts] = useState([])

  useEffect(() => {
    console.log(session)
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${session?.user.id}/posts`)
      const data = await response.json();
      setPosts(data)
    }
    if(session?.user?.id)
      fetchPosts()
  },[])
  const handleEdit = (post) => { 
    routes.push(`/update-prompt?id=${post._id}`)
  }
  const handleDelete = async (post) => {
    try {
      const hasConfirmed = confirm("Are you sure you want to delete this prompt?")
      if(hasConfirmed){
        await fetch(`/api/prompt/${post._id.toString()}`,{
          method:'DELETE'
        })
        const filteredPosts = posts.filter((p) => p._id !== post._id)
        setPosts(filteredPosts)
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Profile
      name="My"
      desc="Welcome to your personalized profile page"
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default MyProfile;
