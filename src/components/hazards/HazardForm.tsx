import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { MapPin, Camera, Upload } from "lucide-react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import TextArea from "../ui/TextArea";
import Button from "../ui/Button";
import useAuthStore from "../../store/authStore";
import MapSelector from "./MapSelector";

interface HazardFormData {
  title: string;
  description: string;
  type: string;
  severity: string;
  address: string;
}

const ReportHazard: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<HazardFormData>();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const [showMap, setShowMap] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // 📌 Handle image selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // 📌 Remove uploaded image
  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  // 📌 Handle location selection from the map
  const handleLocationSelect = (lat: number, lng: number) => {
    setLocation({ latitude: lat, longitude: lng });
    setShowMap(false);
  };
  const convertImageToBase64 = (file: File): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // 📌 Form submission
  const onSubmit = async (data: HazardFormData) => {
  console.log("🚀 Form Submitted!", data);

  if (!location) {
    alert("Please select a location");
    return;
  }

  if (!user) {
    alert("You must be logged in to report a hazard");
    navigate("/login");
    return;
  }

  // ✅ Map frontend types to backend enums
  const typeMapping: Record<string, string> = {
    "road-damage": "Road",
    "flooding": "Flooding",
    "other": "Other"
  };

  const mappedType = typeMapping[data.type.toLowerCase()] || "Other";

  try {
    let image_base64 = null;
    if (photoFile) {
      console.log("📷 Converting photo to Base64...");
      image_base64 = await convertImageToBase64(photoFile);
    }

    const hazardData = {
      title: data.title,
      description: data.description,
      type: mappedType, // ✅ Fixed here
      severity: data.severity,
      status: "reported",
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        address: data.address,
      },
      images: image_base64 ? [image_base64] : [], // ✅ Backend expects images[]
      reportedBy: user.id,                         // ✅ Only userId needed
      predictedClass: mappedType,                 // ✅ Avoid invalid enum like "Low"
      priorityScore: 0.3                          // ✅ Default score
    };

    console.log("📡 Sending Data to API:", JSON.stringify(hazardData, null, 2));

    const response = await fetch("http://localhost:5000/api/hazards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(hazardData),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("❌ API Response:", responseData);
      throw new Error(`Failed to submit hazard report: ${responseData.message || "Unknown error"}`);
    }

    console.log("✅ Hazard Report Submitted Successfully!");
    navigate("/dashboard");
  } catch (error) {
    console.error("❌ Error submitting hazard report:", error);
  }
};

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Report a Hazard</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <Input
          label="Hazard Title"
          placeholder="E.g., Large pothole on Main Street"
          fullWidth
          {...register("title", { required: "Title is required", minLength: { value: 5, message: "Title must be at least 5 characters" } })}
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}

        {/* Hazard Type & Severity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Hazard Type"
            options={[
              { value: "road-damage", label: "Road Damage" },
              { value: "Drainage", label: "Water" },
              { value: "Garbage", label: "Garbage" },
            ]}
            fullWidth
            {...register("type", { required: "Please select a hazard type" })}
          />
          <Select
            label="Severity Level"
            options={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
              { value: "critical", label: "Critical" },
            ]}
            fullWidth
            {...register("severity", { required: "Please select a severity level" })}
          />
        </div>

        {/* Photo Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Photo Evidence</label>
          {photoPreview && (
            <div className="relative">
              <img src={photoPreview} alt="Hazard preview" className="h-48 w-auto object-cover rounded-md border border-gray-300" />
              <button type="button" onClick={removePhoto} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">X</button>
            </div>
          )}
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
          <input type="file" accept="image/*" capture="environment" className="hidden" ref={cameraInputRef} onChange={handleFileChange} />
          {!photoPreview && (
            <div className="flex space-x-4">
              <Button type="button" variant="outline" onClick={() => cameraInputRef.current?.click()}><Camera className="h-5 w-5 mr-2" /> Take Photo</Button>
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}><Upload className="h-5 w-5 mr-2" /> Upload Photo</Button>
            </div>
          )}
        </div>

        {/* Description */}
        <TextArea
          label="Description"
          placeholder="Provide details about the hazard..."
          rows={4}
          fullWidth
          {...register("description", { required: "Description is required", minLength: { value: 10, message: "Description must be at least 10 characters" } })}
        />
        
        {/* Location Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <Input placeholder="Address" fullWidth {...register("address", { required: "Address is required" })} />
          <Button type="button" variant="outline" onClick={() => setShowMap(!showMap)}>
            <MapPin className="h-5 w-5 mr-1" /> {location ? "Change" : "Select"}
          </Button>
          {location && <p className="text-sm text-green-600">Location: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</p>}
          {showMap && <div className="mt-2 border border-gray-300 rounded-md overflow-hidden h-64"><MapSelector onLocationSelect={handleLocationSelect} /></div>}
        </div>

        {/* Submit Button */}
        <Button type="submit" variant="primary" fullWidth>Submit Hazard Report</Button>
      </form>
    </div>
  );
};

export default ReportHazard;
