import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router";
import { useUserSession } from "@/contexts/UserSessionContext";
import { useState } from "react";

type Textbook = {
  id: string | number;
  title: string;
  author: string[];
  category: string;
};

// Proper formatting of authors tags
function formatAuthors(authors: string[]) {
  if (!authors || authors.length === 0) return "Unknown";
  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return `${authors[0]} & ${authors[1]}`;
  return authors.slice(0, -1).join(", ") + " & " + authors[authors.length - 1];
}

export default function TextbookCard({ textbook }: { textbook: Textbook }) {
  const navigate = useNavigate();
  const { userSessionId } = useUserSession();
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  const createChatSession = async () => {
    if (!userSessionId || isCreatingSession) return;
    
    setIsCreatingSession(true);
    try {
      // Get public token
      const tokenResponse = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/user/publicToken`);
      const { token } = await tokenResponse.json();

      // Create chat session
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/textbooks/${textbook.id}/chat_sessions`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_sessions_session_id: userSessionId
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create chat session');
      }

      const chatSession = await response.json();
      
      // Navigate with both textbook and chat session data
      navigate(`/textbook/${textbook.id}/chat`, { 
        state: { 
          textbook,
          chatSessionId: chatSession.id 
        } 
      });
    } catch (error) {
      console.error('Failed to create chat session:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsCreatingSession(false);
    }
  };

  return (
    <Card
      key={textbook.id}
      onClick={createChatSession}
      className="flex flex-col items-start p-[10px] gap-4 not-odd:transition-shadow hover:shadow-lg cursor-pointer"
    >
      <CardHeader className="flex-1 p-0 w-full">
        <CardTitle
          className="line-clamp-3 text-lg leading-[1.25] text-left overflow-hidden"
          style={{ minHeight: `calc(1em * 1.25 * 3)` }}
        >
          {textbook.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 w-full">
        <p className="truncate text-sm text-primary text-left">
          By {formatAuthors(textbook.author)}
        </p>
      </CardContent>
      <CardContent className="p-0 w-full">
        <p className="px-[10px] py-[5px] bg-primary text-primary-foreground border rounded-xl w-fit text-left">
          {textbook.category}
        </p>
      </CardContent>
    </Card>
  );
}
