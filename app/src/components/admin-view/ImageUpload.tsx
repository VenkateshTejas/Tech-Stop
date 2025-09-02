import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { toast } from "react-toastify";
import { AxiosResponse } from "axios";
import { uploadProductImage } from "@/services/admin-view/productsService";

interface ProductImageUploadProps {
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  imageLoadingState: boolean;
  uploadedImageUrl: string | null;
  setUploadedImageUrl: (url: string | null) => void;
  setImageLoadingState: (loading: boolean) => void;
  isEditMode?: boolean;
  isCustomStyling?: boolean;
}

const ProductImageUpload: React.FC<ProductImageUploadProps> = ({
  imageFile,
  setImageFile,
  imageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleImageFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      setImageFile(selectedFile); // Triggers state update
    }

    // The current value of `imageFile` here will still reflect the previous state.
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) setImageFile(droppedFile);
  }

  function handleRemoveImage() {
    setImageFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  // Function to upload an image to the cloudinary
  async function uploadImageToCloudinary() {
    if (!imageFile) {
      console.error("No file selected for upload.");
      return;
    }

    // Image is getting uploaded to the cloud
    setImageLoadingState(true);

    try {
      const response = await uploadProductImage(imageFile);

      // Check if the response is an AxiosResponse
      if ((response as AxiosResponse).status === 200) {
        setUploadedImageUrl((response as AxiosResponse).data.image.src);
        // Show a toast on succeessfull upload of an image
        toast("Image uploaded Successfully!", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        console.error("Image upload failed:", response);
      }
    } catch (error) {
      // Set the loading state of image to false on error
      setImageLoadingState(false);
      console.error("An error occurred during the image upload:", error);
    } finally {
      // Set the loading state of image to false
      setImageLoadingState(false);
    }
  }

  useEffect(() => {
    if (imageFile) uploadImageToCloudinary();
  }, [imageFile]);

  return (
    <div className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}>
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${
          isEditMode ? "opacity-60" : ""
        } border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode}
        />
        {!imageFile ? (
          <Label
            htmlFor="image-upload"
            className={`${
              isEditMode ? "cursor-not-allowed" : ""
            } flex flex-col items-center justify-center h-32 cursor-pointer`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop or click to upload image</span>
          </Label>
        ) : imageLoadingState ? (
          <Skeleton className="h-10 bg-gray-100" />
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileIcon className="w-8 text-primary mr-2 h-8" />
            </div>
            <p className="text-sm font-medium">{imageFile.name}</p>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleRemoveImage}
            >
              <XIcon className="w-4 h-4" />
              <span className="sr-only">Remove File</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductImageUpload;
