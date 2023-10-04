import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/configureStore";
import {
  fetchMessagesAsync,
  messagesSelectors,
} from "../../features/admin/messages/messagesSlice";

export default function useMessages() {
  const messages = useAppSelector(messagesSelectors.selectAll);
  const { isLoaded, status, metaData } = useAppSelector(
    (state) => state.messages
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoaded) dispatch(fetchMessagesAsync());
  }, [isLoaded, dispatch]);

  return {
    messages,
    isLoaded,
    status,
    metaData,
  };
}
