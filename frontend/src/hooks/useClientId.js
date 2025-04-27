import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { clientService } from "../api/clientService";

export const useClientId = () => {
  const { user } = useUser();
  const [clientId, setClientId] = useState(null);

  useEffect(() => {
    if (user) {
      clientService.getByUserId(user.sub)
        .then(res => setClientId(res.data.client_id))
        .catch(err => console.error(err));
    }
  }, [user]);

  return clientId;
};
