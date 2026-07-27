import React from "react";
import { motion } from "framer-motion";
import { Upload, AlertCircle } from "lucide-react";
import { Card } from "../../components/common/Card";
import toast from "react-hot-toast";

interface FileUploadZoneProps {
  onSuccess: (parsedText: string, fileName: string) => void;
}

/**
 * FileUploadZone - Simplified stub for file uploads
 * Full file upload (PDF parsing, OCR) is not yet implemented.
 * Users can still paste text directly in the topic input field.
 */
export const FileUploadZone: React.FC<FileUploadZoneProps> = ({ onSuccess }) => {
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Only support text files for now
    if (file.type === "text/plain" || file.type === "text/markdown") {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          onSuccess(text, file.name);
          toast.success(`Loaded ${file.name} - paste content in topic field`);
        }
      };
      reader.onerror = () => {
        toast.error("Failed to read file");
      };
      reader.readAsText(file);
    } else {
      toast.error("Only .txt and .md files are currently supported. PDF support coming soon!");
    }
  };

  return (
    <div className="space-y-4">
      <Card padding="lg" variant="bordered" className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="py-8"
        >
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary-50 rounded-full">
              <Upload className="w-8 h-8 text-primary-500" />
            </div>
          </div>

          <h3 className="font-semibold text-slate-900 mb-2">Upload Study Material</h3>
          <p className="text-sm text-slate-600 mb-6">
            Currently, you can paste text directly in the topic input field above.
          </p>

          <p className="text-xs text-slate-500 mb-4">
            File upload features (PDF parsing, OCR) are coming in a future update.
          </p>

          <div className="flex gap-2 justify-center">
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".txt,.md"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div
                className="px-4 py-2 rounded-lg font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors inline-flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Choose Text File
              </div>
            </label>
          </div>

          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
            <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">
              <strong>Tip:</strong> Paste your notes or study material directly in the topic field above for instant study plan generation.
            </p>
          </div>
        </motion.div>
      </Card>
    </div>
  );
};
