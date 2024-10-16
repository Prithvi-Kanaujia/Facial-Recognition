import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Container, Tabs, Tab } from 'react-bootstrap';
import { RootState } from './state/store';
import { setActiveTab } from './state/active_tab/tabSlice';
import { toggleExpression } from './state/expression/expressionSlice';
import { toggleAge } from './state/Age/ageSlice'
import { toggleFeature } from './state/landmarks/landmarkSlice';


const App: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgCanvasref = useRef<HTMLCanvasElement | null>(null);
  const intervalRef = useRef<number | null>(null);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [age, setAge] = useState(-1);
  const [Gender, setGender] = useState('N/A');
  const [emotion, setEmotion] = useState('N/A');
  const isExpressionActive = useSelector((state: RootState) => state.expressionReducer.isExpressionActive);
  const isAgeActive = useSelector((state: RootState) => state.ageReducer.isAgeActive);
  const isFeatureActive = useSelector((state: RootState) => state.featureReducer.isFeatureActive);
  const [uploadedFile, setUploadedFile] = useState<string | null>('/default.jpg');
  const dispatch = useDispatch();

  const startVideo = async () => {
    if (!isVideoActive) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current && canvasRef.current) {
          videoRef.current.srcObject = stream;
          setIsVideoActive(true);

          const displaySize = {
            width: videoRef.current.offsetWidth,
            height: videoRef.current.offsetHeight,
          };
          canvasRef.current.width = displaySize.width;
          canvasRef.current.height = displaySize.height;
          faceapi.matchDimensions(canvasRef.current, displaySize);

          startDetection();
        }
      } catch (err) {
        console.error('Error accessing webcam:', err);
      }
    }
  };

  const startDetection = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (videoRef.current && canvasRef.current) {
      const displaySize = {
        width: videoRef.current.offsetWidth,
        height: videoRef.current.offsetHeight,
      };

      intervalRef.current = window.setInterval(async () => {
        if (videoRef.current && canvasRef.current) {
          const detections = await faceapi
            .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions()
            .withAgeAndGender();
          const resizedDetections = faceapi.resizeResults(detections, displaySize);

          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
            if (isFeatureActive) {
              faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
            }


            if (isExpressionActive) {
              faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
              if (resizedDetections.length > 0) {
                const maxExpression = Object.entries(resizedDetections[resizedDetections.length - 1].expressions as Record<string, number>).reduce((max, current) => current[1] > max[1] ? current : max);
                setEmotion((maxExpression[0]))
              } else {
                setEmotion('N/A')
              }

            }
            if (isAgeActive) {
              resizedDetections.forEach((detections: { detection: { box: any; }; age: number; gender: string; }) => {
                const box = detections.detection.box
                setAge(Math.round(detections.age))
                setGender((detections.gender))
                const drawBox = new faceapi.draw.DrawBox(box, {
                  label: Math.round(detections.age) + " years old " + detections.gender
                });
                drawBox.draw(canvasRef.current)
              }
              )
            }
          }
        }
      }, 100);
    }
  };

  const stopVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsVideoActive(false);


      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  const createImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedFile(reader.result as string);
      };
      reader.readAsDataURL(file);
      // imageDetection()
    }
  };

  const imageDetection = async () => {

    if (uploadedFile && imgCanvasref.current) {
      const img = new Image();
      img.src = uploadedFile
      img.onload = async () => {
        if (imgCanvasref.current) {
          imgCanvasref.current.width = img.width
          imgCanvasref.current.height = img.height
        }
      }

      const detection = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender();

      const resizedDetections = faceapi.resizeResults(detection, { width: img.width, height: img.height });
      const ctx = imgCanvasref.current.getContext('2d');

      if (ctx) {
        ctx.clearRect(0, 0, imgCanvasref.current.width, imgCanvasref.current.height);
        ctx.drawImage(img, 0, 0);

        faceapi.draw.drawDetections(imgCanvasref.current, resizedDetections);
        if (isFeatureActive) {
          faceapi.draw.drawFaceLandmarks(imgCanvasref.current, resizedDetections);
        }


        if (isExpressionActive) {
          faceapi.draw.drawFaceExpressions(imgCanvasref.current, resizedDetections);
          const maxExpression = Object.entries(resizedDetections[resizedDetections.length - 1].expressions as Record<string, number>).reduce((max, current) =>
            current[1] > max[1] ? current : max
          );
          setEmotion((maxExpression[0]))
        }


        if (isAgeActive) {
          resizedDetections.forEach((detections: { detection: { box: any; }; age: number; gender: string; }) => {
            const box = detections.detection.box
            setAge(Math.round(detections.age))
            setGender((detections.gender))
            const drawBox = new faceapi.draw.DrawBox(box, {
              label: Math.round(detections.age) + " years old " + detections.gender
            });
            drawBox.draw(imgCanvasref.current)
          }
          )
        }
      }
    }

  }

  //load all models
  useEffect(() => {
    const loadModels = async () => {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models'),
        faceapi.nets.ageGenderNet.loadFromUri('/models'),
      ]);
    };

    loadModels();
  }, []);


  useEffect(() => {
    if (activeTab != "home") {
      imageDetection()
    };
    if (isVideoActive) {
      startDetection();
    }
  }, [isExpressionActive]);
  useEffect(() => {
    if (activeTab != "home") {
      imageDetection()
    };
    if (isVideoActive) {
      startDetection();
    }
  }, [isFeatureActive]);

  useEffect(() => {
    if (activeTab != "home") {
      imageDetection()
    };
    if (isVideoActive) {
      startDetection();
    }
  }, [isAgeActive]);


  const handleToggleExpression = () => {
    dispatch(toggleExpression());
  };
  const handleToggleAge = () => {
    dispatch(toggleAge());
  };
  const handleToggleFeature = () => {
    dispatch(toggleFeature());
  };



  const activeTab = useSelector((state: RootState) => state.appReducer.activeTab);
  const handleTabChange = (k: string | null) => {
    if (k !== null) {
      stopVideo(); // stop video when changing tabs
      dispatch(setActiveTab(k));
    }
  };

  return (
    <Container style={{ flexWrap: 'wrap' }}>

      <div style={{ textAlign: 'center', margin: '1rem' }}>
        <h1 style={{ color: 'white' }}>Live Link Face</h1>
      </div>

      <Tabs activeKey={activeTab} onSelect={handleTabChange} style={{ backgroundColor: "#212529", padding: "1px", borderRadius: "8px" }} fill>
        <Tab eventKey="home" title="Webcam" >
          <br />
          <div style={{
            position: 'relative',
            width: '100%',
            height: 'auto',
            paddingTop: '56.25%',
            backgroundColor: '#212529',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <video
              ref={videoRef}
              autoPlay
              muted
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 2,
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />


            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: '#212529',
              zIndex: 1
            }} />



            <canvas
              ref={canvasRef}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 2,
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
          <br />
          <div style={{
            position: 'relative',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>

            <Button
              variant="info"
              onClick={isVideoActive ? stopVideo : startVideo}
            >
              {isVideoActive ? "Stop Capture" : "Start Capture"}
            </Button>
            <Button variant="danger" onClick={handleToggleFeature} style={{ position: 'relative', zIndex: 2 }}>
              {isFeatureActive ? "Remove Features" : "Show Features"}</Button>

            <Button
              variant="primary"
              onClick={handleToggleExpression}
            >
              {isExpressionActive ? "Remove Expression" : "Show Expression"}
            </Button>

            <Button
              variant="warning"
              onClick={handleToggleAge}
            >
              {isAgeActive ? "Remove Age and Gender" : "Show Age and Gender"}
            </Button>
          </div>
          <div style={{ textAlign: 'center', margin: '1rem' }}>
            <h6 style={{ color: 'white' }}>{"Age: " + age}</h6>
            <h6 style={{ color: 'white' }}>{"Gender: " + Gender}</h6>
            <h6 style={{ color: 'white' }}>{"Emotion: " + emotion}</h6>
          </div>
        </Tab>

        <Tab eventKey="profile" title="Upload file">
          <Container>
            <form>
              <div className="mb-3">
                <label htmlFor="formFile" className="form-label" style={{ color: 'white' }}>Upload your own image</label>
                <input className="form-control" type="file" id="formFile" accept='image/*' onChange={createImage} />
              </div>

            </form>
            <div style={{ display: 'flex', position: 'relative', width: 'auto%', height: 'auto', paddingTop: '56.25%' }}> {/* Maintain aspect ratio (16:9) */}

              <>{uploadedFile && (
                <img
                  src={uploadedFile}
                  alt='Uploaded Preview'
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }} />
              )}
                <canvas
                  ref={imgCanvasref}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 1,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }} /></>
            </div>
            <br />
            <div style={{
              position: 'relative',
              margin: 1,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              <Button variant="info" onClick={imageDetection} style={{ position: 'relative', zIndex: 2 }}>{"Use Image"}</Button>
              <Button variant="danger" onClick={handleToggleFeature} style={{ position: 'relative', zIndex: 2 }}>
                {isFeatureActive ? "Remove Features" : "Show Features"}</Button>
              <Button variant="primary" onClick={handleToggleExpression} style={{ position: 'relative', zIndex: 2 }}>
                {isExpressionActive ? "Remove Expression" : "Show Expression"}
              </Button>
              <Button variant="warning" onClick={handleToggleAge} style={{ position: 'relative', zIndex: 2 }}>
                {isAgeActive ? "Remove Age and Gender" : "Show Age and Gender"}
              </Button>
            </div>
            <div style={{ textAlign: 'center', margin: '1rem' }}>
              <h6 style={{ color: 'white' }}>{"Age: " + age}</h6>
              <h6 style={{ color: 'white' }}>{"Gender: " + Gender}</h6>
              <h6 style={{ color: 'white' }}>{"Emotion: " + emotion}</h6>
            </div>
          </Container>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default App;