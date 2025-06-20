"use client";

import { useEffect, useRef, useState } from "react";

import { motion } from "framer-motion";

export default function ProfilPage() {
  const [file, setFile] = useState<File | null>(null);
  const [email, setEmail] = useState<string>("");
  const [skills, setSkills] = useState<string[]>([]);
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [showUpload, setShowUpload] = useState<boolean>(false);
  const [recommendedFormations, setRecommendedFormations] = useState<any[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        if (userObj?.email) {
          const userEmail = userObj.email;
          setEmail(userEmail);

          fetch("/api/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: userEmail }),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log("Données profil reçues:", data);
              setSkills(data.skills || []);
              setCvUrl(data.cvUrl || null);
            })
            .catch(() => setError("Erreur lors du chargement du profil."));
        } else {
          setError("Email manquant dans les données.");
        }
      } catch {
        setError("Erreur de parsing localStorage.");
      }
    } else {
      setError("Utilisateur non connecté.");
    }
  }, []);

  useEffect(() => {
    if (skills.length > 0) {
      const normalize = (text: string) =>
        text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      fetch("/api/Formation")
        .then((res) => res.json())
        .then((data) => {
          console.log("Formations reçues:", data);

          const matching = data.filter((formation: any) =>
            skills.some((skill) => {
              const normTitle = normalize(formation.title || "");
              const normDesc = normalize(formation.description || "");
              const normSkill = normalize(skill);

              // Vérifie si la compétence est incluse dans le titre ou la description
              // OU si le titre/description est inclus dans la compétence (bidirectionnel)
              return (
                normTitle.includes(normSkill) ||
                normSkill.includes(normTitle) ||
                normDesc.includes(normSkill) ||
                normSkill.includes(normDesc)
              );
            })
          );

          console.log("Formations recommandées trouvées:", matching);
          setRecommendedFormations(matching);
        })
        .catch((err) => {
          console.error("Erreur recommandations formations:", err);
        });
    }
  }, [skills]);

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    if (!file || !email) {
      setError("Veuillez sélectionner un fichier PDF.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("cv", file);
      formData.append("email", email.toLowerCase());

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Erreur lors de l'upload.");
      }

      const data = await res.json();
      setSkills(data.skills || []);
      setCvUrl(data.cvUrl || null);
      setFile(null);
      setShowUpload(false);
      setSuccess("CV mis à jour avec succès !");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err: any) {
      setError(err.message || "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 space-y-8"
      >
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-indigo-700 mb-2">Mon Profil</h1>
          {email ? (
            <p className="text-gray-600">
              Connecté en tant que : <span className="font-semibold">{email}</span>
            </p>
          ) : (
            <p className="text-red-500 font-medium">Email non détecté.</p>
          )}
        </div>

        {cvUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center"
          >
            <a
              href={cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
              aria-label="Voir mon CV actuel"
            >
              📄 <span className="ml-2">Voir mon CV actuel</span>
            </a>
          </motion.div>
        )}

        <div className="space-y-4">
          {!showUpload ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUpload(true)}
              className="w-full bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Changer de CV
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-400 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => e.target.files && setFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <p className="text-center text-gray-500">
                  {file ? file.name : "Glissez ou sélectionnez un PDF"}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={loading || !email || !file}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  loading || !email || !file
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                      />
                    </svg>
                    Chargement...
                  </span>
                ) : (
                  "Uploader & Extraire"
                )}
              </motion.button>
              <button
                onClick={() => {
                  setShowUpload(false);
                  setFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="w-full text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Annuler
              </button>
            </motion.div>
          )}
        </div>

        {(error || success) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`p-4 rounded-lg ${
              error ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}
          >
            {error || success}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-semibold text-gray-800">Compétences extraites</h3>
          {skills.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {skills.map((skill, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm"
                >
                  {skill}
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Aucune compétence disponible.</p>
          )}
        </motion.div>

        {/* Formations recommandées */}
        {recommendedFormations.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4 mt-8"
          >
            <h3 className="text-xl font-semibold text-gray-800">🎯 Formations Recommandées</h3>
            <div className="space-y-4">
              {recommendedFormations.map((formation, i) => (
                <motion.div
                  key={formation._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-lg p-4 shadow flex flex-col gap-2"
                >
                  <h4 className="text-indigo-700 font-bold">{formation.title}</h4>
                  <p className="text-gray-600 text-sm">{formation.description}</p>
                  <a
                    href={`/Formation/${formation._id}`}
                    className="text-indigo-600 hover:underline font-medium text-sm self-start"
                  >
                    Voir la formation →
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Aucune formation recommandée */}
        {recommendedFormations.length === 0 && skills.length > 0 && (
          <div className="text-center text-gray-500 text-sm mt-4">
            Aucune formation recommandée trouvée pour vos compétences extraites.
          </div>
        )}
      </motion.div>
    </div>
  );
}
