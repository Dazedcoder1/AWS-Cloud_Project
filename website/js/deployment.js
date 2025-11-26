// Cloud Deployment File Upload Simulation
document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const uploadProgress = document.getElementById('uploadProgress');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const uploadResults = document.getElementById('uploadResults');

    // Click to browse
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        handleFiles(e.dataTransfer.files);
    });

    function handleFiles(files) {
        if (files.length === 0) return;

        // Clear previous results
        uploadResults.innerHTML = '';
        
        Array.from(files).forEach(file => {
            simulateUpload(file);
        });
    }

    function simulateUpload(file) {
        // Validate file
        const maxSize = 100 * 1024 * 1024; // 100MB
        if (file.size > maxSize) {
            showError(`File "${file.name}" is too large. Maximum size is 100MB.`);
            return;
        }

        // Show progress
        uploadProgress.style.display = 'block';
        progressFill.style.width = '0%';
        progressText.textContent = `Uploading ${file.name}...`;

        // Create result card
        const resultCard = document.createElement('div');
        resultCard.className = 'upload-result-card';
        resultCard.innerHTML = `
            <div class="result-header">
                <span class="file-icon">📄</span>
                <div class="file-info">
                    <h4>${file.name}</h4>
                    <p class="file-size">${formatFileSize(file.size)}</p>
                </div>
            </div>
            <div class="result-status" id="status-${file.name}">
                <div class="status-indicator"></div>
                <span class="status-text">Preparing...</span>
            </div>
        `;
        uploadResults.appendChild(resultCard);

        const statusElement = document.getElementById(`status-${file.name}`);
        const statusIndicator = statusElement.querySelector('.status-indicator');
        const statusText = statusElement.querySelector('.status-text');

        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) progress = 100;

            progressFill.style.width = progress + '%';
            statusText.textContent = `Uploading... ${Math.round(progress)}%`;

            if (progress >= 100) {
                clearInterval(interval);
                completeUpload(file, resultCard, statusIndicator, statusText);
            }
        }, 200);
    }

    function completeUpload(file, resultCard, statusIndicator, statusText) {
        // Simulate processing stages
        setTimeout(() => {
            statusText.textContent = 'Validating file...';
            statusIndicator.className = 'status-indicator processing';
        }, 500);

        setTimeout(() => {
            statusText.textContent = 'Scanning for viruses...';
        }, 1000);

        setTimeout(() => {
            statusText.textContent = 'Uploading to cloud storage...';
        }, 1500);

        setTimeout(() => {
            statusText.textContent = 'Creating backup...';
        }, 2000);

        setTimeout(() => {
            statusText.textContent = 'Generating CDN links...';
        }, 2500);

        setTimeout(() => {
            // Upload complete
            statusIndicator.className = 'status-indicator success';
            statusText.textContent = 'Deployment successful!';
            statusText.style.color = 'var(--success-color)';
            
            progressFill.style.width = '100%';
            progressText.textContent = 'All files uploaded successfully!';
            
            // Add deployment info
            const deploymentInfo = document.createElement('div');
            deploymentInfo.className = 'deployment-info';
            deploymentInfo.innerHTML = `
                <div class="info-item">
                    <strong>Deployment Status:</strong> <span class="status-success">✓ Live</span>
                </div>
                <div class="info-item">
                    <strong>Storage Location:</strong> Cloud Storage / ${file.type || 'application/octet-stream'}
                </div>
                <div class="info-item">
                    <strong>URL:</strong> 
                    <code class="file-url">https://cloud.example.com/files/${generateRandomId()}/${file.name}</code>
                    <button class="copy-btn" onclick="copyToClipboard(this.previousElementSibling.textContent)">📋 Copy</button>
                </div>
                <div class="info-item">
                    <strong>Uploaded:</strong> ${new Date().toLocaleString()}
                </div>
            `;
            resultCard.appendChild(deploymentInfo);

            // Hide progress after delay
            setTimeout(() => {
                uploadProgress.style.display = 'none';
                progressFill.style.width = '0%';
            }, 1000);
        }, 3000);
    }

    function showError(message) {
        const errorCard = document.createElement('div');
        errorCard.className = 'upload-result-card error';
        errorCard.innerHTML = `
            <div class="result-header">
                <span class="file-icon">❌</span>
                <div class="file-info">
                    <h4>Upload Failed</h4>
                    <p class="error-message">${message}</p>
                </div>
            </div>
        `;
        uploadResults.appendChild(errorCard);

        setTimeout(() => {
            errorCard.remove();
        }, 5000);
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    function generateRandomId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
});

// Copy to clipboard function
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = '✓ Copied!';
        btn.style.background = 'var(--success-color)';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
    }).catch(() => {
        alert('Failed to copy to clipboard');
    });
}

