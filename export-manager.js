class ExportManager {
    constructor() {
        this.exportQuality = 1.0;
        this.exportScale = 2; // 2x for high DPI
    }
    
    async exportPNG() {
        try {
            showLoading();
            
            const mockupStage = document.getElementById('mockupStage');
            const canvas = await html2canvas(mockupStage, {
                scale: this.exportScale,
                backgroundColor: null,
                useCORS: true,
                allowTaint: true,
                logging: false,
                width: mockupStage.offsetWidth,
                height: mockupStage.offsetHeight
            });
            
            // Create download link
            const link = document.createElement('a');
            link.download = `mockup-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png', this.exportQuality);
            link.click();
            
            showToast('PNG exported successfully', 'success');
        } catch (error) {
            console.error('PNG export error:', error);
            showToast('Error exporting PNG', 'error');
        } finally {
            hideLoading();
        }
    }
    
    async exportSVG() {
        try {
            showLoading();
            
            // Use html2canvas to create PNG first, then embed in SVG
            const mockupStage = document.getElementById('mockupStage');
            const canvas = await html2canvas(mockupStage, {
                scale: this.exportScale,
                backgroundColor: null,
                useCORS: true,
                allowTaint: true,
                logging: false,
                width: mockupStage.offsetWidth,
                height: mockupStage.offsetHeight
            });
            
            // Create SVG with embedded PNG
            const svgString = this.createSVGFromCanvas(canvas);
            
            // Create download link
            const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
            const link = document.createElement('a');
            link.download = `mockup-${Date.now()}.svg`;
            link.href = URL.createObjectURL(blob);
            link.click();
            URL.revokeObjectURL(link.href);
            
            showToast('SVG exported successfully', 'success');
        } catch (error) {
            console.error('SVG export error:', error);
            showToast('Error exporting SVG: ' + error.message, 'error');
        } finally {
            hideLoading();
        }
    }
    
    async exportPDF() {
        try {
            showLoading();
            
            // Check if jsPDF is available
            if (typeof window.jspdf === 'undefined' && typeof jsPDF === 'undefined') {
                throw new Error('PDF library not loaded. Please refresh the page and try again.');
            }
            
            const mockupStage = document.getElementById('mockupStage');
            const canvas = await html2canvas(mockupStage, {
                scale: this.exportScale,
                backgroundColor: '#ffffff',
                useCORS: true,
                allowTaint: true,
                logging: false,
                width: mockupStage.offsetWidth,
                height: mockupStage.offsetHeight
            });
            
            const imgData = canvas.toDataURL('image/png');
            
            // Try different ways to access jsPDF
            let jsPDFConstructor;
            if (typeof window.jspdf !== 'undefined') {
                jsPDFConstructor = window.jspdf.jsPDF;
            } else if (typeof jsPDF !== 'undefined') {
                jsPDFConstructor = jsPDF;
            } else {
                throw new Error('jsPDF constructor not found');
            }
            
            // Calculate PDF dimensions in mm
            const canvasWidthMM = canvas.width * 0.264583; // Convert px to mm
            const canvasHeightMM = canvas.height * 0.264583;
            
            const pdf = new jsPDFConstructor({
                orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
                unit: 'mm',
                format: [canvasWidthMM, canvasHeightMM]
            });
            
            pdf.addImage(imgData, 'PNG', 0, 0, canvasWidthMM, canvasHeightMM);
            pdf.save(`mockup-${Date.now()}.pdf`);
            
            showToast('PDF exported successfully', 'success');
        } catch (error) {
            console.error('PDF export error:', error);
            showToast('Error exporting PDF: ' + error.message, 'error');
        } finally {
            hideLoading();
        }
    }
    
    createSVGFromCanvas(canvas) {
        const width = canvas.width;
        const height = canvas.height;
        const dataURL = canvas.toDataURL('image/png');
        
        // Create SVG with embedded PNG image
        const svgString = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
     width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <image x="0" y="0" width="${width}" height="${height}" xlink:href="${dataURL}" />
</svg>`;
        
        return svgString;
    }
    
    // Removed complex SVG generation - using simpler canvas-to-SVG approach
    
    // Helper method for XML escaping - kept for potential future use
    escapeXML(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
    
    async exportMultipleFormats() {
        try {
            showLoading();
            
            // Export all formats simultaneously
            const promises = [
                this.exportPNG(),
                this.exportSVG(),
                this.exportPDF()
            ];
            
            await Promise.all(promises);
            
            showToast('All formats exported successfully', 'success');
        } catch (error) {
            console.error('Multi-format export error:', error);
            showToast('Error exporting multiple formats', 'error');
        } finally {
            hideLoading();
        }
    }
    
    async exportCustomSize(width, height, format = 'png') {
        try {
            showLoading();
            
            const mockupStage = document.getElementById('mockupStage');
            const originalWidth = mockupStage.style.width;
            const originalHeight = mockupStage.style.height;
            
            // Temporarily resize mockup
            mockupStage.style.width = `${width}px`;
            mockupStage.style.height = `${height}px`;
            
            // Wait for reflow
            await new Promise(resolve => setTimeout(resolve, 100));
            
            let result;
            switch (format.toLowerCase()) {
                case 'png':
                    result = await this.exportPNG();
                    break;
                case 'svg':
                    result = await this.exportSVG();
                    break;
                case 'pdf':
                    result = await this.exportPDF();
                    break;
                default:
                    throw new Error('Unsupported format');
            }
            
            // Restore original size
            mockupStage.style.width = originalWidth;
            mockupStage.style.height = originalHeight;
            
            return result;
        } catch (error) {
            console.error('Custom size export error:', error);
            showToast('Error exporting custom size', 'error');
        } finally {
            hideLoading();
        }
    }
    
    setExportQuality(quality) {
        this.exportQuality = Math.max(0.1, Math.min(1.0, quality));
    }
    
    setExportScale(scale) {
        this.exportScale = Math.max(1, Math.min(4, scale));
    }
    
    async exportToClipboard() {
        try {
            showLoading();
            
            const mockupStage = document.getElementById('mockupStage');
            const canvas = await html2canvas(mockupStage, {
                scale: this.exportScale,
                backgroundColor: null,
                useCORS: true,
                allowTaint: true,
                logging: false
            });
            
            // Convert canvas to blob
            canvas.toBlob(async (blob) => {
                try {
                    await navigator.clipboard.write([
                        new ClipboardItem({ 'image/png': blob })
                    ]);
                    showToast('Mockup copied to clipboard', 'success');
                } catch (error) {
                    console.error('Clipboard error:', error);
                    showToast('Failed to copy to clipboard', 'error');
                }
            });
        } catch (error) {
            console.error('Clipboard export error:', error);
            showToast('Error copying to clipboard', 'error');
        } finally {
            hideLoading();
        }
    }
    
    async exportBase64(format = 'png') {
        try {
            const mockupStage = document.getElementById('mockupStage');
            const canvas = await html2canvas(mockupStage, {
                scale: this.exportScale,
                backgroundColor: null,
                useCORS: true,
                allowTaint: true,
                logging: false
            });
            
            const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
            return canvas.toDataURL(mimeType, this.exportQuality);
        } catch (error) {
            console.error('Base64 export error:', error);
            throw error;
        }
    }
}
