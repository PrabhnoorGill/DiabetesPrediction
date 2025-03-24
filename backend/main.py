from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
from typing import Dict, Optional

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5176"],  # Replace with your React app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PatientData(BaseModel):
    personalInfo: Dict
    symptoms: Dict
    riskFactors: Dict
    bloodGlucose: Optional[float]

# Load the pre-trained model
# Note: You'll need to train and save this model first
try:
    model = joblib.load('diabetes_model.pkl')
except:
    print("Warning: Model file not found. Make sure to train and save the model first.")

@app.post("/predict")
async def predict_diabetes(patient_data: PatientData):
    try:
        # Extract features from the patient data
        features = []
        
        # Personal Info
        features.extend([
            float(patient_data.personalInfo.get('age', 0)),
            float(patient_data.personalInfo.get('weight', 0)),
            float(patient_data.personalInfo.get('height', 0)),
        ])
        
        # Symptoms (convert boolean to 0/1)
        symptoms = patient_data.symptoms
        symptom_values = [
            1 if symptoms.get('increasedThirst', False) else 0,
            1 if symptoms.get('frequentUrination', False) else 0,
            1 if symptoms.get('extremeHunger', False) else 0,
            1 if symptoms.get('unexplainedWeightLoss', False) else 0,
            1 if symptoms.get('fatigue', False) else 0,
            1 if symptoms.get('irritability', False) else 0,
            1 if symptoms.get('blurredVision', False) else 0,
            1 if symptoms.get('slowHealingSores', False) else 0,
            1 if symptoms.get('frequentInfections', False) else 0
        ]
        features.extend(symptom_values)
        
        # Risk Factors (convert boolean to 0/1)
        risk_factors = patient_data.riskFactors
        risk_values = [
            1 if risk_factors.get('familyHistory', False) else 0,
            1 if risk_factors.get('overweight', False) else 0,
            1 if risk_factors.get('inactiveLifestyle', False) else 0,
            1 if risk_factors.get('highBloodPressure', False) else 0,
            1 if risk_factors.get('abnormalCholesterol', False) else 0
        ]
        features.extend(risk_values)
        
        # Blood Glucose
        blood_glucose = patient_data.bloodGlucose or 0
        features.append(float(blood_glucose))
        
        # Convert to numpy array and reshape
        features_array = np.array(features).reshape(1, -1)
        
        # Make prediction
        # Note: This is where you'd use your actual trained model
        try:
            prediction = model.predict_proba(features_array)[0][1] * 100
        except:
            # Fallback calculation if model isn't loaded
            # This is a simplified risk calculation based on the features
            symptom_score = sum(symptom_values) / len(symptom_values) * 40
            risk_score = sum(risk_values) / len(risk_values) * 40
            glucose_score = 0
            if blood_glucose > 200:
                glucose_score = 20
            elif blood_glucose > 140:
                glucose_score = 10
            prediction = min(symptom_score + risk_score + glucose_score, 100)
        
        # Determine risk level
        risk_level = "High risk" if prediction >= 70 else "Moderate risk" if prediction >= 40 else "Low risk"
        
        return {
            "prediction": round(prediction, 2),
            "riskLevel": risk_level
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 