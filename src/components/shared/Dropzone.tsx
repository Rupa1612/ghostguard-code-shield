import { useCallback, useState } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface DropzoneProps {
  onDrop: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  className?: string;
}

export const Dropzone = ({ 
  onDrop, 
  accept = "*/*",
  multiple = true,
  maxFiles = 50,
  className 
}: DropzoneProps) => {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.slice(0, maxFiles);
    
    setFiles(validFiles);
    onDrop(validFiles);
  }, [onDrop, maxFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    const validFiles = selectedFiles.slice(0, maxFiles);
    
    setFiles(validFiles);
    onDrop(validFiles);
  }, [onDrop, maxFiles]);

  const removeFile = useCallback((index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onDrop(updatedFiles);
  }, [files, onDrop]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200",
          dragOver 
            ? "border-primary bg-primary/5 scale-105" 
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-ghost/50",
          "cursor-pointer group"
        )}
      >
        <input
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          data-testid="file-input"
        />
        
        <div className="space-y-4">
          <div className={cn(
            "mx-auto w-12 h-12 rounded-full flex items-center justify-center transition-colors",
            dragOver ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground"
          )}>
            <Upload className="w-6 h-6" />
          </div>
          
          <div>
            <p className="text-lg font-medium">
              {dragOver ? "Drop files here" : "Drag & drop files here"}
            </p>
            <p className="text-muted-foreground mt-1">
              or <span className="text-primary underline">browse files</span> to upload
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Supports: .js, .ts, .py, .go, .java, .php, .rb, .cs, .cpp, .c, .h, .json, .xml, .env
            </p>
          </div>
        </div>
      </div>

      {/* Selected Files List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Selected Files ({files.length})</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
            {files.map((file, index) => (
              <div 
                key={`${file.name}-${index}`}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border"
              >
                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)} • {file.type || 'Unknown type'}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};