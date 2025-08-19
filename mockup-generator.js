class MockupGenerator {
    constructor() {
        this.currentMode = 'code';
        this.currentTemplate = 'minimal';
        this.currentBgType = 'transparent';
        this.currentDeviceType = 'iphone';
        this.currentDeviceColor = 'black';
        
        this.settings = {
            width: 800,
            padding: 32,
            radius: 12,
            shadow: 60,
            deviceThickness: 20
        };
        
        this.imageProcessor = new ImageProcessor();
        this.exportManager = new ExportManager();
        
        this.initializeElements();
        this.bindEvents();
        this.loadState();
        this.updateMockup();
    }
    
    initializeElements() {
        // Mode elements
        this.modeBtns = document.querySelectorAll('.mode-btn');
        this.codeInputs = document.getElementById('codeInputs');
        this.webInputs = document.getElementById('webInputs');
        this.deviceInputs = document.getElementById('deviceInputs');
        
        // Template elements
        this.templateBtns = document.querySelectorAll('.template-btn');
        
        // Setting elements
        this.mockupWidthSlider = document.getElementById('mockupWidth');
        this.widthValue = document.getElementById('widthValue');
        this.mockupPaddingSlider = document.getElementById('mockupPadding');
        this.paddingValue = document.getElementById('paddingValue');
        this.borderRadiusSlider = document.getElementById('borderRadius');
        this.radiusValue = document.getElementById('radiusValue');
        this.shadowIntensitySlider = document.getElementById('shadowIntensity');
        this.shadowValue = document.getElementById('shadowValue');
        this.deviceThicknessSlider = document.getElementById('deviceThickness');
        this.thicknessValue = document.getElementById('thicknessValue');
        
        // Background elements
        this.bgTypeBtns = document.querySelectorAll('.bg-type-btn');
        this.bgControls = document.getElementById('bgControls');
        this.bgColor = document.getElementById('bgColor');
        this.bgColor2 = document.getElementById('bgColor2');
        
        // Content elements
        this.codeTitle = document.getElementById('codeTitle');
        this.codeLanguage = document.getElementById('codeLanguage');
        this.codeContent = document.getElementById('codeContent');
        this.webTitle = document.getElementById('webTitle');
        this.webUrl = document.getElementById('webUrl');
        this.deviceType = document.getElementById('deviceType');
        this.deviceColors = document.querySelectorAll('.device-color');
        
        // Upload elements
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.deviceUploadArea = document.getElementById('deviceUploadArea');
        this.deviceFileInput = document.getElementById('deviceFileInput');
        
        // Mockup elements
        this.mockupStage = document.getElementById('mockupStage');
        this.codeMockup = document.getElementById('codeMockup');
        this.webMockup = document.getElementById('webMockup');
        this.deviceMockup = document.getElementById('deviceMockup');
        this.canvasContainer = document.getElementById('canvasContainer');
        
        // Display elements
        this.displayTitle = document.getElementById('displayTitle');
        this.displayUrl = document.getElementById('displayUrl');
        this.codeDisplay = document.getElementById('codeDisplay');
        this.lineNumbers = document.getElementById('lineNumbers');
        this.webContent = document.getElementById('webContent');
        this.deviceContent = document.getElementById('deviceContent');
        this.deviceFrame = document.getElementById('deviceFrame');
        
        // Export elements
        this.exportPNGBtn = document.getElementById('exportPNG');
        this.exportSVGBtn = document.getElementById('exportSVG');
        this.exportPDFBtn = document.getElementById('exportPDF');
    }
    
    bindEvents() {
        // Mode switching
        this.modeBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchMode(btn.dataset.mode));
        });
        
        // Template switching
        this.templateBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchTemplate(btn.dataset.template));
        });
        
        // Settings
        if (this.mockupWidthSlider) {
            this.mockupWidthSlider.addEventListener('input', () => this.updateWidth());
        }
        if (this.mockupPaddingSlider) {
            this.mockupPaddingSlider.addEventListener('input', () => this.updatePadding());
        }
        if (this.borderRadiusSlider) {
            this.borderRadiusSlider.addEventListener('input', () => this.updateRadius());
        }
        if (this.shadowIntensitySlider) {
            this.shadowIntensitySlider.addEventListener('input', () => this.updateShadow());
        }
        if (this.deviceThicknessSlider) {
            this.deviceThicknessSlider.addEventListener('input', () => this.updateDeviceThickness());
        }
        
        // Background
        this.bgTypeBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchBgType(btn.dataset.bg));
        });
        if (this.bgColor) {
            this.bgColor.addEventListener('change', () => this.updateBackground());
        }
        if (this.bgColor2) {
            this.bgColor2.addEventListener('change', () => this.updateBackground());
        }
        
        // Content
        if (this.codeTitle) {
            this.codeTitle.addEventListener('input', () => this.updateCodeTitle());
        }
        if (this.codeLanguage) {
            this.codeLanguage.addEventListener('change', () => this.updateCodeDisplay());
        }
        if (this.codeContent) {
            this.codeContent.addEventListener('input', () => this.updateCodeDisplay());
        }
        if (this.webTitle) {
            this.webTitle.addEventListener('input', () => this.updateWebTitle());
        }
        if (this.webUrl) {
            this.webUrl.addEventListener('input', () => this.updateWebUrl());
        }
        if (this.deviceType) {
            this.deviceType.addEventListener('change', () => this.updateDeviceFrame());
        }
        
        // Device colors
        this.deviceColors.forEach(btn => {
            btn.addEventListener('click', () => this.switchDeviceColor(btn.dataset.color));
        });
        
        // File uploads
        if (this.uploadArea && this.fileInput) {
            this.uploadArea.addEventListener('click', () => this.fileInput.click());
            this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
            this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
            this.uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            this.fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        }
        
        if (this.deviceUploadArea && this.deviceFileInput) {
            this.deviceUploadArea.addEventListener('click', () => this.deviceFileInput.click());
            this.deviceUploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
            this.deviceUploadArea.addEventListener('drop', (e) => this.handleDeviceDrop(e));
            this.deviceUploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            this.deviceFileInput.addEventListener('change', (e) => this.handleDeviceFileUpload(e));
        }
        
        // Export
        if (this.exportPNGBtn) {
            this.exportPNGBtn.addEventListener('click', () => this.exportManager.exportPNG());
        }
        if (this.exportSVGBtn) {
            this.exportSVGBtn.addEventListener('click', () => this.exportManager.exportSVG());
        }
        if (this.exportPDFBtn) {
            this.exportPDFBtn.addEventListener('click', () => this.exportManager.exportPDF());
        }
    }
    
    switchMode(mode) {
        this.currentMode = mode;
        
        // Update active button
        this.modeBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        
        // Show/hide input panels
        if (this.codeInputs) this.codeInputs.classList.toggle('hidden', mode !== 'code');
        if (this.webInputs) this.webInputs.classList.toggle('hidden', mode !== 'web');
        if (this.deviceInputs) this.deviceInputs.classList.toggle('hidden', mode !== 'device');
        
        // Show/hide mockup content
        if (this.codeMockup) this.codeMockup.classList.toggle('hidden', mode !== 'code');
        if (this.webMockup) this.webMockup.classList.toggle('hidden', mode !== 'web');
        if (this.deviceMockup) this.deviceMockup.classList.toggle('hidden', mode !== 'device');
        
        this.updateMockup();
    }
    
    switchTemplate(template) {
        this.currentTemplate = template;
        
        // Update active button
        this.templateBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.template === template);
        });
        
        this.applyTemplate();
    }
    
    applyTemplate() {
        if (!this.mockupStage) return;
        
        const stage = this.mockupStage;
        const mockupContent = document.querySelector('.mockup-content:not(.hidden)');
        
        // Reset styles
        stage.style.background = '';
        stage.style.backdropFilter = '';
        stage.style.border = '';
        stage.style.boxShadow = '';
        stage.style.padding = '';
        
        switch (this.currentTemplate) {
            case 'minimal':
                // Clean default style
                break;
            case 'modern':
                stage.style.background = 'linear-gradient(135deg, var(--primary), var(--secondary))';
                stage.style.padding = '3rem';
                stage.style.borderRadius = '2rem';
                break;
            case 'glassmorphism':
                stage.style.background = 'rgba(255, 255, 255, 0.1)';
                stage.style.backdropFilter = 'blur(20px)';
                stage.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                stage.style.borderRadius = '2rem';
                stage.style.padding = '2rem';
                break;
            case 'transparent':
                stage.style.background = 'transparent';
                stage.style.padding = '0';
                if (mockupContent) {
                    mockupContent.style.boxShadow = 'none';
                    mockupContent.style.border = 'none';
                }
                break;
        }
        
        // Update shadow based on template
        if (this.currentTemplate !== 'transparent') {
            this.updateShadow();
        }
    }
    
    updateWidth() {
        if (!this.mockupWidthSlider || !this.widthValue || !this.mockupStage) return;
        
        this.settings.width = parseInt(this.mockupWidthSlider.value);
        this.widthValue.textContent = `${this.settings.width}px`;
        
        // Update mockup content width directly
        const mockupContent = document.querySelector('.mockup-content:not(.hidden)');
        if (mockupContent) {
            mockupContent.style.width = `${this.settings.width}px`;
            mockupContent.style.maxWidth = '100%';
        }
        
        // Ensure mockup stage centers the content
        this.mockupStage.style.width = 'auto';
        this.mockupStage.style.maxWidth = '100%';
    }
    
    updatePadding() {
        if (!this.mockupPaddingSlider || !this.paddingValue || !this.canvasContainer) return;
        
        this.settings.padding = parseInt(this.mockupPaddingSlider.value);
        this.paddingValue.textContent = `${this.settings.padding}px`;
        
        // Apply padding to canvas container
        const paddingValue = `${this.settings.padding}px`;
        this.canvasContainer.style.padding = paddingValue;
        
        // Ensure mockup stage respects the new padding
        if (this.mockupStage) {
            this.mockupStage.style.margin = '0 auto';
        }
    }
    
    updateRadius() {
        if (!this.borderRadiusSlider || !this.radiusValue) return;
        
        this.settings.radius = parseInt(this.borderRadiusSlider.value);
        this.radiusValue.textContent = `${this.settings.radius}px`;
        
        if (this.mockupStage) {
            this.mockupStage.style.borderRadius = `${this.settings.radius}px`;
        }
        
        const mockupContent = document.querySelector('.mockup-content:not(.hidden)');
        if (mockupContent) {
            mockupContent.style.borderRadius = `${this.settings.radius}px`;
        }
    }
    
    updateShadow() {
        if (!this.shadowIntensitySlider || !this.shadowValue) return;
        
        this.settings.shadow = parseInt(this.shadowIntensitySlider.value);
        this.shadowValue.textContent = `${this.settings.shadow}%`;
        
        if (this.currentTemplate === 'transparent') {
            return; // No shadow for transparent template
        }
        
        const opacity = this.settings.shadow / 100;
        const mockupContent = document.querySelector('.mockup-content:not(.hidden)');
        if (mockupContent) {
            mockupContent.style.boxShadow = `0 25px 50px -12px rgba(0, 0, 0, ${opacity})`;
        }
    }
    
    switchBgType(bgType) {
        this.currentBgType = bgType;
        
        // Update active button
        this.bgTypeBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.bg === bgType);
        });
        
        // Show/hide color controls
        if (this.bgControls) {
            this.bgControls.classList.toggle('hidden', bgType === 'transparent');
        }
        
        this.updateBackground();
    }
    
    updateBackground() {
        if (!this.canvasContainer) return;
        
        const container = this.canvasContainer;
        
        switch (this.currentBgType) {
            case 'transparent':
                container.style.background = 'var(--canvas-bg)';
                container.style.backgroundImage = 'radial-gradient(circle at 1px 1px, var(--canvas-grid) 1px, transparent 0)';
                container.style.backgroundSize = '20px 20px';
                break;
            case 'solid':
                if (this.bgColor) {
                    container.style.background = this.bgColor.value;
                    container.style.backgroundImage = 'none';
                }
                break;
            case 'gradient':
                if (this.bgColor && this.bgColor2) {
                    container.style.background = `linear-gradient(135deg, ${this.bgColor.value}, ${this.bgColor2.value})`;
                    container.style.backgroundImage = 'none';
                }
                break;
            case 'pattern':
                if (this.bgColor && this.bgColor2) {
                    container.style.background = this.bgColor.value;
                    container.style.backgroundImage = `
                        radial-gradient(circle at 2px 2px, ${this.bgColor2.value} 1px, transparent 0),
                        radial-gradient(circle at 10px 10px, ${this.bgColor2.value} 1px, transparent 0)
                    `;
                    container.style.backgroundSize = '20px 20px';
                }
                break;
        }
    }
    
    updateCodeTitle() {
        if (this.codeTitle && this.displayTitle) {
            this.displayTitle.textContent = this.codeTitle.value;
        }
    }
    
    updateCodeDisplay() {
        if (!this.codeLanguage || !this.codeContent || !this.codeDisplay || !this.lineNumbers) return;
        
        const language = this.codeLanguage.value;
        const code = this.codeContent.value;
        
        // Update language class
        this.codeDisplay.className = `language-${language}`;
        this.codeDisplay.textContent = code;
        
        // Highlight syntax if Prism is available
        if (typeof Prism !== 'undefined') {
            Prism.highlightElement(this.codeDisplay);
        }
        
        // Update line numbers
        const lines = code.split('\n').length;
        this.lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join('<br>');
    }
    
    updateWebTitle() {
        // Could update browser title bar if needed
    }
    
    updateWebUrl() {
        if (this.webUrl && this.displayUrl) {
            this.displayUrl.textContent = this.webUrl.value || 'https://example.com';
        }
    }
    
    updateDeviceFrame() {
        if (!this.deviceType || !this.deviceFrame) return;
        
        const deviceType = this.deviceType.value;
        this.currentDeviceType = deviceType;
        
        // Update device frame classes
        this.deviceFrame.className = `device-frame ${deviceType} ${this.currentDeviceColor}`;
        
        // Apply current thickness
        this.updateDeviceThickness();
    }
    
    updateDeviceThickness() {
        if (!this.deviceThicknessSlider || !this.thicknessValue || !this.deviceFrame) return;
        
        this.settings.deviceThickness = parseInt(this.deviceThicknessSlider.value);
        this.thicknessValue.textContent = `${this.settings.deviceThickness}px`;
        
        // Apply thickness as padding to device frame
        this.deviceFrame.style.padding = `${this.settings.deviceThickness}px`;
    }
    
    switchDeviceColor(color) {
        this.currentDeviceColor = color;
        
        // Update active button
        this.deviceColors.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.color === color);
        });
        
        // Update device frame
        this.updateDeviceFrame();
    }
    
    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('dragover');
    }
    
    handleDragLeave(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
    }
    
    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
        
        const files = Array.from(e.dataTransfer.files);
        this.processFiles(files);
    }
    
    handleDeviceDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
        
        const files = Array.from(e.dataTransfer.files);
        this.processDeviceFiles(files);
    }
    
    handleFileUpload(e) {
        const files = Array.from(e.target.files);
        this.processFiles(files);
    }
    
    handleDeviceFileUpload(e) {
        const files = Array.from(e.target.files);
        this.processDeviceFiles(files);
    }
    
    async processFiles(files) {
        for (const file of files) {
            if (file.type.startsWith('image/')) {
                await this.processImageFile(file);
            } else if (file.type === 'text/html' || file.name.endsWith('.html')) {
                await this.processHTMLFile(file);
            }
        }
    }
    
    async processDeviceFiles(files) {
        for (const file of files) {
            if (file.type.startsWith('image/')) {
                await this.processDeviceImageFile(file);
            }
        }
    }
    
    async processImageFile(file) {
        try {
            showLoading();
            
            const result = await this.imageProcessor.processImage(file);
            
            // Auto-resize mockup to match image dimensions with intelligent scaling
            const aspectRatio = result.width / result.height;
            let newWidth = Math.min(result.width, 1200);
            let newHeight = newWidth / aspectRatio;
            
            // Ensure reasonable dimensions
            if (newHeight > 800) {
                newHeight = 800;
                newWidth = newHeight * aspectRatio;
            }
            
            if (newWidth < 300) {
                newWidth = 300;
                newHeight = newWidth / aspectRatio;
            }
            
            // Update settings
            this.settings.width = Math.round(newWidth);
            if (this.mockupWidthSlider) {
                this.mockupWidthSlider.value = this.settings.width;
            }
            this.updateWidth();
            
            // Display image in web mockup
            if (this.webContent) {
                this.webContent.innerHTML = `<img src="${result.dataUrl}" alt="Uploaded image" style="width: 100%; height: auto; display: block;">`;
            }
            
            // Switch to web mode if not already
            if (this.currentMode !== 'web') {
                this.switchMode('web');
            }
            
            showToast('Image uploaded and mockup auto-resized', 'success');
        } catch (error) {
            console.error('Image processing error:', error);
            showToast('Error processing image: ' + error.message, 'error');
        } finally {
            hideLoading();
        }
    }
    
    async processDeviceImageFile(file) {
        try {
            showLoading();
            
            const result = await this.imageProcessor.processImage(file);
            
            // Display image in device mockup
            if (this.deviceContent) {
                this.deviceContent.innerHTML = `<img src="${result.dataUrl}" alt="Device screen content" style="width: 100%; height: 100%; object-fit: cover;">`;
            }
            
            // Switch to device mode if not already
            if (this.currentMode !== 'device') {
                this.switchMode('device');
            }
            
            showToast('Device screen content uploaded', 'success');
        } catch (error) {
            console.error('Device image processing error:', error);
            showToast('Error processing device image: ' + error.message, 'error');
        } finally {
            hideLoading();
        }
    }
    
    async processHTMLFile(file) {
        try {
            showLoading();
            
            const text = await file.text();
            
            // Display HTML content in iframe
            if (this.webContent) {
                const blob = new Blob([text], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                this.webContent.innerHTML = `<iframe src="${url}" style="width: 100%; height: 400px; border: none;"></iframe>`;
            }
            
            // Switch to web mode
            if (this.currentMode !== 'web') {
                this.switchMode('web');
            }
            
            showToast('HTML file loaded', 'success');
        } catch (error) {
            console.error('HTML processing error:', error);
            showToast('Error processing HTML file: ' + error.message, 'error');
        } finally {
            hideLoading();
        }
    }
    
    updateMockup() {
        // Update all visual elements
        this.updateWidth();
        this.updatePadding();
        this.updateRadius();
        this.updateShadow();
        this.updateBackground();
        this.applyTemplate();
        this.updateCodeDisplay();
        this.updateCodeTitle();
        this.updateWebUrl();
        this.updateDeviceFrame();
        this.updateDeviceThickness();
    }
    
    saveState() {
        const state = {
            mode: this.currentMode,
            template: this.currentTemplate,
            bgType: this.currentBgType,
            deviceType: this.currentDeviceType,
            deviceColor: this.currentDeviceColor,
            settings: this.settings,
            codeTitle: this.codeTitle?.value || '',
            codeLanguage: this.codeLanguage?.value || 'javascript',
            codeContent: this.codeContent?.value || '',
            webTitle: this.webTitle?.value || '',
            webUrl: this.webUrl?.value || '',
            bgColor: this.bgColor?.value || '#6366f1',
            bgColor2: this.bgColor2?.value || '#8b5cf6'
        };
        
        localStorage.setItem('mockcraft-state', JSON.stringify(state));
    }
    
    loadState() {
        try {
            const savedState = localStorage.getItem('mockcraft-state');
            if (!savedState) return;
            
            const state = JSON.parse(savedState);
            
            // Restore settings
            if (state.settings) {
                this.settings = { ...this.settings, ...state.settings };
                if (this.mockupWidthSlider) this.mockupWidthSlider.value = this.settings.width;
                if (this.mockupPaddingSlider) this.mockupPaddingSlider.value = this.settings.padding;
                if (this.borderRadiusSlider) this.borderRadiusSlider.value = this.settings.radius;
                if (this.shadowIntensitySlider) this.shadowIntensitySlider.value = this.settings.shadow;
                if (this.deviceThicknessSlider) this.deviceThicknessSlider.value = this.settings.deviceThickness || 20;
            }
            
            // Restore content
            if (this.codeTitle && state.codeTitle) this.codeTitle.value = state.codeTitle;
            if (this.codeLanguage && state.codeLanguage) this.codeLanguage.value = state.codeLanguage;
            if (this.codeContent && state.codeContent) this.codeContent.value = state.codeContent;
            if (this.webTitle && state.webTitle) this.webTitle.value = state.webTitle;
            if (this.webUrl && state.webUrl) this.webUrl.value = state.webUrl;
            if (this.bgColor && state.bgColor) this.bgColor.value = state.bgColor;
            if (this.bgColor2 && state.bgColor2) this.bgColor2.value = state.bgColor2;
            
            // Restore mode and template
            if (state.mode) this.switchMode(state.mode);
            if (state.template) this.switchTemplate(state.template);
            if (state.bgType) this.switchBgType(state.bgType);
            if (state.deviceType) {
                this.currentDeviceType = state.deviceType;
                if (this.deviceType) this.deviceType.value = state.deviceType;
            }
            if (state.deviceColor) this.switchDeviceColor(state.deviceColor);
            
        } catch (error) {
            console.error('Error loading saved state:', error);
        }
    }
    
    handleResize() {
        // Handle window resize events
        this.updateMockup();
    }
}