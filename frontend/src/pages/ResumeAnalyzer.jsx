import { useState, useCallback } from 'react';
import Navbar from '../components/Navbar';
import { UploadCloud, FileText, CheckCircle, AlertCircle, Download, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import { supabase } from '../lib/supabase';

export default function ResumeAnalyzer() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [file, setFile] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    if (!uploadedFile) return;

    if (uploadedFile.type !== 'application/pdf') {
      toast.error('Only PDF files are supported.');
      return;
    }

    setFile(uploadedFile);
    setAnalyzing(true);
    
    const formData = new FormData();
    formData.append('file', uploadedFile);

    try {
      // Mock Analysis since backend is removed
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResult = {
        score: 75,
        summary: "This resume shows strong technical skills but could be improved by highlighting more quantifiable achievements.",
        strengths: ["Clear layout", "Relevant technical keywords", "Good project descriptions"],
        weaknesses: ["Missing soft skills", "Lack of measurable impact"],
        missingKeywords: ["Agile", "CI/CD", "Team Leadership"]
      };

      setResult(mockResult);
      toast.success('Resume analyzed successfully!');
      
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to analyze resume. Make sure the backend is running and API key is set.');
      console.error(error);
      setFile(null);
    } finally {
      setAnalyzing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: {'application/pdf': ['.pdf']} });

  const downloadReport = () => {
    if (!result) return;
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("PrepGenie Resume Analysis Report", 20, 20);
    
    doc.setFontSize(16);
    doc.text(`ATS Score: ${result.score}/100`, 20, 40);
    
    doc.setFontSize(12);
    doc.text("Summary:", 20, 55);
    const summaryLines = doc.splitTextToSize(result.summary, 170);
    doc.text(summaryLines, 20, 65);

    let yOffset = 65 + (summaryLines.length * 7);
    
    doc.setFontSize(14);
    doc.text("Strengths:", 20, yOffset + 10);
    yOffset += 20;
    doc.setFontSize(11);
    result.strengths?.forEach(s => {
      doc.text(`• ${s}`, 20, yOffset);
      yOffset += 7;
    });

    doc.setFontSize(14);
    doc.text("Weaknesses & Missing Keywords:", 20, yOffset + 10);
    yOffset += 20;
    doc.setFontSize(11);
    result.weaknesses?.forEach(w => {
      doc.text(`• ${w}`, 20, yOffset);
      yOffset += 7;
    });
    result.missingKeywords?.forEach(k => {
      doc.text(`• Missing keyword: ${k}`, 20, yOffset);
      yOffset += 7;
    });

    doc.save("Resume_Analysis_Report.pdf");
  };

  return (
    <div className="app-container animate-fade-in">
      <Navbar />
      <div style={{ padding: '2rem 0', maxWidth: '900px', margin: '0 auto' }}>
        <h1 className="heading-gradient" style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '0.5rem' }}>AI Resume Analyzer</h1>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '3rem' }}>Upload your resume to get an ATS score, keyword suggestions, and formatting feedback.</p>

        {!result ? (
          <div {...getRootProps()} className="glass-panel" style={{ 
              padding: '4rem 2rem', textAlign: 'center', 
              border: isDragActive ? '2px dashed #10b981' : '2px dashed rgba(255,255,255,0.1)',
              cursor: analyzing ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s'
            }}>
            <input {...getInputProps()} disabled={analyzing} />
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '1.5rem', borderRadius: '50%' }}>
                {analyzing ? <Loader2 size={48} color="#a855f7" className="animate-spin" /> : <UploadCloud size={48} color="#a855f7" />}
              </div>
            </div>
            <h2 style={{ marginBottom: '1rem' }}>
              {analyzing ? 'Analyzing your resume...' : isDragActive ? 'Drop your PDF here' : 'Drag & Drop your Resume'}
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Supports PDF (Max 5MB)</p>
            {!analyzing && (
              <button className="btn-primary" type="button">
                Browse Files to Analyze
              </button>
            )}
          </div>
        ) : (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              {/* ATS Score Card */}
              <div className="glass-panel" style={{ flex: '1 1 300px', padding: '2rem', textAlign: 'center', background: result.score > 70 ? 'linear-gradient(145deg, rgba(16,185,129, 0.1), transparent)' : result.score > 40 ? 'linear-gradient(145deg, rgba(245,158,11, 0.1), transparent)' : 'linear-gradient(145deg, rgba(239,68,68, 0.1), transparent)' }}>
                <h3 style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>ATS Compatibility Score</h3>
                <div style={{ fontSize: '4rem', fontWeight: 'bold', color: result.score > 70 ? '#10b981' : result.score > 40 ? '#f59e0b' : '#ef4444', marginBottom: '0.5rem' }}>
                  {result.score}<span style={{ fontSize: '2rem' }}>/100</span>
                </div>
                <p style={{ color: result.score > 70 ? '#10b981' : result.score > 40 ? '#f59e0b' : '#ef4444' }}>
                  {result.score > 70 ? 'Great! Your resume is highly readable.' : 'Your resume needs some improvements.'}
                </p>
              </div>
              
              {/* Actions */}
              <div className="glass-panel" style={{ flex: '1 1 300px', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
                <h3 style={{ marginBottom: '1rem' }}><FileText size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }}/> {file?.name || 'Resume.pdf'}</h3>
                <button className="btn-primary" style={{ width: '100%', background: 'rgba(255,255,255,0.1)', boxShadow: 'none' }} onClick={() => {setResult(null); setFile(null);}}>
                  Upload New Version
                </button>
                <button className="btn-primary" style={{ width: '100%' }} onClick={downloadReport}>
                  <Download size={18} style={{ marginRight: '8px' }}/> Download PDF Report
                </button>
              </div>
            </div>

            {/* Detailed Feedback */}
            <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Improvement Suggestions & Feedback</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {result.summary && (
                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                   <FileText color="#a855f7" size={24} style={{ flexShrink: 0 }} />
                   <div>
                     <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Resume Summary</h4>
                     <p style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>{result.summary}</p>
                   </div>
                </div>
              )}
              
              {result.strengths?.map((strength, idx) => (
                <div key={`s-${idx}`} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <CheckCircle color="#10b981" size={24} style={{ flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Strength</h4>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>{strength}</p>
                  </div>
                </div>
              ))}

              {result.missingKeywords?.map((keyword, idx) => (
                <div key={`k-${idx}`} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <AlertCircle color="#f59e0b" size={24} style={{ flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Missing Keyword</h4>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>Consider adding keyword: <strong>{keyword}</strong></p>
                  </div>
                </div>
              ))}

              {result.weaknesses?.map((weakness, idx) => (
                <div key={`w-${idx}`} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <AlertCircle color="#ef4444" size={24} style={{ flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Improvement Needed</h4>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>{weakness}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
