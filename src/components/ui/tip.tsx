import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface TipProps {
  children?: React.ReactNode;
}

export function Tip({ children }: TipProps) {
  return (
    <div className={cn("my-6 flex items-center rounded-md  border-l-4 border-green-500 bg-blue-50 p-4 dark:bg-blue-900/20")}>
      <Lightbulb className="mr-4 h-5 w-5 text-green-500" />
      <div className="prose-sm max-w-none text-green-800 dark:text-green-200">{children}</div>
    </div>
  );
}
