import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Button, Stack } from "@mui/material";
import Friend from "../components/Friend";
import SearchUsers from "../components/SearchUsers";
import { getFriends } from "../util/api";

const FriendsPage: React.FC = () => {
  // Todo: Fix state: any errors/warnings
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userID = useSelector((state: any) => state.auth.user._id);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const searchUsersRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isLoggedIn = useSelector((state: any) => state.auth.isAuthenticated);

  const { data: friends, isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getFriends,
    enabled: isLoggedIn && !!userID,
    staleTime: 30 * 60 * 1000,
  });

  const addFriend = async (friendID: string) => {
    try {
      const response = await axios.post(
        `/api/friends/add?friendId=${friendID}`
      );
      if (response.status < 300) {
        // Update the friends list
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(axiosError.response?.data);
    }
  };

  const handleFormSubmit = async () => {
    const friendID = searchUsersRef.current.getSelectedUser();
    if (friendID) {
      await addFriend(friendID);
      searchUsersRef.current && searchUsersRef.current.clearInput();
    }
  };

  return (
    <>
      {loadingFriends ? (
        <p style={{ textAlign: "center", color: "white" }}>
          Loading Friends...
        </p>
      ) : (
        <>
          <h1 style={{ color: "white" }}>{userID}: Friends</h1>
          <ul>
            {friends.map((f: { friendId: string; status: string }) => (
              <Friend key={f.friendId} id={f.friendId} status={f.status} />
            ))}
          </ul>
        </>
      )}
      <h1 style={{ color: "white" }}>{userID}: Add Friends</h1>
      <Stack
        direction="row"
        alignItems="center"
        style={{ marginBottom: "20px" }}
      >
        <SearchUsers sxProps={{ width: "12vw" }} ref={searchUsersRef} />
        <Button
          variant="contained"
          size="large"
          onClick={handleFormSubmit}
          sx={{
            my: "1rem",
            ml: "1rem",
            backgroundColor: "#47a661",
            "&:hover": {
              backgroundColor: "#367a4e", // Your custom color for hover state
            },
            color: "white",
          }}
        >
          Add
        </Button>
      </Stack>
    </>
  );
};

export default FriendsPage;
