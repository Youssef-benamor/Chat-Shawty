import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchRecipientUser = (chat, user) => {
  const [recipientUser, setRecipientUser] = useState(null);
  const [error, setError] = useState(null);

  // Get the other user's ID from chat members array
  const recipientId = chat?.members.find((id) => id !== user?._id);

  useEffect(() => {
    if (!recipientId) {
      setRecipientUser(null);
      setError(null);
      return;
    }

    const getUser = async () => {
      try {
        const response = await getRequest(
          `${baseUrl}/users/find/${recipientId}`,
        );

        if (response.error) {
          setError(response.error);
          setRecipientUser(null);
        } else {
          setRecipientUser(response);
          setError(null);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch recipient user");
        setRecipientUser(null);
      }
    };

    getUser();
  }, [recipientId]);

  return { recipientUser, error };
};
