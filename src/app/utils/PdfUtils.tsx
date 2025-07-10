// Import html2pdf dynamically to avoid SSR issues
export const loadHtml2Pdf = async () => {
  if (typeof window !== 'undefined') {
    const html2pdf = await import('html2pdf.js');
    return html2pdf.default as unknown as {
      (): {
        set: (options: Record<string, unknown>) => {
          from: (element: HTMLElement) => {
            save: () => Promise<void>;
          };
        };
      };
    };
  }
  return null;
};

export const generatePdfFromMain = async (year: number) => {
  try {
    // Show loading feedback
    console.log('Loading PDF generation library...');
    const html2pdf = await loadHtml2Pdf();

    if (!html2pdf) {
      alert('PDF generation is not available in this browser. Please use the Print & Save as PDF option instead.');
      return;
    }

    // Find the main element
    const mainElement = document.querySelector('main');
    if (!mainElement) {
      alert('Could not find calendar content. Please try refreshing the page.');
      return;
    }

    console.log('Preparing calendar content for PDF...');

    // Clone the main element to avoid modifying the original
    const clonedElement = mainElement.cloneNode(true) as HTMLElement;

    // Remove screen-only elements from the clone
    const screenOnlyElements = clonedElement.querySelectorAll('.screen-only');
    screenOnlyElements.forEach(el => el.remove());

    // Configure html2pdf options
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `yearly-tracker-${year}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 1.0,
        useCORS: true,
        letterRendering: true
      },
      jsPDF: {
        unit: 'mm', 
        format: 'a4', 
        orientation: 'landscape'
      }
    };

    console.log('Generating PDF... This may take a moment for large calendars.');

    // Generate PDF
    await html2pdf().set(opt).from(clonedElement).save();

    console.log('PDF generated successfully!');
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try using the Print & Save as PDF option instead.');
  }
};
