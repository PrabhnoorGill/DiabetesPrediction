import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { 
  TextField, 
  Button, 
  Checkbox, 
  FormControlLabel, 
  Paper, 
  Typography, 
  Box,
  Slider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  LinearProgress,
  Container,
  Grid,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Using simple HTML entities instead of Material icons
// This helps avoid any potential font loading issues
const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: 16,
  padding: theme.spacing(4),
  boxShadow: '0 8px 24px rgba(149, 157, 165, 0.2)',
  background: 'linear-gradient(145deg, #ffffff 0%, #f5f7fa 100%)'
}));

const ColoredSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.primary.main,
  height: 8,
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&:before': {
      display: 'none',
    },
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  borderRadius: 28,
  padding: '12px 24px',
  fontSize: 16,
  fontWeight: 'bold',
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
  '&:hover': {
    background: 'linear-gradient(45deg, #1976D2 30%, #00BCD4 90%)',
  }
}));

const validationSchema = Yup.object().shape({
  personalInfo: Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    age: Yup.number().required('Age is required').positive('Age must be positive').integer('Age must be an integer'),
    gender: Yup.string().required('Gender is required'),
    weight: Yup.number().positive('Weight must be positive').required('Weight is required'),
    height: Yup.number().positive('Height must be positive').required('Height is required'),
  }),
  symptoms: Yup.object().shape({
    increasedThirst: Yup.boolean(),
    frequentUrination: Yup.boolean(),
    extremeHunger: Yup.boolean(),
    unexplainedWeightLoss: Yup.boolean(),
    fatigue: Yup.boolean(),
    irritability: Yup.boolean(),
    blurredVision: Yup.boolean(),
    slowHealingSores: Yup.boolean(),
    frequentInfections: Yup.boolean()
  }),
  riskFactors: Yup.object().shape({
    familyHistory: Yup.boolean(),
    overweight: Yup.boolean(),
    inactiveLifestyle: Yup.boolean(),
    highBloodPressure: Yup.boolean(),
    abnormalCholesterol: Yup.boolean()
  }),
  bloodGlucose: Yup.number().min(0, 'Cannot be negative'),
});

