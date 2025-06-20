import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// ✅ Import react-toastify and its CSS
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jsPDF } from "jspdf";


const chartLabels = [
  "Correlation Heatmap",
  "Category Distribution (Bar)",
  "Category Distribution (Pie)",
  "Numeric Column Histogram",
  "Numeric Column Line Chart"
];

const Analysis = () => {
  const navigate = useNavigate();
  const [charts, setCharts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);
    toast.info('Uploading & analyzing file...');

    try {
      const res = await axios.post('http://localhost:8000/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setCharts(res.data.charts);
      setStats(res.data.stats);
      toast.success('Analysis complete! Charts generated.');
    } catch (err) {
      console.error(err);
      toast.error('Error analyzing file!');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    const doc = new jsPDF('p', 'mm', 'a4');

    for (let i = 0; i < charts.length; i++) {
      const img = new Image();
      img.src = `data:image/png;base64,${charts[i]}`;

      await new Promise((resolve) => {
        img.onload = () => {
          const width = doc.internal.pageSize.getWidth();
          const height = (img.height * width) / img.width;
          doc.addImage(img, 'PNG', 10, 10, width - 20, height);
          if (i !== charts.length - 1) doc.addPage();
          resolve();
        };
      });
    }
    doc.save('analysis_charts.pdf');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-blue-100 px-4 py-8">
      <ToastContainer position="top-center" />

      {/* Top Navigation */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => navigate('/Home')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Home
        </button>
      </div>

      {/* Title */}
      <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Upload your CSV or Excel files and explore your data through interactive charts, visual summaries, and AI-powered insights.
Generate, download, and review graphs — all in one place, designed for simplicity and speed.
        </p>
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-2">📊 Data Analysis Dashboard</h1>
      <p className="text-center text-gray-600 text-lg mb-8">
        Upload your CSV or Excel file and get insights instantly with visualized charts.
      </p>

      {/* Upload Box */}
      <div className="max-w-xl mx-auto">
        <label className="block cursor-pointer border-4 border-dashed border-blue-300 bg-white p-6 rounded-lg shadow hover:bg-blue-50 transition">
          <p className="text-center text-blue-500 font-semibold">Click to upload a CSV or Excel file</p>
          <input type="file" accept=".csv, .xlsx, .xls" onChange={handleFileChange} className="hidden" />
        </label>
      </div>

      {/* Spinner */}
      {loading && (
        <div className="flex justify-center items-center mt-10">
          <div className="w-10 h-10 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
          <span className="ml-4 text-blue-600 text-lg">Analyzing your file...</span>
        </div>
      )}

      {/* Chart Display */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {charts.map((chart, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition w-full max-w-md">
            <h2 className="text-center font-semibold text-gray-700 mb-2">{chartLabels[index] || `Chart ${index + 1}`}</h2>
            <img
              src={`data:image/png;base64,${chart}`}
              alt={`Chart ${index + 1}`}
              className="w-full h-auto object-contain rounded"
            />
          </div>
        ))}
      </div>

      {/* Dataset Statistics */}
      {stats && (
        <div className="bg-white p-6 mt-12 rounded-lg shadow-md w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">📋 Dataset Summary</h2>
          <p><strong>Rows:</strong> {stats.rows} | <strong>Columns:</strong> {stats.columns}</p>
          <p><strong>Column Names:</strong> {stats.column_names.join(', ')}</p>
          <p className="mt-2"><strong>Missing Values:</strong></p>
          <ul className="list-disc list-inside">
            {Object.entries(stats.missing_values).map(([key, val]) => (
              <li key={key}>{key}: {val}</li>
            ))}
          </ul>
          <p className="mt-2"><strong>Data Types:</strong></p>
          <ul className="list-disc list-inside">
            {Object.entries(stats.data_types).map(([key, val]) => (
              <li key={key}>{key}: {val}</li>
            ))}
          </ul>
        </div>
      )}

      {/* PDF Download Button */}
      {charts.length > 0 && (
        <div className="mt-8 text-center">
          <button
            onClick={handleExportPDF}
            className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700 transition"
          >
            Download All Charts as PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default Analysis;
