import React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Switch } from "../components/ui/switch";
import { ScrollArea } from "../components/ui/scroll-area";
import {
  Loader2,
  Upload,
  ImageIcon,
  Calendar,
  Target,
  Flag,
  Info,
  X,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { toast } from "react-toastify";
import useCreateCampaign from "../hooks/Campaigns/useCreateCampaign";

const CreateCampaign = () => {
  const { createCampaign, loading, error } = useCreateCampaign();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [advancedMode, setAdvancedMode] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    target: "",
    deadline: "",
    image: "",
    milestones: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "estoken");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dn2ed9k6p/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to upload image");

      const data = await response.json();
      setFormData((prev) => ({
        ...prev,
        image: data.secure_url,
      }));

      toast.success("Image uploaded successfully!");
    } catch (err) {
      toast.error("Failed to upload image");
      console.error(err);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a campaign title");
      return;
    }

    if (!formData.target || Number(formData.target) <= 0) {
      toast.error("Please enter a valid funding target");
      return;
    }

    if (!formData.deadline) {
      toast.error("Please select a deadline");
      return;
    }

    const milestonesArray = formData.milestones
      ? formData.milestones.split(",").map(Number)
      : [25, 50, 75, 100];

    try {
      const success = await createCampaign(
        formData.title,
        formData.description,
        formData.target,
        formData.deadline,
        formData.image,
        milestonesArray
      );

      if (success) {
        toast.success("Campaign created successfully!");
        setFormData({
          title: "",
          description: "",
          target: "",
          deadline: "",
          image: "",
          milestones: "",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="max-w-4xl mx-auto mt-10 border-none shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-primary to-primary/60 p-8">
          <CardTitle className="text-4xl font-bold mb-2 text-primary-foreground">
            Create Campaign
          </CardTitle>
          <CardDescription className="text-xl text-primary-foreground/80">
            Launch your fundraising campaign
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <ScrollArea className="h-[60vh] pr-4">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-lg font-semibold">
                  Campaign Title
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="text-lg"
                  placeholder="Enter your campaign title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-lg font-semibold">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="text-lg"
                  placeholder="Describe your campaign..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="target" className="text-lg font-semibold">
                    Funding Target (XFI)
                  </Label>
                  <div className="relative">
                    <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="target"
                      type="number"
                      step="0.01"
                      value={formData.target}
                      onChange={handleInputChange}
                      required
                      className="text-lg pl-10"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline" className="text-lg font-semibold">
                    Deadline
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      required
                      className="text-lg pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label htmlFor="image" className="text-lg font-semibold">
                  Campaign Image
                </Label>
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="text-lg"
                    />
                    <ImageIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  </div>
                  {uploading && <Loader2 className="animate-spin" />}
                </div>
                {uploadProgress > 0 && (
                  <Progress value={uploadProgress} className="w-full mt-2" />
                )}
                {formData.image && (
                  <div className="relative group mt-4">
                    <img
                      src={formData.image || "/placeholder.svg"}
                      alt="Campaign"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, image: "" }))
                      }
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="advanced-mode"
                  checked={advancedMode}
                  onCheckedChange={setAdvancedMode}
                />
                <Label
                  htmlFor="advanced-mode"
                  className="text-lg font-semibold"
                >
                  Advanced Mode
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enable to set custom milestone percentages</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <AnimatePresence>
                {advancedMode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <Label
                      htmlFor="milestones"
                      className="text-lg font-semibold"
                    >
                      Milestone Percentages
                    </Label>
                    <div className="relative">
                      <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="milestones"
                        value={formData.milestones}
                        onChange={handleInputChange}
                        className="text-lg pl-10"
                        placeholder="25,50,75,100"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Enter milestone percentages separated by commas (default:
                      25,50,75,100)
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </ScrollArea>
        </CardContent>
        <CardFooter className="bg-muted/50 p-8">
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={loading || uploading}
            className="w-full text-lg py-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 transform hover:scale-105"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                Creating Campaign...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-6 w-6" />
                Create Campaign
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl mx-auto mt-4 p-4 bg-destructive text-destructive-foreground rounded-lg"
        >
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CreateCampaign;