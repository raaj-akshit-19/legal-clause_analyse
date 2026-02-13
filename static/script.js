document.addEventListener('DOMContentLoaded', () => {
    const analyzeBtn = document.getElementById('analyze-btn');
    const clearBtn = document.getElementById('clear-btn');
    const legalText = document.getElementById('legal-text');
    const resultsSection = document.getElementById('results-section');
    const clausesContainer = document.getElementById('clauses-container');
    const downloadPdfBtn = document.getElementById('download-pdf');
    const downloadDocxBtn = document.getElementById('download-docx');

    let currentAnalysisResults = [];

    // Analyze Button Click Handler
    analyzeBtn.addEventListener('click', async () => {
        const text = legalText.value.trim();
        if (!text) {
            alert('Please enter some legal text to analyze.');
            return;
        }

        // Show loading state (optional: add spinner)
        analyzeBtn.disabled = true;
        analyzeBtn.textContent = 'Analyzing...';

        try {
            const formData = new FormData();
            formData.append('text', text);

            const response = await fetch('/analyze', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Analysis failed');
            }

            const data = await response.json();
            currentAnalysisResults = data.results;

            displayResults(currentAnalysisResults);
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during analysis.');
        } finally {
            analyzeBtn.disabled = false;
            analyzeBtn.textContent = 'Analyze Document';
        }
    });

    // Clear Button Click Handler
    clearBtn.addEventListener('click', () => {
        legalText.value = '';
        resultsSection.classList.add('hidden');
        clausesContainer.innerHTML = '';
        currentAnalysisResults = [];
    });

    // Display Results Function
    function displayResults(clauses) {
        clausesContainer.innerHTML = '';
        resultsSection.classList.remove('hidden');

        if (clauses.length === 0) {
            clausesContainer.innerHTML = '<p class="text-muted" style="text-align: center;">No clauses found matching the criteria.</p>';
            return;
        }

        clauses.forEach((clause, index) => {
            const card = document.createElement('div');
            card.className = 'clause-card';
            card.setAttribute('data-type', clause.type);
            card.style.animationDelay = `${index * 100}ms`;

            card.innerHTML = `
                <div class="clause-header">
                    <span class="clause-type">${clause.type}</span>
                </div>
                <div class="clause-content">
                    <div class="clause-row">
                        <span class="label">Condition</span>
                        <span class="value">${clause.condition}</span>
                    </div>
                    <div class="clause-row">
                        <span class="label">Consequence</span>
                        <span class="value">${clause.consequence}</span>
                    </div>
                </div>
            `;
            clausesContainer.appendChild(card);
        });

        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Download Handler
    async function handleDownload(format) {
        if (currentAnalysisResults.length === 0) {
            alert('No analysis results to download.');
            return;
        }

        const formData = new FormData();
        formData.append('format', format);
        formData.append('data', JSON.stringify(currentAnalysisResults));

        try {
            const response = await fetch('/download', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Download failed');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `legal_analysis_report.${format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading file:', error);
            alert('Failed to download file.');
        }
    }

    downloadPdfBtn.addEventListener('click', () => handleDownload('pdf'));
    downloadDocxBtn.addEventListener('click', () => handleDownload('docx'));
});
