import { NextApiRequest, NextApiResponse } from "next";
import universities from "../../../themes.json";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const universityId = req.headers["x-university-id"] as string;

  if (!universityId) {
    return res.status(400).json({ error: "University ID not found" });
  }

  return res.status(200).json({ universityId });
}
