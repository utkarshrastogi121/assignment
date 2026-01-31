import { useState } from "react";
import api from "../../api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Result = {
  alreadyGenerated: boolean;
  month: number;
  year: number;
  generated: number;
  totalAmount: number;
};

export default function Fees() {
  const [month, setMonth] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  const generateFees = async () => {
    try {
      setLoading(true);
      setResult(null);

      const res = await api.post("/fees/generate", { month });
      setResult(res.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-sm">
      <Input
        placeholder="YYYY-MM"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      />

      <Button onClick={generateFees} disabled={!month || loading}>
        {loading ? "Processing..." : "Generate Monthly Fees"}
      </Button>

      {result && (
        <Card>
          <CardHeader className="flex items-center justify-between">
            <span className="font-semibold">
              Fee Generation Summary
            </span>

            <Badge
              variant={
                result.alreadyGenerated ? "secondary" : "default"
              }
            >
              {result.alreadyGenerated
                ? "Already Generated"
                : "Newly Generated"}
            </Badge>
          </CardHeader>

          <CardContent className="space-y-2 text-sm">
            <p>
              Month: {result.month}/{result.year}
            </p>
            <p>Students Charged: {result.generated}</p>
            <p className="font-semibold">
              Total Amount: ₹{result.totalAmount}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
