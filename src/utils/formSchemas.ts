export const formSchemas = {
  sell: [
    { id: "condition", label: "Condition", type: "select", options: ["New", "Used"] },
    { id: "brand", label: "Brand", type: "text" },
    { id: "model", label: "Model", type: "text" },
  ],

  service: [
    { id: "experience", label: "Years of Experience", type: "number" },
    { id: "skills", label: "Skills", type: "text" },
  ],

  realestate: [
    { id: "rooms", label: "Rooms", type: "number" },
    { id: "size", label: "Square Meters", type: "number" },
    { id: "furnished", label: "Furnished", type: "boolean" },
  ],

  job: [
    { id: "jobType", label: "Type", type: "select", options: ["Full-time", "Part-time", "Remote"] },
    { id: "salary", label: "Salary", type: "number" },
  ],

  media: [
    { id: "caption", label: "Caption", type: "text" },
  ],

  travel: [
    { id: "days", label: "Number of Days", type: "number" },
    { id: "packageType", label: "Package Type", type: "select", options: ["Hotel", "Flight + Hotel", "Tour Only"] },
  ],

  course: [
    { id: "level", label: "Difficulty Level", type: "select", options: ["Beginner", "Intermediate", "Advanced"] },
    { id: "duration", label: "Course Duration (Hrs)", type: "number" },
  ],
};
