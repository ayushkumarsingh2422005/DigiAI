import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import useFlowStore from '../../../store/flowStore';
import * as pdfjsLib from 'pdfjs-dist';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PDFNode = ({ id, data }) => {
  const [pdfName, setPdfName] = useState('');
  const [pdfContent, setPdfContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const updateNodeData = useFlowStore((state) => state.updateNodeData);

  const extractText = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n\n';
      }

      return fullText.trim();
    } catch (error) {
      console.error('Error extracting PDF text:', error);
      throw error;
    }
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      setPdfName(file.name);
      try {
        const extractedText = await extractText(file);
        setPdfContent(extractedText);
        updateNodeData(id, { pdfFile: file.name, pdfContent: extractedText });
      } catch (error) {
        console.error('Failed to extract PDF content:', error);
        setPdfContent('Failed to extract PDF content');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-3 rounded-md bg-white shadow-md border border-gray-200 w-64">
      <div className="font-bold text-sm mb-2">PDF Node</div>
      <div className="mb-2">
        <input 
          type="file" 
          accept=".pdf" 
          onChange={handlePdfUpload} 
          className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
        />
      </div>
      {loading && <div className="text-sm text-gray-500">Extracting text...</div>}
      {pdfName && !loading && (
        <div className="mt-2 text-xs">
          <p className="font-medium">Loaded: {pdfName}</p>
          <p className="text-gray-500 mt-1 truncate">{pdfContent}</p>
        </div>
      )}
      <Handle type="source" position={Position.Right} id="output" />
    </div>
  );
};

export default PDFNode;