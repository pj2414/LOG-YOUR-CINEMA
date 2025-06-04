import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "./ui/button";

interface VideoPlayerProps {
  open: boolean;
  onClose: () => void;
  videoUrl: string;
}

export const VideoPlayer = ({ open, onClose, videoUrl }: VideoPlayerProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full p-0 bg-black/90 backdrop-blur-xl">
        <div className="relative">
          <Button
            variant="ghost"
            className="absolute right-2 top-2 z-50 text-white hover:bg-white/20"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="pt-[56.25%] relative w-full">
            <iframe
              src={videoUrl}
              className="absolute top-0 left-0 w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};