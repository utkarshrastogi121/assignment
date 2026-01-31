import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/api/axios";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";


interface MonthlyFee {
  id: number;
  month: number;
  year: number;
  tuitionFee: number;
  transportFee: number;
  totalFee: number;
  status: string;
}

interface Student {
  name: string;
  className: string;
  rollNumber: number;
  tuitionFee: number;
  transportFee: number | null;
  fees: MonthlyFee[];
}

export default function StudentDetails() {
  const { id } = useParams();
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    api.get(`/students/${id}`).then((res) => {
      setStudent(res.data);
    });
  }, [id]);

  if (!student) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      
      <Card>
        <CardHeader className="text-lg font-semibold">
          {student.name}
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p>Class: {student.className}</p>
          <p>Roll No: {student.rollNumber}</p>
          <p>Tuition Fee: Rs.{student.tuitionFee}</p>
          <p>Transport Fee: Rs.{student.transportFee ?? 0}</p>
        </CardContent>
      </Card>

      
      <Card>
        <CardHeader className="font-semibold">
          Monthly Fee History
        </CardHeader>

        <CardContent className="space-y-4">
          {student.fees.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No fees generated yet.
            </p>
          )}

          {student.fees.map((f) => (
            <div
              key={f.id}
              className="flex justify-between items-start border-b pb-3"
            >
              <div className="space-y-1">
                <p className="font-medium">
                  {f.month}/{f.year}
                </p>

                <p className="text-sm text-muted-foreground">
                  Tuition: Rs.{f.tuitionFee}
                </p>

                <p className="text-sm text-muted-foreground">
                  Transport: Rs.{f.transportFee}
                </p>

                <p className="text-sm font-semibold">
                  Total: Rs.{f.totalFee}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
