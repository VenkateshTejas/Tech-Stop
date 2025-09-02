import ProductImageUpload from "@/components/admin-view/ImageUpload";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-helper";
import { addFeatureImage, getFeatureImages } from "@/store/common";
import { useEffect, useState } from "react";

// Define types for the feature image based on your API response
interface FeatureImage {
  _id: string;
  image: string; // URL of the image
  createdAt: string; // Assuming the image creation date
  updatedAt: string; // Assuming the image update date
}

function AdminDashboard() {
  const [imageFile, setImageFile] = useState<File | null>(null); // `File` type for the image file
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [imageLoadingState, setImageLoadingState] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  // Use the RootState to access Redux state and provide correct type for `featureImageList`
  const { featureImageList } = useAppSelector((state) => state.commonFeature);

  console.log(uploadedImageUrl, "uploadedImageUrl");

  function handleUploadFeatureImage() {
    if (uploadedImageUrl) {
      dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
        // Ensure type safety by checking if the payload is of the expected type
        if (typeof data.payload === "object" && data.payload?.success) {
          console.log(data);
          dispatch(getFeatureImages());
          setImageFile(null);
          setUploadedImageUrl("");
        } else {
          console.error("Failed to add feature image:", data.payload);
        }
      });
    }
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div>
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        isCustomStyling={true}
      />
      <Button onClick={handleUploadFeatureImage} className="mt-5 w-full">
        Upload
      </Button>
      <div className="flex flex-col gap-4 mt-5">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map(
              (featureImgItem: FeatureImage, index: number) => (
                <div key={index} className="relative">
                  <img
                    src={featureImgItem.image}
                    className="w-full h-[300px] object-cover rounded-t-lg"
                    alt={`Feature Image ${index}`}
                  />
                </div>
              )
            )
          : null}
      </div>
    </div>
  );
}

export default AdminDashboard;
