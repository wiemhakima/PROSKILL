import { NextRequest, NextResponse } from "next/server";

import User from "../../../models/User";
import bcrypt from "bcryptjs";
import dbConnect from "../../../lib/mongo";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return NextResponse.json({ error: "Email déjà utilisé" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword });

    return NextResponse.json({
      message: "✅ Utilisateur créé avec succès",
      user: { email: newUser.email },
    });
  } catch (error) {
    console.error("Erreur signup :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
