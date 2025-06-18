import { NextRequest, NextResponse } from "next/server";

import User from "@/models/User";
import dbConnect from "../../../lib/mongo";
import pdfParse from "pdf-parse";
import { writeFile } from "fs/promises";

export const config = {
  api: {
    bodyParser: false, // pour gérer form-data (upload fichier)
  },
};

// Fonction qui appelle Hugging Face NER pour extraire les compétences
async function extractSkillsFromText(text: string): Promise<string[]> {
  const HF_API_TOKEN = process.env.HF_API_TOKEN;
  if (!HF_API_TOKEN) throw new Error("Token Hugging Face manquant");

  const response = await fetch(
    "https://api-inference.huggingface.co/models/Nucha/Nucha_SkillNER_BERT",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: text }),
    }
  );

  if (!response.ok) {
    throw new Error("Erreur API Hugging Face");
  }

  const data = await response.json();

  // Filtrer les compétences extraites (selon le modèle, adapte si besoin)
  const skills = data
    .filter((item: any) => item.entity.toUpperCase().includes("SKILL"))
    .map((item: any) => item.word);

  return Array.from(new Set(skills)); // suppression doublons
}

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const formData = await req.formData();
    const file = formData.get("cv") as File;
    const email = formData.get("email") as string;

    if (!file || !email) {
      return NextResponse.json({ message: "Fichier ou email manquant" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Sauvegarde fichier CV (optionnel)
    const fileName = `cv-${Date.now()}.pdf`;
    const filePath = `./public/uploads/${fileName}`;
    await writeFile(filePath, buffer);

    // Extraire texte du PDF
    const pdfData = await pdfParse(buffer);
    const text = pdfData.text;

    // Extraire compétences avec Hugging Face
    const skills = await extractSkillsFromText(text);

    // Mise à jour utilisateur avec URL du CV et compétences
    const user = await User.findOneAndUpdate(
      { email },
      { cvUrl: `/uploads/${fileName}`, skills },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ message: "Utilisateur non trouvé" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Upload et extraction réussis",
      url: `/uploads/${fileName}`,
      skills,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