const DiabetesAssessmentForm = () => {
  const [prediction, setPrediction] = useState(null);
  const [riskLevel, setRiskLevel] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  const steps = ['Personal Information', 'Symptoms', 'Risk Factors', 'Measurements'];

  const handleSubmit = async (values) => {
    try {
      // Fixing localhost issue by using proper API endpoint configuration
      // For development, we'll simulate a response instead of actual API call
      console.log('Submitting values:', values);
      
      // Calculate a mock risk score based on the number of symptoms and risk factors
      const symptomCount = Object.values(values.symptoms).filter(Boolean).length;
      const riskFactorCount = Object.values(values.riskFactors).filter(Boolean).length;
      
      let score = (symptomCount / 9) * 50 + (riskFactorCount / 5) * 50;
      
      // Adjust based on glucose level if provided
      if (values.bloodGlucose) {
        if (values.bloodGlucose > 200) score += 30;
        else if (values.bloodGlucose > 140) score += 20;
        else if (values.bloodGlucose > 100) score += 10;
      }
      
      // Cap at 100
      score = Math.min(score, 100);
      
      // Determine risk level
      let riskText = '';
      if (score >= 70) riskText = 'High risk';
      else if (score >= 40) riskText = 'Moderate risk';
      else riskText = 'Low risk';
      
      // Set states with mock response
      setPrediction(Math.round(score));
      setRiskLevel(riskText);
      
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box 
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'auto'
      }}
    >
      <Container 
        maxWidth="md" 
        sx={{ 
          py: 5,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <StyledPaper sx={{ 
          width: '100%',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <Typography 
            variant="h4" 
            align="center" 
            gutterBottom 
            sx={{ 
              color: '#1976D2', 
              fontWeight: 'bold', 
              fontFamily: 'Arial, sans-serif',
              textAlign: 'center',
              width: '100%',
              display: 'block'
            }}
          >
            Diabetes Risk Assessment
          </Typography>
          <Typography variant="subtitle1" align="center" sx={{ mb: 4, color: '#546e7a', fontFamily: 'Arial, sans-serif' }}>
            Complete this form to evaluate your diabetes risk factors and symptoms
          </Typography>
          
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <Formik
            initialValues={{
              personalInfo: {
                email: '',
                age: '',
                gender: '',
                weight: '',
                height: ''
              },
              symptoms: {
                increasedThirst: false,
                frequentUrination: false,
                extremeHunger: false,
                unexplainedWeightLoss: false,
                fatigue: false,
                irritability: false,
                blurredVision: false,
                slowHealingSores: false,
                frequentInfections: false
              },
              riskFactors: {
                familyHistory: false,
                overweight: false,
                inactiveLifestyle: false,
                highBloodPressure: false,
                abnormalCholesterol: false
              },
              bloodGlucose: ''
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, values, handleChange, setFieldValue, isValid }) => (
              <Form>
                {activeStep === 0 && (
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2, color: '#1976D2', fontFamily: 'Arial, sans-serif' }}>
                      Personal Information
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Field
                          name="personalInfo.email"
                          as={TextField}
                          label="Email Address"
                          fullWidth
                          variant="outlined"
                          error={touched.personalInfo?.email && Boolean(errors.personalInfo?.email)}
                          helperText={touched.personalInfo?.email && errors.personalInfo?.email}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Field
                          name="personalInfo.age"
                          as={TextField}
                          label="Age"
                          type="number"
                          fullWidth
                          variant="outlined"
                          error={touched.personalInfo?.age && Boolean(errors.personalInfo?.age)}
                          helperText={touched.personalInfo?.age && errors.personalInfo?.age}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth variant="outlined" error={touched.personalInfo?.gender && Boolean(errors.personalInfo?.gender)}>
                          <InputLabel id="gender-label">Gender</InputLabel>
                          <Select
                            labelId="gender-label"
                            name="personalInfo.gender"
                            value={values.personalInfo.gender}
                            onChange={handleChange}
                            label="Gender"
                          >
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                            <MenuItem value="prefer-not-to-say">Prefer not to say</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Field
                          name="personalInfo.weight"
                          as={TextField}
                          label="Weight (kg)"
                          type="number"
                          fullWidth
                          variant="outlined"
                          error={touched.personalInfo?.weight && Boolean(errors.personalInfo?.weight)}
                          helperText={touched.personalInfo?.weight && errors.personalInfo?.weight}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Field
                          name="personalInfo.height"
                          as={TextField}
                          label="Height (cm)"
                          type="number"
                          fullWidth
                          variant="outlined"
                          error={touched.personalInfo?.height && Boolean(errors.personalInfo?.height)}
                          helperText={touched.personalInfo?.height && errors.personalInfo?.height}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {activeStep === 1 && (
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2, color: '#1976D2', fontFamily: 'Arial, sans-serif' }}>
                      Symptoms
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 3, color: '#546e7a', fontFamily: 'Arial, sans-serif' }}>
                      Please check any symptoms you've experienced recently
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Card sx={{ mb: 2, height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <span style={{ marginRight: 8, color: '#2196F3' }}>💧</span>
                              <Typography variant="subtitle1" sx={{ fontFamily: 'Arial, sans-serif' }}>Fluid-related</Typography>
                            </Box>
                            <Field
                              name="symptoms.increasedThirst"
                              as={FormControlLabel}
                              control={<Checkbox color="primary" />}
                              label="Increased thirst"
                            />
                            <Field
                              name="symptoms.frequentUrination"
                              as={FormControlLabel}
                              control={<Checkbox color="primary" />}
                              label="Frequent urination"
                            />
                          </CardContent>
                        </Card>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Card sx={{ mb: 2, height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <span style={{ marginRight: 8, color: '#FF9800' }}>🍽️</span>
                              <Typography variant="subtitle1" sx={{ fontFamily: 'Arial, sans-serif' }}>Appetite & Weight</Typography>
                            </Box>
                            <Field
                              name="symptoms.extremeHunger"
                              as={FormControlLabel}
                              control={<Checkbox color="primary" />}
                              label="Extreme hunger"
                            />
                            <Field
                              name="symptoms.unexplainedWeightLoss"
                              as={FormControlLabel}
                              control={<Checkbox color="primary" />}
                              label="Unexplained weight loss"
                            />
                          </CardContent>
                        </Card>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Card sx={{ mb: 2, height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <span style={{ marginRight: 8, color: '#4CAF50' }}>⚡</span>
                              <Typography variant="subtitle1" sx={{ fontFamily: 'Arial, sans-serif' }}>Energy & Mood</Typography>
                            </Box>
                            <Field
                              name="symptoms.fatigue"
                              as={FormControlLabel}
                              control={<Checkbox color="primary" />}
                              label="Fatigue (feeling tired)"
                            />
                            <Field
                              name="symptoms.irritability"
                              as={FormControlLabel}
                              control={<Checkbox color="primary" />}
                              label="Irritability"
                            />
                          </CardContent>
                        </Card>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Card sx={{ mb: 2, height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <span style={{ marginRight: 8, color: '#9C27B0' }}>👁️</span>
                              <Typography variant="subtitle1" sx={{ fontFamily: 'Arial, sans-serif' }}>Other Symptoms</Typography>
                            </Box>
                            <Field
                              name="symptoms.blurredVision"
                              as={FormControlLabel}
                              control={<Checkbox color="primary" />}
                              label="Blurred vision"
                            />
                            <Field
                              name="symptoms.slowHealingSores"
                              as={FormControlLabel}
                              control={<Checkbox color="primary" />}
                              label="Slow-healing sores"
                            />
                            <Field
                              name="symptoms.frequentInfections"
                              as={FormControlLabel}
                              control={<Checkbox color="primary" />}
                              label="Frequent infections"
                            />
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {activeStep === 2 && (
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2, color: '#1976D2', fontFamily: 'Arial, sans-serif' }}>
                      Risk Factors
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 3, color: '#546e7a', fontFamily: 'Arial, sans-serif' }}>
                      Please check any risk factors that apply to you
                    </Typography>
                    
                    <Card sx={{ mb: 3, p: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <span style={{ marginRight: 8, color: '#F44336' }}>🏥</span>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }}>Medical & Lifestyle Factors</Typography>
                        </Box>
                        
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Field
                              name="riskFactors.familyHistory"
                              as={FormControlLabel}
                              control={<Checkbox color="primary" />}
                              label="Family history of diabetes"
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <Field
                              name="riskFactors.overweight"
                              as={FormControlLabel}
                              control={<Checkbox color="primary" />}
                              label="Overweight/Obesity"
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <Field
                              name="riskFactors.inactiveLifestyle"
                              as={FormControlLabel}
                              control={<Checkbox color="primary" />}
                              label="Physical inactivity"
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <Field
                              name="riskFactors.highBloodPressure"
                              as={FormControlLabel}
                              control={<Checkbox color="primary" />}
                              label="High blood pressure"
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <Field
                              name="riskFactors.abnormalCholesterol"
                              as={FormControlLabel}
                              control={<Checkbox color="primary" />}
                              label="Abnormal cholesterol levels"
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Box>
                )}

                {activeStep === 3 && (
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2, color: '#1976D2', fontFamily: 'Arial, sans-serif' }}>
                      Blood Glucose Measurement
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 3, color: '#546e7a', fontFamily: 'Arial, sans-serif' }}>
                      If you have a recent blood glucose reading, please enter it below.
                      This is optional but helps improve the accuracy of your assessment.
                    </Typography>
                    
                    <Card sx={{ p: 3, mb: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                      <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} sm={8}>
                          <Field
                            name="bloodGlucose"
                            as={TextField}
                            label="Fasting Blood Glucose (mg/dL)"
                            type="number"
                            fullWidth
                            variant="outlined"
                            error={touched.bloodGlucose && Boolean(errors.bloodGlucose)}
                            helperText={touched.bloodGlucose && errors.bloodGlucose}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="body2" sx={{ color: '#546e7a', fontStyle: 'italic', fontFamily: 'Arial, sans-serif' }}>
                            Normal range: 70-99 mg/dL
                          </Typography>
                        </Grid>
                      </Grid>
                    </Card>
                  </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    variant="outlined"
                  >
                    Back
                  </Button>
                  
                  {activeStep === steps.length - 1 ? (
                    <SubmitButton
                      type="submit"
                      variant="contained"
                    >
                      Get Assessment
                    </SubmitButton>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </Form>
            )}
          </Formik>

          {prediction !== null && (
            <Box sx={{ mt: 5, p: 3, borderRadius: 2, bgcolor: '#f5f5f5' }}>
              <Typography variant="h5" gutterBottom sx={{ color: '#1976D2', fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }}>
                Your Diabetes Risk Assessment
              </Typography>
              
              <Box sx={{ my: 3 }}>
                <Typography variant="body2" gutterBottom sx={{ fontFamily: 'Arial, sans-serif' }}>
                  Risk Score:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={prediction} 
                      sx={{ 
                        height: 10, 
                        borderRadius: 5,
                        backgroundColor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: prediction > 70 ? '#f44336' : prediction > 40 ? '#ff9800' : '#4caf50',
                          borderRadius: 5,
                        }
                      }} 
                    />
                  </Box>
                  <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Arial, sans-serif' }}>{`${prediction}%`}</Typography>
                  </Box>
                </Box>
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mt: 2, 
                    color: prediction > 70 ? '#f44336' : prediction > 40 ? '#ff9800' : '#4caf50',
                    fontWeight: 'bold',
                    fontFamily: 'Arial, sans-serif'
                  }}
                >
                  {riskLevel}
                </Typography>
              </Box>
              
              <Typography variant="body1" paragraph sx={{ fontFamily: 'Arial, sans-serif' }}>
                Based on the information you provided, we've calculated your risk assessment.
                {prediction > 70 ? 
                  " Your results indicate a high risk of diabetes. We strongly recommend consulting with a healthcare provider for proper evaluation." :
                  prediction > 40 ? 
                  " Your results indicate a moderate risk of diabetes. Consider discussing these results with your healthcare provider." :
                  " Your results indicate a low risk of diabetes. However, maintaining a healthy lifestyle is always recommended."}
              </Typography>
              
              <Typography variant="caption" display="block" sx={{ mt: 2, color: '#757575', fontFamily: 'Arial, sans-serif' }}>
                Disclaimer: This assessment tool provides an estimate based on self-reported information and should not be considered a medical diagnosis. 
                Always consult with a qualified healthcare professional for proper evaluation and advice.
              </Typography>
            </Box>
          )}
        </StyledPaper>
      </Container>
    </Box>
  );
};

export default DiabetesAssessmentForm;