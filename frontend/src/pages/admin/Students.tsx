import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

type Student = {
  id: number;
  name: string;
  className: string;
  rollNumber: number;
};

export default function Students() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    api.get("/students").then((res) => setStudents(res.data));
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Students</h1>
        <Link to="/admin/students/add">
          <Button>Add Student</Button>
        </Link>
      </div>

      {students.map((s) => (
        <Card
          key={s.id}
          className="cursor-pointer hover:shadow-md transition"
          onClick={() => navigate(`/admin/students/${s.id}`)}
        >
          <CardContent className="flex justify-between p-4">
            <span>{s.name}</span>
            <span>Class: {s.className}</span>
            <span>Roll: {s.rollNumber}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
