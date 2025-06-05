
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Play } from 'lucide-react';

interface StreamingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  servers: { name: string; url: string }[];
}

export default function StreamingModal({ isOpen, onClose, title, servers }: StreamingModalProps) {
  const [selectedServer, setSelectedServer] = useState(0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 bg-black/95 backdrop-blur-md border border-white/20">
        <div className="flex flex-col h-full">
          <DialogHeader className="p-4 border-b border-white/20">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-white">{title}</DialogTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-2 mt-2">
              {servers.map((server, index) => (
                <Button
                  key={index}
                  variant={selectedServer === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedServer(index)}
                  className={selectedServer === index ? "bg-neon-blue" : ""}
                >
                  <Play className="w-3 h-3 mr-1" />
                  {server.name}
                </Button>
              ))}
            </div>
          </DialogHeader>
          <div className="flex-1 p-4">
            <iframe
              src={servers[selectedServer]?.url}
              className="w-full h-full rounded-lg"
              allowFullScreen
              frameBorder="0"
              title={`${title} - ${servers[selectedServer]?.name}`}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
