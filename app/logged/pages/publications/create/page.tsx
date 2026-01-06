"use client";

import React, { FC, useState } from "react";
import { PublicationService } from "@/app/service/PublicationService";

interface CreatePublicationProps { }

const CreatePublication: FC<CreatePublicationProps> = () => {
  const [idPublication, setIdPublication] = useState("");
  const [redirectionLink, setRedirectionLink] = useState("");
  const [date, setDate] = useState("");
  const [revista, setRevista] = useState("");
  const [numero, setNumero] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = () => {
    setIdPublication("");
    setRedirectionLink("");
    setDate("");
    setRevista("");
    setNumero("");
    setShowConfirm(false);
  };

  const handleConfirm = async () => {
    try {
      const publicationData = {
        id_publication: idPublication,
        redirectionLink: redirectionLink,
        date: date,
        revista: revista,
        número: numero
      };
      await PublicationService.createPublication(publicationData);
      alert("Publicación creada correctamente");
      handleReset();
    } catch (e) {
      alert(`Error al crear la publicación: ${e}`);
    } finally {
      setShowConfirm(false);
    }
  };

  const isFormValid = idPublication && redirectionLink && date && revista && numero;

  return (
    <div className="flex flex-col min-h-screen bg-gray-200">
      <div className="bg-blue-950 text-white p-6 text-center">
        <h1 className="text-2xl font-bold">Crear Nueva Publicación</h1>
      </div>

      <div className="flex flex-col w-3xl h-3xl mx-auto my-36 p-6 bg-white shadow-xl rounded-2xl space-y-12 text-gray-700">
        <div className="space-y-2">
          <label className="block font-bold text-2xl font-medium text-gray-700">ID de Publicación</label>
          <input
            type="text"
            value={idPublication}
            onChange={(e) => setIdPublication(e.target.value)}
            placeholder="Introduzca el ID de la publicación"
            className="w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block font-bold text-2xl font-medium text-gray-700">Enlace de Redirección</label>
          <input
            type="text"
            value={redirectionLink}
            onChange={(e) => setRedirectionLink(e.target.value)}
            placeholder="Introduzca el enlace de redirección"
            className="w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block font-bold text-2xl font-medium text-gray-700">Fecha</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block font-bold text-2xl font-medium text-gray-700">Revista</label>
          <input
            type="text"
            value={revista}
            onChange={(e) => setRevista(e.target.value)}
            placeholder="Introduzca el nombre de la revista"
            className="w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block font-bold text-2xl font-medium text-gray-700">Número</label>
          <input
            type="text"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            placeholder="Introduzca el número de la publicación"
            className="w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2 text-lg">
          <button
            onClick={handleReset}
            className="w-full bg-blue-950 text-white py-2 px-4 rounded-xl shadow hover:bg-blue-900 transition duration-200"
          >
            Cancelar y borrar
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            disabled={!isFormValid}
            className={`w-full py-2 px-4 rounded-xl shadow transition duration-200 ${
              isFormValid
                ? "bg-blue-950 text-white hover:bg-blue-900"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Crear publicación
          </button>
        </div>

        {showConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full mx-4">
              <h2 className="text-xl font-bold mb-4 text-gray-700">Confirmar creación</h2>
              <div className="space-y-2 mb-6 text-gray-600">
                <p><strong>ID:</strong> {idPublication}</p>
                <p><strong>Enlace:</strong> {redirectionLink}</p>
                <p><strong>Fecha:</strong> {date}</p>
                <p><strong>Revista:</strong> {revista}</p>
                <p><strong>Número:</strong> {numero}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-xl hover:bg-gray-400 transition duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 bg-blue-950 text-white py-2 px-4 rounded-xl hover:bg-blue-900 transition duration-200"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePublication;