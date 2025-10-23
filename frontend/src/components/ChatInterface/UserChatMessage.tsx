import { Card, CardContent } from "@/components/ui/card";
import { SaveIcon } from "lucide-react";
import { Button } from "../ui/button";

// temporary props for future api calla
type UserChatMessageProps = {
  text: string;
  onSave?: () => void;
};

export default function UserChatMessage({ text, onSave }: UserChatMessageProps) {
  return (
    // main msg container
    <div className="flex flex-col items-end gap-1 group">
      <div className="flex justify-end w-full">
        <Card className="py-[10px] max-w-[90%]">
          <CardContent className="px-[10px] text-sm lg:text-md break-words">
            <p>{text}</p>
          </CardContent>
        </Card>
      </div>

      {/* hover save button */}
      <div className="flex justify-end">
        <button
          // visible by default on small (touch) screens, hidden on md+ until hover/focus
          className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity focus:opacity-100"
          onClick={onSave}
          aria-label="Save message"
        >
          <SaveIcon className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground" />
        </button>
      </div>
    </div>
  );
}
