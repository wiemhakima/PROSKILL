"use client";

import { useEffect, useState } from "react";

export default function ProfilPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [skills, setSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) setUserEmail(storedEmail);
  }, []);

  useEffect(() => {
    if (!userEmail) return;

    setIsLoading(true);
    setError("");

    fetch(`/api/upload?email=${encodeURIComponent(userEmail)}`)
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setUploadedUrl(data.url || "");
          setSkills(data.skills || []);
        } else {
          setSkills([]);
          setUploadedUrl("");
        }
      })
      .catch(() => setError("Erreur récupération CV"))
      .finally(() => setIsLoading(false));
  }, [userEmail]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setError("");
    } else {
      setError("Veuillez sélectionner un fichier PDF.");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !userEmail) {
      setError("Fichier ou email manquant.");
      return;
    }

    setIsLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("cv", selectedFile);
    formData.append("email", userEmail);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setUploadedUrl(data.url);
        setSkills(data.skills || []);
        alert("✅ CV uploadé avec succès !");
      } else {
        setError(data.message || "Erreur lors de l'upload.");
      }
    } catch {
      setError("Erreur réseau pendant l'upload.");
    } finally {
      setIsLoading(false);
    }
  };

  const getInitial = (email: string) => email.charAt(0).toUpperCase();

  return (
    <div className="bg-gray-50 flex flex-col items-center pt-8 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full">
        <div className="flex items-center mb-8">
          {userEmail && (
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-full flex items-center justify-center text-3xl font-bold mr-6">
              {getInitial(userEmail)}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
            <p className="text-gray-600">{userEmail}</p>
          </div>
        </div>

        {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>}

        {isLoading && (
          <p className="text-gray-700 bg-gray-100 p-3 rounded mb-4 flex items-center">
            Chargement...
          </p>
        )}

        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="mb-4 block w-full text-sm text-gray-600 file:py-2 file:px-4 file:rounded file:bg-blue-100 file:text-blue-700 file:font-semibold hover:file:bg-blue-200"
          disabled={isLoading}
        />

        <button
          onClick={handleUpload}
          disabled={isLoading || !selectedFile}
          className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "Envoi..." : "Uploader le CV"}
        </button>

        {uploadedUrl && (
          <div className="mt-6 bg-gray-100 p-4 rounded">
            <p className="font-medium text-gray-700">CV actuel :</p>
            <a href={uploadedUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">
              Voir le CV
            </a>
          </div>
        )}

        {skills.length > 0 && (
          <div className="mt-6 bg-gray-100 p-4 rounded">
            <p className="font-medium text-gray-700 mb-2">Compétences extraites :</p>
            <ul className="list-disc list-inside text-gray-700">
              {skills.map((skill, i) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
