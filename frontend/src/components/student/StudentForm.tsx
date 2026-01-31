import { useState } from "react";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function StudentForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    className: "",
    rollNumber: "",
    tuitionFee: "",
    transportFee: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await api.post("/students", {
      name: form.name,
      className: form.className,
      rollNumber: Number(form.rollNumber),
      tuitionFee: Number(form.tuitionFee),
      transportFee: form.transportFee ? Number(form.transportFee) : null,
    });

    navigate("/admin/students");
  };

  return (
    <Card className="max-w-lg">
      <CardHeader className="text-lg font-semibold">Add New Student</CardHeader>

      <CardContent className="space-y-4">
        <Input name="name" placeholder="Student Name" onChange={handleChange} />

        <Input
          name="className"
          placeholder="Class (e.g. 10-A)"
          onChange={handleChange}
        />

        <Input
          name="rollNumber"
          placeholder="Roll Number"
          type="number"
          onChange={handleChange}
        />

        <Input
          name="tuitionFee"
          placeholder="Monthly Tuition Fee"
          type="number"
          onChange={handleChange}
        />

        <Input
          name="transportFee"
          placeholder="Transport Fee (optional)"
          type="number"
          onChange={handleChange}
        />

        <Button className="w-full" onClick={handleSubmit}>
          Save Student
        </Button>
      </CardContent>
    </Card>
  );
}
