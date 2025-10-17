import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../render/incoming');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `upload-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Quality control detection endpoint
router.post('/detect', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imagePath = req.file.path;
    const originalName = req.file.originalname;
    const startTime = Date.now();

    // Move the uploaded file to the incoming directory for watch_infer.py to process
    const incomingDir = path.join(__dirname, '../../render/incoming');
    const targetPath = path.join(incomingDir, originalName);
    
    // Ensure incoming directory exists
    if (!fs.existsSync(incomingDir)) {
      fs.mkdirSync(incomingDir, { recursive: true });
    }

    // Move file to incoming directory
    fs.renameSync(imagePath, targetPath);
    console.log(`Moved uploaded file to: ${targetPath}`);

    // Simulate processing time
    const processingTime = (Date.now() - startTime) / 1000 + Math.random() * 2; // 0-2 seconds

    // Hardcoded defect data for demonstration
    const hardcodedDefects = [
      {
        class: 'defect',
        confidence: 0.85,
        bbox: [120, 80, 60, 40] // x, y, width, height
      },
      {
        class: 'defect', 
        confidence: 0.72,
        bbox: [200, 150, 45, 35]
      },
      {
        class: 'defect',
        confidence: 0.68,
        bbox: [80, 220, 55, 30]
      }
    ];

    // Randomly decide if there are defects (70% chance of defects)
    const hasDefects = Math.random() > 0.3;
    const defects = hasDefects ? hardcodedDefects : [];

    // Simulate inference log data
    const mockInferenceLog = {
      timestamp: new Date().toISOString(),
      image: originalName,
      has_defect: hasDefects,
      num_detections: defects.length + 1, // +1 for bolt
      detections: [
        ...defects.map(defect => ({
          class_id: 1,
          class_name: 'defect',
          confidence: defect.confidence,
          bbox_xyxy: [
            defect.bbox[0], // x
            defect.bbox[1], // y  
            defect.bbox[0] + defect.bbox[2], // x + width
            defect.bbox[1] + defect.bbox[3]  // y + height
          ]
        })),
        {
          class_id: 0,
          class_name: 'bolt',
          confidence: 0.95,
          bbox_xyxy: [50, 50, 300, 400] // Full image area
        }
      ]
    };

    const results = {
      defects: defects,
      bolt_detected: true,
      processing_time: processingTime,
      original_image: `/api/quality-control/original/${originalName}`,
      inference_log: mockInferenceLog
    };

    // Add a small delay to simulate processing
    setTimeout(() => {
      res.json(results);
    }, 1000);

  } catch (error) {
    console.error('Quality control error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Serve annotated images
router.get('/annotated/:filename', (req, res) => {
  const filename = req.params.filename;
  const annotatedPath = path.join(__dirname, '../../render/runs/realtime/annotated', filename);
  
  if (fs.existsSync(annotatedPath)) {
    res.sendFile(annotatedPath);
  } else {
    res.status(404).json({ error: 'Annotated image not found' });
  }
});

// Serve original images
router.get('/original/:filename', (req, res) => {
  const filename = req.params.filename;
  const originalPath = path.join(__dirname, '../../render/incoming', filename);
  
  if (fs.existsSync(originalPath)) {
    res.sendFile(originalPath);
  } else {
    res.status(404).json({ error: 'Original image not found' });
  }
});

// Get inference logs
router.get('/logs', (req, res) => {
  const logPath = path.join(__dirname, '../../render/runs/realtime/inference_log.jsonl');
  
  if (fs.existsSync(logPath)) {
    try {
      const logContent = fs.readFileSync(logPath, 'utf8');
      const lines = logContent.trim().split('\n').filter(line => line.trim());
      const logs = lines.map(line => {
        try {
          return JSON.parse(line);
        } catch (e) {
          return null;
        }
      }).filter(log => log !== null);
      
      res.json({ logs });
    } catch (error) {
      res.status(500).json({ error: 'Failed to read logs' });
    }
  } else {
    res.status(404).json({ error: 'Log file not found' });
  }
});

// Health check for quality control service
router.get('/health', (req, res) => {
  const watchScript = path.join(__dirname, '../../render/watch_infer.py');
  const modelPath = path.join(__dirname, '../../render/yolov8n.pt');
  const trainedModelPath = path.join(__dirname, '../../render/runs/detect/train3/weights/best.pt');
  const incomingDir = path.join(__dirname, '../../render/incoming');
  const logPath = path.join(__dirname, '../../render/runs/realtime/inference_log.jsonl');
  
  const checks = {
    watch_script_exists: fs.existsSync(watchScript),
    model_exists: fs.existsSync(modelPath) || fs.existsSync(trainedModelPath),
    incoming_dir_exists: fs.existsSync(incomingDir),
    log_file_exists: fs.existsSync(logPath),
    log_writable: fs.existsSync(path.dirname(logPath))
  };

  const allGood = Object.values(checks).every(check => check === true);
  
  res.status(allGood ? 200 : 503).json({
    status: allGood ? 'healthy' : 'unhealthy',
    checks: checks,
    timestamp: new Date().toISOString(),
    note: 'Ensure watch_infer.py is running for real-time processing'
  });
});

export default router;
