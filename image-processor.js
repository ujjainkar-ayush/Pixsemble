class ImageProcessor {
    constructor() {
        this.maxFileSize = 10 * 1024 * 1024; // 10MB
        this.supportedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    }
    
    async processImage(file) {
        return new Promise((resolve, reject) => {
            // Validate file size
            if (file.size > this.maxFileSize) {
                reject(new Error('File size too large. Maximum size is 10MB.'));
                return;
            }
            
            // Validate file type
            if (!this.supportedFormats.includes(file.type)) {
                reject(new Error('Unsupported file format. Please use JPEG, PNG, GIF, WebP, or SVG.'));
                return;
            }
            
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const img = new Image();
                
                img.onload = () => {
                    const result = {
                        width: img.naturalWidth,
                        height: img.naturalHeight,
                        dataUrl: e.target.result,
                        file: file,
                        aspectRatio: img.naturalWidth / img.naturalHeight
                    };
                    
                    // Optimize large images
                    if (img.naturalWidth > 2000 || img.naturalHeight > 2000) {
                        this.optimizeImage(img, result).then(resolve).catch(reject);
                    } else {
                        resolve(result);
                    }
                };
                
                img.onerror = () => {
                    reject(new Error('Failed to load image. The file may be corrupted.'));
                };
                
                img.src = e.target.result;
            };
            
            reader.onerror = () => {
                reject(new Error('Failed to read file.'));
            };
            
            reader.readAsDataURL(file);
        });
    }
    
    async optimizeImage(img, originalResult) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Calculate optimal dimensions
            const maxWidth = 1920;
            const maxHeight = 1080;
            let { width, height } = originalResult;
            
            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width = Math.round(width * ratio);
                height = Math.round(height * ratio);
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // Draw and compress
            ctx.drawImage(img, 0, 0, width, height);
            
            const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
            
            resolve({
                ...originalResult,
                width,
                height,
                dataUrl: optimizedDataUrl,
                optimized: true,
                aspectRatio: width / height
            });
        });
    }
    
    async resizeToFit(imageResult, targetWidth, targetHeight) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                const aspectRatio = img.width / img.height;
                const targetAspectRatio = targetWidth / targetHeight;
                
                let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
                
                if (aspectRatio > targetAspectRatio) {
                    // Image is wider than target
                    drawHeight = targetHeight;
                    drawWidth = drawHeight * aspectRatio;
                    offsetX = (targetWidth - drawWidth) / 2;
                } else {
                    // Image is taller than target
                    drawWidth = targetWidth;
                    drawHeight = drawWidth / aspectRatio;
                    offsetY = (targetHeight - drawHeight) / 2;
                }
                
                canvas.width = targetWidth;
                canvas.height = targetHeight;
                
                // Fill background (optional)
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, targetWidth, targetHeight);
                
                // Draw image
                ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
                
                const resizedDataUrl = canvas.toDataURL('image/png');
                
                resolve({
                    ...imageResult,
                    width: targetWidth,
                    height: targetHeight,
                    dataUrl: resizedDataUrl,
                    resized: true
                });
            };
            
            img.src = imageResult.dataUrl;
        });
    }
    
    async cropToAspectRatio(imageResult, aspectRatio) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                const currentAspectRatio = img.width / img.height;
                let cropWidth, cropHeight, offsetX = 0, offsetY = 0;
                
                if (currentAspectRatio > aspectRatio) {
                    // Image is wider, crop width
                    cropHeight = img.height;
                    cropWidth = cropHeight * aspectRatio;
                    offsetX = (img.width - cropWidth) / 2;
                } else {
                    // Image is taller, crop height
                    cropWidth = img.width;
                    cropHeight = cropWidth / aspectRatio;
                    offsetY = (img.height - cropHeight) / 2;
                }
                
                canvas.width = cropWidth;
                canvas.height = cropHeight;
                
                ctx.drawImage(
                    img,
                    offsetX, offsetY, cropWidth, cropHeight,
                    0, 0, cropWidth, cropHeight
                );
                
                const croppedDataUrl = canvas.toDataURL('image/png');
                
                resolve({
                    ...imageResult,
                    width: cropWidth,
                    height: cropHeight,
                    dataUrl: croppedDataUrl,
                    cropped: true,
                    aspectRatio: aspectRatio
                });
            };
            
            img.src = imageResult.dataUrl;
        });
    }
    
    async addImageEffects(imageResult, effects = {}) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                
                // Apply effects
                if (effects.brightness !== undefined) {
                    ctx.filter = `brightness(${effects.brightness}%)`;
                }
                
                if (effects.contrast !== undefined) {
                    ctx.filter += ` contrast(${effects.contrast}%)`;
                }
                
                if (effects.saturation !== undefined) {
                    ctx.filter += ` saturate(${effects.saturation}%)`;
                }
                
                if (effects.blur !== undefined) {
                    ctx.filter += ` blur(${effects.blur}px)`;
                }
                
                ctx.drawImage(img, 0, 0);
                
                // Add overlay if specified
                if (effects.overlay) {
                    ctx.globalAlpha = effects.overlay.opacity || 0.5;
                    ctx.fillStyle = effects.overlay.color || '#000000';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
                
                const processedDataUrl = canvas.toDataURL('image/png');
                
                resolve({
                    ...imageResult,
                    dataUrl: processedDataUrl,
                    effects: effects
                });
            };
            
            img.src = imageResult.dataUrl;
        });
    }
    
    getImageDimensions(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const url = URL.createObjectURL(file);
            
            img.onload = () => {
                URL.revokeObjectURL(url);
                resolve({
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                    aspectRatio: img.naturalWidth / img.naturalHeight
                });
            };
            
            img.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error('Failed to load image dimensions'));
            };
            
            img.src = url;
        });
    }
    
    async generateThumbnail(imageResult, size = 200) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                const aspectRatio = img.width / img.height;
                let thumbWidth, thumbHeight;
                
                if (aspectRatio > 1) {
                    thumbWidth = size;
                    thumbHeight = size / aspectRatio;
                } else {
                    thumbHeight = size;
                    thumbWidth = size * aspectRatio;
                }
                
                canvas.width = thumbWidth;
                canvas.height = thumbHeight;
                
                ctx.drawImage(img, 0, 0, thumbWidth, thumbHeight);
                
                const thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.8);
                
                resolve({
                    dataUrl: thumbnailDataUrl,
                    width: thumbWidth,
                    height: thumbHeight
                });
            };
            
            img.src = imageResult.dataUrl;
        });
    }
}
